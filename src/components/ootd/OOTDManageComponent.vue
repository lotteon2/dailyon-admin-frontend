<script setup lang="ts">
import {onBeforeMount, ref, watch} from "vue"
import PaginationComponent from "@/components/PaginationComponent.vue";
import type {PostAdminResponse} from "@/apis/ootd/PostDto";
import {getPosts, searchPosts, softBulkDeletePosts} from "@/apis/ootd/PostClient";

const VITE_STATIC_IMG_URL = ref<string>(import.meta.env.VITE_STATIC_IMG_URL)

const requestPage = ref<number>(0)
const totalPages = ref<number>(0)
const totalElements = ref<number>(0)

const allChecked = ref<boolean>(false)
const checkedPosts = ref<Array<number>>(new Array<number>())
const posts = ref<Array<PostAdminResponse>>(new Array<PostAdminResponse>())

const initData = async () => {
  const postPageAdminResponse = await getPosts(0, 5, 'id,asc')
  posts.value = postPageAdminResponse.posts
  totalPages.value = postPageAdminResponse.totalPages
  totalElements.value = postPageAdminResponse.totalElements
}

onBeforeMount(async () => {
  await initData()
})

const onChangePage = async (page: number) => {
  if (0 <= page && page < totalPages.value) {
    requestPage.value = page
  }
}

watch(requestPage, async (afterPage, beforePage) => {
  if (afterPage < totalPages.value!) {
    if(previousSearchQuery.value === '' && searchQuery.value === '') {
      const postPageAdminResponse = await getPosts(afterPage, 5, 'id,asc')
      posts.value = postPageAdminResponse.posts
      totalPages.value = postPageAdminResponse.totalPages
      totalElements.value = postPageAdminResponse.totalElements
    } else {
      const postPageAdminResponse = await searchPosts(previousSearchQuery.value, afterPage, 5, 'id,asc');
      posts.value = postPageAdminResponse.posts
      totalPages.value = postPageAdminResponse.totalPages
      totalElements.value = postPageAdminResponse.totalElements
    }
  }
})

const toggleAll = () => {
  if (allChecked.value) {
    checkedPosts.value = []
  } else {
    checkedPosts.value = posts.value.map((product) => product.id)
  }
  allChecked.value = !allChecked.value
}

const deleteChecked = () => {
  if (checkedPosts.value.length == 0) {
    alert("삭제할 게시글을 선택해주세요")
    return
  }
  if (confirm("삭제하시겠습니까?")) {
    softBulkDeletePosts(checkedPosts.value)
        .then(() => {
          checkedPosts.value = []
          alert("삭제 성공")
          initData()
        })
        .then(initData)
        .catch((error: any) => {
          alert(error.response!.data!.message)
        })
  }
}

const deleteAll = () => {
  if (confirm("삭제하시겠습니까?")) {
    softBulkDeletePosts(posts.value.map((post) => post.id))
        .then(() => {
          checkedPosts.value = []
          alert("삭제 성공")
          initData()
        })
        .then(initData)
        .catch((error: any) => {
          alert(error.response!.data!.message)
        })
  }
}

const isCurrentlySearched = ref<boolean>(false)
const previousSearchQuery = ref<string>('')
const searchQuery = ref<string>('')
const onSearchPosts = async () => {
  if(searchQuery.value === '' && !isCurrentlySearched.value) {
    alert('검색할 게시글을 입력해주세요.')
    return
  }

  if (searchQuery.value !== '' && !isCurrentlySearched.value) {
    isCurrentlySearched.value = true
    previousSearchQuery.value = searchQuery.value

    posts.value = new Array<PostAdminResponse>()

    const postPageAdminResponse = await searchPosts(searchQuery.value, 0, 5, 'id,asc');
    posts.value = postPageAdminResponse.posts
    totalPages.value = postPageAdminResponse.totalPages
    totalElements.value = postPageAdminResponse.totalElements

    searchQuery.value = ''

    if(posts.value.length === 0) {
      alert('검색 결과가 없습니다.')
    }
  }

  isCurrentlySearched.value = false
}
</script>

<template>
  <div class="product-container">
    <div class="head-block">
      <div class="search-wrapper">
        <input
            class="search-input"
            type="text"
            id="productSearch"
            placeholder="게시글 검색"
            autocomplete="off"
            v-model="searchQuery"
            @keyup.enter="onSearchPosts"
        />
      </div>
      <div class="button-block">
        <button class="deleteBtn" @click="toggleAll">
          {{ allChecked ? "전체 해제" : "전체 선택" }}
        </button>
        <button class="deleteBtn" @click="deleteChecked">선택 삭제</button>
        <button class="deleteBtn" @click="deleteAll">전체 삭제</button>
      </div>
    </div>
    <div class="table-block">
      <table>
        <thead>
        <tr>
          <th></th>
          <th>게시글 id</th>
          <th>썸네일 이미지</th>
          <th>해시태그</th>
          <th>제목</th>
          <th>내용</th>
          <th>작성자 닉네임</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(post, index) in posts" :key="index">
          <td>
            <input
                type="checkbox"
                :id="`checkbox-${index}`"
                :value="post.id"
                v-model="checkedPosts"
            />
          </td>
          <td>{{ post.id }}</td>
          <td>
            <img
                class="product-thumbnail"
                :src="`${VITE_STATIC_IMG_URL}${post.thumbnailImgUrl}`"
                alt="product-img"
            />
          </td>
          <td class="product-stocks">
            <div v-for="(hashTagName, index) in post.hashTagNames"
                 :key="index">
              {{ hashTagName }}
            </div>
          </td>
          <td>{{ post.title }}</td>
          <td>{{ post.description }}</td>
          <td>{{ post.memberNickname }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <PaginationComponent
        :on-change-page="onChangePage"
        :request-page="requestPage"
        :total-pages="totalPages"
    />
  </div>
</template>

<style scoped>
@import url("@/assets/css/ootd-manage.css");
</style>
