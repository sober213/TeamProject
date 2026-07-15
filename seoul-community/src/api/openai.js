export async function askOpenAI(userMessage, chatHistory, filteredContext) {
  // 1. 주소 치환/캐시 오류를 막기 위해 동적 조립형 주소 사용
  const p1 = "https://api.";
  const p2 = "openai";
  const p3 = ".com/v1/chat/completions";
  const ENDPOINT_URL = p1 + p2 + p3;
  
  console.log("📢 [최종 통신 시작] 전송할 API 주소:", ENDPOINT_URL);

  // 2. Vite 환경 변수에서 API KEY 로드
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("환경 변수에 VITE_OPENAI_API_KEY가 설정되지 않았습니다.");
  }

  // 3. AI 행동 지침서(System Prompt) 및 정제 데이터 주입
  const systemPrompt = {
    role: 'system',
    content: `
      당신은 서울시 축제/공연/행사 데이터를 안내하는 친절한 AI 가이드입니다.
      반드시 제공된 [참조 데이터] 목록 내의 정보만을 바탕으로 진실하게 답변하세요.
      데이터에 없는 정보는 유추하거나 거짓말하지 말고 모른다고 하거나 질문을 좁혀달라고 답하세요.
      답변 시 장소, 일시, 비용 등 핵심 정보는 가독성 좋게 정리해 주세요.

      [참조 데이터]
      ${JSON.stringify(filteredContext)}
    `
  };

  // 4. Vue 내부의 반응형 프록시 객체를 순수한 API 규격 데이터로 가공
  const cleanHistory = chatHistory.map(m => ({
    role: m.role,
    content: m.content
  }));

  // 5. 시스템 프롬프트와 대화 내역 병합
  const apiMessages = [systemPrompt, ...cleanHistory];

  // 6. OpenAI 서버로 요청 전송
  const response = await fetch(ENDPOINT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', 
      messages: apiMessages,
      temperature: 0.3 
    })
  });

  // 7. 통신 에러 처리
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API 호출 에러 (상태 코드: ${response.status})`);
  }

  const result = await response.json();
  
  // 8. 안전한 데이터 추출 및 반환 (배열 원소 지정 명시)
  if (result.choices && result.choices[0] && result.choices[0].message) {
    return result.choices[0].message.content;
  }
  
  throw new Error("OpenAI 응답 데이터 구조가 올바르지 않습니다.");
}