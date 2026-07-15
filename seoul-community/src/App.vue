<!-- src/App.vue -->
<template>
  <div class="app-container">
    <ChatBot />
  </div>
</template>

<script setup>
import ChatBot from './components/ChatBot.vue';
</script>

<style>
/* 화면 중앙 정렬을 위한 가벼운 스타일 */
body {
  margin: 0;
  background-color: #f0f2f5;
}
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>