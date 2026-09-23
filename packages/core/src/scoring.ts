import type { ScoreComponents } from "./types.js";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function scoreOpportunity(c: ScoreComponents): number {
  const weighted =
    c.intent * 0.25 +
    c.productFit * 0.25 +
    c.recency * 0.15 +
    c.replyability * 0.10 +
    c.communityFit * 0.10 +
    c.urgency * 0.05 +
    c.engagement * 0.05 +
    c.novelty * 0.05 -
    (c.saturationPenalty ?? 0) -
    (c.promotionRisk ?? 0);

  return Math.round(clamp(weighted));
}

export function scoreBand(score: number) {
  if (score >= 90) return "immediate_review";
  if (score >= 75) return "strong_opportunity";
  if (score >= 60) return "candidate";
  if (score >= 40) return "monitor";
  return "ignore";
}
