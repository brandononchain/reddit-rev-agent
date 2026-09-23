import type { RedditProvider } from "../../reddit/src/provider.js";
import type { NeedExtractor, OpportunityQualifier, ProductContext, CommunityPolicy } from "../../agents/src/contracts.js";
import type { Opportunity } from "../../core/src/types.js";

export class DiscoveryPipeline {
  constructor(
    private readonly reddit: RedditProvider,
    private readonly extractor: NeedExtractor,
    private readonly qualifier: OpportunityQualifier
  ) {}

  async run(product: ProductContext, policies: CommunityPolicy[]): Promise<Opportunity[]> {
    const bySub = new Map(policies.map((p) => [p.subreddit, p]));
    const found = new Map<string, Opportunity>();

    for (const phrase of product.searchPhrases) {
      const threads = await this.reddit.searchPosts(phrase, product.targetSubreddits);

      for (const thread of threads) {
        if (thread.locked || thread.archived || found.has(thread.id)) continue;
        const policy = bySub.get(thread.subreddit);
        if (!policy) continue;

        // Trust boundary: raw Reddit text is reduced to structured need data here.
        const need = await this.extractor.extract(thread);
        const opportunity = await this.qualifier.qualify({ thread, need, product, community: policy });
        if (opportunity) found.set(thread.id, opportunity);
      }
    }

    return [...found.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }
}
