import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log("1. 스크립트 실행 시작...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '서울_축제공연행사.json');
const OUTPUT_FILE = path.join(__dirname, '서울_축제공연행사_cleaned.json');

try {
  if (!fs.existsSync(INPUT_FILE)) {
    console.log("❌ 에러: 원본 JSON 파일이 없습니다!");
    process.exit(1);
  }

  const rawData = fs.readFileSync(INPUT_FILE, 'utf-8');
  console.log("4. 파일 읽기 성공, 데이터 구조 파싱 중...");
  
  let parsedData = JSON.parse(rawData);
  let jsonArray = [];

  // 🔥 핵심: JSON 구조 분석 및 배열(Array) 강제 추출 로직
  if (Array.isArray(parsedData)) {
    // 1) 최상단이 배열인 경우 ([ {}, {} ])
    jsonArray = parsedData;
  } else if (parsedData.response && parsedData.response.body && parsedData.response.body.items && Array.isArray(parsedData.response.body.items.item)) {
    // 2) 공공데이터 표준 포맷인 경우 (response.body.items.item)
    jsonArray = parsedData.response.body.items.item;
  } else if (parsedData.items && Array.isArray(parsedData.items)) {
    // 3) items 키 내부에 배열이 있는 경우 ({ items: [] })
    jsonArray = parsedData.items;
  } else {
    // 4) 기타 다른 키에 배열이 숨어있을 경우 자동으로 찾아내기
    const possibleKey = Object.keys(parsedData).find(key => Array.isArray(parsedData[key]));
    if (possibleKey) {
      jsonArray = parsedData[possibleKey];
    } else {
      // 5) 정말 배열이 없다면 단일 객체를 배열로 감싸기
      jsonArray = [parsedData];
    }
  }

  console.log(`5. 기존 데이터 개수: ${jsonArray.length}개 발견`);

  // 데이터 압축 및 정제
  const cleanedData = jsonArray.map(item => {
    return {
      title: item.title || "정보 없음",
      addr: item.addr1 || "정보 없음",
      place: item.eventplace || "정보 없음",
      startDate: item.eventstartdate || "",
      endDate: item.eventenddate || "",
      price: item.usetimefestival || "무료 또는 정보 없음",
      tel: item.tel || "",
      program: item.program ? item.program.substring(0, 300) + '...' : "상세 프로그램 정보 없음"
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanedData, null, 2), 'utf-8');
  console.log(`✅ 6. 정제 완료! 새 파일 생성됨: ${OUTPUT_FILE}`);

} catch (error) {
  console.error('❌ 최종 에러 발생:', error);
}