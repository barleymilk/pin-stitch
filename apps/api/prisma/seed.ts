import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const now = new Date("2026-05-26T09:00:00.000+09:00");
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

async function clearDatabase() {
  await prisma.$transaction([
    prisma.analyticsEvent.deleteMany(),
    prisma.sellerInsight.deleteMany(),
    prisma.returnReason.deleteMany(),
    prisma.shipment.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.orderCouponApplication.deleteMany(),
    prisma.orderLine.deleteMany(),
    prisma.customerOrder.deleteMany(),
    prisma.cartExcludedCoupon.deleteMany(),
    prisma.cartCouponApplication.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.couponTarget.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.storeInventory.deleteMany(),
    prisma.store.deleteMany(),
    prisma.reviewSummaryWarning.deleteMany(),
    prisma.reviewSummaryBasis.deleteMany(),
    prisma.reviewSummary.deleteMany(),
    prisma.reviewImage.deleteMany(),
    prisma.reviewKeyword.deleteMany(),
    prisma.fitReview.deleteMany(),
    prisma.sizeMeasurement.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.product.deleteMany(),
    prisma.bodyProfile.deleteMany(),
    prisma.user.deleteMany()
  ]);
}

async function seedUsersAndBodyProfiles() {
  await prisma.user.createMany({
    data: [
      {
        userId: "user_customer_01",
        role: "CUSTOMER",
        name: "김민서",
        email: "minseo@example.com",
        createdAt: daysAgo(90)
      },
      {
        userId: "user_customer_02",
        role: "CUSTOMER",
        name: "이지윤",
        email: "jiyoon@example.com",
        createdAt: daysAgo(80)
      },
      {
        userId: "user_customer_03",
        role: "CUSTOMER",
        name: "박서연",
        email: "seoyeon@example.com",
        createdAt: daysAgo(70)
      },
      {
        userId: "user_customer_04",
        role: "CUSTOMER",
        name: "정하린",
        email: "harin@example.com",
        createdAt: daysAgo(60)
      },
      {
        userId: "user_customer_05",
        role: "CUSTOMER",
        name: "최나은",
        email: "naeun@example.com",
        createdAt: daysAgo(50)
      },
      {
        userId: "user_seller_01",
        role: "SELLER",
        name: "뮤게 스튜디오",
        email: "seller@muguet.example.com",
        createdAt: daysAgo(120)
      },
      {
        userId: "user_admin_01",
        role: "ADMIN",
        name: "PIN STITCH 운영자",
        email: "admin@pinstitch.example.com",
        createdAt: daysAgo(180)
      }
    ]
  });

  await prisma.bodyProfile.createMany({
    data: [
      {
        bodyProfileId: "body_customer_01",
        userId: "user_customer_01",
        heightCm: 162,
        weightKg: 52,
        topSize: "S",
        bottomSize: "M",
        bodyShape: "WAVE",
        fitPreference: "REGULAR",
        consentToUseBodyData: true,
        updatedAt: daysAgo(3)
      },
      {
        bodyProfileId: "body_customer_02",
        userId: "user_customer_02",
        heightCm: 168,
        weightKg: 58,
        topSize: "M",
        bottomSize: "M",
        bodyShape: "STRAIGHT",
        fitPreference: "SLIM",
        consentToUseBodyData: true,
        updatedAt: daysAgo(6)
      },
      {
        bodyProfileId: "body_customer_03",
        userId: "user_customer_03",
        heightCm: 155,
        weightKg: 48,
        topSize: "S",
        bottomSize: "S",
        bodyShape: "NATURAL",
        fitPreference: "LOOSE",
        consentToUseBodyData: true,
        updatedAt: daysAgo(9)
      },
      {
        bodyProfileId: "body_customer_04",
        userId: "user_customer_04",
        heightCm: 171,
        weightKg: 63,
        topSize: "L",
        bottomSize: "L",
        bodyShape: "STRAIGHT",
        fitPreference: "REGULAR",
        consentToUseBodyData: true,
        updatedAt: daysAgo(2)
      },
      {
        bodyProfileId: "body_customer_05",
        userId: "user_customer_05",
        heightCm: 160,
        weightKg: 55,
        topSize: "M",
        bottomSize: "M",
        bodyShape: "UNKNOWN",
        fitPreference: "LOOSE",
        consentToUseBodyData: false,
        updatedAt: daysAgo(11)
      }
    ]
  });
}

async function seedProducts() {
  await prisma.product.createMany({
    data: [
      {
        productId: "prod_soft_line_jacket",
        brandId: "brand_muguet",
        brandName: "Muguet Studio",
        name: "소프트 라인 싱글 재킷",
        description: "어깨선이 부드럽게 떨어지는 데일리 싱글 재킷",
        category: "OUTER",
        material: "Polyester 68%, Rayon 28%, Span 4%",
        fit: "REGULAR",
        priceAmount: 129000,
        status: "ACTIVE",
        createdAt: daysAgo(40),
        updatedAt: daysAgo(1)
      },
      {
        productId: "prod_wave_denim",
        brandId: "brand_serein",
        brandName: "Serein",
        name: "웨이브 스트레이트 데님",
        description: "허리 들뜸을 줄인 중청 스트레이트 데님",
        category: "BOTTOM",
        material: "Cotton 99%, Span 1%",
        fit: "REGULAR",
        priceAmount: 79000,
        status: "ACTIVE",
        createdAt: daysAgo(35),
        updatedAt: daysAgo(2)
      },
      {
        productId: "prod_daily_knit",
        brandId: "brand_muguet",
        brandName: "Muguet Studio",
        name: "데일리 리브 니트",
        description: "간절기 단품과 이너로 입기 좋은 리브 니트",
        category: "KNIT",
        material: "Cotton 55%, Acrylic 45%",
        fit: "SLIM",
        priceAmount: 49000,
        status: "ACTIVE",
        createdAt: daysAgo(30),
        updatedAt: daysAgo(1)
      },
      {
        productId: "prod_wrap_dress",
        brandId: "brand_lenu",
        brandName: "Lenu",
        name: "핀턱 랩 원피스",
        description: "허리 조절이 쉬운 핀턱 랩 원피스",
        category: "DRESS",
        material: "Rayon 72%, Nylon 28%",
        fit: "LOOSE",
        priceAmount: 98000,
        status: "ACTIVE",
        createdAt: daysAgo(28),
        updatedAt: daysAgo(4)
      },
      {
        productId: "prod_tailored_skirt",
        brandId: "brand_serein",
        brandName: "Serein",
        name: "테일러드 H라인 스커트",
        description: "골반 라인을 안정적으로 잡아주는 H라인 스커트",
        category: "SKIRT",
        material: "Wool 35%, Polyester 65%",
        fit: "REGULAR",
        priceAmount: 69000,
        status: "ACTIVE",
        createdAt: daysAgo(25),
        updatedAt: daysAgo(3)
      }
    ]
  });

  await prisma.productImage.createMany({
    data: [
      {
        productImageId: "img_soft_line_jacket_01",
        productId: "prod_soft_line_jacket",
        s3Key: "products/soft-line-jacket/main.jpg",
        url: "https://cdn.pinstitch.example/products/soft-line-jacket/main.jpg",
        altText: "베이지 색상 소프트 라인 싱글 재킷을 정면에서 착용한 모델",
        sortOrder: 1,
        width: 1200,
        height: 1600
      },
      {
        productImageId: "img_soft_line_jacket_02",
        productId: "prod_soft_line_jacket",
        s3Key: "products/soft-line-jacket/detail.jpg",
        url: "https://cdn.pinstitch.example/products/soft-line-jacket/detail.jpg",
        altText: "소프트 라인 싱글 재킷의 라펠과 단추 디테일",
        sortOrder: 2,
        width: 1200,
        height: 1600
      },
      {
        productImageId: "img_wave_denim_01",
        productId: "prod_wave_denim",
        s3Key: "products/wave-denim/main.jpg",
        url: "https://cdn.pinstitch.example/products/wave-denim/main.jpg",
        altText: "중청 웨이브 스트레이트 데님을 착용한 전신 모델",
        sortOrder: 1,
        width: 1200,
        height: 1600
      },
      {
        productImageId: "img_daily_knit_01",
        productId: "prod_daily_knit",
        s3Key: "products/daily-knit/main.jpg",
        url: "https://cdn.pinstitch.example/products/daily-knit/main.jpg",
        altText: "아이보리 데일리 리브 니트를 착용한 상반신 모델",
        sortOrder: 1,
        width: 1200,
        height: 1600
      },
      {
        productImageId: "img_wrap_dress_01",
        productId: "prod_wrap_dress",
        s3Key: "products/wrap-dress/main.jpg",
        url: "https://cdn.pinstitch.example/products/wrap-dress/main.jpg",
        altText: "네이비 핀턱 랩 원피스를 착용한 모델",
        sortOrder: 1,
        width: 1200,
        height: 1600
      },
      {
        productImageId: "img_tailored_skirt_01",
        productId: "prod_tailored_skirt",
        s3Key: "products/tailored-skirt/main.jpg",
        url: "https://cdn.pinstitch.example/products/tailored-skirt/main.jpg",
        altText: "차콜 테일러드 H라인 스커트를 착용한 모델",
        sortOrder: 1,
        width: 1200,
        height: 1600
      }
    ]
  });

  await prisma.productVariant.createMany({
    data: [
      {
        variantId: "var_jacket_beige_s",
        productId: "prod_soft_line_jacket",
        sku: "MGT-JK-BE-S",
        color: "Beige",
        size: "S",
        availableQuantity: 12
      },
      {
        variantId: "var_jacket_beige_m",
        productId: "prod_soft_line_jacket",
        sku: "MGT-JK-BE-M",
        color: "Beige",
        size: "M",
        availableQuantity: 8
      },
      {
        variantId: "var_jacket_black_m",
        productId: "prod_soft_line_jacket",
        sku: "MGT-JK-BK-M",
        color: "Black",
        size: "M",
        availableQuantity: 4
      },
      {
        variantId: "var_denim_blue_s",
        productId: "prod_wave_denim",
        sku: "SRN-DN-BL-S",
        color: "Blue",
        size: "S",
        availableQuantity: 7
      },
      {
        variantId: "var_denim_blue_m",
        productId: "prod_wave_denim",
        sku: "SRN-DN-BL-M",
        color: "Blue",
        size: "M",
        availableQuantity: 3
      },
      {
        variantId: "var_denim_blue_l",
        productId: "prod_wave_denim",
        sku: "SRN-DN-BL-L",
        color: "Blue",
        size: "L",
        availableQuantity: 0
      },
      {
        variantId: "var_knit_ivory_s",
        productId: "prod_daily_knit",
        sku: "MGT-KN-IV-S",
        color: "Ivory",
        size: "S",
        availableQuantity: 18
      },
      {
        variantId: "var_knit_ivory_m",
        productId: "prod_daily_knit",
        sku: "MGT-KN-IV-M",
        color: "Ivory",
        size: "M",
        availableQuantity: 15
      },
      {
        variantId: "var_knit_black_m",
        productId: "prod_daily_knit",
        sku: "MGT-KN-BK-M",
        color: "Black",
        size: "M",
        availableQuantity: 9
      },
      {
        variantId: "var_dress_navy_s",
        productId: "prod_wrap_dress",
        sku: "LNU-DR-NV-S",
        color: "Navy",
        size: "S",
        availableQuantity: 6
      },
      {
        variantId: "var_dress_navy_m",
        productId: "prod_wrap_dress",
        sku: "LNU-DR-NV-M",
        color: "Navy",
        size: "M",
        availableQuantity: 5
      },
      {
        variantId: "var_skirt_charcoal_m",
        productId: "prod_tailored_skirt",
        sku: "SRN-SK-CH-M",
        color: "Charcoal",
        size: "M",
        availableQuantity: 11
      }
    ]
  });

  await prisma.sizeMeasurement.createMany({
    data: [
      {
        sizeMeasurementId: "measure_jacket_s",
        productId: "prod_soft_line_jacket",
        size: "S",
        shoulderCm: 39,
        chestCm: 48,
        lengthCm: 66,
        sleeveCm: 58
      },
      {
        sizeMeasurementId: "measure_jacket_m",
        productId: "prod_soft_line_jacket",
        size: "M",
        shoulderCm: 40.5,
        chestCm: 50,
        lengthCm: 68,
        sleeveCm: 59
      },
      {
        sizeMeasurementId: "measure_denim_s",
        productId: "prod_wave_denim",
        size: "S",
        waistCm: 33,
        hipCm: 45,
        thighCm: 27,
        lengthCm: 100
      },
      {
        sizeMeasurementId: "measure_denim_m",
        productId: "prod_wave_denim",
        size: "M",
        waistCm: 35,
        hipCm: 47,
        thighCm: 28.5,
        lengthCm: 101
      },
      {
        sizeMeasurementId: "measure_denim_l",
        productId: "prod_wave_denim",
        size: "L",
        waistCm: 37,
        hipCm: 49,
        thighCm: 30,
        lengthCm: 102
      },
      {
        sizeMeasurementId: "measure_knit_s",
        productId: "prod_daily_knit",
        size: "S",
        shoulderCm: 34,
        chestCm: 38,
        lengthCm: 55,
        sleeveCm: 60
      },
      {
        sizeMeasurementId: "measure_knit_m",
        productId: "prod_daily_knit",
        size: "M",
        shoulderCm: 35.5,
        chestCm: 40,
        lengthCm: 57,
        sleeveCm: 61
      },
      {
        sizeMeasurementId: "measure_dress_s",
        productId: "prod_wrap_dress",
        size: "S",
        shoulderCm: 36,
        chestCm: 44,
        waistCm: 36,
        lengthCm: 112
      },
      {
        sizeMeasurementId: "measure_dress_m",
        productId: "prod_wrap_dress",
        size: "M",
        shoulderCm: 37.5,
        chestCm: 46,
        waistCm: 38,
        lengthCm: 114
      },
      {
        sizeMeasurementId: "measure_skirt_m",
        productId: "prod_tailored_skirt",
        size: "M",
        waistCm: 34,
        hipCm: 46,
        lengthCm: 78
      }
    ]
  });
}

async function seedReviewsAndSummaries() {
  await prisma.fitReview.createMany({
    data: [
      {
        reviewId: "review_001",
        userId: "user_customer_01",
        productId: "prod_soft_line_jacket",
        variantId: "var_jacket_beige_s",
        rating: 5,
        content: "어깨가 각지지 않고 자연스럽게 떨어져서 출근룩으로 좋아요.",
        heightCm: 162,
        bodyShape: "WAVE",
        fitPreference: "REGULAR",
        purchasedSize: "S",
        fitResult: "TRUE_TO_SIZE",
        createdAt: daysAgo(12)
      },
      {
        reviewId: "review_002",
        userId: "user_customer_02",
        productId: "prod_soft_line_jacket",
        variantId: "var_jacket_beige_m",
        rating: 4,
        content: "정사이즈인데 소매가 살짝 길어요. 품은 예쁘게 맞습니다.",
        heightCm: 168,
        bodyShape: "STRAIGHT",
        fitPreference: "SLIM",
        purchasedSize: "M",
        fitResult: "TRUE_TO_SIZE",
        createdAt: daysAgo(10)
      },
      {
        reviewId: "review_003",
        userId: "user_customer_04",
        productId: "prod_soft_line_jacket",
        variantId: "var_jacket_black_m",
        rating: 4,
        content: "L 체형인데 M도 잠기지만 이너를 두껍게 입으면 답답합니다.",
        heightCm: 171,
        bodyShape: "STRAIGHT",
        fitPreference: "REGULAR",
        purchasedSize: "M",
        fitResult: "SMALL",
        createdAt: daysAgo(8)
      },
      {
        reviewId: "review_004",
        userId: "user_customer_01",
        productId: "prod_wave_denim",
        variantId: "var_denim_blue_m",
        rating: 5,
        content: "허리 들뜸이 적고 골반은 편해요. 길이는 운동화 기준 딱 좋습니다.",
        heightCm: 162,
        bodyShape: "WAVE",
        fitPreference: "REGULAR",
        purchasedSize: "M",
        fitResult: "TRUE_TO_SIZE",
        createdAt: daysAgo(7)
      },
      {
        reviewId: "review_005",
        userId: "user_customer_03",
        productId: "prod_wave_denim",
        variantId: "var_denim_blue_s",
        rating: 4,
        content: "허리는 맞는데 밑위가 생각보다 높아서 취향을 탈 것 같아요.",
        heightCm: 155,
        bodyShape: "NATURAL",
        fitPreference: "LOOSE",
        purchasedSize: "S",
        fitResult: "TRUE_TO_SIZE",
        createdAt: daysAgo(6)
      },
      {
        reviewId: "review_006",
        userId: "user_customer_02",
        productId: "prod_daily_knit",
        variantId: "var_knit_ivory_m",
        rating: 3,
        content: "슬림핏이라 몸 라인이 꽤 드러납니다. 한 사이즈 업이 편할 듯해요.",
        heightCm: 168,
        bodyShape: "STRAIGHT",
        fitPreference: "SLIM",
        purchasedSize: "M",
        fitResult: "SMALL",
        createdAt: daysAgo(5)
      },
      {
        reviewId: "review_007",
        userId: "user_customer_03",
        productId: "prod_wrap_dress",
        variantId: "var_dress_navy_s",
        rating: 5,
        content: "허리를 묶어서 조절할 수 있어 작은 키에도 비율이 좋아 보여요.",
        heightCm: 155,
        bodyShape: "NATURAL",
        fitPreference: "LOOSE",
        purchasedSize: "S",
        fitResult: "TRUE_TO_SIZE",
        createdAt: daysAgo(4)
      },
      {
        reviewId: "review_008",
        userId: "user_customer_04",
        productId: "prod_tailored_skirt",
        variantId: "var_skirt_charcoal_m",
        rating: 4,
        content: "허리는 맞고 골반은 살짝 타이트합니다. 앉을 때는 조금 신경 쓰여요.",
        heightCm: 171,
        bodyShape: "STRAIGHT",
        fitPreference: "REGULAR",
        purchasedSize: "M",
        fitResult: "SMALL",
        createdAt: daysAgo(3)
      }
    ]
  });

  await prisma.reviewKeyword.createMany({
    data: [
      {
        reviewKeywordId: "keyword_001",
        reviewId: "review_001",
        sentiment: "POSITIVE",
        keyword: "어깨선 부드러움"
      },
      {
        reviewKeywordId: "keyword_002",
        reviewId: "review_001",
        sentiment: "POSITIVE",
        keyword: "출근룩"
      },
      {
        reviewKeywordId: "keyword_003",
        reviewId: "review_002",
        sentiment: "NEGATIVE",
        keyword: "소매 김"
      },
      {
        reviewKeywordId: "keyword_004",
        reviewId: "review_003",
        sentiment: "NEGATIVE",
        keyword: "품 타이트"
      },
      {
        reviewKeywordId: "keyword_005",
        reviewId: "review_004",
        sentiment: "POSITIVE",
        keyword: "허리 들뜸 적음"
      },
      {
        reviewKeywordId: "keyword_006",
        reviewId: "review_005",
        sentiment: "NEGATIVE",
        keyword: "밑위 높음"
      },
      {
        reviewKeywordId: "keyword_007",
        reviewId: "review_006",
        sentiment: "NEGATIVE",
        keyword: "슬림핏"
      },
      {
        reviewKeywordId: "keyword_008",
        reviewId: "review_007",
        sentiment: "POSITIVE",
        keyword: "허리 조절"
      },
      {
        reviewKeywordId: "keyword_009",
        reviewId: "review_008",
        sentiment: "NEGATIVE",
        keyword: "골반 타이트"
      }
    ]
  });

  await prisma.reviewImage.create({
    data: {
      reviewImageId: "review_image_001",
      reviewId: "review_001",
      s3Key: "reviews/review-001/fit.jpg",
      url: "https://cdn.pinstitch.example/reviews/review-001/fit.jpg",
      altText: "162cm 웨이브 체형 고객이 소프트 라인 싱글 재킷 S 사이즈를 착용한 모습",
      sortOrder: 1,
      width: 900,
      height: 1200
    }
  });

  await prisma.reviewSummary.createMany({
    data: [
      {
        reviewSummaryId: "summary_jacket_wave_regular",
        productId: "prod_soft_line_jacket",
        variantId: "var_jacket_beige_s",
        bodyProfileId: "body_customer_01",
        summary:
          "162cm 전후 웨이브 체형, 정핏 선호 고객은 S 사이즈가 어깨와 품 모두 안정적으로 맞는 편입니다.",
        matchedReviewCount: 2,
        generatedAt: daysAgo(1)
      },
      {
        reviewSummaryId: "summary_denim_wave_regular",
        productId: "prod_wave_denim",
        variantId: "var_denim_blue_m",
        bodyProfileId: "body_customer_01",
        summary:
          "허리 들뜸을 민감하게 보는 고객에게 긍정 반응이 많고, 운동화 기준 기장이 안정적입니다.",
        matchedReviewCount: 2,
        generatedAt: daysAgo(1)
      },
      {
        reviewSummaryId: "summary_knit_straight_slim",
        productId: "prod_daily_knit",
        variantId: "var_knit_ivory_m",
        bodyProfileId: "body_customer_02",
        summary:
          "슬림핏 선호 고객도 몸 라인 노출을 체감할 수 있어 편안함을 원하면 한 사이즈 업을 고려하세요.",
        matchedReviewCount: 1,
        generatedAt: daysAgo(1)
      }
    ]
  });

  await prisma.reviewSummaryBasis.createMany({
    data: [
      { reviewSummaryId: "summary_jacket_wave_regular", reviewId: "review_001" },
      { reviewSummaryId: "summary_jacket_wave_regular", reviewId: "review_002" },
      { reviewSummaryId: "summary_denim_wave_regular", reviewId: "review_004" },
      { reviewSummaryId: "summary_denim_wave_regular", reviewId: "review_005" },
      { reviewSummaryId: "summary_knit_straight_slim", reviewId: "review_006" }
    ]
  });

  await prisma.reviewSummaryWarning.createMany({
    data: [
      {
        reviewSummaryWarningId: "summary_warning_001",
        reviewSummaryId: "summary_jacket_wave_regular",
        warning: "두꺼운 이너와 함께 입으면 품이 답답할 수 있습니다.",
        sortOrder: 1
      },
      {
        reviewSummaryWarningId: "summary_warning_002",
        reviewSummaryId: "summary_knit_straight_slim",
        warning: "슬림핏 상품이라 체형 데이터가 적은 고객에게는 보수적으로 추천하세요.",
        sortOrder: 1
      }
    ]
  });
}

async function seedStoresAndCoupons() {
  await prisma.store.createMany({
    data: [
      {
        storeId: "store_hongdae",
        name: "PIN STITCH 홍대 쇼룸",
        address: "서울 마포구 와우산로 29길 12",
        lat: 37.555141,
        lng: 126.922996,
        isOpen: true
      },
      {
        storeId: "store_seongsu",
        name: "PIN STITCH 성수 픽업스토어",
        address: "서울 성동구 연무장길 45",
        lat: 37.544581,
        lng: 127.055961,
        isOpen: true
      },
      {
        storeId: "store_gangnam",
        name: "PIN STITCH 강남 스토어",
        address: "서울 강남구 테헤란로 152",
        lat: 37.500982,
        lng: 127.036522,
        isOpen: false
      }
    ]
  });

  await prisma.storeInventory.createMany({
    data: [
      {
        storeInventoryId: "inv_hongdae_jacket_s",
        storeId: "store_hongdae",
        productId: "prod_soft_line_jacket",
        variantId: "var_jacket_beige_s",
        quantity: 3,
        floor: "2F",
        zone: "A",
        rack: "A-03",
        updatedAt: now
      },
      {
        storeInventoryId: "inv_hongdae_denim_m",
        storeId: "store_hongdae",
        productId: "prod_wave_denim",
        variantId: "var_denim_blue_m",
        quantity: 1,
        floor: "2F",
        zone: "B",
        rack: "B-07",
        updatedAt: now
      },
      {
        storeInventoryId: "inv_seongsu_knit_m",
        storeId: "store_seongsu",
        productId: "prod_daily_knit",
        variantId: "var_knit_ivory_m",
        quantity: 5,
        floor: "1F",
        zone: "C",
        rack: "C-02",
        updatedAt: now
      },
      {
        storeInventoryId: "inv_seongsu_dress_s",
        storeId: "store_seongsu",
        productId: "prod_wrap_dress",
        variantId: "var_dress_navy_s",
        quantity: 2,
        floor: "1F",
        zone: "D",
        rack: "D-01",
        updatedAt: now
      },
      {
        storeInventoryId: "inv_gangnam_skirt_m",
        storeId: "store_gangnam",
        productId: "prod_tailored_skirt",
        variantId: "var_skirt_charcoal_m",
        quantity: 0,
        floor: "3F",
        zone: "E",
        rack: "E-04",
        updatedAt: daysAgo(2)
      }
    ]
  });

  await prisma.coupon.createMany({
    data: [
      {
        couponId: "coupon_welcome_5000",
        userId: "user_customer_01",
        name: "첫 구매 5,000원 할인",
        discountType: "FIXED_AMOUNT",
        discountValue: 5000,
        minOrderAmount: 30000,
        targetType: "ORDER",
        stackable: true,
        startsAt: daysAgo(30),
        endsAt: daysFromNow(30)
      },
      {
        couponId: "coupon_outer_10",
        name: "아우터 10% 할인",
        discountType: "PERCENTAGE",
        discountValue: 10,
        maxDiscountAmount: 15000,
        minOrderAmount: 70000,
        targetType: "CATEGORY",
        stackable: false,
        startsAt: daysAgo(15),
        endsAt: daysFromNow(20)
      },
      {
        couponId: "coupon_delay_3000",
        userId: "user_customer_01",
        name: "배송 지연 보상 3,000원",
        discountType: "FIXED_AMOUNT",
        discountValue: 3000,
        minOrderAmount: 10000,
        targetType: "ORDER",
        stackable: true,
        startsAt: daysAgo(1),
        endsAt: daysFromNow(60)
      },
      {
        couponId: "coupon_lenu_7000",
        name: "Lenu 브랜드 7,000원 할인",
        discountType: "FIXED_AMOUNT",
        discountValue: 7000,
        minOrderAmount: 90000,
        targetType: "BRAND",
        stackable: false,
        startsAt: daysAgo(10),
        endsAt: daysFromNow(10)
      }
    ]
  });

  await prisma.couponTarget.createMany({
    data: [
      { couponTargetId: "target_outer_category", couponId: "coupon_outer_10", targetId: "OUTER" },
      { couponTargetId: "target_lenu_brand", couponId: "coupon_lenu_7000", targetId: "brand_lenu" }
    ]
  });
}

async function seedCartOrdersPaymentsAndShipments() {
  await prisma.cart.create({
    data: {
      cartId: "cart_customer_01",
      userId: "user_customer_01",
      subtotalAmount: 208000,
      discountTotalAmount: 17900,
      finalTotalAmount: 190100,
      currency: "KRW",
      updatedAt: now,
      items: {
        createMany: {
          data: [
            {
              cartItemId: "cart_item_jacket",
              productId: "prod_soft_line_jacket",
              variantId: "var_jacket_beige_s",
              quantity: 1,
              unitPriceAmount: 129000,
              lineTotalAmount: 129000
            },
            {
              cartItemId: "cart_item_denim",
              productId: "prod_wave_denim",
              variantId: "var_denim_blue_m",
              quantity: 1,
              unitPriceAmount: 79000,
              lineTotalAmount: 79000
            }
          ]
        }
      }
    }
  });

  await prisma.cartCouponApplication.createMany({
    data: [
      {
        cartCouponApplicationId: "cart_coupon_welcome",
        cartId: "cart_customer_01",
        couponId: "coupon_welcome_5000",
        discountAmount: 5000,
        reason: "주문 금액 조건을 충족한 첫 구매 쿠폰"
      },
      {
        cartCouponApplicationId: "cart_coupon_outer",
        cartId: "cart_customer_01",
        couponId: "coupon_outer_10",
        cartItemId: "cart_item_jacket",
        discountAmount: 12900,
        reason: "아우터 카테고리 상품 10% 할인"
      }
    ]
  });

  await prisma.cartExcludedCoupon.create({
    data: {
      cartExcludedCouponId: "cart_excluded_lenu",
      cartId: "cart_customer_01",
      couponId: "coupon_lenu_7000",
      reasonCode: "TARGET_NOT_MATCHED",
      message: "장바구니에 Lenu 브랜드 상품이 없어 적용할 수 없습니다."
    }
  });

  await prisma.customerOrder.createMany({
    data: [
      {
        orderId: "order_20260526_0001",
        orderNumber: "20260526-0001",
        userId: "user_customer_01",
        status: "PAID",
        recipientName: "김민서",
        phone: "010-1111-2222",
        postalCode: "04790",
        address1: "서울 성동구 왕십리로 10",
        address2: "PIN 아파트 101동 1201호",
        subtotalAmount: 129000,
        discountTotalAmount: 5000,
        finalTotalAmount: 124000,
        createdAt: daysAgo(0),
        updatedAt: daysAgo(0)
      },
      {
        orderId: "order_20260525_0002",
        orderNumber: "20260525-0002",
        userId: "user_customer_02",
        status: "SHIPPED",
        recipientName: "이지윤",
        phone: "010-2222-3333",
        postalCode: "06018",
        address1: "서울 강남구 도산대로 45",
        address2: "302호",
        subtotalAmount: 79000,
        discountTotalAmount: 0,
        finalTotalAmount: 79000,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
      },
      {
        orderId: "order_20260524_0003",
        orderNumber: "20260524-0003",
        userId: "user_customer_03",
        status: "PAYMENT_FAILED",
        recipientName: "박서연",
        phone: "010-3333-4444",
        postalCode: "04012",
        address1: "서울 마포구 양화로 19",
        address2: "5층",
        subtotalAmount: 49000,
        discountTotalAmount: 0,
        finalTotalAmount: 49000,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2)
      },
      {
        orderId: "order_20260522_0004",
        orderNumber: "20260522-0004",
        userId: "user_customer_01",
        status: "PAID",
        recipientName: "김민서",
        phone: "010-1111-2222",
        postalCode: "04790",
        address1: "서울 성동구 왕십리로 10",
        address2: "PIN 아파트 101동 1201호",
        subtotalAmount: 98000,
        discountTotalAmount: 7000,
        finalTotalAmount: 91000,
        createdAt: daysAgo(4),
        updatedAt: daysAgo(1)
      },
      {
        orderId: "order_20260520_0005",
        orderNumber: "20260520-0005",
        userId: "user_customer_04",
        status: "DELIVERED",
        recipientName: "정하린",
        phone: "010-4444-5555",
        postalCode: "06236",
        address1: "서울 강남구 테헤란로 142",
        address2: "8층",
        subtotalAmount: 69000,
        discountTotalAmount: 0,
        finalTotalAmount: 69000,
        createdAt: daysAgo(6),
        updatedAt: daysAgo(2)
      }
    ]
  });

  await prisma.orderLine.createMany({
    data: [
      {
        orderLineId: "order_line_0001_01",
        orderId: "order_20260526_0001",
        productId: "prod_soft_line_jacket",
        variantId: "var_jacket_beige_s",
        quantity: 1,
        unitPriceAmount: 129000,
        lineTotalAmount: 129000
      },
      {
        orderLineId: "order_line_0002_01",
        orderId: "order_20260525_0002",
        productId: "prod_wave_denim",
        variantId: "var_denim_blue_m",
        quantity: 1,
        unitPriceAmount: 79000,
        lineTotalAmount: 79000
      },
      {
        orderLineId: "order_line_0003_01",
        orderId: "order_20260524_0003",
        productId: "prod_daily_knit",
        variantId: "var_knit_ivory_m",
        quantity: 1,
        unitPriceAmount: 49000,
        lineTotalAmount: 49000
      },
      {
        orderLineId: "order_line_0004_01",
        orderId: "order_20260522_0004",
        productId: "prod_wrap_dress",
        variantId: "var_dress_navy_s",
        quantity: 1,
        unitPriceAmount: 98000,
        lineTotalAmount: 98000
      },
      {
        orderLineId: "order_line_0005_01",
        orderId: "order_20260520_0005",
        productId: "prod_tailored_skirt",
        variantId: "var_skirt_charcoal_m",
        quantity: 1,
        unitPriceAmount: 69000,
        lineTotalAmount: 69000
      }
    ]
  });

  await prisma.orderCouponApplication.createMany({
    data: [
      {
        orderCouponApplicationId: "order_coupon_0001_welcome",
        orderId: "order_20260526_0001",
        couponId: "coupon_welcome_5000",
        discountAmount: 5000,
        reason: "첫 구매 쿠폰 적용"
      },
      {
        orderCouponApplicationId: "order_coupon_0004_lenu",
        orderId: "order_20260522_0004",
        couponId: "coupon_lenu_7000",
        orderLineId: "order_line_0004_01",
        discountAmount: 7000,
        reason: "Lenu 브랜드 쿠폰 적용"
      }
    ]
  });

  await prisma.payment.createMany({
    data: [
      {
        paymentId: "payment_0001",
        orderId: "order_20260526_0001",
        orderNumber: "20260526-0001",
        provider: "TOSS_PAYMENTS",
        status: "APPROVED",
        amount: 124000,
        providerOrderId: "20260526-0001",
        providerPaymentKey: "tgen_20260526_0001",
        method: "카드",
        receiptUrl:
          "https://dashboard.tosspayments.com/receipt/redirection?transactionId=tgen_20260526_0001",
        requestedAt: daysAgo(0),
        approvedAt: daysAgo(0)
      },
      {
        paymentId: "payment_0002",
        orderId: "order_20260525_0002",
        orderNumber: "20260525-0002",
        provider: "TOSS_PAYMENTS",
        status: "APPROVED",
        amount: 79000,
        providerOrderId: "20260525-0002",
        providerPaymentKey: "tgen_20260525_0002",
        method: "간편결제",
        receiptUrl:
          "https://dashboard.tosspayments.com/receipt/redirection?transactionId=tgen_20260525_0002",
        requestedAt: daysAgo(1),
        approvedAt: daysAgo(1)
      },
      {
        paymentId: "payment_0003",
        orderId: "order_20260524_0003",
        orderNumber: "20260524-0003",
        provider: "TOSS_PAYMENTS",
        status: "FAILED",
        amount: 49000,
        providerOrderId: "20260524-0003",
        providerPaymentKey: "tgen_20260524_0003",
        method: "카드",
        requestedAt: daysAgo(2),
        failedAt: daysAgo(2),
        failureCode: "REJECT_CARD_COMPANY",
        failureMessage: "카드사 승인 거절"
      },
      {
        paymentId: "payment_0004",
        orderId: "order_20260522_0004",
        orderNumber: "20260522-0004",
        provider: "TOSS_PAYMENTS",
        status: "APPROVED",
        amount: 91000,
        providerOrderId: "20260522-0004",
        providerPaymentKey: "tgen_20260522_0004",
        method: "카드",
        receiptUrl:
          "https://dashboard.tosspayments.com/receipt/redirection?transactionId=tgen_20260522_0004",
        requestedAt: daysAgo(4),
        approvedAt: daysAgo(4)
      },
      {
        paymentId: "payment_0005",
        orderId: "order_20260520_0005",
        orderNumber: "20260520-0005",
        provider: "TOSS_PAYMENTS",
        status: "APPROVED",
        amount: 69000,
        providerOrderId: "20260520-0005",
        providerPaymentKey: "tgen_20260520_0005",
        method: "카드",
        receiptUrl:
          "https://dashboard.tosspayments.com/receipt/redirection?transactionId=tgen_20260520_0005",
        requestedAt: daysAgo(6),
        approvedAt: daysAgo(6)
      }
    ]
  });

  await prisma.shipment.createMany({
    data: [
      {
        shipmentId: "shipment_0001",
        orderId: "order_20260526_0001",
        orderNumber: "20260526-0001",
        status: "PREPARING",
        carrierName: "CJ대한통운",
        estimatedDeliveryDate: daysFromNow(2),
        lastCheckedAt: now
      },
      {
        shipmentId: "shipment_0002",
        orderId: "order_20260525_0002",
        orderNumber: "20260525-0002",
        status: "IN_TRANSIT",
        carrierName: "CJ대한통운",
        trackingNumber: "123456789012",
        trackingUrl: "https://trace.cjlogistics.com/example/123456789012",
        estimatedDeliveryDate: daysFromNow(1),
        shippedAt: daysAgo(1),
        lastCheckedAt: now
      },
      {
        shipmentId: "shipment_0004",
        orderId: "order_20260522_0004",
        orderNumber: "20260522-0004",
        status: "DELAYED",
        carrierName: "롯데택배",
        estimatedDeliveryDate: daysAgo(1),
        delayedAt: daysAgo(1),
        delayReason: "브랜드 출고 지연으로 예상 배송일보다 2일 늦어질 예정입니다.",
        lastCheckedAt: now
      },
      {
        shipmentId: "shipment_0005",
        orderId: "order_20260520_0005",
        orderNumber: "20260520-0005",
        status: "DELIVERED",
        carrierName: "CJ대한통운",
        trackingNumber: "987654321098",
        trackingUrl: "https://trace.cjlogistics.com/example/987654321098",
        estimatedDeliveryDate: daysAgo(2),
        shippedAt: daysAgo(5),
        deliveredAt: daysAgo(2),
        lastCheckedAt: daysAgo(2)
      }
    ]
  });
}

async function seedSignalsForMcpAndSeller() {
  await prisma.returnReason.createMany({
    data: [
      {
        returnReasonId: "return_reason_0005_01",
        orderId: "order_20260520_0005",
        productId: "prod_tailored_skirt",
        variantId: "var_skirt_charcoal_m",
        userId: "user_customer_04",
        reasonCode: "WAIST_FIT",
        memo: "허리는 맞지만 앉았을 때 골반 쪽이 답답함",
        createdAt: daysAgo(1)
      },
      {
        returnReasonId: "return_reason_0003_01",
        orderId: "order_20260524_0003",
        productId: "prod_daily_knit",
        variantId: "var_knit_ivory_m",
        userId: "user_customer_03",
        reasonCode: "SIZE_TOO_SMALL",
        memo: "결제 실패 주문이지만 교환 시나리오 테스트용 사이즈 불만 기록",
        createdAt: daysAgo(2)
      }
    ]
  });

  await prisma.sellerInsight.createMany({
    data: [
      {
        insightId: "insight_jacket_size_guide",
        productId: "prod_soft_line_jacket",
        type: "SIZE_GUIDE_IMPROVEMENT",
        severity: "MEDIUM",
        message:
          "키 168cm 이상 고객 리뷰에서 소매 길이 언급이 반복됩니다. 소매 실측 강조가 필요합니다.",
        createdAt: daysAgo(1)
      },
      {
        insightId: "insight_knit_fit_warning",
        productId: "prod_daily_knit",
        type: "DETAIL_PAGE_IMPROVEMENT",
        severity: "HIGH",
        message: "슬림핏 체감 리뷰가 누적되어 상세 상단에 핏 경고 문구를 노출하는 것이 좋습니다.",
        createdAt: daysAgo(1)
      },
      {
        insightId: "insight_skirt_return",
        productId: "prod_tailored_skirt",
        type: "OPTION_IMPROVEMENT",
        severity: "HIGH",
        message:
          "골반/허리 핏 반품 사유가 확인되어 L 사이즈 입고 또는 허리 실측 안내 보강이 필요합니다.",
        createdAt: daysAgo(0)
      }
    ]
  });

  await prisma.analyticsEvent.createMany({
    data: [
      {
        analyticsEventId: "event_001",
        userId: "user_customer_01",
        sessionId: "session_customer_01_a",
        eventName: "product_fit_filter_applied",
        productId: "prod_soft_line_jacket",
        metadata: { bodyShape: "WAVE", fitPreference: "REGULAR", source: "product_list" },
        createdAt: daysAgo(1)
      },
      {
        analyticsEventId: "event_002",
        userId: "user_customer_01",
        sessionId: "session_customer_01_b",
        eventName: "mcp_delayed_shipment_detected",
        orderId: "order_20260522_0004",
        metadata: {
          shipmentId: "shipment_0004",
          delayDays: 2,
          compensationCouponId: "coupon_delay_3000"
        },
        createdAt: now
      },
      {
        analyticsEventId: "event_003",
        userId: "user_customer_04",
        sessionId: "session_customer_04_a",
        eventName: "return_reason_submitted",
        productId: "prod_tailored_skirt",
        orderId: "order_20260520_0005",
        metadata: { reasonCode: "WAIST_FIT", purchasedSize: "M" },
        createdAt: daysAgo(1)
      }
    ]
  });
}

async function main() {
  await clearDatabase();
  await seedUsersAndBodyProfiles();
  await seedProducts();
  await seedReviewsAndSummaries();
  await seedStoresAndCoupons();
  await seedCartOrdersPaymentsAndShipments();
  await seedSignalsForMcpAndSeller();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed data inserted for PIN STITCH.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
