# 💍 Pathfinding Wedding Space (Client)

이 프로젝트는 실제 결혼식을 가상 공간에서 재현한 웹 애플리케이션의 **프론트엔드**입니다.  
사용자는 캐릭터로 접속하여 **위치 이동, 채팅, 방명록 작성, 이미지 보기, 음악 감상** 등을 할 수 있으며,  
실시간 상호작용은 **Socket.IO**를 통해 서버와 연결됩니다.  
3D 환경은 **Three.js 기반 React 렌더링**으로 시각화됩니다.

---

## 🎯 프로젝트 목적

- 결혼식을 온라인 가상 공간에서 경험할 수 있도록 시각화
- React + Three.js 기반의 3D 인터페이스 실습
- 실시간 동기화(위치, 메시지, 아바타 등) 처리 학습
- 모듈화된 상태 관리(Zustand)와 인터페이스 설계 경험

---

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| UI 프레임워크 | React, TypeScript |
| 3D 렌더링 | Three.js (`@react-three/fiber`, `@react-three/drei`) |
| 실시간 통신 | Socket.IO Client |
| 상태 관리 | Zustand |
| 백엔드 연동 | Firebase (방명록 등) |
| 스타일링 | TailwindCSS, tailwind-scrollbar-hide |
| 애니메이션 | Framer Motion, framer-motion-3d |
| 라우팅 | Wouter |
| 번들링 | Vite |

---

## ⚙️ 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/ohe1013/pathfinding-socket.git
cd pathfinding-socket/client

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 프로덕션 빌드
npm run build

## 📁 폴더 구조

src/
├── App.tsx, main.tsx            # 진입점 및 라우터 구성
├── index.css                    # 전역 스타일 정의 (Tailwind 기반)
│
├── assets/                      # 정적 리소스 (로고, 아이콘 등)
│
├── features/                    # 주요 기능 모듈화 구성
│   ├── characters/              # 아바타, 캐릭터 모션 구성
│   ├── components/              # 공통 UI 요소 (버튼, 모달 등)
│   ├── gallery/                 # 이미지 뷰어, 미니맵
│   ├── items/                   # 공간 내 오브젝트 (조명, 사운드 등)
│   ├── rooms/                   # 룸 뷰 (로비, 방명록 등)
│   ├── svg/                     # SVG 아이콘 컴포넌트
│   ├── tablet/                  # 방명록, 게임 UI
│   └── UI/                      # 고정 UI 영역 (음악 버튼, UI.tsx 등)
│
├── firebase/                    # Firebase 초기화 및 설정
│
├── hooks/                       # 커스텀 훅 (useForm, useVote 등)
│
├── store/                       # Zustand 기반 상태 저장소
│
├── types/                       # 전역 타입 정의
│
└── vite-env.d.ts                # Vite/TS 환경 설정


## 🧠 Zustand 상태 구조

Zustand는 기능 단위로 store를 분리하여 다음과 같은 전역 상태를 관리합니다:

| 파일명 | 설명 |
|--------|------|
| `avatar.ts` | 캐릭터 아바타 URL 및 상태 |
| `characters.ts` | 전체 캐릭터 목록, 위치, 이동 경로 |
| `user.ts` | 현재 사용자 ID, 닉네임, 접속 룸 정보 |
| `rooms.ts` | 현재 룸 정보 및 전환 상태 |
| `map.ts` | 맵 사이즈, 그리드 정보 |
| `galleryImage.ts` | 선택된 이미지 및 갤러리 상태 |
| `modal.ts` | 모달 UI 열림 여부 및 타입 |
| `info.ts` | 결혼식 관련 전역 정보 (이름, 날짜 등) |

