<script setup>

import { ref, computed } from 'vue';
import { createChatCompletion } from '../utils/openai';
import { buildMessages } from '../utils/prompt';
import festival from '../data/서울_축제공연행사.json';
import ChatMessage from './ChatMessage.vue';

const open = ref(false);
const input = ref('');
const isThinking = ref(false);
const messages = ref([
  { role: 'system', content: '안내: 서울 지역 정보 챗봇입니다. 제공 데이터 기반으로만 응답합니다.' }
]);

function getRelevantItems(query, max=5) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return (festival.items || [])
    .filter(it => {
      const s = `${it.title || ''} ${it.eventplace || ''} ${it.svccn || ''}`.toLowerCase();
      return s.includes(q);
    })
    .slice(0, max);
}

async function send() {
  const text = input.value && input.value.trim();
  if (!text) return;
  messages.value.push({ role: 'user', content: text });
  input.value = '';
  isThinking.value = true;

  try {
    const relevant = getRelevantItems(text, 5);
    const msgs = buildMessages(text, relevant);
    const resp = await createChatCompletion(msgs, { max_completion_tokens: 128 });
    const content = resp.choices?.[0]?.message?.content || '응답이 없습니다.';
    messages.value.push({ role: 'assistant', content });
  } catch (err) {
    messages.value.push({ role: 'assistant', content: `오류: ${err.message}` });
  } finally {
    isThinking.value = false;
  }
}
</script>

<template>
  <div>
    <!-- Floating toggle -->
    <button class="chat-toggle" @click="open = !open" aria-label="chat">
      💬
    </button>

    <div v-if="open" class="chat-panel">
      <header class="chat-header">
        <h4>서울 지역 챗봇</h4>
        <button @click="open = false">✕</button>
      </header>

      <main class="chat-body">
        <div v-for="(m, i) in messages" :key="i">
          <ChatMessage :message="m" />
        </div>
        <div v-if="isThinking" class="typing">응답 생성중…</div>
      </main>

      <form class="chat-input" @submit.prevent="send">
        <input v-model="input" placeholder="질문을 입력하세요 (예: 광진구 축제 추천)" />
        <button type="submit">전송</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chat-toggle {
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #0ea5b7;
  color: white;
  border: none;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
  z-index: 60;
}
.chat-panel {
  position: fixed;
  right: 18px;
  bottom: 86px;
  width: min(420px, 92%);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 60;
}
.chat-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 12px; border-bottom:1px solid #eee;
}
.chat-body {
  padding:12px; overflow:auto; flex:1;
}
.chat-input {
  display:flex; gap:8px; padding:8px; border-top:1px solid #eee;
}
.chat-input input { flex:1; padding:8px 10px; border-radius:6px; border:1px solid #ddd; }
.chat-input button { background:#0ea5b7; color:#fff; border:none; padding:8px 12px; border-radius:6px; }
.typing { font-style: italic; color:#666; margin-top:8px; }
@media (max-width:600px){ .chat-panel { right:8px; left:8px; bottom:72px; width:auto; } }
</style>