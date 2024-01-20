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
import { onMounted, reactive, ref, watch, computed } from "vue"
import { getAllCategories } from "@/apis/category/CategoryClient"
import { useCategoryStore } from "@/stores/CategoryStore"
import type { ReadBrandResponse } from "@/apis/brand/BrandDto"
import { getAllBrands } from "@/apis/brand/BrandClient"
import ProductCreateModal from "@/components/product/ProductCreateModal.vue"
import ProductUpdateModal from "@/components/product/ProductUpdateModal.vue"
import WhitePageComponent from "@/components/WhitePageComponent.vue"

const categoryStore = useCategoryStore()

const pageSize: number = 5
const VITE_STATIC_IMG_URL = ref<string>(import.meta.env.VITE_STATIC_IMG_URL)

const allChecked = computed(() => {
  return checkedProducts.value.length === Math.min(pageSize, products.value.length)
})

const selectedBrandId = ref<number>(0)
const selectedCategoryId = ref<number>(0)
const checkedProducts = ref<Array<Number>>(new Array<Number>())
const brands = ref<Array<ReadBrandResponse>>(new Array<ReadBrandResponse>())
const products = ref<Array<ReadProductAdminResponse>>(new Array<ReadProductAdminResponse>())

const sort = ref<string>("updatedAt")
const direction = ref<string>("desc")
const query = ref<string | null>(null)

const isUpdateModalVisible = ref(false)
const isCreateModalVisible = ref(false)

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

  getProductPages({
    page: 0,
    size: pageSize,
    brandId: null,
    categoryId: null,
    type: "NORMAL",
    query: null,
    sort: "updatedAt",
    direction: "desc"
  })
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
  brandName: "",
  categoryId: 0,
  categoryName: "",
  price: 0,
  name: "",
  code: "",
  gender: "",
  imgUrl: "",
  describeImgUrls: new Array<string>(),
  productStocks: new Array<ReadProductStockAdminResponse>()
})
const onChangePage = async (page: number) => {
  if (0 <= page && page < totalPages.value) {
    requestPage.value = page
    checkedProducts.value = []
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
  console.log("after update")
  isUpdateModalVisible.value = false
  getProductPages({
    page: (requestPage.value = 0),
    size: pageSize,
    brandId: selectedBrandId.value,
    categoryId: selectedCategoryId.value,
    type: selectedType.value,
    query: query.value,
    sort: sort.value,
    direction: direction.value
  })
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

const afterCreate = () => {
  console.log("after create")
  isCreateModalVisible.value = false
  getProductPages({
    page: requestPage.value,
    size: pageSize,
    brandId: selectedBrandId.value === 0 ? null : selectedBrandId.value,
    categoryId: selectedCategoryId.value === 0 ? null : selectedCategoryId.value,
    type: selectedType.value,
    query: query.value,
    sort: sort.value,
    direction: direction.value
  })
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

const changeSortAndDirection = (sortVal: string, dirVal: string) => {
  sort.value = sortVal
  direction.value = dirVal
}

const sorted = (
  productStocks: Array<ReadProductStockAdminResponse>
): Array<ReadProductStockAdminResponse> => {
  return productStocks.sort(
    (a: ReadProductStockAdminResponse, b: ReadProductStockAdminResponse) => b.quantity - a.quantity
  )
}

const toggleAll = () => {
  if (allChecked.value) {
    checkedProducts.value = []
  } else {
    checkedProducts.value = products.value.map((product) => product.id)
  }
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
      .then(() =>
        getProductPages({
          page: requestPage.value,
          size: pageSize,
          brandId: selectedBrandId.value === 0 ? null : selectedBrandId.value,
          categoryId: selectedCategoryId.value === 0 ? null : selectedCategoryId.value,
          type: selectedType.value,
          query: query.value,
          sort: sort.value,
          direction: direction.value
        })
          .then((axiosResponse: AxiosResponse) => {
            const response: ReadProductPageResponse = axiosResponse.data
            totalPages.value = response.totalPages
            totalElements.value = response.totalElements
            products.value = response.productResponses
          })
          .catch((error: any) => {
            alert(error.response!.data!.message)
          })
      )
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
      .then(() =>
        getProductPages({
          page: requestPage.value,
          size: pageSize,
          brandId: selectedBrandId.value === 0 ? null : selectedBrandId.value,
          categoryId: selectedCategoryId.value === 0 ? null : selectedCategoryId.value,
          type: selectedType.value,
          query: query.value,
          sort: sort.value,
          direction: direction.value
        })
          .then((axiosResponse: AxiosResponse) => {
            const response: ReadProductPageResponse = axiosResponse.data
            totalPages.value = response.totalPages
            totalElements.value = response.totalElements
            products.value = response.productResponses
          })
          .catch((error: any) => {
            alert(error.response!.data!.message)
          })
      )
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
}

const searchProducts = () => {
  const request: ReadProductPageRequest = {
    page: (requestPage.value = 0),
    size: pageSize,
    type: selectedType.value,
    brandId: selectedBrandId.value === 0 ? null : selectedBrandId.value,
    categoryId: selectedCategoryId.value === 0 ? null : selectedCategoryId.value,
    query: query.value === "" ? null : query.value,
    sort: sort.value,
    direction: direction.value
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

// 페이지 이동 watch
watch(requestPage, (afterPage: number, beforePage: number) => {
  checkedProducts.value = []
  if (afterPage < totalPages.value) {
    const request: ReadProductPageRequest = {
      page: afterPage,
      size: pageSize,
      type: selectedType.value,
      brandId: selectedBrandId.value === 0 ? null : selectedBrandId.value,
      categoryId: selectedCategoryId.value === 0 ? null : selectedCategoryId.value,
      query: query.value,
      sort: sort.value,
      direction: direction.value
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

// 카테고리, 브랜드 watch
watch(
  [selectedCategoryId, selectedBrandId],
  ([newCategoryId, newBrandId], [oldCategoryId, oldBrandId]) => {
    const request: ReadProductPageRequest = {
      page: (requestPage.value = 0),
      size: pageSize,
      type: selectedType.value,
      brandId: newBrandId === 0 ? null : newBrandId,
      categoryId: newCategoryId === 0 ? null : newCategoryId,
      query: query.value,
      sort: sort.value,
      direction: direction.value
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

// 상품 타입 watch
watch(selectedType, async (newType, oldType) => {
  const request: ReadProductPageRequest = {
    page: (requestPage.value = 0),
    size: pageSize,
    type: newType,
    brandId: selectedBrandId.value === 0 ? null : selectedBrandId.value,
    categoryId: selectedCategoryId.value === 0 ? null : selectedCategoryId.value,
    query: null,
    sort: sort.value,
    direction: direction.value
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
})

//정렬 기준 watch
watch(sort, (newSort, oldSort) => {
  const request: ReadProductPageRequest = {
    page: (requestPage.value = 0),
    size: pageSize,
    type: selectedType.value,
    brandId: selectedBrandId.value === 0 ? null : selectedBrandId.value,
    categoryId: selectedCategoryId.value === 0 ? null : selectedCategoryId.value,
    query: null,
    sort: newSort,
    direction: direction.value
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
      <div class="button-block">
        <button class="sortBtn" v-if="sort === 'updatedAt' && direction === 'desc'">최신순</button>
        <button class="disabledBtn" v-else @click="changeSortAndDirection('updatedAt', 'desc')">
          최신순
        </button>
        <button class="sortBtn" v-if="sort === 'review' && direction === 'desc'">
          리뷰 많은 순
        </button>
        <button class="disabledBtn" v-else @click="changeSortAndDirection('review', 'desc')">
          리뷰 많은 순
        </button>
        <button class="sortBtn" v-if="sort === 'rating' && direction === 'desc'">
          평점 높은 순
        </button>
        <button class="disabledBtn" v-else @click="changeSortAndDirection('rating', 'desc')">
          평점 높은 순
        </button>
      </div>

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
        <input
          class="select-block-input"
          type="text"
          v-model.lazy="query"
          placeholder="상품명 또는 코드로 검색"
          @keyup.enter="searchProducts"
        />
      </div>
      <div class="button-block" v-if="selectedType === 'NORMAL'">
        <button class="deleteBtn" @click="toggleAll">
          {{ allChecked ? "전체 해제" : "전체 선택" }}
        </button>
        <button class="deleteBtn" @click="deleteChecked">선택 삭제</button>
        <button class="deleteBtn" @click="deleteAll">전체 삭제</button>
      </div>
    </div>
    <div class="table-block" v-if="products.length > 0">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>썸네일 이미지</th>
            <th>카테고리</th>
            <th>브랜드</th>
            <th>상품명</th>
            <th>재고</th>
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
            <td>
              <img
                class="product-thumbnail"
                :src="`${VITE_STATIC_IMG_URL}${product.imgUrl}`"
                alt="product-img"
              />
            </td>
            <td>{{ product.categoryName }}</td>
            <td>{{ product.brandName }}</td>
            <td>{{ product.name }}</td>
            <td class="product-stocks">
              <div
                class="stock-quantity"
                v-for="(productStock, index) in sorted(product.productStocks)"
                :key="index"
              >
                {{
                  `${productStock.productSizeName} - ${productStock.quantity.toLocaleString()}개`
                }}
              </div>
            </td>
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
    <div class="table-block" v-else>
      <WhitePageComponent message="상품이 존재하지 않습니다" />
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
