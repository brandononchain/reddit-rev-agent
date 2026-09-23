import type { Opportunity, RedditThread, ExtractedNeed } from "../../core/src/types.js";

export type ProductContext = {
  name: string;
  valueProposition: string;
  icps: string[];
  pains: string[];
  competitors: string[];
  targetSubreddits: string[];
  searchPhrases: string[];
  verifiedExperienceClaims: string[];
  verifiedProductFacts: string[];
  disclosure: string;
};

export type CommunityPolicy = {
  subreddit: string;
  promotionPolicy: "none" | "disclosed" | "weekly_thread_only" | "unknown";
  productMentionAllowed: boolean;
  notes?: string[];
};

export interface NeedExtractor {
  extract(thread: RedditThread): Promise<ExtractedNeed>;
}

export interface OpportunityQualifier {
  qualify(input: {
    thread: RedditThread;
    need: ExtractedNeed;
    product: ProductContext;
    community: CommunityPolicy;
  }): Promise<Opportunity | null>;
}

export interface ReplyWriter {
  draft(input: {
    opportunity: Opportunity;
    product: ProductContext;
  }): Promise<string>;
}

export interface ReplyCritic {
  review(input: {
    draft: string;
    opportunity: Opportunity;
    product: ProductContext;
  }): Promise<{
    passed: boolean;
    helpfulness: number;
    salesiness: number;
    issues: string[];
  }>;
}
