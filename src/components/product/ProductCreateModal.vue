<script setup lang="ts">
import type { Category } from "@/apis/category/CategoryDto"
import { computed, type Ref, ref, toRefs, watch } from "vue"
import type { AxiosResponse } from "axios"
import { getLeafCategories } from "@/apis/category/CategoryClient"
import { getAllBrands } from "@/apis/brand/BrandClient"
import type { ReadBrandResponse } from "@/apis/brand/BrandDto"
import type { ReadProductSizeResponse } from "@/apis/productsize/ProductSizeDto"
import { getProductSizesByCategory } from "@/apis/productsize/ProductSizeClient"
import { genders } from "@/apis/utils/CommonDto"
import type { Gender } from "@/apis/utils/CommonDto"
import type {
  CreateProductRequest,
  CreateProductResponse,
  ProductStockRequest
} from "@/apis/product/ProductDto"
import { createProduct } from "@/apis/product/ProductClient"
import { uploadImageToS3 } from "@/apis/s3/S3Client"

const props = defineProps({
  showModal: {
    type: Boolean
  }
})
const emits = defineEmits(["close-create-modal"])

const brands = ref<Array<ReadBrandResponse>>(new Array<ReadBrandResponse>())
const leafCategories = ref<Array<Category>>(new Array<Category>())
const productSizesToUse = ref<Array<ReadProductSizeResponse>>(new Array<ReadProductSizeResponse>())
const productSizeUsed = ref<boolean[]>([])

const requestCode = ref<string>("")
const requestName = ref<string>("")
const requestPrice = ref<number>(0)

const requestCategory = ref<Category>({ id: 0, name: "" })
const requestBrand = ref<ReadBrandResponse>({ id: 0, name: "" })
const requestGender = ref<Gender>({ name: "", value: "" })
const requestImage = ref<string>("")
const requestDescribeImages = ref<Array<String>>(new Array<String>())
const requestProductStocks = ref<Array<ProductStockRequest>>(
  new Array<ProductStockRequest>({ productSizeId: 0, quantity: 0 })
)

const imageFile: Ref<File | null> = ref(null)
const previewImageFile: Ref<string | null> = ref(null)
const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    imageFile.value = target.files[0]
    requestImage.value = target.files[0].name

    const fileReader = new FileReader()
    fileReader.onload = (event: any) => {
      if (event.target) {
        previewImageFile.value = event.target.result as string
      }
    }

    if (imageFile.value) {
      fileReader.readAsDataURL(imageFile.value)
    }
  }
}

const describeFiles: Ref<Array<File>> = ref(new Array<File>())
const previewDescribeFiles: Ref<Array<string>> = ref(new Array<string>())
const onDescribeImageChange = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    if (describeFiles.value.some((file) => file.name === target.files[0].name)) {
      alert("다른 이미지를 선택해주세요")
      return
    }
    describeFiles.value[index] = target.files[0]
    requestDescribeImages.value[index] = target.files[0].name

    const fileReader = new FileReader()
    fileReader.onload = (event: any) => {
      if (event.target) {
        previewDescribeFiles.value[index] = event.target.result as string
      }
    }

    if (describeFiles.value[index]) {
      fileReader.readAsDataURL(describeFiles.value[index])
    }
  }
}

const closeModal = () => {
  emits("close-create-modal")
}

const executeCreate = () => {
  const productStocks: Array<ProductStockRequest> = requestProductStocks.value.filter(
    (productStock) => productStock.quantity > 0 && productStock.productSizeId !== 0
  )

  const describeImages: Array<String> = requestDescribeImages.value.filter(
    (describeImage) => describeImage !== null
  )

  const request: CreateProductRequest = {
    brandId: requestBrand.value.id,
    categoryId: requestCategory.value.id!,
    code: requestCode.value,
    describeImages: describeImages,
    image: requestImage.value,
    name: requestName.value,
    price: requestPrice.value,
    gender: requestGender.value.value,
    type: "NORMAL",
    productStocks: productStocks
  }

  createProduct(request)
    .then((axiosResponse: AxiosResponse) => {
      const response: CreateProductResponse = axiosResponse.data

      uploadImageToS3(response.imgPresignedUrl, imageFile.value!).catch((error: any) => {
        alert("이미지 업로드 오류")
      })

      for (let i = 0; i < describeImages.length; i++) {
        uploadImageToS3(
          response.describeImgPresignedUrl[`${describeImages[i]}`],
          describeFiles.value[i]
        ).catch((error: any) => {
          alert("이미지 업로드 오류")
        })
      }
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}

const addProductStock = () => {
  requestProductStocks.value.push({ productSizeId: 0, quantity: 0 })
}

function removeProductStock(index: number) {
  requestProductStocks.value.splice(index, 1)
}

watch(
  () => props.showModal,
  (newVal, oldVal) => {
    if (newVal) {
      getLeafCategories()
        .then((axiosResponse: AxiosResponse) => {
          leafCategories.value = axiosResponse.data.categoryResponses
        })
        .catch((error: any) => {
          alert(error.response!.data!.message)
        })

      getAllBrands()
        .then((axiosResponse: AxiosResponse) => {
          brands.value = axiosResponse.data.brandResponses
        })
        .catch((error: any) => {
          alert(error.response!.data!.message)
        })
    }
  }
)

watch(requestCategory, () => {
  if (requestCategory.value && requestCategory.value.id !== null) {
    getProductSizesByCategory(requestCategory.value.id)
      .then((axiosResponse: AxiosResponse) => {
        productSizesToUse.value = axiosResponse.data.productSizes
        requestProductStocks.value = [{ productSizeId: 0, quantity: 0 }]
        productSizeUsed.value = Array(productSizesToUse.value.length).fill(false)
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
})

const filteredProductSizes = computed(() => {
  return productSizesToUse.value.filter((productSize, index) => !productSizeUsed.value[index])
})

const selectProductSize = (selectedProductId: number) => {
  const selectedIndex = productSizesToUse.value.findIndex(
    (productSize) => productSize.id === selectedProductId
  )

  if (selectedIndex !== -1) {
    productSizeUsed.value[selectedIndex] = false
  }
}
</script>

<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-name">상품 등록</div>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <div class="modal-main">
        <div class="modal-main-image">
          <img v-if="previewImageFile" :src="previewImageFile" alt="productPreviewImg" />
          <input type="file" @change="onImageChange" />
        </div>
        <div class="modal-sub-images">
          <div v-for="index in 5" :key="index" class="modal-sub-image">
            <img
              v-if="previewDescribeFiles[index]"
              :src="previewDescribeFiles[index]"
              alt="describeImages"
            />
            <input type="file" @change="onDescribeImageChange($event, index)" />
          </div>
        </div>
      </div>
      <div class="modal-sub-container">
        <div class="modal-sub">
          <div class="modal-sub-items">
            <label class="modal-label">상품 코드</label>
            <input class="modal-input" type="text" v-model="requestCode" required />
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">상품명</label>
            <input class="modal-input" type="text" v-model="requestName" />
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">상품 가격</label>
            <input class="modal-input" type="number" v-model="requestPrice" />
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">카테고리</label>
            <select class="modal-select" v-model.lazy="requestCategory">
              <option v-for="(category, index) in leafCategories" :key="index" :value="category">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">브랜드</label>
            <select class="modal-select" v-model.lazy="requestBrand">
              <option v-for="(brand, index) in brands" :key="index" :value="brand">
                {{ brand.name }}
              </option>
            </select>
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">성별</label>
            <select class="modal-select" v-model.lazy="requestGender">
              <option v-for="(gender, index) in genders" :key="index" :value="gender">
                {{ gender.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-sub">
          <div class="modal-sub-header">
            <label class="modal-sub-label">치수별 수량</label>
            <button
              class="updateBtn"
              @click="addProductStock"
              v-if="filteredProductSizes.length > 0"
            >
              추가
            </button>
          </div>
          <div
            v-for="(productStock, index) in requestProductStocks"
            :key="index"
            class="modal-sub-items"
          >
            <select
              class="modal-select"
              v-model.lazy="productStock.productSizeId"
              @change="selectProductSize(productStock.productSizeId)"
            >
              <option
                v-for="(productSize, productSizeIdx) in filteredProductSizes"
                :key="productSizeIdx"
                :value="productSize.id"
              >
                {{ productSize.name }}
              </option>
            </select>
            <input class="modal-input" type="number" v-model="productStock.quantity" />
            <button class="updateBtn" @click="removeProductStock(index)">삭제</button>
          </div>
        </div>
      </div>
      <div class="modal-button">
        <button class="createBtn" @click="executeCreate">상품 등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/css/product-modal.css");
</style>
