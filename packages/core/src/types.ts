import { z } from "zod";

export const OpportunityCategory = z.enum([
  "recommendation_request",
  "competitor_frustration",
  "workflow_problem",
  "purchase_research",
  "migration_intent",
  "integration_question",
  "technical_problem",
  "general_discussion",
  "venting",
  "irrelevant"
]);
export type OpportunityCategory = z.infer<typeof OpportunityCategory>;

export const OpportunityStatus = z.enum([
  "discovered",
  "pre_filtered",
  "qualified",
  "rules_checked",
  "context_ready",
  "drafted",
  "critique_passed",
  "review_required",
  "approved",
  "dismissed",
  "post_ready",
  "posted",
  "tracking",
  "learned"
]);
export type OpportunityStatus = z.infer<typeof OpportunityStatus>;

export const RedditThread = z.object({
  id: z.string(),
  subreddit: z.string(),
  author: z.string().optional(),
  title: z.string(),
  body: z.string(),
  permalink: z.string(),
  createdAt: z.coerce.date(),
  commentCount: z.number().int().nonnegative().default(0),
  locked: z.boolean().default(false),
  archived: z.boolean().default(false)
});
export type RedditThread = z.infer<typeof RedditThread>;

export const ExtractedNeed = z.object({
  need: z.string(),
  constraints: z.array(z.string()).default([]),
  productsMentioned: z.array(z.string()).default([]),
  question: z.string().optional(),
  intent: OpportunityCategory
});
export type ExtractedNeed = z.infer<typeof ExtractedNeed>;

export type ScoreComponents = {
  intent: number;
  productFit: number;
  recency: number;
  replyability: number;
  communityFit: number;
  urgency: number;
  engagement: number;
  novelty: number;
  saturationPenalty?: number;
  promotionRisk?: number;
};

export type Opportunity = {
  id: string;
  thread: RedditThread;
  need: ExtractedNeed;
  score: number;
  scoreComponents: ScoreComponents;
  whyRelevant: string;
  status: OpportunityStatus;
  promotion: {
    allowed: boolean;
    disclosureRequired: boolean;
    productMentionRecommended: boolean;
  };
};
