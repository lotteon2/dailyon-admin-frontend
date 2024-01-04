import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("@/views/LoginView.vue")
    },
    {
      path: "/main",
      name: "main",
      component: () => import("@/views/AdminLayoutView.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "/manage-brand",
          name: "manage-brand",
          component: () => import("@/components/brand/BrandManageComponent.vue")
        },
        {
          path: "/manage-category",
          name: "manage-category",
          component: () => import("@/components/category/CategoryManageComponent.vue")
        },
        {
          path: "/manage-coupon",
          name: "manage-coupon",
          component: () => import("@/components/coupon/CouponManagerComponent.vue")
        },
        {
          path: "/manage-banner",
          name: "manage-banner",
          component: () => import("@/components/BannerManageComponent.vue")
        },
        {
          path: "/manage-product",
          name: "manage-product",
          component: () => import("@/components/product/ProductManageComponent.vue")
        },
        {
          path: "/manage-product-size",
          name: "manage-product-size",
          component: () => import("@/components/productsize/ProductSizeManageComponent.vue")
        },
        {
          path: "/manage-auction",
          name: "manage-auction",
          component: () => import("@/components/auction/AuctionManageComponent.vue")
        }
      ]
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue")
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    alert("로그인이 필요한 페이지입니다.")
    next("/")
  } else if (to.name === "login" && isLoggedIn()) {
    next("/main")
  } else if (to.name === "not-found") {
    alert("페이지를 찾을 수 없습니다.")
    next("/main")
  } else {
    next()
  }
})

const isLoggedIn = () => {
  const token = sessionStorage.getItem("accessToken")
  return !!token
}

export default router
