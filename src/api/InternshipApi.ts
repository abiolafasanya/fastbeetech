import QueryBuilder from "@/lib/utils";
import { PaginatedResponse } from "@/types/global";
import axios, { AxiosResponse } from "axios";
import { Listing, ListingFilters } from "@/types/Listing";
import { InternshipFormData } from "@/app/components/internshipModal";

// Interfaces for request parameters

export interface GetBranchParams {
  page: number;
  pageSize: number;
}

interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
}

interface InternshipApplication {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
}

class InternshipApi {
  private readonly url: string;

  constructor() {
    this.url = "/api/v1/internship";
  }

  private buildListingQuery = (filters: Partial<ListingFilters>) => {
    const query = new QueryBuilder(`${this.url}s/`);

    if (filters.category) query.set("category", filters.category);
    if (filters.location) query.set("location", filters.location);
    if (filters.minPrice) query.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) query.set("maxPrice", filters.maxPrice.toString());

    // House-specific
    if (filters.bedrooms) query.set("bedrooms", filters.bedrooms.toString());
    if (filters.type) query.set("type", filters.type);

    // Product-specific
    if (filters.productType) query.set("productType", filters.productType);
    if (filters.condition) query.set("condition", filters.condition);

    // Service-specific
    if (filters.serviceType) query.set("serviceType", filters.serviceType);
    if (filters.availability) query.set("availability", filters.availability);

    return query.build();
  };

  async fetchListings(
    params: Partial<ListingFilters> = {}
  ): Promise<PaginatedResponse<Listing>> {
    const query = this.buildListingQuery(params);

    const response: AxiosResponse<PaginatedResponse<Listing>> =
      await axios.get(query);
    return response.data;
  }

  async intenshipApplications(params: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<InternshipApplication>>> {
    const query = new QueryBuilder(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/internship/applications`
    )
      .set("page", params.page?.toString() || "1")
      .set("pageSize", params.pageSize?.toString() || "10")
      .set("search", params.search || "")
      .build();

    const response: AxiosResponse<
      ApiResponse<PaginatedResponse<InternshipApplication>>
    > = await axios.get(query);
    return response.data;
  }

  async findOne(id: string): Promise<ApiResponse<InternshipApplication>> {
    const query = new QueryBuilder(`${this.url}/${id}`).build();

    const response: AxiosResponse<ApiResponse<InternshipApplication>> =
      await axios.get(query);
    return response.data;
  }

  async create(payload: InternshipFormData): Promise<ApiResponse> {
    const query = new QueryBuilder(`${this.url}/`).build();

    const response: AxiosResponse<ApiResponse> = await axios.post(
      query,
      payload
    );
    return response.data;
  }

  async updateStatus(payload: {
    id: string;
    status: "accepted" | "rejected";
  }): Promise<ApiResponse<{ status: "accepted" | "rejected" }>> {
    const query = new QueryBuilder(`${this.url}/${payload.id}/status`).build();

    const response: AxiosResponse<
      ApiResponse<{ status: "accepted" | "rejected" }>
    > = await axios.patch(query, { status: payload.status });
    return response.data;
  }

  async sendMail(id: string): Promise<ApiResponse> {
    const query = new QueryBuilder(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/internship/applications/${id}`
    ).build();

    const response: AxiosResponse<ApiResponse> = await axios.post(query);
    console.log("Send mail response:", query, response.data);
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse> {
    const query = new QueryBuilder(`${this.url}/$${id}`).build();

    const response: AxiosResponse<ApiResponse> = await axios.delete(query);
    return response.data;
  }
}

// Export a singleton instance
const InternshipApiInstance = new InternshipApi();
export default InternshipApiInstance;
