import type { OpportunityStatus } from "./types.js";

const transitions: Record<OpportunityStatus, OpportunityStatus[]> = {
  discovered: ["pre_filtered", "dismissed"],
  pre_filtered: ["qualified", "dismissed"],
  qualified: ["rules_checked", "dismissed"],
  rules_checked: ["context_ready", "dismissed"],
  context_ready: ["drafted", "dismissed"],
  drafted: ["critique_passed", "dismissed"],
  critique_passed: ["review_required", "dismissed"],
  review_required: ["approved", "dismissed"],
  approved: ["post_ready", "dismissed"],
  dismissed: [],
  post_ready: ["posted", "dismissed"],
  posted: ["tracking"],
  tracking: ["learned"],
  learned: []
};

export function canTransition(from: OpportunityStatus, to: OpportunityStatus) {
  return transitions[from].includes(to);
}

export function transition(from: OpportunityStatus, to: OpportunityStatus) {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid opportunity transition: ${from} -> ${to}`);
  }
  return to;
}
