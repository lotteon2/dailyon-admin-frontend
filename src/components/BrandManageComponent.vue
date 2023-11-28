<script setup lang="ts">
const exampleBrands = [
  { brandId: 1, name: "brand1" },
  { brandId: 2, name: "brand2" },
  { brandId: 3, name: "brand3" }
]
</script>

<template>
  <div class="container">
    <div class="button-block">
      <button>브랜드 등록</button>
    </div>
    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th>브랜드 id</th>
            <th>브랜드 이름</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in exampleBrands" :key="brand.brandId">
            <td>{{ brand.brandId }}</td>
            <td>{{ brand.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/css/brand-manage.css");
</style>
