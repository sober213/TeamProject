<template>
  <div class="community-list">
    <div v-if="!posts || posts.length === 0">작성된 글이 없습니다.</div>
    <ul>
      <li v-for="post in posts" :key="post.id" @click="$emit('select', post.id)">
        <div class="title">{{ post.title }}</div>
        <div class="meta">{{ formatDate(post.createdAt) }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
const props = defineProps({ posts: { type: Array, default: () => [] } })

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString()
}
</script>

<style scoped>
.community-list ul { list-style: none; padding: 0; margin: 0 }
.community-list li { padding: 10px; border-bottom: 1px solid #eee; cursor: pointer }
.community-list li:hover { background: #fafafa }
.community-list .title { font-weight: 600 }
.community-list .meta { font-size: 12px; color: #888 }
</style>
