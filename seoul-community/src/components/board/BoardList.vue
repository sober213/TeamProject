<script setup>
import { ref, onMounted } from 'vue';
import { getPosts, addPost, updatePost, deletePost } from '../../utils/board';
import PostEditor from './PostEditor.vue';
import BoardPost from './BoardPost.vue';

const posts = ref([]);
const editing = ref(null);
const showNew = ref(false);
const message = ref('');

function refresh() { posts.value = getPosts(); }

onMounted(refresh);

function handleSave({ id, title, body, password }) {
  if (id) {
    const res = updatePost(id, { title, body, password });
    if (!res.ok) {
      message.value = res.reason === 'bad-password' ? '비밀번호가 일치하지 않습니다.' : '수정 실패';
      return;
    }
    message.value = '수정되었습니다.';
  } else {
    addPost({ title, body, password });
    message.value = '작성되었습니다.';
  }
  editing.value = null;
  showNew.value = false;
  refresh();
}

function handleCancel() {
  editing.value = null;
  showNew.value = false;
}

function onEdit(post) {
  editing.value = post;
}

function onDeleted({ id, password }) {
  const res = deletePost(id, password);
  if (!res.ok) {
    message.value = res.reason === 'bad-password' ? '비밀번호가 일치하지 않습니다.' : '삭제 실패';
    return;
  }
  message.value = '삭제되었습니다.';
  refresh();
}
</script>

<template>
  <section class="board">
    <div class="header">
      <h2>익명 커뮤니티</h2>
      <div class="controls">
        <button @click="showNew = !showNew">{{ showNew ? '닫기' : '새 글쓰기' }}</button>
      </div>
    </div>

    <div v-if="message" class="info">{{ message }}</div>

    <div v-if="showNew">
      <PostEditor :modelValue="editing" @save="handleSave" @cancel="handleCancel" />
    </div>

    <div v-if="!posts.length" class="empty">등록된 게시글이 없습니다.</div>

    <div>
      <BoardPost v-for="p in posts" :key="p.id" :post="p" @edit="onEdit" @deleted="onDeleted" />
    </div>
  </section>
</template>

<style scoped>
.board { max-width:860px; margin:0 auto; text-align:left; padding:12px; }
.header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.controls button { padding:8px 12px; border-radius:6px; border:none; background:#0ea5b7; color:#fff; }
.info { margin:8px 0; color:#0b8590; }
.empty { color:#666; padding:16px; background:#f8fafc; border-radius:8px; }
</style>