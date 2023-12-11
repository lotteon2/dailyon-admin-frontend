<script setup lang="ts">
import type { AxiosResponse } from "axios"
import PaginationComponent from "@/components/PaginationComponent.vue"
import { getProductPages } from "@/apis/product/ProductClient"
import type {
  ReadProductAdminResponse,
  ReadProductPageRequest,
  ReadProductPageResponse,
  ReadProductStockAdminResponse
} from "@/apis/product/ProductDto"
import { onMounted, ref, watch } from "vue"
import { getAllCategories } from "@/apis/category/CategoryClient"
import { useCategoryStore } from "@/stores/CategoryStore"
import type { ReadBrandResponse } from "@/apis/brand/BrandDto"
import { getAllBrands } from "@/apis/brand/BrandClient"

const categoryStore = useCategoryStore()

const initData = () => {
  getAllBrands()
    .then((axiosResponse: AxiosResponse) => {
      brands.value = axiosResponse.data.brandResponses
      brands.value.unshift({ id: 0, name: "브랜드" })
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })

  getAllCategories()
    .then((axiosResponse: AxiosResponse) => {
      categoryStore.setCategories(axiosResponse.data.allCategories)
      categoryStore.categories.unshift({ id: 0, name: "카테고리" })
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })

  getProductPages({ page: 0, type: "NORMAL" })
    .then((axiosResponse: AxiosResponse) => {
      const response: ReadProductPageResponse = axiosResponse.data
      totalPages.value = response.totalPages
      totalElements.value = response.totalElements
      products.value = response.productResponses
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}

const requestPage = ref<number>(0)
const totalPages = ref<number>(0)
const totalElements = ref<number>(0)

const selectedProduct = ref<ReadProductAdminResponse>({
  id: 0,
  brandId: 0,
  categoryId: 0,
  price: 0,
  name: "",
  code: "",
  gender: "",
  imgUrl: "",
  describeImgUrls: new Array<String>(),
  productStocks: new Array<ReadProductStockAdminResponse>()
})

const selectedBrandId = ref<number>(0)
const selectedCategoryId = ref<number>(0)
const brands = ref<Array<ReadBrandResponse>>(new Array<ReadBrandResponse>())
const products = ref<Array<ReadProductAdminResponse>>(new Array<ReadProductAdminResponse>())
const onChangePage = async (page: number) => {
  if (0 <= page && page < totalPages.value) {
    requestPage.value = page
  }
}

onMounted(initData)

watch(requestPage, async (afterPage: number, beforePage: number) => {
  if (afterPage < totalPages.value) {
    const request: ReadProductPageRequest = {
      page: afterPage,
      type: "NORMAL",
      brandId: selectedBrandId.value === 0 ? null : selectedBrandId.value,
      categoryId: selectedCategoryId.value === 0 ? null : selectedCategoryId.value
    }

    getProductPages(request)
      .then((axiosResponse: AxiosResponse) => {
        const response: ReadProductPageResponse = axiosResponse.data
        totalPages.value = response.totalPages
        totalElements.value = response.totalElements
        products.value = response.productResponses
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
})

watch(
  [selectedCategoryId, selectedBrandId],
  async ([newCategoryId, newBrandId], [oldCategoryId, oldBrandId]) => {
    const request: ReadProductPageRequest = {
      page: requestPage.value,
      type: "NORMAL",
      brandId: newBrandId === 0 ? null : newBrandId,
      categoryId: newCategoryId === 0 ? null : newCategoryId
    }
    getProductPages(request)
      .then((axiosResponse: AxiosResponse) => {
        const response: ReadProductPageResponse = axiosResponse.data
        totalPages.value = response.totalPages
        totalElements.value = response.totalElements
        products.value = response.productResponses
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
)
</script>

<template>
  <div class="product-container">
    <div class="head-button-block">
      <button class="createBtn">상품 등록</button>
    </div>
    <div class="head-block">
      <div>
        <select class="select-block-select" v-model.lazy.number="selectedCategoryId">
          <option
            v-for="(category, index) in categoryStore.categories"
            :key="index"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <select class="select-block-select" v-model.lazy.number="selectedBrandId">
          <option v-for="(brand, index) in brands" :key="index" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>
      </div>
      <div class="button-block">
        <button class="deleteBtn">전체 선택</button>
        <button class="deleteBtn">선택 삭제</button>
        <button class="deleteBtn">전체 삭제</button>
      </div>
    </div>
    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>상품 id</th>
            <th>썸네일 이미지</th>
            <th>상품 코드</th>
            <th>상품명</th>
            <th>상품 가격</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>체크박스</td>
            <td>{{ product.id }}</td>
            <td><img src="{{ product.imgUrl }}" alt="productImgUrl" /></td>
            <td>{{ product.code }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>
              <button class="updateBtn">수정</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationComponent
      :on-change-page="onChangePage"
      :request-page="requestPage"
      :total-pages="totalPages"
    />
  </div>
</template>

<style scoped>
@import url("@/assets/css/product-manage.css");
</style>