<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router';
import { authAxiosInstance } from '@/apis/utils';
import qs from 'qs';

const username = ref('');
const password = ref('');



const login = async () => {
  const data = {
  username: username.value,
  password: password.value
}

authAxiosInstance.post('auth-service/admin/login', qs.stringify(data), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
}).then(response => {
  const token = response.data.token;
  if (token) {
    localStorage.setItem('accessToken', token);
    router.push({ name: 'main' });
  } else {
    alert('로그인에 실패하였습니다. ID와 비밀번호를 확인해주세요!');
  }
}).catch(error => {
  console.error('Login failed:', error);
});


};
</script>

<template>
  <div class="login-container">
    <h1 class="logo">Daily<span class="red">O</span>n</h1>
    <form @submit.prevent="login" class="login-form">
      <label for="username">Username:</label>
      <input v-model="username" type="text" id="username" placeholder="Enter your username" required />

      <label for="password">Password:</label>
      <input v-model="password" type="password" id="password" placeholder="Enter your password" required />

      <button type="submit">Login</button>
    </form>
  </div>
</template>


<style scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(to bottom right, black, black, red);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  font-size: 3rem;
  color: white;
  margin-bottom: 30px;
}

.red {
  color: red;
}

.login-form {
  background-color: white; 
  width: 400px;
  padding: 40px; 
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); 
}

label {
  display: block;
  margin-bottom: 10px;
}

input {
  width:  calc(100% - 30px);
  padding: 12px;
  margin-bottom: 20px;
}

button {
  width: 100%;
  padding: 15px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
