import type { RedditThread } from "../../core/src/types.js";

export interface RedditProvider {
  getNewPosts(subreddit: string): Promise<RedditThread[]>;
  searchPosts(query: string, subreddits?: string[]): Promise<RedditThread[]>;
  getThread(id: string): Promise<RedditThread>;
}

export class MockRedditProvider implements RedditProvider {
  constructor(private readonly threads: RedditThread[] = []) {}

  async getNewPosts(subreddit: string) {
    return this.threads.filter((t) => t.subreddit.toLowerCase() === subreddit.toLowerCase());
  }

  async searchPosts(query: string, subreddits?: string[]) {
    const q = query.toLowerCase();
    return this.threads.filter((t) => {
      const communityOk = !subreddits?.length || subreddits.includes(t.subreddit);
      const text = `${t.title} ${t.body}`.toLowerCase();
      return communityOk && text.includes(q);
    });
  }

  async getThread(id: string) {
    const thread = this.threads.find((t) => t.id === id);
    if (!thread) throw new Error(`Thread not found: ${id}`);
    return thread;
  }
}
