import { getCategoryConfig } from "@/config/categories";
import { getStickerRule } from "@/config/sticker-rules";
import type { BuildingAnalysis, BuildingCategoryId } from "@/types/birdguard";
import type { StickerRecommendation } from "@/lib/recommend-stickers";
import { designPreviewNotice, stickerColors } from "@/config/sticker-catalog";

export type DesignExplanation = {
  summary: string;
  categoryLine: string;
  reflectedFactors: string[];
  reason: string;
  conceptNote: string;
};

export function buildDesignExplanation({
  analysis,
  initialCategory,
  selectedCategory,
  customDesignRequest,
  recommendation,
}: {
  analysis: BuildingAnalysis;
  initialCategory: BuildingCategoryId;
  selectedCategory: BuildingCategoryId;
  customDesignRequest: string;
  recommendation?: StickerRecommendation;
}): DesignExplanation {
  const selectedConfig = getCategoryConfig(selectedCategory);
  const initialConfig = getCategoryConfig(initialCategory);
  const rule = getStickerRule(selectedCategory);
  const categoryChanged = initialCategory !== selectedCategory;
  if (recommendation) {
    const dense = recommendation.layout === "dense";
    const mainColor = stickerColors[recommendation.asset.color];
    const subColor = stickerColors[recommendation.companion.color];
    const mainRisks = analysis.riskFactors.slice(0, 3);
    return {
      summary: `${recommendation.label} 디자인으로 ${recommendation.title} 스티커를 추천해요.`,
      categoryLine: `AI 최초 분류: ${initialConfig.labelKo} / 최종 선택 분류: ${selectedConfig.labelKo}`,
      reflectedFactors: [
        ...(mainRisks.length ? [`주요 위험 요인: ${mainRisks.join(", ")}`] : []),
        `색상: ${mainColor}·${subColor} 조합으로 밝은 배경과 어두운 배경 모두에서 잘 보여요.`,
        `마감: ${recommendation.finish}`,
        dense
          ? "설치 기준: 실측 후 가로·세로 5cm 이내의 강화 배열을 검토해 주세요."
          : "설치 기준: 실측 후 스티커 사이 빈 공간이 가로 10cm·세로 5cm 이내인지 확인해 주세요.",
      ],
      reason: dense
        ? "유리 반사나 주변 환경 때문에 새가 창을 알아보기 어려운 조건이라, 스티커를 촘촘하게 반복해 배치했어요."
        : "스티커를 일정한 간격으로 반복 배치해 새가 유리면을 장애물로 알아볼 수 있게 했어요.",
      conceptNote: `디자인 조합: ${recommendation.id}. 제공된 SVG 원본으로 구성한 미리보기입니다.`,
    };
  }
  const riskFactors = analysis.riskFactors.slice(0, 3);
  const designFactors = analysis.designConsiderations.slice(0, 3);
  const reflectedFactors = [...riskFactors, ...designFactors].slice(0, 5);

  return {
    summary: `${selectedConfig.labelKo} 환경에 맞춰 ${rule.conceptName} 방향의 컨셉 시안을 만들었습니다.`,
    categoryLine: categoryChanged
      ? `AI 최초 분류: ${initialConfig.labelKo} / 최종 선택 분류: ${selectedConfig.labelKo}`
      : `AI 최초 분류와 최종 선택 분류: ${selectedConfig.labelKo}`,
    reflectedFactors,
    reason: [
      `${analysis.classificationReason}`,
      `주요 위험 요소로 ${riskFactors.join(", ") || "사진 기반 위험 요소"}가 반영되었습니다.`,
      customDesignRequest
        ? `사용자 추가 조건인 "${customDesignRequest}"도 프롬프트에 포함했습니다.`
        : "사용자 추가 조건은 입력되지 않았습니다.",
    ].join(" "),
    conceptNote:
      "디자인 설명은 분석 JSON과 설정 파일을 조합해 로컬 코드에서 생성했습니다. 추가 Gemini 설명 호출은 사용하지 않았습니다.",
  };
}