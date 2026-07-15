<script setup>
defineProps({
  role: String,
  content: String
})
</script>

<template>
  <div :class="['message', role]">
    {{ content }}
  </div>
</template>