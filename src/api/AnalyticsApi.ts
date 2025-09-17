import QueryBuilder from "@/lib/utils";
import axios from "axios";

export interface AnalyticsSeriesItem {
  day: string;
  views: number;
  reads: number;
  completions: number;
  likes: number;
  shares: number;
}

export interface AnalyticsTotals {
  views: number;
  reads: number;
  completions: number;
  likes: number;
  shares: number;
}

export interface AdminAnalyticsOverviewResponse {
  status: true;
  data: {
    series: AnalyticsSeriesItem[];
    totals: AnalyticsTotals;
    completionRate: number;
  };
}

class AnalyticsApi {
  private readonly url: string;
  private readonly adminUrl: string;

  constructor() {
    this.url = "/api/v1/analytics";
    this.adminUrl = "/api/v1/admin";
  }

  /**
   * Public: capture an analytics event
   * POST /api/v1/analytics/events
   */
  async captureEvent(event: Record<string, unknown>): Promise<unknown> {
    const response = await axios.post(`${this.url}/events`, event);
    return response.data as unknown;
  }

  /**
   * Admin: analytics overview
   * GET /api/v1/analytics/admin/analytics/overview
   */
  async adminAnalyticsOverview(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<AdminAnalyticsOverviewResponse> {
    const qb = new QueryBuilder(
      `${this.adminUrl}/analytics/overview`
    ).addParams(params);
    const query = qb.build();
    const response = await axios.get<AdminAnalyticsOverviewResponse>(query);
    return response.data as AdminAnalyticsOverviewResponse;
  }

  /**
   * Admin: top analytics
   * GET /api/v1/analytics/admin/analytics/top
   */
  async adminAnalyticsTop(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<unknown> {
    const qb = new QueryBuilder(`${this.adminUrl}/analytics/top`).addParams(
      params
    );
    const query = qb.build();
    const response = await axios.get(query);
    return response.data as unknown;
  }

  /**
   * Admin: general stats overview
   * GET /api/v1/analytics/admin/stats
   */
  async adminStatsOverview(
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<unknown> {
    const qb = new QueryBuilder(`${this.adminUrl}/stats`).addParams(params);
    const query = qb.build();
    const response = await axios.get(query);
    return response.data as unknown;
  }
}

// Export a singleton instance
const AnalyticsApiInstance = new AnalyticsApi();
export default AnalyticsApiInstance;
