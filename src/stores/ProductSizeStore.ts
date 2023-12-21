import { defineStore } from "pinia"
import { ref } from "vue"
import type {
  ReadProductSizeResponse,
  UpdateProductSizeDto
} from "@/apis/productsize/ProductSizeDto"

export const useProductSizeStore = defineStore("productSize", () => {
  const productSizes = ref<Array<ReadProductSizeResponse>>([])

  function setProductSizes(data: Array<ReadProductSizeResponse>) {
    productSizes.value = data
  }

  function addProductSize(data: ReadProductSizeResponse) {
    productSizes.value.unshift(data)
  }

  function updateProductSize(data: UpdateProductSizeDto) {
    productSizes.value[data.index].name = data.name
  }

  return { productSizes, setProductSizes, addProductSize, updateProductSize }
})
