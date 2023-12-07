export interface CreateBrandRequest {
  name: string
}

export interface UpdateBrandRequest {
  name: string
}

export interface UpdateBrandDto {
  index: number
  name: string
}

export interface ReadBrandResponse {
  id: number
  name: string
}

export interface CreateBrandResponse {
  brandId: number
}

export interface ReadBrandPageResponse {
  totalElements: number
  totalPages: number
  brandResponses: Array<ReadBrandResponse>
}
