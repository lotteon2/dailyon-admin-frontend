export interface CreateCategoryRequest {
  masterCategoryId: number | null
  name: string
}

export interface UpdateCategoryRequest {
  name: string
}
