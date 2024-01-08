<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">쿠폰 생성</h2>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <form @submit.prevent="createCoupon">
        <!-- Coupon Name -->
        <div class="form-group">
          <label for="couponName">쿠폰 이름</label>
          <input
            type="text"
            id="couponName"
            placeholder="적용대상, 할인 값 작성시 자동완성됩니다."
            v-model="couponCreateRequest.name"
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
              @input="performSearchProducts"
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
          <select id="discountType" v-model="couponCreateRequest.discountType" required>
            <option value="PERCENTAGE">정률 할인</option>
            <option value="FIXED_AMOUNT">정액 할인</option>
          </select>
        </div>
        <div class="form-group">
          <label for="discountValue">할인 값</label>
          <input
            type="number"
            id="discountValue"
            v-model="couponCreateRequest.discountValue"
            min="0"
            required
          />
          <!-- <span v-if="coupon.discountType === 'PERCENTAGE'">%</span> -->
          <!-- <span v-else>원</span> -->
        </div>

        <!-- Start and End Dates -->
        <div class="form-group">
          <label for="startAt">이벤트 시작일시</label>
          <input
            type="datetime-local"
            id="startAt"
            v-model="couponCreateRequest.startAt"
            required
          />
        </div>
        <div class="form-group">
          <label for="endAt">이벤트 종료일시</label>
          <input type="datetime-local" id="endAt" v-model="couponCreateRequest.endAt" required />
        </div>

        <!-- Issued Quantity -->
        <div class="form-group">
          <label for="issuedQuantity">발행 개수</label>
          <input
            type="number"
            id="issuedQuantity"
            v-model="couponCreateRequest.issuedQuantity"
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
            v-model="couponCreateRequest.requiresConcurrencyControl"
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
            v-model="couponCreateRequest.minPurchaseAmount"
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
            v-model="couponCreateRequest.maxDiscountAmount"
            min="0"
          />
          <!-- <span>원</span> -->
        </div>

        <!-- Submit Button -->
        <button type="submit" class="center-align">쿠폰 생성하기</button>
      </form>

      <!-- Close Button -->
      <!-- <button class="modal-close-btn" @click="closeModal">&times; 닫기</button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits, defineProps, computed, watch } from "vue"
import { createCouponInfo, searchProducts, fetchCategories } from "@/apis/coupon/CouponClient"
import type {
  CouponCreateRequest,
  ReadProductResponse,
  ReadChildrenCategoryResponse
} from "@/apis/coupon/CouponDto"
import axios from "axios" // assuming you are using axios for HTTP requests

const emits = defineEmits(["close-create-modal", "created-coupon"])
const props = defineProps({
  showModal: Boolean
})

const couponCreateRequest = ref<CouponCreateRequest>({
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

const searchQuery = ref("")
const searchResults = ref<ReadProductResponse[]>([])
const categories = ref<ReadChildrenCategoryResponse[]>([])
const targetType = ref("PRODUCT") // Default to product
const selectedCategoryId = ref(null)

const closeModal = () => {
  emits("close-create-modal")
}

const loadCategories = async () => {
  try {
    const categoryData = await fetchCategories()
    categories.value = categoryData
  } catch (error) {
    console.error("Failed to loadCategories", error)
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

const createCoupon = async () => {
  try {
    const response = await createCouponInfo(couponCreateRequest.value)
    if (response.status === 201) {
      // Ensure you have got the 201 status indicating a successful creation
      alert("쿠폰이 등록되었습니다.")
      emits("created-coupon")
      closeModal()
    }
    // Additional state updates
  } catch (error) {
    alert("쿠폰 등록요청 중 에러 발생.")
    console.error("Failed to create coupon", error)
  }
}

const selectProduct = (result: ReadProductResponse) => {
  couponCreateRequest.value.appliesToType = "PRODUCT"
  couponCreateRequest.value.appliesToId = result.id
  couponCreateRequest.value.appliesToName = result.name
  couponCreateRequest.value.targetImgUrl = result.imgUrl
  searchResults.value = []
  couponCreateRequest.value.name = couponName.value
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
  couponCreateRequest.value.appliesToType = "CATEGORY"
  couponCreateRequest.value.appliesToId = category.id
  couponCreateRequest.value.appliesToName = category.name
  couponCreateRequest.value.targetImgUrl = "" // Categories do not have images
  couponCreateRequest.value.name = couponName.value
}

const couponName = computed(() => {
  let nameParts: string[] = []

  if (couponCreateRequest.value.requiresConcurrencyControl) {
    nameParts.push("[특가 할인]")
  }

  if (couponCreateRequest.value.appliesToName) {
    nameParts.push(
      couponCreateRequest.value.appliesToType === "CATEGORY"
        ? `${couponCreateRequest.value.appliesToName} 카테고리`
        : couponCreateRequest.value.appliesToName
    )
  }

  if (couponCreateRequest.value.discountType === "PERCENTAGE") {
    nameParts.push(`${couponCreateRequest.value.discountValue}% 할인`)
  } else if (couponCreateRequest.value.discountType === "FIXED_AMOUNT") {
    nameParts.push(
      `${new Intl.NumberFormat().format(couponCreateRequest.value.discountValue)}원 할인`
    )
  }

  if (nameParts.length > 0) {
    nameParts.push("쿠폰")
  }

  return nameParts.join(" ")
})

watch(couponName, (newName) => {
  couponCreateRequest.value.name = newName
})

onMounted(loadCategories)
</script>

<style scoped>
@import url("@/assets/css/coupon-create-modal.css");
</style>
