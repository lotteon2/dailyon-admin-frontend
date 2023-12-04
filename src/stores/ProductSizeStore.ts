import { defineStore } from "pinia"
import { ref } from "vue"
import type { AxiosResponse } from "axios"
import type {
  ReadProductSizeResponse,
  UpdateProductSizeDto
} from "@/apis/productsize/ProductSizeDto"

export const useProductSizeStore = defineStore("productSize", () => {
  const productSizeMap = ref<Map<number, Array<ReadProductSizeResponse>>>(new Map())

  function setProductSizeMap(categoryId: number, response: AxiosResponse) {
    productSizeMap.value.set(categoryId, response.data.productSizes)
  }

  function addProductSize(categoryId: number, productSize: ReadProductSizeResponse) {
    productSizeMap.value.get(categoryId)?.unshift(productSize)
  }

  function updateProductSize(categoryId: number, productSize: UpdateProductSizeDto) {
    productSizeMap.value.get(categoryId)![productSize.index].name = productSize.name
  }

  return { productSizeMap, setProductSizeMap, addProductSize, updateProductSize }
})
