export interface Category {
  id: number | null
  name: string | null
}

export interface ReadCategoryResponse {
  id: number
  name: string
  masterCategoryId: null | number
  masterCategoryName: null | string
}

export interface ReadCategoryPageResponse {
  totalElements: number
  totalPages: number
  responses: Array<ReadCategoryResponse>
}

export interface UpdateCategoryDto {
  index: number
  name: string
}

export interface CreateCategoryRequest {
  masterCategoryId: number | null
  categoryName: string
}

export interface UpdateCategoryRequest {
  name: string
}
