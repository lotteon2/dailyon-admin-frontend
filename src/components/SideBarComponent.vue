<script setup lang="ts"></script>

<template>
  <div class="sidebar">
    <div class="sidebar-elements">
      <div class="sidebar-element">
        <RouterLink to="/manage-product" class="sidebar-content">
          <img src="@/assets/images/Product_White.png" alt="product" />
          <p>상품 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink to="/manage-banner" class="sidebar-content">
          <img src="@/assets/images/Banner_White.png" alt="banner" />
          <p>배너 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink to="/manage-coupon" class="sidebar-content">
          <img src="@/assets/images/Coupon_White.png" alt="coupon" />
          <p>쿠폰 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink to="/manage-auction" class="sidebar-content">
          <img src="@/assets/images/Raffle_White.png" alt="auction" />
          <p>경매 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink to="/manage-brand" class="sidebar-content">
          <img src="@/assets/images/Category_White.png" alt="brand" />
          <p>브랜드 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink to="/manage-category" class="sidebar-content">
          <img src="@/assets/images/Category_White.png" alt="category" />
          <p>카테고리 관리</p>
        </RouterLink>
      </div>
      <div class="sidebar-element">
        <RouterLink to="/manage-product-size" class="sidebar-content">
          <img src="@/assets/images/Category_White.png" alt="product-size" />
          <p>치수 관리</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/side-bar.css";
</style>
