<script setup lang="ts">
import { ref } from "vue"
import router from "@/router"
import { defaultAxiosInstance } from "@/apis/utils"
import qs from "qs"

const username = ref("")
const password = ref("")

const login = async () => {
  const data = {
    username: username.value,
    password: password.value
  }

  defaultAxiosInstance
    .post("auth-service/admin/login", qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then((response) => {
      const token = response.data.token
      if (token) {
        sessionStorage.setItem("accessToken", token)
        router.push({ name: "manage-product" })
      } else {
        alert("로그인에 실패하였습니다. ID와 비밀번호를 확인해주세요!")
      }
    })
    .catch((error) => {
      console.error("Login failed:", error)
    })
}
</script>

<template>
  <div class="login-container">
    <h1 class="logo-text">Daily<span class="logo-text-highlight">O</span>n</h1>
    <form @submit.prevent="login" class="login-form">
      <label for="username">Username:</label>
      <input
        v-model="username"
        type="text"
        id="username"
        placeholder="Enter your username"
        required
      />

      <label for="password">Password:</label>
      <input
        v-model="password"
        type="password"
        id="password"
        placeholder="Enter your password"
        required
      />

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped>
@import "@/assets/css/login-view";
</style>