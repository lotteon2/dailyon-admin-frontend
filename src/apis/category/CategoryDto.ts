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

export interface UpdateCategoryResponse {
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
