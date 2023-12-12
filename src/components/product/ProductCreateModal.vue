<script setup lang="ts">
import type { Category } from "@/apis/category/CategoryDto"
import { Ref, ref, watch } from "vue"
import type { AxiosResponse } from "axios"
import { getLeafCategories } from "@/apis/category/CategoryClient"
import { getAllBrands } from "@/apis/brand/BrandClient"
import { ReadBrandResponse } from "@/apis/brand/BrandDto"
import type { ReadProductSizeResponse } from "@/apis/productsize/ProductSizeDto"
import { getProductSizesByCategory } from "@/apis/productsize/ProductSizeClient"
import { genders } from "@/apis/utils/CommonDto"
import type { Gender } from "@/apis/utils/CommonDto"
import type { ProductStockRequest } from "@/apis/product/ProductDto"

const props = defineProps({
  showModal: {
    type: Boolean
  }
})
const emits = defineEmits(["close-create-modal"])

const brands = ref<Array<ReadBrandResponse>>(new Array<ReadBrandResponse>())
const leafCategories = ref<Array<Category>>(new Array<Category>())
const productSizesToUse = ref<Array<ReadProductSizeResponse>>(new Array<ReadProductSizeResponse>())

const requestCode = ref<string>("")
const requestName = ref<string>("")
const requestPrice = ref<number>(0)

const requestCategory = ref<Category>({ id: 0, name: "" })
const requestBrand = ref<ReadBrandResponse>({ id: 0, name: "" })
const requestGender = ref<Gender>({ name: "", value: "" })
const requestImage = ref<string>("")
const requestDescribeImages = ref<Array<String>>(new Array<String>())
const requestProductStocks = ref<Array<ProductStockRequest>>(new Array<ProductStockRequest>())

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

const describeFiles: Ref<Array<File | null>> = ref(new Array<File | null>())
const previewDescribeFiles: Ref<Array<string | null>> = ref(new Array<string | null>())
const onDescribeImageChange = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
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

    console.log(requestDescribeImages.value)
  }
}

const closeModal = () => {
  emits("close-create-modal")
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
  getProductSizesByCategory(requestCategory.value.id)
    .then((axiosResponse: AxiosResponse) => {
      productSizesToUse.value = axiosResponse.data.productSizes
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
})
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
            <input class="modal-input" type="text" v-model="requestName" required />
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">상품 가격</label>
            <input class="modal-input" type="number" v-model="requestPrice" required />
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">카테고리</label>
            <select class="modal-select" v-model.lazy="requestCategory" required>
              <option
                v-for="(category, index) in leafCategories"
                :key="index"
                :value="requestCategory"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">브랜드</label>
            <select class="modal-select" v-model.lazy="requestBrand" required>
              <option v-for="(brand, index) in brands" :key="index" :value="requestBrand">
                {{ brand.name }}
              </option>
            </select>
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">성별</label>
            <select class="modal-select" v-model.lazy="requestGender" required>
              <option v-for="(gender, index) in genders" :key="index" :value="requestGender">
                {{ gender.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-sub"></div>
      </div>
      <div class="modal-button">
        <button class="createBtn">상품 등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/css/product-modal.css");
</style>
