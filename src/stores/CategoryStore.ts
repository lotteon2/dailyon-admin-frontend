import { defineStore } from "pinia"
import { ref } from "vue"
import type { ReadCategoryResponse, UpdateCategoryDto } from "@/apis/category/CategoryDto"

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Array<ReadCategoryResponse>>([])

  function setCategories(data: Array<ReadCategoryResponse>) {
    categories.value = data
  }

  function addCategory(data: ReadCategoryResponse) {
    categories.value.unshift(data)
  }

  function updateCategory(data: UpdateCategoryDto) {
    categories.value[data.index].name = data.name
  }

  return { categories, setCategories, addCategory, updateCategory }
})
