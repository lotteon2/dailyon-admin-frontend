export interface CreateCategoryRequest {
  masterCategoryId: number | null
  categoryName: string
}

export interface UpdateCategoryRequest {
  name: string
}
