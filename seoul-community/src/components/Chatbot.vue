<!-- src/components/ChatBot.vue -->
<template>
  <div class="chat-container">
    <div class="chat-header">📍 서울 축제 AI 안내봇</div>
    <div class="chat-messages">
      <div v-for="(msg, index) in messages" :key="index" :class="['message-row', msg.role]">
        <div class="bubble">{{ msg.content }}</div>
      </div>
      <div v-if="isLoading" class="message-row assistant loading-text">🤖 답변을 생각하는 중입니다...</div>
    </div>
    <div class="chat-input-area">
      <input v-model="userInput" @keyup.enter="handleSend" placeholder="질문을 입력하세요..." :disabled="isLoading" />
      <button @click="handleSend" :disabled="isLoading">전송</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import cleanedFestivalData from '../data/서울_축제공연행사_cleaned.json';
import { filterFestivalData } from '../utils/chatbotFilter';
import { askOpenAI } from '../api/openai'; // 이 임포트 경로가 올바른지 확인 필수

const userInput = ref('');
const messages = ref([{ role: 'assistant', content: '안녕하세요! 서울시 축제 안내봇입니다.' }]);
const isLoading = ref(false);

const handleSend = async () => {
  const text = userInput.value.trim();
  if (!text || isLoading.value) return;

  messages.value.push({ role: 'user', content: text });
  userInput.value = '';
  isLoading.value = true;

  try {
    const contextualData = filterFestivalData(cleanedFestivalData, text);
    
    // 🔥 [DEBUG LOG] 전송 직전 로그 출력
    console.log("📢 [DEBUG] ChatBot.vue에서 askOpenAI 함수를 호출합니다. 필터링된 데이터 개수:", contextualData.length);

    const aiResponse = await askOpenAI(text, messages.value, contextualData);
    messages.value.push({ role: 'assistant', content: aiResponse });
  } catch (error) {
    console.error("📢 [DEBUG] 챗봇 catch 블록 진입 에러:", error);
    messages.value.push({ 
      role: 'assistant', 
      content: `⚠️ 오류 발생 원인: ${error.message}` 
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.chat-container { max-width: 500px; margin: 30px auto; border: 1px solid #e0e0e0; border-radius: 12px; display: flex; flex-direction: column; height: 600px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background-color: #fff; font-family: sans-serif; }
.chat-header { background-color: #3f51b5; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 1.1rem; border-top-left-radius: 11px; border-top-right-radius: 11px; }
.chat-messages { flex: 1; padding: 15px; overflow-y: auto; background-color: #f9f9f9; display: flex; flex-direction: column; gap: 12px; }
.message-row { display: flex; width: 100%; }
.message-row.user { justify-content: flex-end; }
.message-row.assistant { justify-content: flex-start; }
.bubble { max-width: 75%; padding: 10px 14px; border-radius: 16px; font-size: 0.95rem; line-height: 1.4; white-space: pre-line; }
.user .bubble { background-color: #3f51b5; color: white; border-bottom-right-radius: 2px; }
.assistant .bubble { background-color: #e0e0e0; color: #333; border-bottom-left-radius: 2px; }
.loading-text { color: #777; font-size: 0.85rem; font-style: italic; }
.chat-input-area { display: flex; padding: 12px; border-top: 1px solid #e0e0e0; background-color: #fff; border-bottom-left-radius: 11px; border-bottom-right-radius: 11px; gap: 8px; }
.chat-input-area input { flex: 1; padding: 10px 14px; border: 1px solid #ccc; border-radius: 20px; outline: none; font-size: 0.95rem; }
.chat-input-area button { background-color: #3f51b5; color: white; border: none; padding: 0 16px; border-radius: 20px; cursor: pointer; font-weight: bold; }
</style>