<template>
  <div class="ccalendar-root">
    <div class="cc-header">
      <button @click="prevMonth">‹</button>
      <div class="cc-month">{{ year }}년 {{ month+1 }}월</div>
      <button @click="nextMonth">›</button>
    </div>

    <div class="cc-weeknames">
      <div v-for="d in weekNames" :key="d" class="cc-weekname">{{ d }}</div>
    </div>

    <div class="cc-grid">
      <div v-for="cell in monthCells" :key="cell.key" :class="['cc-cell', { 'cc-other': !cell.thisMonth, 'cc-hasEvent': cell.events.length }]" @click="selectCell(cell)">
        <div class="cc-day">{{ cell.day }}</div>
        <div v-if="cell.events.length" class="cc-dot"></div>
      </div>
    </div>

    <div v-if="selectedCell" class="cc-event-list">
      <div class="cc-list-header">선택: {{ selectedCell.displayDate }}</div>
      <ul>
        <li v-for="(e, i) in selectedCell.events" :key="i">
          <strong>{{ e.title }}</strong> — {{ e.place || e.addr || '-' }}
        </li>
        <li v-if="selectedCell.events.length===0">해당 일자에 일정이 없습니다.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
  events: { type: Array, default: () => [] } // expects startDate, endDate in "YYYYMMDD"
});

const today = new Date();
const viewYear = ref(today.getFullYear());
const viewMonth = ref(today.getMonth()); // 0-based
const selectedCell = ref(null);

const weekNames = ['일','월','화','수','목','금','토'];

const year = computed(() => viewYear.value);
const month = computed(() => viewMonth.value);

function pad(n){ return String(n).padStart(2,'0'); }
function ymdToDate(ymd){ return new Date(Number(ymd.slice(0,4)), Number(ymd.slice(4,6))-1, Number(ymd.slice(6,8))); }

function buildMonthCells(y,m){
  const first = new Date(y,m,1);
  const startDay = first.getDay();
  const daysInMonth = new Date(y,m+1,0).getDate();
  const prevDays = startDay;
  const totalCells = Math.ceil((prevDays + daysInMonth)/7)*7;
  const cells = [];
  const startDate = new Date(y,m,1 - prevDays);
  for(let i=0;i<totalCells;i++){
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const cellYear = d.getFullYear(); const cellMonth = d.getMonth(); const cellDay = d.getDate();
    const thisMonth = (cellYear===y && cellMonth===m);
    const ymd = `${cellYear}${pad(cellMonth+1)}${pad(cellDay)}`;
    // collect events that include this date (startDate <= date <= endDate)
    const cellEvents = props.events.filter(ev=>{
      if(!ev.startDate) return false;
      try{
        const s = ev.startDate;
        const e = ev.endDate || ev.startDate;
        return s <= ymd && ymd <= e;
      }catch{ return false; }
    });
    cells.push({
      key: `${ymd}-${i}`,
      dateObj: d,
      day: cellDay,
      thisMonth,
      ymd,
      events: cellEvents,
      displayDate: `${cellYear}-${pad(cellMonth+1)}-${pad(cellDay)}`
    });
  }
  return cells;
}

const monthCells = computed(()=> buildMonthCells(viewYear.value, viewMonth.value));

function prevMonth(){ if(viewMonth.value===0){ viewYear.value--; viewMonth.value=11 } else viewMonth.value--; selectedCell.value=null; }
function nextMonth(){ if(viewMonth.value===11){ viewYear.value++; viewMonth.value=0 } else viewMonth.value++; selectedCell.value=null; }
function selectCell(cell){ selectedCell.value = cell; }
</script>

<style scoped>
.ccalendar-root { width: 320px; font-family: inherit; background: #fff; border-radius:8px; padding:10px; box-shadow:0 6px 18px rgba(0,0,0,0.08); }
.cc-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; gap:8px; }
.cc-header button { background:#efefef; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; }
.cc-weeknames { display:grid; grid-template-columns:repeat(7,1fr); font-size:12px; color:#666; margin-bottom:4px; }
.cc-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:6px; }
.cc-cell { min-height:46px; padding:6px; border-radius:6px; cursor:pointer; position:relative; display:flex; flex-direction:column; align-items:flex-start; }
.cc-other { opacity:0.38; }
.cc-hasEvent .cc-day { font-weight:600; color:#1e88e5; }
.cc-dot { width:6px; height:6px; background:#1e88e5; border-radius:50%; position:absolute; right:8px; bottom:8px; }
.cc-event-list { margin-top:8px; border-top:1px solid #eee; padding-top:8px; }
.cc-list-header { font-weight:700; margin-bottom:6px; }
</style>