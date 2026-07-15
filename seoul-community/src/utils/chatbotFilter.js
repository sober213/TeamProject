export function filterFestivalData(cleanedData, userQuery) {
  const query = userQuery.toLowerCase().trim();
  
  // 1. 유저 질문에서 '구' 단위 지역 키워드 추출 (예: "종로구", "강남", "서초")
  // 서울시 25개 자치구 목록 배열
  const seoulGuList = ['종로', '중구', '용산', '성동', '광진', '동대문', '중랑', '성북', '강북', '도봉', '노원', '은평', '서대문', '마포', '양천', '강서', '구로', '금천', '영등포', '동작', '관악', '서초', '강남', '송파', '강동'];
  
  // 유저가 언급한 특정 구가 있는지 매칭
  const matchedGu = seoulGuList.find(gu => query.includes(gu));

  // 2. 유저 질문에서 '월' 단위 날짜 키워드 추출 (예: "9월", "10월")
  const monthMatch = query.match(/(\d+)월/);
  let matchedMonth = "";
  if (monthMatch) {
    matchedMonth = monthMatch[1].padStart(2, '0'); // '9' -> '09'
  }

  // 3. 조건에 맞는 데이터 수집 및 가중치 계산
  const scoredList = cleanedData.map(item => {
    let score = 0;
    
    // 유저가 특정 구를 물어봤고, 축제 주소에 그 구가 포함되면 우선순위 대폭 상승
    if (matchedGu && item.addr && item.addr.includes(matchedGu)) {
      score += 30;
    }
    
    // 유저가 특정 월을 물어봤고, 축제 시작월이 일치하면 우선순위 대폭 상승
    if (matchedMonth && item.startDate && item.startDate.substring(4, 6) === matchedMonth) {
      score += 30;
    }

    // 일반 텍스트 키워드 매칭 가점
    if (item.title && item.title.toLowerCase().includes(query)) score += 10;
    if (item.place && item.place.toLowerCase().includes(query)) score += 5;
    if (item.program && item.program.toLowerCase().includes(query)) score += 3;
    if (query.includes('무료') && item.price && item.price.includes('무료')) score += 5;

    return { item, score };
  });

  // 4. 연관성 점수가 있는 것들을 높은 순으로 정렬
  let finalMatches = scoredList
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(res => res.item);

  // 5. 🔥 수집 볼륨 확장: 만약 조건에 맞는 데이터가 너무 많다면 최대 100개까지만 잘라서 보냄
  if (finalMatches.length > 0) {
    return finalMatches.slice(0, 100);
  }

  // 6. 만약 사용자가 아무 조건 없이 "축제 아무거나 다 알려줘"라고 광범위하게 물어봤다면 
  // 원본 정제 데이터에서 상위 80개를 기본 수집 세트로 OpenAI에 넘겨줍니다.
  return cleanedData.slice(0, 80);
}