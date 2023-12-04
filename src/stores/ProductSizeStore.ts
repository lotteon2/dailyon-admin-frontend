import { defineStore } from "pinia"
import { type Ref, ref } from "vue"
import type { AxiosResponse } from "axios"
import type {
  ReadProductSizeResponse,
  UpdateProductSizeDto
} from "@/apis/productsize/ProductSizeDto"

export const useProductSizeStore = defineStore("productSize", () => {
  const productSizeMap = ref(new Map<number, Ref<Array<ReadProductSizeResponse>>>())

  function setProductSizeMap(categoryId: number, response: AxiosResponse) {
    productSizeMap.value.set(categoryId, ref(response.data.productSizes))
  }

  function addProductSize(categoryId: number, productSize: ReadProductSizeResponse) {
    console.log(productSizeMap.value)
    console.log(productSizeMap.value.keys())
    productSizeMap.value.get(categoryId).value.unshift(ref(productSize))
  }

  function updateProductSize(categoryId: number, productSize: UpdateProductSizeDto) {
    productSizeMap.value.get(categoryId).value[productSize.index].name = productSize.name
  }

  return { productSizeMap, setProductSizeMap, addProductSize, updateProductSize }
})
