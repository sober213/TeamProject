<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  modelValue: Object // { id?, title, body }
});
const emits = defineEmits(['save','cancel']);

const title = ref(props.modelValue?.title || '');
const body = ref(props.modelValue?.body || '');
const password = ref('');

watch(()=>props.modelValue, v=>{
  title.value = v?.title || '';
  body.value = v?.body || '';
  password.value = '';
});

function onSave() {
  if (!title.value.trim() && !body.value.trim()) return;
  emits('save', { id: props.modelValue?.id, title: title.value, body: body.value, password: password.value });
  title.value = '';
  body.value = '';
  password.value = '';
}
</script>

<template>
  <div class="editor">
    <input v-model="title" placeholder="제목" />
    <textarea v-model="body" placeholder="내용"></textarea>
    <input v-model="password" type="password" placeholder="비밀번호 (수정/삭제 시 필요)" />
    <div class="actions">
      <button @click="onSave">저장</button>
      <button @click="$emit('cancel')">취소</button>
    </div>
  </div>
</template>

<style scoped>
.editor { display:flex; flex-direction:column; gap:8px; }
.editor input, .editor textarea { padding:8px; border:1px solid #ddd; border-radius:6px; }
.editor textarea { min-height:100px; resize:vertical; }
.actions { display:flex; gap:8px; }
.actions button { padding:8px 12px; border-radius:6px; border:none; background:#0ea5b7; color:#fff; }
.actions button:nth-child(2) { background:#e5e7eb; color:#111; }
</style>