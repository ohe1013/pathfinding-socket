# 💍 Pathfinding Wedding Space - Fullstack Project

> 가상 결혼식 공간을 구현한 풀스택 프로젝트로, 사용자들이 3D 공간 내에서 실시간으로 캐릭터를 움직이고 채팅하며 방명록을 남기고 음악을 즐길 수 있는 **인터랙티브 웹 서비스**입니다.
---

## 📸 배포 주소
https://pathfinding-socket.vercel.app/
> 백엔드는 **Socket.IO 기반의 실시간 통신 처리**와 주기적인 리소스 관리가 필요한 구조이기 때문에, 지속 실행이 가능하고 배포 및 스케일링이 유연한 **Render**에 배포했습니다.  
> 반면 프론트엔드는 **정적 파일 기반의 SPA(싱글 페이지 애플리케이션)**이며, 글로벌 캐싱 및 빠른 응답 속도가 중요한 만큼, 정적 호스팅에 최적화된 **Vercel**을 선택해 배포했습니다.
---

## 🧠 프로젝트 개요

* **목적**: 오프라인 결혼식의 상호작용 요소를 온라인 가상 공간으로 확장
* **형태**: 풀스택 애플리케이션 (프론트엔드 + 백엔드)
* **기술**: WebSocket을 통한 실시간 통신, Three.js 기반 3D 렌더링
* **주요 기능**:

  * 실시간 캐릭터 이동 및 애니메이션
  * 룸 전환 기능 (로비, 포토존, 방명록 등)
  * 채팅 시스템
  * 아바타 및 닉네임 설정
  * 음악 재생 및 제어
  * 방명록 작성 (Firebase)
  * 이미지 갤러리 기능

---

## 📦 기술 스택

### 공통

* TypeScript
* Socket.IO

### 프론트엔드

* React
* Three.js (`@react-three/fiber`, `@react-three/drei`)
* Zustand (상태 관리)
* TailwindCSS
* Framer Motion / framer-motion-3d
* Firebase (방명록)
* Wouter (라우팅)
* Vite (번들러)

### 백엔드

* Node.js + Express
* Socket.IO (서버)
* TypeScript
* Pathfinding.js (A\* 알고리즘)

---

## ⚙️ 실행 방법

### 서버

```bash
cd server
npm install
npm run dev       # 개발 모드
# 또는
npm run build
npm start         # 프로덕션 모드
```

### 클라이언트

```bash
cd client
npm install
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
```

---

## 📁 폴더 구조

### 서버 (`/server`)

* `index.ts`: 서버 초기화 및 소켓 핸들러 연결
* `socket/handlers.ts`: 모든 실시간 이벤트 처리
* `services/`: 캐릭터, 룸, 경로 탐색 등 로직
* `models/`: `Room`, `Character` 클래스
* `data/`: 룸 구성 (`rooms.json`) 및 아이템 정의
* `types/`: 공통 타입 정의

### 클라이언트 (`/client/src`)

* `App.tsx`, `main.tsx`: 앱 진입점 및 라우터 설정
* `features/`: 핵심 기능 모듈

  * `characters/`: 캐릭터 아바타 및 이동 렌더링
  * `components/`: 공통 UI 요소 (버튼, 모달 등)
  * `gallery/`: 이미지 뷰어 및 미니맵
  * `items/`: 조명, 소리 등 맵 구성 요소
  * `rooms/`: 공간별 컴포넌트
  * `tablet/`: 방명록 및 게임 UI
  * `UI/`: 상단 UI (음악 버튼, 채팅 등)
* `store/`: Zustand 상태 모듈
* `firebase/`: Firebase 설정
* `hooks/`, `types/`: 커스텀 훅 및 타입 정의

---

## 🧠 Zustand 상태 구조 (클라이언트)

| 파일명               | 설명                      |
| ----------------- | ----------------------- |
| `avatar.ts`       | 캐릭터 아바타 URL 및 상태        |
| `characters.ts`   | 전체 캐릭터 목록, 위치, 이동 경로    |
| `user.ts`         | 현재 사용자 ID, 닉네임, 접속 룸 정보 |
| `rooms.ts`        | 현재 룸 및 전환 상태            |
| `map.ts`          | 맵 사이즈 및 그리드 정보          |
| `galleryImage.ts` | 이미지 뷰어 상태               |
| `modal.ts`        | 모달 UI 상태 관리             |
| `info.ts`         | 결혼식 설정 정보 (이름, 날짜 등)    |

---

## 🔄 실시간 흐름 요약

1. **접속 시**: 서버에서 맵, 캐릭터, 룸 정보 수신 → 상태 초기화
2. **이동 요청**: `move(from, to)` 이벤트 송신 → 서버에서 A\* 계산 → 경로 반환 → 이동 애니메이션
3. **룸 전환**: `joinRoom(roomId)` 호출 시 기존 룸 퇴장 + 새 룸 입장
4. **채팅 / 아바타 / 이름 설정**: 클라이언트에서 이벤트 전송 → 룸 전체에 반영
5. **음악, 갤러리, 방명록**: UI 인터랙션 → 상태 변경 또는 Firebase 업데이트

---

## 🖱️ UI 기능 요약

| 기능      | 설명                            | 위치                                         |
| ------- | ----------------------------- | ------------------------------------------ |
| 캐릭터 이동  | 클릭 시 서버로 위치 이동 요청, 경로 계산 후 반영 | `features/characters/`, `SocketManager.ts` |
| 채팅      | 메시지 입력 후 룸에 브로드캐스트            | `features/UI/`, `SocketManager.ts`         |
| 방명록     | 작성된 메시지를 Firebase에 저장 및 렌더링   | `features/tablet/GuestBook.tsx`            |
| 이미지 갤러리 | 포토존에서 썸네일 및 확대 보기 기능          | `features/gallery/`                        |
| 음악 제어   | 버튼 클릭으로 배경음악 재생/정지 제어         | `features/UI/MusicButton.tsx`              |
| 애니메이션   | 버튼으로 캐릭터 애니메이션 실행             | `features/UI/AnimationButton.tsx`          |
| 룸 전환    | 사용자가 룸을 전환하여 맵과 캐릭터 상태 갱신     | `rooms/`, `SocketManager.ts`               |

---

## 📜 라이선스

MIT License
