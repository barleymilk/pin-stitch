import { matchSimilarReviews } from "./fit-score";
import type {
  BodyProfile,
  FitReview,
  ReviewId,
  ReviewSummary,
  ProductId,
  VariantId
} from "./types";

export interface GenerateReviewSummaryInput {
  productId: ProductId;
  variantId?: VariantId;
  bodyProfile?: BodyProfile;
  reviews: FitReview[];
  maxBasisReviewCount?: number;
}

interface KeywordCount {
  keyword: string;
  count: number;
}

const DEFAULT_BASIS_REVIEW_COUNT = 3;

export function generateReviewSummary(input: GenerateReviewSummaryInput): ReviewSummary {
  const productReviews = input.reviews.filter((review) => {
    if (review.productId !== input.productId) {
      return false;
    }

    return input.variantId ? review.variantId === input.variantId : true;
  });

  const similarMatches = matchSimilarReviews(input.bodyProfile, productReviews, {
    ...(input.variantId ? { variantId: input.variantId } : {})
  });
  const summaryReviews =
    similarMatches.length > 0 ? similarMatches.map((match) => match.review) : productReviews;

  if (summaryReviews.length === 0) {
    return withOptionalReviewSummaryVariantId(
      {
        productId: input.productId,
        summary: "아직 요약에 사용할 리뷰가 없습니다.",
        warnings: ["리뷰가 충분히 쌓이면 체형 기반 사이즈/핏 주의사항을 제공할 수 있습니다."],
        matchedReviewCount: 0,
        basisReviewIds: []
      },
      input.variantId
    );
  }

  const positiveKeywords = countKeywords(
    summaryReviews.flatMap((review) => review.positiveKeywords)
  );
  const negativeKeywords = countKeywords(
    summaryReviews.flatMap((review) => review.negativeKeywords)
  );
  const fitDistribution = getFitDistribution(summaryReviews);
  const basisReviewIds = getBasisReviewIds(
    similarMatches.length > 0
      ? similarMatches.map((match) => match.review)
      : summaryReviews.sort((a, b) => b.rating - a.rating),
    input.maxBasisReviewCount ?? DEFAULT_BASIS_REVIEW_COUNT
  );

  return withOptionalReviewSummaryVariantId(
    {
      productId: input.productId,
      summary: buildSummarySentence({
        bodyProfile: input.bodyProfile,
        usedFallback: similarMatches.length === 0,
        reviewCount: summaryReviews.length,
        positiveKeywords,
        negativeKeywords,
        fitDistribution
      }),
      warnings: generateFitWarnings(summaryReviews),
      matchedReviewCount: similarMatches.length,
      basisReviewIds
    },
    input.variantId
  );
}

export function generateFitWarnings(reviews: FitReview[]): string[] {
  if (reviews.length === 0) {
    return ["리뷰가 충분히 쌓이면 체형 기반 사이즈/핏 주의사항을 제공할 수 있습니다."];
  }

  const warnings: string[] = [];
  const negativeKeywords = countKeywords(reviews.flatMap((review) => review.negativeKeywords));
  const fitDistribution = getFitDistribution(reviews);
  const topNegativeKeyword = negativeKeywords[0];

  if (fitDistribution.smallRatio >= 0.4) {
    warnings.push("정사이즈보다 작다는 리뷰가 많습니다.");
  }

  if (fitDistribution.largeRatio >= 0.4) {
    warnings.push("정사이즈보다 크다는 리뷰가 많습니다.");
  }

  if (topNegativeKeyword) {
    warnings.push(getKeywordWarning(topNegativeKeyword.keyword));
  }

  return unique(warnings).slice(0, 3);
}

function buildSummarySentence(input: {
  bodyProfile: BodyProfile | undefined;
  usedFallback: boolean;
  reviewCount: number;
  positiveKeywords: KeywordCount[];
  negativeKeywords: KeywordCount[];
  fitDistribution: ReturnType<typeof getFitDistribution>;
}): string {
  const audience = input.usedFallback
    ? "전체 리뷰에서는"
    : `${formatBodyProfileLabel(input.bodyProfile)} 사용자는`;
  const positiveText = formatKeywordPhrase(input.positiveKeywords, "만족 의견이 많습니다");
  const negativeText = formatKeywordPhrase(input.negativeKeywords, "주의 의견이 있습니다");
  const fitText = formatFitDistribution(input.fitDistribution);

  return `${audience} ${positiveText}. ${fitText}${negativeText ? ` 다만 ${negativeText}.` : ""}`;
}

function formatBodyProfileLabel(bodyProfile: BodyProfile | undefined): string {
  if (!bodyProfile?.consentToUseBodyData) {
    return "유사 체형";
  }

  return `${bodyProfile.heightCm}cm 전후 ${formatBodyShape(bodyProfile.bodyShape)} 체형`;
}

function formatBodyShape(bodyShape: BodyProfile["bodyShape"]): string {
  switch (bodyShape) {
    case "STRAIGHT":
      return "스트레이트";
    case "WAVE":
      return "웨이브";
    case "NATURAL":
      return "내추럴";
    case "UNKNOWN":
      return "미분류";
  }
}

function formatKeywordPhrase(keywords: KeywordCount[], suffix: string): string {
  const topKeywords = keywords.slice(0, 2).map((keyword) => keyword.keyword);

  if (topKeywords.length === 0) {
    return `핏과 사이즈에 대한 ${suffix}`;
  }

  return `${topKeywords.join(", ")}에 대한 ${suffix}`;
}

function formatFitDistribution(distribution: ReturnType<typeof getFitDistribution>): string {
  if (distribution.trueToSizeRatio >= 0.5) {
    return "정사이즈로 맞았다는 평가가 가장 많습니다.";
  }

  if (distribution.smallRatio > distribution.largeRatio) {
    return "작게 느껴졌다는 평가가 상대적으로 많습니다.";
  }

  if (distribution.largeRatio > distribution.smallRatio) {
    return "크게 느껴졌다는 평가가 상대적으로 많습니다.";
  }

  return "사이즈 평가는 리뷰마다 갈립니다.";
}

function getKeywordWarning(keyword: string): string {
  if (keyword.includes("어깨")) {
    return "어깨 핏에 민감하다면 실측과 착용 후기를 함께 확인하세요.";
  }

  if (keyword.includes("기장")) {
    return "키가 작은 사용자는 기장이 길게 느껴질 수 있습니다.";
  }

  if (keyword.includes("허리")) {
    return "허리 여유감에 대한 의견이 있어 평소 사이즈와 실측을 비교하세요.";
  }

  if (keyword.includes("소재")) {
    return "소재감 기대와 다르다는 의견이 있어 상세 소재 정보를 확인하세요.";
  }

  return `${keyword} 관련 주의 리뷰가 반복됩니다.`;
}

function countKeywords(keywords: string[]): KeywordCount[] {
  const counts = new Map<string, number>();

  for (const keyword of keywords) {
    counts.set(keyword, (counts.get(keyword) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword));
}

function getFitDistribution(reviews: FitReview[]): {
  smallRatio: number;
  trueToSizeRatio: number;
  largeRatio: number;
} {
  const total = reviews.length;

  return {
    smallRatio: reviews.filter((review) => review.fitResult === "SMALL").length / total,
    trueToSizeRatio: reviews.filter((review) => review.fitResult === "TRUE_TO_SIZE").length / total,
    largeRatio: reviews.filter((review) => review.fitResult === "LARGE").length / total
  };
}

function getBasisReviewIds(reviews: FitReview[], maxCount: number): ReviewId[] {
  return reviews.slice(0, maxCount).map((review) => review.reviewId);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function withOptionalReviewSummaryVariantId(
  summary: Omit<ReviewSummary, "variantId">,
  variantId: VariantId | undefined
): ReviewSummary {
  return variantId
    ? {
        ...summary,
        variantId
      }
    : summary;
}
