<script setup lang="ts">
import BannerManageComponent from "@/components/BannerManageComponent.vue"
import BrandManageComponent from "@/components/brand/BrandManageComponent.vue"
import CategoryManageComponent from "@/components/category/CategoryManageComponent.vue"
import CouponManagerComponent from "@/components/coupon/CouponManagerComponent.vue"
import ProductManageComponent from "@/components/product/ProductManageComponent.vue"
import AuctionManageComponent from "@/components/auction/AuctionManageComponent.vue"
import ProductSizeManageComponent from "@/components/productsize/ProductSizeManageComponent.vue"
import SideBarComponent from "@/components/SideBarComponent.vue"
import HeaderComponent from "@/components/HeaderComponent.vue"
</script>

<template>
  <header>
    <HeaderComponent />
  </header>
  <div class="container">
    <SideBarComponent />
    <ProductManageComponent v-if="$route.name === 'manage-product'" />
    <BrandManageComponent v-if="$route.name === 'manage-brand'" />
    <BannerManageComponent v-if="$route.name === 'manage-banner'" />
    <CouponManagerComponent v-if="$route.name === 'manage-coupon'" />
    <AuctionManageComponent v-if="$route.name === 'manage-auction'" />
    <CategoryManageComponent v-if="$route.name === 'manage-category'" />
    <ProductSizeManageComponent v-if="$route.name === 'manage-product-size'" />
  </div>
</template>

<style scoped>
@import "@/assets/css/admin-layout.css";
</style>
