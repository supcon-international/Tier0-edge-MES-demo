import { request } from "../request"
import type { ApiResponse, PaginationResponse } from "../../types/api"
import type { TemplateItem, TemplateQuery } from "../../types/template"

export const fetchTemplateList = (params: TemplateQuery) =>
  request.get<ApiResponse<PaginationResponse<TemplateItem>>>("templates", {
    params,
  })

export const fetchTemplateDetail = (id: string) =>
  request.get<ApiResponse<TemplateItem>>(`templates/${id}`)

