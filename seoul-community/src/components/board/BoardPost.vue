<script setup>
import { ref } from 'vue';
const props = defineProps({ post: Object });
const emits = defineEmits(['edit','deleted']);

const showFull = ref(false);

function doEdit() {
  emits('edit', props.post);
}

function doDelete() {
  const pw = window.prompt('삭제할 때 사용한 비밀번호를 입력하세요');
  if (pw === null) return;
  emits('deleted', { id: props.post.id, password: pw });
}
</script>

<template>
  <article class="post">
    <h3>{{ post.title }}</h3>
    <div class="meta">{{ new Date(post.createdAt).toLocaleString() }}</div>
    <div class="body" v-html="showFull ? post.body.replace(/\n/g,'<br/>') : (post.body.slice(0,180) + (post.body.length>180 ? '...' : ''))"></div>
    <div class="tools">
      <button @click="showFull = !showFull">{{ showFull ? '접기' : '더보기' }}</button>
      <button @click="doEdit">수정</button>
      <button @click="doDelete">삭제</button>
    </div>
  </article>
</template>

<style scoped>
.post { border:1px solid #eee; padding:10px; border-radius:8px; margin-bottom:8px; background:#fff; text-align:left; }
.meta { font-size:12px; color:#666; margin-bottom:8px; }
.tools { display:flex; gap:8px; margin-top:8px; }
.tools button { padding:6px 10px; border-radius:6px; border:1px solid #ddd; background:#f8fafc; }
</style>