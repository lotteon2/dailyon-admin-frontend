<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">쿠폰정보 수정</h2>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <form @submit.prevent="updateCoupon">
        <!-- Coupon Name -->
        <div class="form-group">
          <label for="couponName">쿠폰 이름</label>
          <input
            type="text"
            id="couponName"
            placeholder="적용대상, 할인 값 작성시 자동완성됩니다."
            v-model="couponUpdateData.name"
            required
          />
        </div>

        <!-- Applies To (Select Product or Category Leaf Node) -->
        <div class="form-group">
          <label for="appliesTo">적용 대상</label>
          <div class="radio-group">
            <input type="radio" id="targetTypeProduct" value="PRODUCT" v-model="targetType" />
            <label for="targetTypeProduct">상품</label>
            <input type="radio" id="targetTypeCategory" value="CATEGORY" v-model="targetType" />
            <label for="targetTypeCategory">카테고리</label>
          </div>
          <div v-if="targetType === 'PRODUCT'">
            <input
              type="text"
              id="productSearch"
              v-model="searchQuery"
              @keypress.enter.prevent
              @keyup.enter="performSearchProducts"
              placeholder="상품 검색"
              autocomplete="off"
            />
            <ul v-if="searchResults.length" class="search-results">
              <li v-for="result in searchResults" :key="result.id" @click="selectProduct(result)">
                {{ result.name }}
              </li>
            </ul>
          </div>
          <div v-else-if="targetType === 'CATEGORY'">
            <select id="categorySelect" @change="handleCategoryChange($event)">
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Discount Type and Value -->
        <div class="form-group">
          <label for="discountType">할인 타입</label>
          <select id="discountType" v-model="couponUpdateData.discountType" required>
            <option value="PERCENTAGE">정률 할인</option>
            <option value="FIXED_AMOUNT">정액 할인</option>
          </select>
        </div>
        <div class="form-group">
          <label for="discountValue">할인 값</label>
          <input
            type="number"
            id="discountValue"
            v-model="couponUpdateData.discountValue"
            min="0"
            required
          />
          <!-- <span v-if="coupon.discountType === 'PERCENTAGE'">%</span> -->
          <!-- <span v-else>원</span> -->
        </div>

        <!-- Start and End Dates -->
        <div class="form-group">
          <label for="startAt">이벤트 시작일시</label>
          <input type="datetime-local" id="startAt" v-model="couponUpdateData.startAt" required />
        </div>
        <div class="form-group">
          <label for="endAt">이벤트 종료일시</label>
          <input type="datetime-local" id="endAt" v-model="couponUpdateData.endAt" required />
        </div>

        <!-- Issued Quantity -->
        <div class="form-group">
          <label for="issuedQuantity">발행 개수</label>
          <input
            type="number"
            id="issuedQuantity"
            v-model="couponUpdateData.issuedQuantity"
            min="0"
            required
          />
          <!-- <span>개</span> -->
        </div>

        <!-- requiresConcurrencyControl -->
        <div class="form-group">
          <label for="requiresConcurrencyControl">특가 여부</label>

          <select
            id="requiresConcurrencyControl"
            :value="couponUpdateData.requiresConcurrencyControl.toString()"
            @change="handleRequiresConcurrencyControlChange($event)"
            required
          >
            <option value="false">아니오</option>
            <option value="true">예</option>
          </select>
          <!-- <span>개</span> -->
        </div>

        <!-- Optional Fields -->
        <div class="form-group">
          <label for="minPurchaseAmount">최소 구매금액</label>
          <input
            type="number"
            id="minPurchaseAmount"
            placeholder="0"
            v-model="couponUpdateData.minPurchaseAmount"
            min="0"
          />
          <!-- <span>원</span> -->
        </div>
        <div class="form-group">
          <label for="maxDiscountAmount">최대 할인금액</label>
          <input
            type="number"
            id="maxDiscountAmount"
            placeholder="필수값이 아닙니다."
            v-model="couponUpdateData.maxDiscountAmount"
            min="0"
          />
          <!-- <span>원</span> -->
        </div>

        <!-- Submit Button -->
        <div class="flex-row">
          <button type="submit" class="center-align">쿠폰 수정하기</button>
          <button @click="closeModal" class="center-align">취소하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits, defineProps, computed, watch } from "vue"
import type { PropType } from "vue"
import { updateCouponInfo, searchProducts, fetchCategories } from "@/apis/coupon/CouponClient"
import type {
  CouponUpdateRequest,
  couponInfoReadItemResponse,
  ReadProductResponse,
  ReadChildrenCategoryResponse,
  ReadOOTDSearchResponse
} from "@/apis/coupon/CouponDto"
import { convertToCouponUpdateRequest } from "@/apis/coupon/CouponDto"

import axios from "axios" // assuming you are using axios for HTTP requests
// import { emit } from "process"

type PossiblyNull<T> = T | null

const emits = defineEmits(["close-update-modal", "updated-coupon"])
const props = defineProps({
  showModal: Boolean,
  couponInfoId: Number,
  coupon: Object as PropType<PossiblyNull<couponInfoReadItemResponse>>
})

const searchQuery = ref("")
const searchResults = ref<ReadOOTDSearchResponse[]>([])
const categories = ref<ReadChildrenCategoryResponse[]>([])
const targetType = ref("PRODUCT") // Default to product
const selectedCategoryId = ref(null)

const couponUpdateData = ref<CouponUpdateRequest>({
  name: "",
  discountType: "PERCENTAGE",
  discountValue: 0,

  startAt: "",
  endAt: "",

  issuedQuantity: 0,

  appliesToType: "",
  appliesToId: 0,
  appliesToName: "",

  requiresConcurrencyControl: false,
  targetImgUrl: "",

  minPurchaseAmount: 0,
  maxDiscountAmount: undefined
})

const formatDateForInput = (dateTime: string) => {
  if (!dateTime) return ""
  const formattedDateTime = dateTime.split(":")[0] + ":" + dateTime.split(":")[1].substring(0, 2)
  return formattedDateTime
}

const closeModal = () => {
  searchQuery.value = ""
  searchResults.value = []
  emits("close-update-modal")
}

const getFetchCategories = async () => {
  try {
    categories.value = await fetchCategories()
  } catch (error) {
    // Handle error fetching categories
    console.error("Failed to fetch categories", error)
  }
}

const performSearchProducts = async () => {
  try {
    const productData = await searchProducts(searchQuery.value)
    searchResults.value = productData
  } catch (error) {
    console.error("Failed to performSearchProducts", error)
  }
}

const updateCoupon = async () => {
  if (props.couponInfoId === undefined) {
    // Handle the undefined case (show an error message, etc.)
    return
  }

  try {
    const response = await updateCouponInfo(props.couponInfoId, couponUpdateData.value)
    if (response.status === 200) {
      // emits("coupon-modified");  // Emit an event to the parent component
      alert("쿠폰이 수정되었습니다.")
      emits("updated-coupon")
      closeModal()
    }
    // Additional state updates
  } catch (error) {
    alert("쿠폰 수정요청 중 에러 발생.")
    console.error("Failed to create coupon", error)
  }
}

const handleRequiresConcurrencyControlChange = (event: Event) => {
  const selectElement = event.target as HTMLSelectElement
  couponUpdateData.value.requiresConcurrencyControl = selectElement.value === "true"
}

const selectProduct = (result: ReadProductResponse) => {
  couponUpdateData.value.appliesToType = "PRODUCT"
  couponUpdateData.value.appliesToId = result.id
  couponUpdateData.value.appliesToName = result.name
  couponUpdateData.value.targetImgUrl = result.imgUrl
  searchQuery.value = ""
  searchResults.value = []
}

const handleCategoryChange = (event: Event) => {
  const selectElement = event.target as HTMLSelectElement
  const selectedIndex = selectElement.selectedIndex
  const selectedOption = selectElement.options[selectedIndex]
  const selectedCategoryId = selectedOption.value

  const selectedCategory = categories.value.find(
    (category) => `${category.id}` === selectedCategoryId
  )

  if (selectedCategory) {
    selectCategory(selectedCategory)
  }
}

const selectCategory = (category: ReadChildrenCategoryResponse) => {
  couponUpdateData.value.appliesToType = "CATEGORY"
  couponUpdateData.value.appliesToId = category.id
  couponUpdateData.value.appliesToName = category.name
  couponUpdateData.value.targetImgUrl = "" // Categories do not have images
}

const couponName = computed(() => {
  let nameParts: string[] = []

  if (couponUpdateData.value.requiresConcurrencyControl) {
    nameParts.push("[특가 할인]")
  }

  if (couponUpdateData.value.appliesToName) {
    nameParts.push(
      couponUpdateData.value.appliesToType === "CATEGORY"
        ? `${couponUpdateData.value.appliesToName} 카테고리`
        : couponUpdateData.value.appliesToName
    )
  }

  if (couponUpdateData.value.discountType === "PERCENTAGE") {
    nameParts.push(`${couponUpdateData.value.discountValue}% 할인`)
  } else if (couponUpdateData.value.discountType === "FIXED_AMOUNT") {
    nameParts.push(`${new Intl.NumberFormat().format(couponUpdateData.value.discountValue)}원 할인`)
  }

  if (nameParts.length > 0) {
    nameParts.push("쿠폰")
  }

  return nameParts.join(" ")
})

onMounted(() => {
  if (props.coupon) {
    // local data를 converted coupon로 update
    Object.assign(couponUpdateData.value, convertToCouponUpdateRequest(props.coupon))
  }
})

onMounted(getFetchCategories)

watch(
  () => props.coupon,
  (newCoupon) => {
    if (newCoupon) {
      const convertedCouponUpdateData = convertToCouponUpdateRequest(newCoupon)
      Object.assign(couponUpdateData.value, convertedCouponUpdateData)
    }
  },
  { deep: true }
)

// `couponUpdateData.startAt` 및 `couponUpdateData.endAt` 값을 감시하고 초 단위를 제거.
watch(
  () => couponUpdateData.value.startAt,
  (newStartAt) => {
    if (newStartAt) {
      couponUpdateData.value.startAt = formatDateForInput(newStartAt)
    }
  },
  { immediate: true }
)

watch(
  () => couponUpdateData.value.endAt,
  (newEndAt) => {
    if (newEndAt) {
      couponUpdateData.value.endAt = formatDateForInput(newEndAt)
    }
  },
  { immediate: true }
)

watch(couponName, (newName) => {
  couponUpdateData.value.name = newName
})
</script>

<style scoped>
@import url("@/assets/css/coupon-create-modal.css");
/* coupon-create-modal과 같은 스타일을 사용.  */
</style>
