<script setup lang="ts">
import BannerManageComponent from "@/components/BannerManageComponent.vue"
import BrandManageComponent from "@/components/brand/BrandManageComponent.vue"
import CategoryManageComponent from "@/components/category/CategoryManageComponent.vue"
import CouponManagerComponent from "@/components/coupon/CouponManagerComponent.vue"
import DashBoardComponent from "@/components/DashBoardComponent.vue"
import ProductManageComponent from "@/components/product/ProductManageComponent.vue"
import RaffleManageComponent from "@/components/RaffleManageComponent.vue"
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
    <DashBoardComponent v-if="$route.name === 'dashboard' || $route.name === 'main'" />
    <ProductManageComponent v-if="$route.name === 'manage-product'" />
    <BrandManageComponent v-if="$route.name === 'manage-brand'" />
    <BannerManageComponent v-if="$route.name === 'manage-banner'" />
    <CouponManagerComponent v-if="$route.name === 'manage-coupon'" />
    <RaffleManageComponent v-if="$route.name === 'manage-raffle'" />
    <CategoryManageComponent v-if="$route.name === 'manage-category'" />
    <ProductSizeManageComponent v-if="$route.name === 'manage-product-size'" />
  </div>
</template>

<style scoped>
@import "@/assets/css/admin-layout.css";
</style>