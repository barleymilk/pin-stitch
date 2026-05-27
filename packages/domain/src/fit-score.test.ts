import { describe, expect, it } from "vitest";

import { calculateFitScore, matchSimilarReviews } from "./fit-score";
import type { BodyProfile, FitReview, ReturnReason } from "./types";

const bodyProfile: BodyProfile = {
  bodyProfileId: "body_1",
  userId: "user_1",
  heightCm: 162,
  weightKg: 52,
  topSize: "S",
  bottomSize: "M",
  bodyShape: "WAVE",
  fitPreference: "REGULAR",
  consentToUseBodyData: true,
  updatedAt: "2026-05-15T00:00:00.000Z"
};

describe("matchSimilarReviews", () => {
  it("matches reviews with similar height, body shape, and size", () => {
    const reviews = [
      createReview({
        reviewId: "rev_1",
        heightCm: 160,
        bodyShape: "WAVE",
        purchasedSize: "M"
      }),
      createReview({
        reviewId: "rev_2",
        heightCm: 175,
        bodyShape: "NATURAL",
        purchasedSize: "XL"
      })
    ];

    const matches = matchSimilarReviews(bodyProfile, reviews);

    expect(matches).toHaveLength(1);
    expect(matches[0]?.review.reviewId).toBe("rev_1");
    expect(matches[0]?.similarityScore).toBeGreaterThanOrEqual(9);
  });

  it("does not match reviews when body data consent is disabled", () => {
    const matches = matchSimilarReviews(
      {
        ...bodyProfile,
        consentToUseBodyData: false
      },
      [
        createReview({
          reviewId: "rev_1",
          heightCm: 160,
          bodyShape: "WAVE",
          purchasedSize: "M"
        })
      ]
    );

    expect(matches).toEqual([]);
  });
});

describe("calculateFitScore", () => {
  it("uses similar body reviews and returns high confidence when there are at least 15 matches", () => {
    const reviews = Array.from({ length: 15 }, (_, index) =>
      createReview({
        reviewId: `rev_${index + 1}`,
        heightCm: 160,
        bodyShape: "WAVE",
        purchasedSize: "M",
        rating: 5,
        fitResult: "TRUE_TO_SIZE",
        negativeKeywords: []
      })
    );

    const fitScore = calculateFitScore({
      productId: "prod_1",
      bodyProfile,
      reviews
    });

    expect(fitScore.confidence).toBe("HIGH");
    expect(fitScore.matchedReviewCount).toBe(15);
    expect(fitScore.score).toBe(100);
  });

  it("falls back to all product reviews when there are no similar body reviews", () => {
    const reviews = [
      createReview({
        reviewId: "rev_1",
        heightCm: 180,
        bodyShape: "NATURAL",
        purchasedSize: "XL",
        rating: 4,
        fitResult: "TRUE_TO_SIZE",
        negativeKeywords: []
      })
    ];

    const fitScore = calculateFitScore({
      productId: "prod_1",
      bodyProfile,
      reviews
    });

    expect(fitScore.confidence).toBe("LOW");
    expect(fitScore.matchedReviewCount).toBe(0);
    expect(fitScore.reasons).toContain("유사 체형 리뷰가 없어 전체 리뷰를 기준으로 계산했습니다.");
    expect(fitScore.score).toBe(92);
  });

  it("lowers score when fit results, negative keywords, and return reasons indicate issues", () => {
    const reviews = [
      createReview({
        reviewId: "rev_1",
        heightCm: 160,
        bodyShape: "WAVE",
        purchasedSize: "M",
        rating: 2,
        fitResult: "SMALL",
        negativeKeywords: ["어깨"]
      }),
      createReview({
        reviewId: "rev_2",
        heightCm: 163,
        bodyShape: "WAVE",
        purchasedSize: "S",
        rating: 3,
        fitResult: "SMALL",
        negativeKeywords: ["기장"]
      })
    ];
    const returnReasons: ReturnReason[] = [
      {
        returnReasonId: "ret_1",
        orderId: "ord_1",
        productId: "prod_1",
        variantId: "var_1",
        userId: "user_1",
        reasonCode: "SIZE_TOO_SMALL",
        createdAt: "2026-05-15T00:00:00.000Z"
      }
    ];

    const fitScore = calculateFitScore({
      productId: "prod_1",
      variantId: "var_1",
      bodyProfile,
      reviews,
      returnReasons
    });

    expect(fitScore.score).toBe(28);
    expect(fitScore.reasons).toContain("정사이즈와 다르다는 리뷰 비율이 높습니다.");
    expect(fitScore.reasons).toContain("핏 관련 부정 키워드가 반복됩니다.");
    expect(fitScore.reasons).toContain("반품 사유에서 핏/사이즈 이슈가 확인됩니다.");
  });

  it("returns an empty-data score when no reviews are available", () => {
    const fitScore = calculateFitScore({
      productId: "prod_1",
      bodyProfile,
      reviews: []
    });

    expect(fitScore).toEqual({
      productId: "prod_1",
      score: 0,
      confidence: "LOW",
      matchedReviewCount: 0,
      reasons: ["계산에 사용할 리뷰가 아직 없습니다."]
    });
  });
});

function createReview(overrides: Partial<FitReview> = {}): FitReview {
  return {
    reviewId: "rev_1",
    userId: "user_2",
    productId: "prod_1",
    variantId: "var_1",
    rating: 5,
    content: "잘 맞아요.",
    heightCm: 160,
    bodyShape: "WAVE",
    purchasedSize: "M",
    fitResult: "TRUE_TO_SIZE",
    positiveKeywords: ["핏"],
    negativeKeywords: [],
    createdAt: "2026-05-15T00:00:00.000Z",
    ...overrides
  };
}
