import { CategoryInfo } from "./types";

export const categories: CategoryInfo[] = [
  { id: "ux-definition", name: "UXとは", subcategories: ["UXの定義", "UXが重視される背景"], questionCount: 0, keywordCount: 23, importance: 3 },
  { id: "ux-design", name: "UXデザイン", subcategories: ["UXデザイン"], questionCount: 0, keywordCount: 2, importance: 3 },
  { id: "ux-growth", name: "UXグロース", subcategories: ["UXグロース"], questionCount: 0, keywordCount: 16, importance: 3 },
  { id: "ux-intelligence", name: "UXインテリジェンス", subcategories: ["UXインテリジェンスとは"], questionCount: 0, keywordCount: 11, importance: 2 },
  { id: "hcd", name: "人間中心デザイン", subcategories: ["HCD"], questionCount: 0, keywordCount: 9, importance: 3 },
  { id: "design-thinking", name: "デザイン思考", subcategories: ["デザイン思考"], questionCount: 0, keywordCount: 5, importance: 3 },
  { id: "agile", name: "アジャイル", subcategories: ["アジャイル開発"], questionCount: 0, keywordCount: 14, importance: 2 },
  { id: "lean", name: "リーン", subcategories: ["リーン開発"], questionCount: 0, keywordCount: 3, importance: 2 },
  { id: "purpose", name: "パーパス", subcategories: ["パーパス"], questionCount: 0, keywordCount: 4, importance: 1 },
  { id: "behavioral-economics", name: "行動経済学", subcategories: ["行動経済学"], questionCount: 0, keywordCount: 4, importance: 2 },
  { id: "cognitive-psychology", name: "認知心理学", subcategories: ["認知心理学"], questionCount: 0, keywordCount: 8, importance: 2 },
  { id: "anthropology", name: "文化人類学", subcategories: ["文化人類学"], questionCount: 0, keywordCount: 1, importance: 1 },
  { id: "ergonomics", name: "人間工学", subcategories: ["人間工学"], questionCount: 0, keywordCount: 3, importance: 1 },
  { id: "usability", name: "ユーザビリティ", subcategories: ["ユーザビリティ"], questionCount: 0, keywordCount: 5, importance: 3 },
  { id: "accessibility", name: "アクセシビリティ", subcategories: ["アクセシビリティ"], questionCount: 0, keywordCount: 2, importance: 2 },
  { id: "project-management", name: "プロジェクトマネジメント", subcategories: ["プロジェクトマネジメント"], questionCount: 0, keywordCount: 5, importance: 2 },
  { id: "product-management", name: "プロダクトマネジメント", subcategories: ["プロダクトマネジメント"], questionCount: 0, keywordCount: 5, importance: 2 },
  { id: "ux-research", name: "UXリサーチ", subcategories: ["UXリサーチ", "定量調査", "定性調査", "行動データ分析"], questionCount: 0, keywordCount: 25, importance: 3 },
  { id: "user-modeling", name: "ユーザーモデリング", subcategories: ["現在の利用状況の把握", "理想の利用状況の想定", "アイデア創出", "情報設計"], questionCount: 0, keywordCount: 23, importance: 3 },
  { id: "prototyping", name: "プロトタイピング・UXライティング", subcategories: ["プロトタイピング", "UXライティング"], questionCount: 0, keywordCount: 13, importance: 3 },
  { id: "evaluation", name: "評価・検証", subcategories: ["ユーザーテスト", "エキスパートレビュー"], questionCount: 0, keywordCount: 13, importance: 3 },
  { id: "ux-ops", name: "UX運用・グロース", subcategories: ["継続的なUX改善", "組織開発", "育成"], questionCount: 0, keywordCount: 16, importance: 2 },
];

export function getCategoryByName(name: string): CategoryInfo | undefined {
  return categories.find((c) => c.name === name);
}

export function getCategoryById(id: string): CategoryInfo | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryForSubcategory(subcategory: string): CategoryInfo | undefined {
  return categories.find((c) => c.subcategories.includes(subcategory));
}
