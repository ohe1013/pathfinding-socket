# 🧭 Pathfinding Socket

**TypeScript**, **Express**, **Socket.IO**로 구현된 실시간 멀티플레이어 경로 탐색 풀스택 프로젝트입니다.  
서버에서 A* 알고리즘을 활용해 경로를 계산하고, 클라이언트는 웹소켓을 통해 캐릭터 이동, 룸 전환, 채팅 등 다양한 상호작용을 실시간으로 수행할 수 있습니다.

---

## 🚀 주요 기능

- 실시간 멀티플레이어 캐릭터 이동
- A* 기반 경로 탐색 (서버 사이드)
- 룸(Room) 단위 맵 구성 및 이동
- 캐릭터 아바타/이름 커스터마이징
- 채팅, 랭킹, 애니메이션 전송
- 타입스크립트 기반 구조적 아키텍처

---

## 🛠️ 기술 스택

- **백엔드**: Node.js, TypeScript, Express, Socket.IO
- **경로 탐색**: [pathfinding](https://www.npmjs.com/package/pathfinding) (A* 알고리즘)
- **개발 도구**: Nodemon, ts-node, cross-env, dotenv

---

## 📦 설치 및 실행

```bash
# 프로젝트 클론
git clone https://github.com/ohe1013/pathfinding-socket.git
cd pathfinding-socket/server

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드 후 실행
npm run build
npm start
