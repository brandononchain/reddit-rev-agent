import type { Opportunity } from "../../core/src/types.js";
import type { ProductContext } from "./contracts.js";

const salesyPatterns = [
  /game[- ]changer/i,
  /look no further/i,
  /highly recommend/i,
  /revolution/i,
  /seamless(ly)?/i
];

export function validateDraft(draft: string, opportunity: Opportunity, product: ProductContext) {
  const issues: string[] = [];
  const words = draft.trim().split(/\s+/).filter(Boolean);

  if (words.length < 15 || words.length > 80) issues.push("reply_length_out_of_bounds");
  if (salesyPatterns.some((p) => p.test(draft))) issues.push("salesy_language");

  const namesProduct = draft.toLowerCase().includes(product.name.toLowerCase());
  if (namesProduct && !opportunity.promotion.productMentionRecommended) {
    issues.push("product_mention_gate_failed");
  }
  if (namesProduct && !draft.toLowerCase().includes(product.disclosure.toLowerCase().slice(0, 12))) {
    issues.push("missing_affiliation_disclosure");
  }

  if (/https?:\/\//i.test(draft)) issues.push("link_drop");

  return { passed: issues.length === 0, issues };
}
