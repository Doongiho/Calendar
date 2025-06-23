# 🗓️ Calendar

**개인 일정 및 팀 일정을 관리할 수 있는 풀스택 캘린더 앱입니다.**
React + Express + JWT + MSSQL을 기반으로 구현되었으며, 사용자 인증과 팀 단위 협업 기능을 포함합니다.

---

## 📌 주요 기능

✅ 로그인 / 회원가입 (JWT 기반 인증)

✅ 개인 캘린더 조회 및 일정 추가, 수정, 삭제

✅ 팀 캘린더 초대, 수락/거절 기능

✅ 일정 색상 커스터마이징

✅ 일정 조회 시 일자별 필터링

✅ 모바일 반응형 대응

✅ WebSocket 기반 팀 일정 실시간 동기화
 
---

## 🛠️ 기술 스택

| 영역       | 사용 기술                                    |
| -------- | ---------------------------------------- |
| Frontend | React, TypeScript, styled-components     |
| Backend  | Node.js, Express, JWT, CORS              |
| Database | MSSQL                                    |
| 기타       | Axios, Zustand, Day.js, React-Router-Dom |

---

## 📂 프로젝트 구조

```
Calendar/
├── backend/                        # 백엔드 (Express + MySQL)
│   ├── controllers/               # API 요청 처리 로직
│   ├── routes/                    # API 라우팅
│   ├── models/                    # DB 모델 정의
│   ├── middleware/                # 인증 등 미들웨어
│   ├── config/                    # DB 및 환경설정
│   └── app.js                     # 서버 진입점
│
├── frontend/                      # 프론트엔드 (React + TS)
│   ├── components/                # 공통 UI 컴포넌트
│   ├── pages/                     # 라우트 별 페이지
│   ├── hooks/                     # 커스텀 훅
│   ├── api/                       # API 함수 정의
│   ├── stores/                    # Zustand 상태 관리
│   ├── styles/                    # 전역 스타일
│   └── App.tsx / main.tsx         # 진입점
│
├── .env                           # 환경 변수
├── package.json                   # 공통 패키지
└── README.md                      # 프로젝트 문서
```

---


