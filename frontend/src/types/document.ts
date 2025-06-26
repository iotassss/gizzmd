export interface DocumentSummary {
  id: string;
  title: string;
  preview: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ListDocsResponse {
  documents: DocumentSummary[];
  pagination: PaginationInfo;
}

export interface DocumentFilters {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  tags?: string;
  created_from?: string;
  created_to?: string;
  updated_from?: string;
  updated_to?: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  tags: string;
  snippet: string;
  author_id: string;
  created_at: string;
  edited_at: string;
}