<script setup lang="ts">
import { computed, type Ref, ref, watch } from "vue"
import { type Gender, genders } from "@/apis/utils/CommonDto"
import { type ReadBrandResponse } from "@/apis/brand/BrandDto"
import { type Category } from "@/apis/category/CategoryDto"
import { type ReadProductSizeResponse } from "@/apis/productsize/ProductSizeDto"
import { getLeafCategories } from "@/apis/category/CategoryClient"
import { getAllBrands } from "@/apis/brand/BrandClient"
import { getProductSizesByCategory } from "@/apis/productsize/ProductSizeClient"
import { type AxiosResponse } from "axios"
import type { CreateAuctionRequest, CreateAuctionResponse } from "@/apis/auction/AuctionDto"
import { createAuction } from "@/apis/auction/AuctionClient"
import { uploadImageToS3 } from "@/apis/s3/S3Client"

const props = defineProps({
  showModal: {
    type: Boolean
  }
})

const emits = defineEmits(["close-create-modal", "create-success"])

const isEnabled = ref<boolean>(true)

const startAt = ref<string>("")
const auctionName = ref<string>("")
const askingPrice = ref<number>(0)

const startBidPrice = computed(() => {
  return Math.floor(requestPrice.value * 0.05)
})

const maximumWinner = computed(() => {
  return requestProductQuantity.value
})

const brands = ref<Array<ReadBrandResponse>>(new Array<ReadBrandResponse>())
const leafCategories = ref<Array<Category>>(new Array<Category>())
const productSizes = ref<Array<ReadProductSizeResponse>>(new Array<ReadProductSizeResponse>())

const requestCode = ref<string>("")
const productName = ref<string>("")
const requestPrice = ref<number>(0)

const requestCategory = ref<Category>({ id: 0, name: "" })
const requestBrand = ref<ReadBrandResponse>({ id: 0, name: "" })
const requestGender = ref<Gender>({ name: "", value: "" })
const requestImage = ref<string>("")
const requestDescribeImages = ref<Array<String>>(new Array<String>())
const requestProductSizeId = ref<number>(0)
const requestProductQuantity = ref<number>(0)

const inputImageFile: Ref<HTMLInputElement | null> = ref(null)
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

const triggerInputFile = () => {
  if (inputImageFile.value) {
    inputImageFile.value.click()
  }
}

const inputDescribeFiles: Ref<Array<HTMLInputElement | null>> = ref([])
const describeFiles: Ref<Array<File>> = ref(new Array<File>())
const previewDescribeFiles: Ref<Array<string>> = ref(new Array<string>())
const onDescribeImageChange = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    if (describeFiles.value.some((file) => file.name === target.files![0].name)) {
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

const triggerInputDescribeFile = (index: number) => {
  console.log(index)
  if (inputDescribeFiles.value[index] !== null) {
    inputDescribeFiles.value[index]!.click()
  }
}

const closeModal = () => {
  isEnabled.value = true

  startAt.value = ""
  auctionName.value = ""
  askingPrice.value = 0
  maximumWinner.value = 0

  brands.value = []
  leafCategories.value = []
  productSizes.value = []

  requestCode.value = ""
  productName.value = ""
  requestPrice.value = 0

  requestCategory.value = { id: 0, name: "" }
  requestBrand.value = { id: 0, name: "" }
  requestGender.value = { name: "", value: "" }
  requestImage.value = ""
  requestDescribeImages.value = []
  requestProductSizeId.value = 0
  requestProductQuantity.value = 0

  inputImageFile.value = null
  imageFile.value = null
  previewImageFile.value = null

  emits("close-create-modal")
}

const createSuccess = () => {
  isEnabled.value = true

  startAt.value = ""
  auctionName.value = ""
  askingPrice.value = 0
  maximumWinner.value = 0

  brands.value = []
  leafCategories.value = []
  productSizes.value = []

  requestCode.value = ""
  productName.value = ""
  requestPrice.value = 0

  requestCategory.value = { id: 0, name: "" }
  requestBrand.value = { id: 0, name: "" }
  requestGender.value = { name: "", value: "" }
  requestImage.value = ""
  requestDescribeImages.value = []
  requestProductSizeId.value = 0
  requestProductQuantity.value = 0

  inputImageFile.value = null
  imageFile.value = null
  previewImageFile.value = null

  emits("create-success")
}

const executeCreate = () => {
  if (isEnabled.value === true) {
    isEnabled.value = false

    if (requestProductQuantity.value <= 0) {
      alert("개수를 입력해주세요")
      isEnabled.value = true
      return
    }

    if (requestProductQuantity.value < maximumWinner.value) {
      alert("수량은 최대 낙찰자 이상으로 입력해주세요")
      isEnabled.value = true
      return
    }

    if (auctionName.value === "") {
      alert("경매 이름을 입력해주세요")
      isEnabled.value = true
      return
    }

    if (startBidPrice.value <= 0) {
      alert("시작 가격을 입력해주세요")
      isEnabled.value = true
      return
    }

    if (startAt.value === "") {
      alert("시작 날짜를 입력해주세요")
      isEnabled.value = true
      return
    }

    if (maximumWinner.value <= 0) {
      alert("최대 낙찰자를 입력해주세요")
      isEnabled.value = true
      return
    }

    if (requestCode.value === "") {
      alert("상품 코드를 입력해주세요")
      isEnabled.value = true
      return
    }

    if (productName.value === "") {
      alert("상품명을 입력해주세요")
      isEnabled.value = true
      return
    }

    if (requestPrice.value <= 0) {
      alert("상품 가격은 0보다 커야 합니다")
      isEnabled.value = true
      return
    }

    if (requestProductQuantity.value <= 0) {
      alert("상품 수량은 0보다 커야 합니다")
      isEnabled.value = true
      return
    }

    if (requestBrand.value.id === 0) {
      alert("브랜드를 지정해주세요")
      isEnabled.value = true
      return
    }

    if (requestCategory.value.id === 0) {
      alert("카테고리를 지정해주세요")
      isEnabled.value = true
      return
    }

    if (requestGender.value.value === "") {
      alert("성별을 지정해주세요")
      isEnabled.value = true
      return
    }

    if (requestImage.value === "") {
      alert("상품 이미지를 추가해주세요")
      isEnabled.value = true
      return
    }

    const describeImages: Array<String> = requestDescribeImages.value.filter(
      (describeImage) => describeImage !== null
    )

    const auctionRequest: CreateAuctionRequest = {
      auctionName: auctionName.value,
      startBidPrice: startBidPrice.value,
      askingPrice: askingPrice.value,
      startAt: startAt.value,
      maximumWinner: maximumWinner.value,
      productRequest: {
        brandId: requestBrand.value.id,
        categoryId: requestCategory.value.id!,
        code: requestCode.value,
        describeImages: describeImages,
        image: requestImage.value,
        name: productName.value,
        price: requestPrice.value,
        gender: requestGender.value.value,
        type: "AUCTION",
        productStocks: [
          { productSizeId: requestProductSizeId.value, quantity: requestProductQuantity.value }
        ]
      }
    }

    createAuction(auctionRequest)
      .then((axiosResponse: AxiosResponse) => {
        const response: CreateAuctionResponse = axiosResponse.data

        uploadImageToS3(response.imgPresignedUrl, imageFile.value!).catch((error: any) => {
          alert("상품 이미지 업로드 오류")
        })

        for (let i = 0; i < describeImages.length; i++) {
          uploadImageToS3(
            response.describeImgPresignedUrl[`${describeImages[i]}`],
            describeFiles.value[i]
          ).catch((error: any) => {
            alert("상품 설명 이미지 업로드 오류")
          })
        }
      })
      .then(() => {
        alert("등록 성공")
        createSuccess()
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
      .finally(() => {
        isEnabled.value = true
      })
  }
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
        productSizes.value = axiosResponse.data.productSizes
        requestProductQuantity.value = 0
        requestProductSizeId.value = 0
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
        <div class="modal-name">경매 정보/경매 상품 등록</div>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <div class="modal-super-container">
        <div class="modal-container">
          <div class="modal-sub">
            <div class="modal-sub-items">
              <label class="modal-label">경매 이름</label>
              <input class="modal-input" type="text" v-model="auctionName" required />
            </div>
            <div class="modal-sub-items">
              <label class="modal-label">호가 단위</label>
              <input class="modal-input" type="number" v-model="askingPrice" required />
            </div>
            <div class="modal-sub-items">
              <label class="modal-label">경매 시작 시각</label>
              <input class="modal-input" type="datetime-local" v-model="startAt" required />
            </div>
            <div class="modal-sub-items">
              <label class="modal-label">입찰 시작가</label>
              <input class="modal-input" type="number" v-model="startBidPrice" required readonly />
            </div>
            <div class="modal-sub-items">
              <label class="modal-label">최대 낙찰자</label>
              <input class="modal-input" type="number" v-model="maximumWinner" required readonly />
            </div>
          </div>
          <div class="modal-button">
            <button class="createBtn" @click="executeCreate">경매 등록</button>
          </div>
        </div>
        <div class="divide-line" />
        <div class="modal-container">
          <div class="modal-main">
            <div class="modal-main-image">
              <img
                v-if="previewImageFile"
                :src="previewImageFile"
                @click="triggerInputFile"
                alt="productPreviewImg"
              />
              <input
                type="file"
                style="display: none"
                ref="inputImageFile"
                @change="onImageChange"
              />
              <button v-if="!previewImageFile" class="updateBtn" @click="triggerInputFile">
                추가
              </button>
            </div>
            <div class="modal-sub-images">
              <div v-for="index in 4" :key="index" class="modal-sub-image">
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
                  @change="onDescribeImageChange($event, index - 1)"
                />
                <button
                  class="updateBtn"
                  v-if="!previewDescribeFiles[index - 1]"
                  @click="triggerInputDescribeFile(index - 1)"
                >
                  추가
                </button>
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
                <input class="modal-input" type="text" v-model="productName" />
              </div>
              <div class="modal-sub-items">
                <label class="modal-label">상품 가격</label>
                <input class="modal-input" type="number" v-model="requestPrice" />
              </div>
              <div class="modal-sub-items">
                <label class="modal-label">카테고리</label>
                <select class="modal-select" v-model.lazy="requestCategory">
                  <option
                    v-for="(category, index) in leafCategories"
                    :key="index"
                    :value="category"
                  >
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
              <div class="modal-sub-items">
                <select class="modal-select" v-model.number.lazy="requestProductSizeId">
                  <option
                    v-for="(productSize, idx) in productSizes"
                    :key="idx"
                    :value="productSize.id"
                  >
                    {{ productSize.name }}
                  </option>
                </select>
                <input
                  class="modal-input"
                  type="number"
                  v-model.number.lazy="requestProductQuantity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/css/auction-create-modal.css");
</style>
