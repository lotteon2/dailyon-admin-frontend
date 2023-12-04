import { defineStore } from "pinia"
import { ref } from "vue"
import type { AxiosResponse } from "axios"
import type { ReadCategoryResponse, UpdateCategoryResponse } from "@/apis/category/CategoryDto"

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Array<ReadCategoryResponse>>([])

  function setCategories(response: AxiosResponse) {
    categories.value = response.data.allCategories
  }

  function addCategory(data: ReadCategoryResponse) {
    categories.value.unshift(data)
  }

  function updateCategory(data: UpdateCategoryResponse) {
    categories.value[data.index].name = data.name
  }

  return { categories, setCategories, addCategory, updateCategory }
})
