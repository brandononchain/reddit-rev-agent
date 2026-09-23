import { MockRedditProvider } from "../../../packages/reddit/src/provider.js";
import { DiscoveryPipeline } from "../../../packages/orchestrator/src/pipeline.js";
import { scoreOpportunity } from "../../../packages/core/src/scoring.js";
import type { NeedExtractor, OpportunityQualifier } from "../../../packages/agents/src/contracts.js";

const reddit = new MockRedditProvider([
  {
    id: "demo-1",
    subreddit: "LocalLLaMA",
    title: "openclaw always running",
    body: "How are people keeping an OpenClaw agent online when their laptop is closed?",
    permalink: "https://reddit.com/r/LocalLLaMA/comments/demo-1",
    createdAt: new Date(),
    commentCount: 4,
    locked: false,
    archived: false
  }
]);

const extractor: NeedExtractor = {
  async extract(thread) {
    return {
      need: "Persistent hosting for an OpenClaw agent",
      constraints: ["must remain online while laptop is closed"],
      productsMentioned: ["OpenClaw"],
      question: thread.body,
      intent: "recommendation_request"
    };
  }
};

const qualifier: OpportunityQualifier = {
  async qualify({ thread, need, community }) {
    const scoreComponents = {
      intent: 95,
      productFit: 95,
      recency: 100,
      replyability: 90,
      communityFit: 85,
      urgency: 70,
      engagement: 55,
      novelty: 80,
      saturationPenalty: 0,
      promotionRisk: community.productMentionAllowed ? 0 : 15
    };

    return {
      id: `opp-${thread.id}`,
      thread,
      need,
      score: scoreOpportunity(scoreComponents),
      scoreComponents,
      whyRelevant: "The OP is explicitly asking for persistent agent hosting.",
      status: "qualified",
      promotion: {
        allowed: community.productMentionAllowed,
        disclosureRequired: true,
        productMentionRecommended: community.productMentionAllowed
      }
    };
  }
};

const pipeline = new DiscoveryPipeline(reddit, extractor, qualifier);
const opportunities = await pipeline.run(
  {
    name: "Example Product",
    valueProposition: "Persistent infrastructure for autonomous agents",
    icps: ["AI builders"],
    pains: ["keeping agents online"],
    competitors: [],
    targetSubreddits: ["LocalLLaMA"],
    searchPhrases: ["openclaw always running"],
    verifiedExperienceClaims: [],
    verifiedProductFacts: ["Provides persistent agent infrastructure"],
    disclosure: "Full disclosure, I work on Example Product"
  },
  [{
    subreddit: "LocalLLaMA",
    promotionPolicy: "disclosed",
    productMentionAllowed: true
  }]
);

console.log(JSON.stringify(opportunities, null, 2));
