import type { BodyProfile, FitReview, FitScore, ProductId, ReturnReason, VariantId } from "./types";

export interface SimilarReviewMatch {
  review: FitReview;
  similarityScore: number;
  reasons: string[];
}

export interface MatchSimilarReviewsOptions {
  variantId?: VariantId;
  minSimilarityScore?: number;
}

export interface CalculateFitScoreInput {
  productId: ProductId;
  variantId?: VariantId;
  bodyProfile?: BodyProfile;
  reviews: FitReview[];
  returnReasons?: ReturnReason[];
}

const DEFAULT_MIN_SIMILARITY_SCORE = 4;

export function matchSimilarReviews(
  bodyProfile: BodyProfile | undefined,
  reviews: FitReview[],
  options: MatchSimilarReviewsOptions = {}
): SimilarReviewMatch[] {
  if (!bodyProfile?.consentToUseBodyData) {
    return [];
  }

  const targetReviews = options.variantId
    ? reviews.filter((review) => review.variantId === options.variantId)
    : reviews;

  const minSimilarityScore = options.minSimilarityScore ?? DEFAULT_MIN_SIMILARITY_SCORE;

  return targetReviews
    .map((review) => scoreReviewSimilarity(bodyProfile, review))
    .filter((match) => match.similarityScore >= minSimilarityScore)
    .sort((a, b) => b.similarityScore - a.similarityScore);
}

export function calculateFitScore(input: CalculateFitScoreInput): FitScore {
  const productReviews = input.reviews.filter((review) => {
    if (review.productId !== input.productId) {
      return false;
    }

    return input.variantId ? review.variantId === input.variantId : true;
  });

  const similarMatches = matchSimilarReviews(
    input.bodyProfile,
    productReviews,
    withOptionalVariantId(input.variantId)
  );

  const scoredReviews =
    similarMatches.length > 0 ? similarMatches.map((match) => match.review) : productReviews;

  if (scoredReviews.length === 0) {
    return withOptionalFitScoreVariantId(
      {
        productId: input.productId,
        score: 0,
        confidence: "LOW",
        matchedReviewCount: 0,
        reasons: ["계산에 사용할 리뷰가 아직 없습니다."]
      },
      input.variantId
    );
  }

  const matchedReviewCount = similarMatches.length;
  const averageRatingScore = calculateAverageRatingScore(scoredReviews);
  const trueToSizeScore = calculateTrueToSizeScore(scoredReviews);
  const negativeKeywordInverseScore = calculateNegativeKeywordInverseScore(scoredReviews);
  const returnReasonInverseScore = calculateReturnReasonInverseScore(
    input.productId,
    input.variantId,
    scoredReviews,
    input.returnReasons ?? []
  );

  const score = Math.round(
    averageRatingScore * 0.4 +
      trueToSizeScore * 0.25 +
      negativeKeywordInverseScore * 0.2 +
      returnReasonInverseScore * 0.15
  );

  return withOptionalFitScoreVariantId(
    {
      productId: input.productId,
      score: clampScore(score),
      confidence: getFitScoreConfidence(matchedReviewCount),
      matchedReviewCount,
      reasons: buildFitScoreReasons({
        matchedReviewCount,
        usedFallback: matchedReviewCount === 0,
        trueToSizeScore,
        negativeKeywordInverseScore,
        returnReasonInverseScore
      })
    },
    input.variantId
  );
}

function scoreReviewSimilarity(bodyProfile: BodyProfile, review: FitReview): SimilarReviewMatch {
  const reasons: string[] = [];
  let similarityScore = 0;

  if (review.heightCm !== undefined) {
    const heightGap = Math.abs(bodyProfile.heightCm - review.heightCm);

    if (heightGap <= 5) {
      similarityScore += 4;
      reasons.push("키 차이가 5cm 이내입니다.");
    } else if (heightGap <= 10) {
      similarityScore += 2;
      reasons.push("키 차이가 10cm 이내입니다.");
    }
  }

  if (review.bodyShape !== undefined && review.bodyShape === bodyProfile.bodyShape) {
    similarityScore += 3;
    reasons.push("골격 타입이 같습니다.");
  }

  if (
    review.purchasedSize === bodyProfile.topSize ||
    review.purchasedSize === bodyProfile.bottomSize
  ) {
    similarityScore += 2;
    reasons.push("평소 사이즈와 착용 사이즈가 비슷합니다.");
  }

  if (review.fitResult === "TRUE_TO_SIZE") {
    similarityScore += 1;
    reasons.push("정사이즈 착용 리뷰입니다.");
  }

  return {
    review,
    similarityScore,
    reasons
  };
}

function calculateAverageRatingScore(reviews: FitReview[]): number {
  const ratingTotal = reviews.reduce((total, review) => total + review.rating, 0);

  return (ratingTotal / reviews.length / 5) * 100;
}

function calculateTrueToSizeScore(reviews: FitReview[]): number {
  const trueToSizeCount = reviews.filter((review) => review.fitResult === "TRUE_TO_SIZE").length;

  return (trueToSizeCount / reviews.length) * 100;
}

function calculateNegativeKeywordInverseScore(reviews: FitReview[]): number {
  const reviewsWithNegativeKeywords = reviews.filter(
    (review) => review.negativeKeywords.length > 0
  ).length;
  const negativeKeywordRate = reviewsWithNegativeKeywords / reviews.length;

  return (1 - negativeKeywordRate) * 100;
}

function calculateReturnReasonInverseScore(
  productId: ProductId,
  variantId: VariantId | undefined,
  reviews: FitReview[],
  returnReasons: ReturnReason[]
): number {
  const productReturnReasons = returnReasons.filter((reason) => {
    if (reason.productId !== productId) {
      return false;
    }

    return variantId ? reason.variantId === variantId : true;
  });

  if (productReturnReasons.length === 0) {
    return 100;
  }

  const returnRateProxy = Math.min(productReturnReasons.length / reviews.length, 1);

  return (1 - returnRateProxy) * 100;
}

function getFitScoreConfidence(matchedReviewCount: number): FitScore["confidence"] {
  if (matchedReviewCount >= 15) {
    return "HIGH";
  }

  if (matchedReviewCount >= 5) {
    return "MEDIUM";
  }

  return "LOW";
}

function buildFitScoreReasons(input: {
  matchedReviewCount: number;
  usedFallback: boolean;
  trueToSizeScore: number;
  negativeKeywordInverseScore: number;
  returnReasonInverseScore: number;
}): string[] {
  const reasons: string[] = [];

  if (input.usedFallback) {
    reasons.push("유사 체형 리뷰가 없어 전체 리뷰를 기준으로 계산했습니다.");
  } else {
    reasons.push(`유사 체형 리뷰 ${input.matchedReviewCount}개를 기준으로 계산했습니다.`);
  }

  if (input.trueToSizeScore >= 70) {
    reasons.push("정사이즈 만족 비율이 높습니다.");
  } else if (input.trueToSizeScore < 40) {
    reasons.push("정사이즈와 다르다는 리뷰 비율이 높습니다.");
  }

  if (input.negativeKeywordInverseScore < 60) {
    reasons.push("핏 관련 부정 키워드가 반복됩니다.");
  }

  if (input.returnReasonInverseScore < 70) {
    reasons.push("반품 사유에서 핏/사이즈 이슈가 확인됩니다.");
  }

  return reasons;
}

function clampScore(score: number): number {
  return Math.min(Math.max(score, 0), 100);
}

function withOptionalVariantId(variantId: VariantId | undefined): MatchSimilarReviewsOptions {
  return variantId ? { variantId } : {};
}

function withOptionalFitScoreVariantId(
  fitScore: Omit<FitScore, "variantId">,
  variantId: VariantId | undefined
): FitScore {
  return variantId
    ? {
        ...fitScore,
        variantId
      }
    : fitScore;
}
