<!-- src/components/ChatBot.vue -->
<template>
  <div class="chatbot-widget-container">
    
    <!-- 1. 대화창 (isOpen이 true일 때만 우아하게 표시) -->
    <transition name="fade">
      <div v-if="isOpen" class="chat-window">
        <!-- 대화창 헤더 (닫기 버튼 포함) -->
        <div class="chat-header">
          <span>📍 서울 축제 AI 안내봇</span>
          <button @click="toggleChat" class="close-btn">✖</button>
        </div>
        
        <!-- 채팅 말풍선 구역 -->
        <div class="chat-messages">
          <div 
            v-for="(msg, index) in messages" 
            :key="index" 
            :class="['message-row', msg.role]"
          >
            <div class="bubble">
              {{ msg.content }}
            </div>
          </div>
          <div v-if="isLoading" class="message-row assistant loading-text">
            🤖 답변을 생각하는 중입니다...
          </div>
        </div>

        <!-- 푸터 입력창 구역 -->
        <div class="chat-input-area">
          <input 
            v-model="userInput" 
            @keyup.enter="handleSend" 
            placeholder="질문을 입력하세요..." 
            :disabled="isLoading"
          />
          <button @click="handleSend" :disabled="isLoading">전송</button>
        </div>
      </div>
    </transition>

    <!-- 2. 좌측 하단 고정형 동그라미 아이콘 버튼 -->
    <button :class="['floating-chat-btn', { 'is-active': isOpen }]" @click="toggleChat">
      <!-- 챗봇이 닫혀있으면 말풍선 이모지, 열려있으면 닫기(X) 표시 -->
      <span v-if="!isOpen">💬</span>
      <span v-else>❌</span>
    </button>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import cleanedFestivalData from '../data/서울_축제공연행사_cleaned.json';
import { filterFestivalData } from '../utils/chatbotFilter';
import { askOpenAI } from '../api/openai';

// 챗봇 열림/닫힘 상태 관리
const isOpen = ref(false);
const userInput = ref('');
const messages = ref([
  { role: 'assistant', content: '안녕하세요! 서울시 축제 및 공연 행사 안내봇입니다. 종로구, 무료 축제, 9월 등 키워드로 편하게 물어보세요!' }
]);
const isLoading = ref(false);

// 챗봇 상태 토글 함수
const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const handleSend = async () => {
  const text = userInput.value.trim();
  if (!text || isLoading.value) return;

  messages.value.push({ role: 'user', content: text });
  userInput.value = '';
  isLoading.value = true;

  try {
    const contextualData = filterFestivalData(cleanedFestivalData, text);
    console.log("📢 [DEBUG] 필터링된 데이터 개수:", contextualData.length);

    const aiResponse = await askOpenAI(text, messages.value, contextualData);
    messages.value.push({ role: 'assistant', content: aiResponse });
  } catch (error) {
    console.error("챗봇 에러:", error);
    messages.value.push({ 
      role: 'assistant', 
      content: '⚠️ 죄송합니다. 답변을 불러오는 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' 
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 전체 위젯 컨테이너: 화면 좌측 하단에 고정 */
.chatbot-widget-container {
  position: fixed;
  bottom: 25px;
  left: 25px;
  z-index: 9999; /* 화면 최상단 정렬 */
  font-family: 'Noto Sans KR', sans-serif;
}

/* 좌측 하단 동그라미 플로팅 버튼 스타일 */
.floating-chat-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #3f51b5;
  color: white;
  border: none;
  font-size: 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(63, 81, 181, 0.4);
  transition: transform 0.2s ease, background-color 0.2s ease;
}
.floating-chat-btn:hover {
  transform: scale(1.08);
  background-color: #303f9f;
}
.floating-chat-btn.is-active {
  background-color: #e53935; /* 열렸을 때는 빨간색 닫기 톤으로 교체 */
  box-shadow: 0 4px 16px rgba(229, 57, 53, 0.4);
}

/* 플로팅 버튼 바로 위에 배치될 대화창 레이아웃 */
.chat-window {
  position: absolute;
  bottom: 75px; /* 동그라미 버튼 바로 위에 안착 */
  left: 0;
  width: 380px;
  height: 520px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  background-color: #fff;
  overflow: hidden;
}

/* 대화창 내부 디자인 요소들 */
.chat-header { 
  background-color: #3f51b5; 
  color: white; 
  padding: 14px 18px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold; 
  font-size: 1rem; 
}
.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  opacity: 0.8;
}
.close-btn:hover { opacity: 1; }

.chat-messages { flex: 1; padding: 15px; overflow-y: auto; background-color: #f8f9fa; display: flex; flex-direction: column; gap: 12px; }
.message-row { display: flex; width: 100%; }
.message-row.user { justify-content: flex-end; }
.message-row.assistant { justify-content: flex-start; }
.bubble { max-width: 78%; padding: 10px 14px; border-radius: 16px; font-size: 0.9rem; line-height: 1.4; white-space: pre-line; word-break: break-all; }
.user .bubble { background-color: #3f51b5; color: white; border-bottom-left-radius: 16px; border-bottom-right-radius: 2px; }
.assistant .bubble { background-color: #fff; color: #333; border: 1px solid #e2e8f0; border-bottom-left-radius: 2px; }
.loading-text { color: #777; font-size: 0.8rem; font-style: italic; }

.chat-input-area { display: flex; padding: 12px; border-top: 1px solid #eee; background-color: #fff; gap: 8px; }
.chat-input-area input { 
  flex: 1; 
  padding: 10px 14px; 
  border: 1px solid #e2e8f0; 
  border-radius: 20px; 
  outline: none; 
  font-size: 0.9rem; 
  
  /* 🔥 해결책: 전역 스타일에 묻히지 않도록 글자색을 어두운 검은색으로 강제 고정합니다 */
  color: #333333 !important; 
  
  /* 입력창 배경색을 살짝 밝은 회색으로 주어 경계를 명확히 합니다 */
  background-color: #f8f9fa !important; 
}

/* 입력창을 클릭(포커스)했을 때의 스타일 */
.chat-input-area input:focus { 
  border-color: #3f51b5; 
  background-color: #ffffff !important; /* 포커스 시 흰색 배경으로 반전 */
}
.chat-input-area button { background-color: #3f51b5; color: white; border: none; padding: 0 16px; border-radius: 20px; cursor: pointer; font-weight: bold; font-size: 0.85rem; }
.chat-input-area button:hover { background-color: #303f9f; }

/* 대화창이 부드럽게 나타나고 사라지는 트랜지션 애니메이션 효과 */
.fade-enter-active, .fade-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>