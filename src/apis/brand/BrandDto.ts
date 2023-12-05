export interface CreateBrandRequest {
  name: string
}

export interface UpdateBrandRequest {
  name: string
}

export interface ReadBrandResponse {
  id: number
  name: string
}

export interface CreateBrandResponse {
  brandId: number
}
