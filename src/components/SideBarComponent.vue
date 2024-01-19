<script setup lang="ts">
import { router } from "@/router"
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-elements">
      <div class="sidebar-element">
        <RouterLink
          to="/manage-product"
          class="sidebar-content"
          :class="{ selected: $route.path === '/manage-product' }"
        >
          <img src="@/assets/images/Product_White.png" alt="product" />
          <p>상품 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink
          to="/manage-order"
          class="sidebar-content"
          :class="{ selected: $route.path === '/manage-order' }"
        >
          <img src="@/assets/images/Dashboard_White.png" alt="order" />
          <p>주문 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink
          to="/manage-delivery"
          class="sidebar-content"
          :class="{ selected: $route.path === '/manage-delivery' }"
        >
          <img src="@/assets/images/Product_White.png" alt="coupon" />
          <p>배송 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink
          to="/manage-coupon"
          class="sidebar-content"
          :class="{ selected: $route.path === '/manage-coupon' }"
        >
          <img src="@/assets/images/Coupon_White.png" alt="coupon" />
          <p>쿠폰 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink
          to="/manage-auction"
          class="sidebar-content"
          :class="{ selected: $route.path === '/manage-auction' }"
        >
          <img src="@/assets/images/Raffle_White.png" alt="auction" />
          <p>경매 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink
          to="/manage-brand"
          class="sidebar-content"
          :class="{ selected: $route.path === '/manage-brand' }"
        >
          <img src="@/assets/images/Category_White.png" alt="brand" />
          <p>브랜드 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink
          to="/manage-category"
          class="sidebar-content"
          :class="{ selected: $route.path === '/manage-category' }"
        >
          <img src="@/assets/images/Category_White.png" alt="category" />
          <p>카테고리 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink
          to="/manage-product-size"
          class="sidebar-content"
          :class="{ selected: $route.path === '/manage-product-size' }"
        >
          <img src="@/assets/images/Category_White.png" alt="product-size" />
          <p>치수 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink
          to="/manage-ootd"
          class="sidebar-content"
          :class="{ selected: $route.path === '/manage-ootd' }"
        >
          <img src="@/assets/images/OOTD_White.png" alt="ootd" />
          <p>OOTD 관리</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/side-bar.css";
</style>
