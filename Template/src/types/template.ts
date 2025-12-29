import type { PaginationParams } from "./api"

export type TemplateStatus = "draft" | "inProgress" | "completed" | "blocked"
export type TemplatePriority = "P1" | "P2" | "P3"

export interface TemplateItem {
  id: string
  name: string
  status: TemplateStatus
  owner: string
  updatedAt: string
  priority: TemplatePriority
}

export interface TemplateQuery extends Partial<PaginationParams> {
  keyword?: string
  status?: TemplateStatus
  owner?: string
  updatedAt?: string
}

