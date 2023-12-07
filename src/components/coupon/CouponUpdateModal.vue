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
            <input type="text" id="couponName" placeholder="적용대상, 할인 값 작성시 자동완성됩니다." v-model="props.coupon.name" required />
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
              <input type="text" id="productSearch" v-model="searchQuery" @input="searchProducts" placeholder="상품 검색" autocomplete="off" />
              <ul v-if="searchResults.length" class="search-results">
                <li v-for="result in searchResults" :key="result.id" @click="selectAppliesTo(result, 'PRODUCT')">
                  {{ result.name }} ({{ result.brandName }})
                </li>
              </ul>
            </div>
            <div v-else-if="targetType === 'CATEGORY'">
              <select id="categorySelect" v-model="selectedCategoryId" @change="updateCategorySelection">
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
  
          <!-- Discount Type and Value -->
          <div class="form-group">
            <label for="discountType">할인 타입</label>
            <select id="discountType" v-model="props.coupon.discountType" required>
              <option value="PERCENTAGE">정률 할인</option>
              <option value="FIXED_AMOUNT">정액 할인</option>
            </select>
          </div>
          <div class="form-group">
            <label for="discountValue">할인 값</label>
            <input type="number" id="discountValue" v-model="props.coupon.discountValue" min="0" required />
            <!-- <span v-if="coupon.discountType === 'PERCENTAGE'">%</span> -->
            <!-- <span v-else>원</span> -->
          </div>
  
          <!-- Start and End Dates -->
          <div class="form-group">
            <label for="startAt">이벤트 시작일시</label>
            <input type="datetime-local" id="startAt" v-model="props.coupon.startAt" required />
          </div>
          <div class="form-group">
            <label for="endAt">이벤트 종료일시</label>
            <input type="datetime-local" id="endAt" v-model="props.coupon.endAt" required />
          </div>
  
          <!-- Issued Quantity -->
          <div class="form-group">
            <label for="issuedQuantity">발행 개수</label>
            <input type="number" id="issuedQuantity" v-model="props.coupon.issuedQuantity" min="0" required />
            <!-- <span>개</span> -->
          </div>
  
          <!-- Optional Fields -->
          <div class="form-group">
            <label for="minPurchaseAmount">최소 구매금액</label>
            <input type="number" id="minPurchaseAmount" placeholder="0" v-model="props.coupon.minPurchaseAmount" min="0" />
            <!-- <span>원</span> -->
          </div>
          <div class="form-group">
            <label for="maxDiscountAmount">최대 할인금액</label>
            <input type="number" id="maxDiscountAmount" placeholder="필수값이 아닙니다." v-model="props.coupon.maxDiscountAmount" min="0" />
            <!-- <span>원</span> -->
          </div>
  
          <!-- Submit Button -->
          <button type="submit" class="center-align">쿠폰 수정하기</button>
          <button type="submit" class="center-align">취소하기</button>
        </form>
  
        <!-- Close Button -->
        <!-- <button class="modal-close-btn" @click="closeModal">&times; 닫기</button> -->
      </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, defineEmits, defineProps, PropType, watch } from "vue";
import { updateCouponInfo } from "@/apis/coupon/CouponClient";
import type { CouponUpdateRequest, CouponInfo } from "@/apis/coupon/CouponDto";
import axios from "axios"; // assuming you are using axios for HTTP requests

const emits = defineEmits(["close-create-modal"]);
const props = defineProps({
  showModal: Boolean,
  coupon: Object as PropType<CouponInfo> // Make sure to import PropType
});

const searchQuery = ref("");
const searchResults = ref([]);
const categories = ref([]);
const targetType = ref("PRODUCT"); // Default to product
const selectedCategoryId = ref(null);

const closeModal = () => {
  emits("close-create-modal");
};

const fetchCategories = async () => {
  try {
    const response = await axios.get("/admin/categories/leaf");
    categories.value = response.data.categoryResponses;
  } catch (error) {
    // Handle error fetching categories
    console.error("Failed to fetch categories", error);
  }
};



const searchProducts = async () => {
  try {
    if (searchQuery.value.trim() !== "") {
      const response = await axios.get(`/product/search`, {
        params: { lastId: 0, query: searchQuery.value },
      });
      searchResults.value = response.data.productResponses;
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    // Handle error searching products
    console.error("Failed to search products", error);
  }
};

const updateCoupon = async () => {
  if (targetType.value === "CATEGORY" && selectedCategoryId.value) {
    const selectedCategory = categories.value.find(c => c.id === selectedCategoryId.value);
    props.coupon.appliesToId = selectedCategory.id;
    props.coupon.appliesToName = selectedCategory.name;
    props.coupon.appliesToType = targetType.value;
  }

  try {
    const response = await updateCouponInfo(coupon.value);
    if (response.status === 200) {
      emits("coupon-modified");  // Emit an event to the parent component
      closeModal();
    }
    // Additional state updates
  } catch (error) {
    console.error("Failed to create coupon", error);
  }
};

const selectAppliesTo = (result, type) => {
  // Set the appliesTo properties in your props.coupon object based on the selection
  props.coupon.appliesToId = result.id;
  props.coupon.appliesToName = result.name;
  props.coupon.appliesToType = type;
  targetType.value = type;
  searchResults.value = [];
};

watch(() => props.coupon?.appliesToType, (newValue) => {
  targetType.value = newValue;
}, {
  immediate: true
});

watch(targetType, (newValue) => {
  if(newValue === 'CATEGORY' && selectedCategoryId.value) {
    const category = categories.value.find(c => c.id === selectedCategoryId.value);
    if(category) {
      props.coupon.appliesToName = category.name;
    }
  }
});

const updateCategorySelection = () => {
  const selectedCategory = categories.value.find(c => c.id === selectedCategoryId.value);
  if(selectedCategory) {
    props.coupon.appliesToId = selectedCategory.id;
    props.coupon.appliesToName = selectedCategory.name;
    // appliesToType은 이미 'CATEGORY'로 설정함.
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
@import url("@/assets/css/coupon-create-modal.css");
</style>