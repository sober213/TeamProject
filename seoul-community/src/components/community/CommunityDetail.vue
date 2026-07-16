<template>
  <div v-if="post">
    <h3>{{ post.title }}</h3>
    <div class="meta">작성일: {{ formatDate(post.createdAt) }} <span v-if="post.updatedAt">(수정: {{ formatDate(post.updatedAt) }})</span></div>
    <div class="content" v-html="nl2br(post.content)"></div>

    <div class="actions">
      <button @click="$emit('edit-request', post.id)">수정</button>
      <button @click="$emit('delete-request', post.id)">삭제</button>
    </div>
  </div>
  <div v-else>
    <div>게시글을 불러올 수 없습니다.</div>
  </div>
</template>

<script setup>
const props = defineProps({ post: { type: Object, default: null } })

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString()
}

function nl2br(text) {
  if (!text) return ''
  return text.replace(/\n/g, '<br/>')
}
</script>

<style scoped>
.meta { color: #666; font-size: 13px; margin-bottom: 12px }
.content { white-space: pre-wrap; margin-bottom: 12px }
.actions button { margin-right: 8px }
</style>
