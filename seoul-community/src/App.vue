<!-- src/App.vue -->
<template>
  <div class="app-root">
    <header class="topbar">
      <h1>Seoul Community</h1>
      <nav>
        <button :class="{active: view==='chat'}" @click="view='chat'">Chatbot</button>
        <button :class="{active: view==='community'}" @click="view='community'">Community</button>
      </nav>
    </header>

    <main class="main-area">
      <Chatbot v-if="view === 'chat'" />
      <CommunityBoard v-if="view === 'community'" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Chatbot from './components/Chatbot.vue'
import CommunityBoard from './components/community/CommunityBoard.vue'

const view = ref('chat')
</script>

<style>
body {
  margin: 0;
  background-color: #f6f7fb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #e6e9ef;
}
.topbar h1 {
  margin: 0;
  font-size: 18px;
}
.topbar nav button {
  margin-left: 8px;
  padding: 6px 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}
.topbar nav button.active {
  border-color: #2f80ed;
  color: #2f80ed;
}
.main-area {
  padding: 20px;
}
</style>