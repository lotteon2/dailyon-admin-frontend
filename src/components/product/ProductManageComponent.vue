<script setup lang="ts">
import type { AxiosResponse } from "axios"
import PaginationComponent from "@/components/PaginationComponent.vue"
import { deleteProducts, getProductPages } from "@/apis/product/ProductClient"
import type {
  ProductTypeEnum,
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
import ProductCreateModal from "@/components/product/ProductCreateModal.vue"
import ProductUpdateModal from "@/components/product/ProductUpdateModal.vue"

const categoryStore = useCategoryStore()

const pageSize: number = 5
const VITE_STATIC_IMG_URL = ref<string>(import.meta.env.VITE_STATIC_IMG_URL)

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
      categoryStore.categories.unshift({
        id: 0,
        masterCategoryId: null,
        masterCategoryName: null,
        name: "카테고리"
      })
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })

  getProductPages({ page: 0, size: pageSize, brandId: null, categoryId: null, type: "NORMAL" })
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

const types = ref<ProductTypeEnum[]>([
  { type: "NORMAL", name: "일반 상품" },
  { type: "AUCTION", name: "경매 상품" }
])

const selectedType = ref<string>("NORMAL")

const selectedProduct = ref<ReadProductAdminResponse>({
  id: 0,
  brandId: 0,
  categoryId: 0,
  price: 0,
  name: "",
  code: "",
  gender: "",
  imgUrl: "",
  describeImgUrls: new Array<string>(),
  productStocks: new Array<ReadProductStockAdminResponse>()
})

const allChecked = ref<boolean>(false)

const selectedBrandId = ref<number>(0)
const selectedCategoryId = ref<number>(0)
const checkedProducts = ref<Array<Number>>(new Array<Number>())
const brands = ref<Array<ReadBrandResponse>>(new Array<ReadBrandResponse>())
const products = ref<Array<ReadProductAdminResponse>>(new Array<ReadProductAdminResponse>())

const isUpdateModalVisible = ref(false)
const isCreateModalVisible = ref(false)
const onChangePage = async (page: number) => {
  if (0 <= page && page < totalPages.value) {
    requestPage.value = page
  }
}

onMounted(initData)

const openCreateModal = () => {
  isCreateModalVisible.value = true
}

const closeCreateModal = () => {
  isCreateModalVisible.value = false
}

const openUpdateModal = (index: number) => {
  selectedProduct.value = products.value[index]
  isUpdateModalVisible.value = true
}

const closeUpdateModal = () => {
  isUpdateModalVisible.value = false
}

const afterUpdate = () => {
  isUpdateModalVisible.value = false
  initData()
}

const afterCreate = () => {
  isCreateModalVisible.value = false
  initData()
}

const toggleAll = () => {
  if (allChecked.value) {
    checkedProducts.value = []
  } else {
    checkedProducts.value = products.value.map((product) => product.id)
  }
  allChecked.value = !allChecked.value
}

const deleteChecked = () => {
  if (checkedProducts.value.length == 0) {
    alert("삭제할 상품을 선택해주세요")
    return
  }
  if (confirm("삭제하시겠습니까?")) {
    deleteProducts(checkedProducts.value)
      .then(() => {
        checkedProducts.value = []
        alert("삭제 성공")
      })
      .then(initData)
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
}

const deleteAll = () => {
  if (confirm("삭제하시겠습니까?")) {
    deleteProducts(products.value.map((product) => product.id))
      .then(() => {
        checkedProducts.value = []
        alert("삭제 성공")
      })
      .then(initData)
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
}

watch(requestPage, async (afterPage: number, beforePage: number) => {
  checkedProducts.value = []
  if (afterPage < totalPages.value) {
    const request: ReadProductPageRequest = {
      page: afterPage,
      size: pageSize,
      type: selectedType.value,
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
      size: pageSize,
      type: selectedType.value,
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
watch(selectedType, async (newType, oldType) => {
  const request: ReadProductPageRequest = {
    page: 0,
    size: pageSize,
    type: newType,
    brandId: selectedBrandId.value === 0 ? null : selectedBrandId.value,
    categoryId: selectedCategoryId.value === 0 ? null : selectedCategoryId.value
  }
  getProductPages(request)
    .then((axiosResponse: AxiosResponse) => {
      const response: ReadProductPageResponse = axiosResponse.data
      totalPages.value = response.totalPages
      totalElements.value = response.totalElements
      products.value = response.productResponses
      requestPage.value = 0
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
})
</script>

<template>
  <div class="product-container">
    <ProductCreateModal
      :show-modal="isCreateModalVisible"
      @close-create-modal="closeCreateModal"
      @create-success="afterCreate"
    />
    <ProductUpdateModal
      :show-modal="isUpdateModalVisible"
      :product-to-update="selectedProduct"
      @close-update-modal="closeUpdateModal"
      @update-succes="afterUpdate"
    />
    <div class="head-button-block">
      <button class="createBtn" @click="openCreateModal">상품 등록</button>
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
        <select class="select-block-select" v-model="selectedType">
          <option v-for="(type, index) in types" :key="index" :value="type.type">
            {{ type.name }}
          </option>
        </select>
      </div>
      <div class="button-block" v-if="selectedType === 'NORMAL'">
        <button class="deleteBtn" @click="toggleAll">
          {{ allChecked ? "전체 해제" : "전체 선택" }}
        </button>
        <button class="deleteBtn" @click="deleteChecked">선택 삭제</button>
        <button class="deleteBtn" @click="deleteAll">전체 삭제</button>
      </div>
    </div>
    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>상품 id</th>
            <th>썸네일 이미지</th>
            <th>재고</th>
            <th>상품 코드</th>
            <th>상품명</th>
            <th>상품 가격</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>
              <input
                type="checkbox"
                :id="`checkbox-${index}`"
                :value="product.id"
                v-model="checkedProducts"
                v-if="selectedType === 'NORMAL'"
              />
            </td>
            <td>{{ product.id }}</td>
            <td>
              <img
                class="product-thumbnail"
                :src="`${VITE_STATIC_IMG_URL}${product.imgUrl}`"
                alt="product-img"
              />
            </td>
            <td class="product-stocks">
              <div
                class="stock-quantity"
                v-for="(productStock, index) in product.productStocks"
                :key="index"
              >
                {{ `${productStock.productSizeName} - ${productStock.quantity}개` }}
              </div>
            </td>
            <td>{{ product.code }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price.toLocaleString() }}원</td>
            <td>
              <button
                class="updateBtn"
                v-if="selectedType === 'NORMAL'"
                @click="openUpdateModal(index)"
              >
                수정
              </button>
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
