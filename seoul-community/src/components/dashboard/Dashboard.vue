<script setup>
import festival from "../../data/서울_축제공연행사.json"

const firstFestival = festival.items[0]
</script>

<template>
  <div class="dashboard">

    <h2>서울 축제 데이터</h2>

    <p>총 {{ festival.total }}개</p>

    <hr>

    <h3>{{ firstFestival.title }}</h3>

    <p>{{ firstFestival.eventplace }}</p>

  </div>
</template>

<style scoped>
.dashboard{
    padding:20px;
}
</style>