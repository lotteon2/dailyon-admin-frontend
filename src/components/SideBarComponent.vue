<script setup lang="ts"></script>

<template>
  <div class="sidebar">
    <div class="sidebar-elements">
      <RouterLink to="/dashboard" class="sidebar-element">
        <img src="@/assets/images/Dashboard_White.png" alt="dashboard" />대시보드
      </RouterLink>
      <RouterLink to="/manage-product" class="sidebar-element">
        <img src="@/assets/images/Product_White.png" alt="product" />상품 관리
      </RouterLink>
      <RouterLink to="/manage-banner" class="sidebar-element">
        <img src="@/assets/images/Banner_White.png" alt="banner" />배너 관리
      </RouterLink>
      <RouterLink to="/manage-coupon" class="sidebar-element">
        <img src="@/assets/images/Coupon_White.png" alt="coupon" />쿠폰 관리
      </RouterLink>
      <RouterLink to="/manage-raffle" class="sidebar-element">
        <img src="@/assets/images/Raffle_White.png" alt="raffle" />응모 관리
      </RouterLink>
      <RouterLink to="/manage-brand" class="sidebar-element">
        <img src="@/assets/images/Category_White.png" alt="brand" />브랜드 관리
      </RouterLink>
      <RouterLink to="/manage-category" class="sidebar-element">
        <img src="@/assets/images/Category_White.png" alt="category" />카테고리 관리
      </RouterLink>
      <RouterLink to="/manage-product-size" class="sidebar-element">
        <img src="@/assets/images/Category_White.png" alt="product-size" />치수 관리
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/side-bar.css";
</style>
