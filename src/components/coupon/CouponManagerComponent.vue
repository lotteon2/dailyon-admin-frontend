<script setup lang="ts">
import type { AxiosResponse } from "axios"
import { onBeforeMount, ref, watch } from "vue"
import ProductSizeCreateModal from "@/components/productsize/ProductSizeCreateModal.vue"
import ProductSizeUpdateModal from "@/components/productsize/ProductSizeUpdateModal.vue"
import PaginationComponent from "@/components/PaginationComponent.vue"
import { getCouponInfoPage } from "@/apis/coupon/CouponClient"
import type { CouponInfo, CouponCreateRequest, CouponInfoPageResponse } from "@/apis/coupon/CouponDto"
import { getDiscountTypeDisplayValue, formatDiscountValue } from "@/apis/coupon/CouponDto"

let size = ref<number>(10);
let page = ref<number>(0);
let list = ref([]);
let totalPages = ref<number>();
const isCreateModalVisible = ref(false)
const isUpdateModalVisible = ref(false)

const initData = async () => {
  try {
    const data = await getCouponInfoPage(size.value, page.value);
    list.value = data.values;
    totalPages.value = data.totalPages;
  } catch(err) {
    console.error(err);
  }
}
onBeforeMount(initData)
// watch(() => categoryId.value, setProductSizeByCategory)
// watch(categoryId, setProductSizeByCategory)

const closeUpdateModal = () => {
  isUpdateModalVisible.value = false
}

const closeCreateModal = () => {
  isCreateModalVisible.value = false
}

const formatName = (name: string) => {
  // Replace square brackets with <br/> tags
  return name.replace(/\[/g, '<br/>[');
};

const formatDate = (localDateTime: string) => {
  // Assuming localDateTime is in ISO string format, adjust as necessary
  return localDateTime.replace(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}).*$/, '$1년 $2월 $3일 $4:$5');
};

const optionalValue = (value: number | undefined) => {
  return value ?? '-';
};
</script>

<template>
  <div class="product-size-container">
    <ProductSizeCreateModal
      :show-modal="isCreateModalVisible"
      @close-create-modal="closeCreateModal"
    />
    <ProductSizeUpdateModal
      :show-modal="isUpdateModalVisible"
      @close-update-modal="closeUpdateModal"
    />
    
    
    <div class="head-block">
      <!-- <select class="category-select" v-model.lazy.number="categoryId">
        <option v-for="category in categoryStore.categories" :value="category.id">
          {{ category.name }}
        </option>
      </select> -->
      <button class="createBtn">쿠폰 등록</button>
    </div>
    
    
    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th>쿠폰 번호</th>
            <th>쿠폰 이름</th>
            <th>할인 타입/값</th>
            <th>이벤트 시작/종료일시</th>
            <th>잔여수량/총 발행개수</th>
            <th>적용 대상</th>
            <th>동시성 체크</th>
            <th>할인대상 이미지</th>
            <th>조건</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>[겨울 특별세일] <br/>나이키 에어포스1 20% 할인쿠폰</td>
                <td>PERCENTAGE/20</td>
                <td>2023년 12월 5일 00:00 <br/>~ 2023년 12월 30일 23:59</td>
                <td>1000/1000</td>
                <td>PRODUCT/1<br/>나이키 에어포스1</td>
                <td>false</td>
                <td><img src="https://contents.lotteon.com/itemimage/20231031160737/LE/12/09/70/22/15/_1/25/24/37/81/3/LE1209702215_1252437813_5.jpg/dims/resizef/554X554" alt="이미지 없음."></td>
                <td>최소 구매금액 5,000원 <br/> 최대 할인금액 30,000원</td>
                <td>
                    <button class="updateBtn">수정</button>
                    <button class="deleteBtn">삭제</button>
                </td>
            </tr>

            <tr>
                <td>2</td>
                <td>[겨울 특별세일] <br/>나이키 에어포스1 20% 할인쿠폰</td>
                <td>PERCENTAGE/20</td>
                <td>2023년 12월 5일 00:00 <br/>~ 2023년 12월 30일 23:59</td>
                <td>1000/1000</td>
                <td>CATEGORY/1<br/>나이키 에어포스1</td>
                <td>false</td>
                <td><img src="" alt="이미지 없음"></td>
                <td>최소 구매금액 5,000원<br/> 최대 할인금액 30,000원</td>
                <td>
                    <button class="updateBtn">수정</button>
                    <button class="deleteBtn">삭제</button>
                </td>
            </tr>
          <tr
            v-for="(adminCouponInfo, index) in list.values"
            :key="index"
          >
            <td>{{ adminCouponInfo.id }}</td>
            <td v-html="formatName(adminCouponInfo.name)"></td> <!-- br을 넣기 위해 v-html 사용 -->
            <td>{{ getDiscountTypeDisplayValue(adminCouponInfo.discountType) }}/{{ formatDiscountDisplay(adminCouponInfo.discountType, adminCouponInfo.discountValue) }}</td>
            <td>{{ formatDate(adminCouponInfo.startAt) }} <br/>~ {{ formatDate(adminCouponInfo.endAt) }}</td> <!-- LocalDateTime으로 들어오는값을 0000년 00월 00일 00:00 형식으로 -->
            <td>{{ adminCouponInfo.remainingQuantity }}/{{ adminCouponInfo.totalQuantity }}</td>
            <td>{{ adminCouponInfo.appliesToType }}/{{ adminCouponInfo.appliesToId }}<br/> {{ adminCouponInfo.appliesToName }}</td>
            <td>{{ adminCouponInfo.requiresConcurrencyControl }}</td>
            <td><img :src="adminCouponInfo.targetImgUrl || ''" alt="이미지 없음"></td>
            <td>{{ optionalValue(adminCouponInfo.minPurchaseAmount) }} <br/> {{ optionalValue(adminCouponInfo.maxDiscountAmount) }}</td> <!-- 둘 다 optional data. 없으면 "-"로 표기. -->
            <td>
              <button class="updateBtn">수정</button>
              <button class="deleteBtn">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationComponent />
  </div>
</template>

<style scoped>
@import url("@/assets/css/coupon-manage.css");
</style>
