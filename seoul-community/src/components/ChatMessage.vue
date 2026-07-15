<script setup>
defineProps({ message: Object });
</script>

<template>
  <div :class="['msg', message.role]">
    <div class="bubble">
      <div v-html="message.content.replace(/\n/g,'<br/>')"></div>
    </div>
  </div>
</template>

<style scoped>
.msg { margin:8px 0; display:flex; }
.msg.user { justify-content:flex-end; }
.msg.assistant { justify-content:flex-start; }
.bubble {
  max-width:78%;
  padding:8px 12px;
  border-radius:12px;
  background:#f3f4f6;
  color:#111827;
}
.msg.user .bubble { background:#0ea5b7; color:white; }
</style>