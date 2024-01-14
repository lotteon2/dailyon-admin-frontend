<script setup lang="ts">
import type {
  ProductStockRequest,
  ReadProductAdminResponse,
  UpdateProductRequest,
  UpdateProductResponse
} from "@/apis/product/ProductDto"
import { computed, type Ref, ref, watch } from "vue"
import type { ReadBrandResponse } from "@/apis/brand/BrandDto"
import type { Category } from "@/apis/category/CategoryDto"
import type { ReadProductSizeResponse } from "@/apis/productsize/ProductSizeDto"
import type { Gender } from "@/apis/utils/CommonDto"
import { getLeafCategories } from "@/apis/category/CategoryClient"
import { getAllBrands } from "@/apis/brand/BrandClient"
import type { AxiosResponse } from "axios"
import { getProductSizesByCategory } from "@/apis/productsize/ProductSizeClient"
import { genders } from "@/apis/utils/CommonDto"
import { updateProduct } from "@/apis/product/ProductClient"
import { uploadImageToS3 } from "@/apis/s3/S3Client"

const VITE_STATIC_IMG_URL = ref<string>(import.meta.env.VITE_STATIC_IMG_URL)

const props = defineProps({
  showModal: {
    type: Boolean
  },
  productToUpdate: {
    type: Object as () => ReadProductAdminResponse,
    required: true
  }
})
const emits = defineEmits(["close-update-modal", "update-success"])

const isEnabled = ref<boolean>(true)

const brands = ref<Array<ReadBrandResponse>>(new Array<ReadBrandResponse>())
const leafCategories = ref<Array<Category>>(new Array<Category>())
const productSizes = ref<Array<ReadProductSizeResponse>>(new Array<ReadProductSizeResponse>())

const requestCode = ref<string>("")
const requestName = ref<string>("")
const requestPrice = ref<number>(0)

const requestCategory = ref<Category>({ id: 0, name: "" })
const requestBrand = ref<ReadBrandResponse>({ id: 0, name: "" })
const requestGender = ref<Gender>({ name: "", value: "" })
const requestImage = ref<string>("")
const requestProductStocks = ref<Array<ProductStockRequest>>([])

const inputImageFile: Ref<HTMLInputElement | null> = ref(null)
const imageFile: Ref<File | null> = ref(null)
const previewImageFile: Ref<string> = ref("")
const triggerInputFile = () => {
  if (inputImageFile.value) {
    inputImageFile.value.click()
  }
}

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

const requestDescribeImages = ref<Record<string, string>>({})
const inputDescribeFiles: Ref<Array<HTMLInputElement | null>> = ref([])
const describeFiles: Ref<Array<File>> = ref([])
const previewDescribeFiles: Ref<Array<string>> = ref([])
const onDescribeImageChange = (event: Event, index: number, fileToChange: string) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    if (describeFiles.value.some((file) => file.name === target.files![0].name)) {
      alert("다른 이미지를 선택해주세요")
      return
    }
    describeFiles.value[index] = target.files[0]
    requestDescribeImages.value[fileToChange] = target.files[0].name

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

const triggerInputDescribeFile = (index: number) => {
  if (inputDescribeFiles.value[index] !== null) {
    inputDescribeFiles.value[index]!.click()
  }
}

const closeModal = () => {
  isEnabled.value = true

  requestCode.value = ""
  requestName.value = ""
  requestPrice.value = 0

  requestCategory.value = { id: 0, name: "" }
  requestBrand.value = { id: 0, name: "" }
  requestGender.value = { name: "", value: "" }
  requestImage.value = ""
  requestDescribeImages.value = {}
  requestProductStocks.value = []

  inputImageFile.value = null
  imageFile.value = null
  previewImageFile.value = ""

  inputDescribeFiles.value = []
  describeFiles.value = []
  previewDescribeFiles.value = []
  emits("close-update-modal")
}

const executeUpdate = () => {
  if (isEnabled.value === true) {
    isEnabled.value = false

    const productStocks: Array<ProductStockRequest> = requestProductStocks.value.filter(
      (productStock) => productStock.quantity > 0 && productStock.productSizeId !== 0
    )

    if (productStocks.length === 0) {
      alert("수량을 입력해주세요")
      isEnabled.value = true
      return
    }

    const describeImagesToUpdate: Record<string, string> = Object.entries(
      requestDescribeImages.value
    )
      .filter(([key, value]) => value !== "")
      .reduce((filteredRecord: Record<string, string>, [key, value]) => {
        return { ...filteredRecord, [key]: value }
      }, {})

    const request: UpdateProductRequest = {
      brandId: requestBrand.value.id,
      categoryId: requestCategory.value.id!,
      price: requestPrice.value,
      name: requestName.value,
      code: requestCode.value,
      gender: requestGender.value.value,
      image: requestImage.value,
      productStocks: productStocks,
      describeImages: describeImagesToUpdate
    }

    updateProduct(props.productToUpdate!.id, request)
      .then((axiosResponse: AxiosResponse) => {
        const response: UpdateProductResponse = axiosResponse.data

        if (response.imgPresignedUrl != null) {
          uploadImageToS3(response.imgPresignedUrl, imageFile.value!).catch((error: any) => {
            alert("상품 이미지 업로드 오류")
          })
        }

        if (response.describeImgPresignedUrl != null) {
          Object.entries(response.describeImgPresignedUrl).map(([key, value]) => {
            uploadImageToS3(value, describeFiles.value.find((file) => file.name === key)!).catch(
              (error: any) => {
                alert("상품 설명 이미지 업로드 오류")
              }
            )
          })
        }
      })
      .then(() => {
        alert("등록 성공")
        emits("update-success")
        closeModal()
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
}

watch(
  () => props.showModal,
  (newVal, oldVal) => {
    if (newVal) {
      requestCode.value = props.productToUpdate!.code
      requestName.value = props.productToUpdate!.name
      requestPrice.value = props.productToUpdate!.price
      previewImageFile.value = `${VITE_STATIC_IMG_URL.value}${props.productToUpdate!.imgUrl}`
      requestGender.value = genders.value.find(
        (gender) => gender.value === props.productToUpdate!.gender
      )!
      previewDescribeFiles.value = props.productToUpdate!.describeImgUrls.map(
        (imgUrl) => `${VITE_STATIC_IMG_URL.value}${imgUrl}`
      )!
      requestDescribeImages.value = props.productToUpdate!.describeImgUrls.reduce(
        (record: Record<string, string>, key: string) => {
          return { ...record, [key]: "" }
        },
        {}
      )

      getLeafCategories()
        .then((axiosResponse: AxiosResponse) => {
          leafCategories.value = axiosResponse.data.categoryResponses
          requestCategory.value = leafCategories.value.find(
            (category) => category.id === props.productToUpdate!.categoryId
          )!

          getProductSizesByCategory(requestCategory.value.id!)
            .then((axiosResponse: AxiosResponse) => {
              productSizes.value = axiosResponse.data.productSizes
              requestProductStocks.value = productSizes.value.map((productSize) => ({
                productSizeId: productSize.id,
                quantity: 0
              }))

              requestProductStocks.value.forEach((productStock1) => {
                props.productToUpdate!.productStocks.forEach((productStock2) => {
                  if (productStock1.productSizeId === productStock2.productSizeId) {
                    productStock1.quantity = productStock2.quantity
                  }
                })
              })
            })
            .catch((error: any) => {
              alert(error.response!.data!.message)
            })
        })
        .catch((error: any) => {
          alert(error.response!.data!.message)
        })

      getAllBrands()
        .then((axiosResponse: AxiosResponse) => {
          brands.value = axiosResponse.data.brandResponses
          requestBrand.value = brands.value.find(
            (brand) => brand.id === props.productToUpdate!.brandId
          )!
        })
        .catch((error: any) => {
          alert(error.response!.data!.message)
        })
    }
  }
)

watch(requestCategory, (nv, ov) => {
  if (ov.id !== 0) {
    getProductSizesByCategory(requestCategory.value!.id!)
      .then((axiosResponse: AxiosResponse) => {
        productSizes.value = axiosResponse.data.productSizes
        requestProductStocks.value = productSizes.value.map((productSize) => ({
          productSizeId: productSize.id,
          quantity: 0
        }))
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
})
</script>

<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-name">상품 수정</div>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <div class="modal-main">
        <div class="modal-main-image">
          <img
            v-if="previewImageFile"
            :src="previewImageFile"
            @click="triggerInputFile"
            alt="productPreviewImg"
          />
          <input type="file" style="display: none" ref="inputImageFile" @change="onImageChange" />
          <button v-if="!previewImageFile" class="updateBtn" @click="triggerInputFile">추가</button>
        </div>
        <div class="modal-sub-images">
          <div
            v-for="index in props.productToUpdate!.describeImgUrls.length"
            :key="index"
            class="modal-sub-image"
          >
            <img
              v-if="previewDescribeFiles[index - 1]"
              :src="previewDescribeFiles[index - 1]"
              @click="triggerInputDescribeFile(index - 1)"
              alt="describeImages"
            />
            <input
              type="file"
              style="display: none"
              ref="inputDescribeFiles"
              @change="onDescribeImageChange($event, index - 1, previewDescribeFiles[index - 1])"
            />
            <button
              class="updateBtn"
              v-if="!previewDescribeFiles[index - 1]"
              @click="triggerInputDescribeFile(index - 1)"
            >
              추가
            </button>
          </div>
          <div
            v-for="index in 4 - props.productToUpdate!.describeImgUrls.length"
            :key="index"
            class="modal-sub-image"
          ></div>
        </div>
      </div>
      <div class="modal-sub-container">
        <div class="modal-sub">
          <div class="modal-sub-items">
            <label class="modal-label">상품 코드</label>
            <input class="modal-input" type="text" v-model="requestCode" />
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">상품명</label>
            <input class="modal-input" type="text" v-model="requestName" />
          </div>
          <div class="modal-sub-items">
            <label class="modal-label">상품 가격</label>
            <input class="modal-input" type="number" v-model.number="requestPrice" />
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
          </div>
          <div v-for="(productSize, index) in productSizes" :key="index" class="modal-sub-items">
            <div class="modal-select">
              {{ productSize.name }}
            </div>
            <input
              class="modal-input"
              type="number"
              v-model="requestProductStocks[index].quantity"
            />
          </div>
        </div>
      </div>
      <div class="modal-button">
        <button class="createBtn" @click="executeUpdate">상품 수정</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/css/product-modal.css");
</style>
