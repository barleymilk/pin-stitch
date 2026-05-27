import { describe, expect, it } from "vitest";

import { generateFitWarnings, generateReviewSummary } from "./review-summary";
import type { BodyProfile, FitReview } from "./types";

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

describe("generateReviewSummary", () => {
  it("summarizes similar body reviews and returns basis review ids", () => {
    const reviews = [
      createReview({
        reviewId: "rev_1",
        heightCm: 160,
        bodyShape: "WAVE",
        purchasedSize: "M",
        positiveKeywords: ["허리", "소재"],
        negativeKeywords: ["어깨"]
      }),
      createReview({
        reviewId: "rev_2",
        heightCm: 164,
        bodyShape: "WAVE",
        purchasedSize: "S",
        positiveKeywords: ["허리"],
        negativeKeywords: ["어깨"]
      }),
      createReview({
        reviewId: "rev_3",
        heightCm: 178,
        bodyShape: "NATURAL",
        purchasedSize: "XL",
        positiveKeywords: ["기장"],
        negativeKeywords: ["소재"]
      })
    ];

    const summary = generateReviewSummary({
      productId: "prod_1",
      bodyProfile,
      reviews
    });

    expect(summary.matchedReviewCount).toBe(2);
    expect(summary.basisReviewIds).toEqual(["rev_1", "rev_2"]);
    expect(summary.summary).toContain("162cm 전후 웨이브 체형 사용자는");
    expect(summary.summary).toContain("허리");
    expect(summary.warnings).toContain("어깨 핏에 민감하다면 실측과 착용 후기를 함께 확인하세요.");
  });

  it("falls back to all product reviews when similar body reviews are unavailable", () => {
    const reviews = [
      createReview({
        reviewId: "rev_1",
        heightCm: 178,
        bodyShape: "NATURAL",
        purchasedSize: "XL",
        positiveKeywords: ["소재"],
        negativeKeywords: []
      })
    ];

    const summary = generateReviewSummary({
      productId: "prod_1",
      bodyProfile,
      reviews
    });

    expect(summary.matchedReviewCount).toBe(0);
    expect(summary.summary).toContain("전체 리뷰에서는");
    expect(summary.basisReviewIds).toEqual(["rev_1"]);
  });

  it("returns an empty summary when no reviews are available", () => {
    const summary = generateReviewSummary({
      productId: "prod_1",
      bodyProfile,
      reviews: []
    });

    expect(summary).toEqual({
      productId: "prod_1",
      summary: "아직 요약에 사용할 리뷰가 없습니다.",
      warnings: ["리뷰가 충분히 쌓이면 체형 기반 사이즈/핏 주의사항을 제공할 수 있습니다."],
      matchedReviewCount: 0,
      basisReviewIds: []
    });
  });

  it("filters reviews by variant id", () => {
    const summary = generateReviewSummary({
      productId: "prod_1",
      variantId: "var_2",
      bodyProfile,
      reviews: [
        createReview({
          reviewId: "rev_1",
          variantId: "var_1"
        }),
        createReview({
          reviewId: "rev_2",
          variantId: "var_2"
        })
      ]
    });

    expect(summary.variantId).toBe("var_2");
    expect(summary.basisReviewIds).toEqual(["rev_2"]);
  });
});

describe("generateFitWarnings", () => {
  it("creates warnings from fit result ratios and negative keywords", () => {
    const warnings = generateFitWarnings([
      createReview({
        reviewId: "rev_1",
        fitResult: "SMALL",
        negativeKeywords: ["기장"]
      }),
      createReview({
        reviewId: "rev_2",
        fitResult: "SMALL",
        negativeKeywords: ["기장"]
      }),
      createReview({
        reviewId: "rev_3",
        fitResult: "TRUE_TO_SIZE",
        negativeKeywords: []
      })
    ]);

    expect(warnings).toContain("정사이즈보다 작다는 리뷰가 많습니다.");
    expect(warnings).toContain("키가 작은 사용자는 기장이 길게 느껴질 수 있습니다.");
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
