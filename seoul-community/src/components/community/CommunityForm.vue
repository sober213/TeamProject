<template>
  <div class="community-form">
    <h3>{{ isEdit ? '글 수정' : '새 글 작성' }}</h3>
    <form @submit.prevent="submit">
      <div class="field">
        <label>제목</label>
        <input v-model="title" />
      </div>
      <div class="field">
        <label>내용</label>
        <textarea v-model="content" rows="6" />
      </div>
      <div class="field">
        <label>수정/삭제 비밀번호</label>
        <input v-model="password" type="password" />
        <div class="note">비밀번호는 브라우저 로컬에 암호화 없이 저장됩니다 (교육용).</div>
      </div>

      <div class="actions">
        <button type="submit">저장</button>
        <button type="button" @click="$emit('cancel')">취소</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ post: { type: Object, default: null } })
const emit = defineEmits(['save', 'cancel'])

const isEdit = ref(!!props.post)
const title = ref(props.post ? props.post.title : '')
const content = ref(props.post ? props.post.content : '')
const password = ref('')

watch(() => props.post, (p) => {
  isEdit.value = !!p
  title.value = p ? p.title : ''
  content.value = p ? p.content : ''
  password.value = ''
})

function submit() {
  if (!title.value.trim()) { alert('제목을 입력하세요'); return }
  if (!content.value.trim()) { alert('내용을 입력하세요'); return }
  if (!password.value) { alert('비밀번호를 입력하세요'); return }

  const payload = {
    id: props.post ? props.post.id : undefined,
    title: title.value,
    content: content.value,
    password: password.value,
  }
  emit('save', payload)
}
</script>

<style scoped>
.field { margin-bottom: 10px }
.field label { display: block; font-weight: 600; margin-bottom: 6px }
input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px }
.note { font-size: 12px; color: #888; margin-top: 6px }
.actions { margin-top: 8px }
.actions button { margin-right: 8px }
</style>
