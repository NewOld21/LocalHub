# LocalHub Frontend

서울 공공데이터 탐색, 익명 커뮤니티, 데이터 기반 챗봇을 제공하는 LocalHub의 Vue.js 3 SPA 프론트엔드입니다.

## 기술 스택

- Vue.js 3 Composition API
- Vue Router 4
- JavaScript
- CSS
- Vue CLI

## 화면 구성

| 경로 | 화면 | 주요 기능 |
|---|---|---|
| `/` | Home | 서비스 소개, 카테고리 바로가기, 인기 게시글, 챗봇 |
| `/information` | Information 목록 | 카테고리·키워드·자치구 필터, 9개 단위 무한 스크롤 |
| `/information/:id` | Information 상세 | 장소 이미지, 주소, 연락처, 좌표 |
| `/community` | Community 목록 | 카테고리·통합 검색, 10개 단위 페이지네이션, 글쓰기 |
| `/community/:id` | Community 상세 | 조회수, 태그, 비밀번호 기반 수정·삭제 |

챗봇은 모든 화면의 우측 하단에서 열 수 있으며 모바일에서는 전체 화면으로 표시됩니다.

## 디렉터리 구조

```text
src/
├─ app/
│  └─ App.vue
├─ assets/styles/
│  └─ global.css
├─ core/
│  ├─ api/client.js            # 공통 fetch client
│  ├─ assets/                  # 공통 배경 이미지
│  ├─ components/Header.vue
│  └─ config/env.js            # 환경변수 접근
├─ features/
│  ├─ home/                    # 홈 화면
│  ├─ information/             # 장소 목록·상세·필터
│  ├─ community/               # 게시글 CRUD·검색
│  └─ chatbot/                 # 챗봇 배너·플로팅 위젯
├─ router/index.js
└─ main.js
```

## 실행 방법

```powershell
cd frontend
npm install
npm run serve
```

백엔드 서버가 함께 실행되어 있어야 실제 장소·게시글·챗봇 데이터를 확인할 수 있습니다.

## 명령어

```powershell
npm run serve   # 개발 서버
npm run lint    # ESLint 검사
npm run build   # 프로덕션 빌드
```

## 환경변수

필요한 환경변수 이름은 `.env.example`에서 확인합니다.

- `VUE_APP_FRONTEND_URL`: 프론트엔드 주소
- `VUE_APP_ROUTER_BASE_PATH`: Vue Router 기본 경로
- `VUE_APP_API_BASE_URL`: FastAPI 서버 주소

Vue CLI 환경변수는 빌드 시점에 주입됩니다. 값을 변경했다면 개발 서버를 재시작하거나 다시 빌드해야 합니다. `.env` 파일은 Git에 포함하지 않습니다.

## API 연동

모든 요청은 `src/core/api/client.js`의 `apiRequest()`를 사용합니다.

| 기능 | API |
|---|---|
| 장소 목록·검색 | `GET /api/locations` |
| 게시글 목록·검색 | `GET /api/posts` |
| 인기 게시글 | `GET /api/posts/popular` |
| 게시글 상세 | `GET /api/posts/{id}` |
| 게시글 작성 | `POST /api/posts` |
| 비밀번호 확인 | `POST /api/posts/{id}/verify-password` |
| 게시글 수정 | `PUT /api/posts/{id}` |
| 게시글 삭제 | `DELETE /api/posts/{id}` |
| 챗봇 | `POST /api/chat` |

## 주요 구현 사항

- Vue Router의 `createWebHistory()`를 사용하는 SPA
- Information 9개, Community 10개 단위 추가 로딩
- API 응답의 로딩·빈 결과·오류 상태 분리
- 장소 이미지가 없으면 카테고리별 로컬 이미지 사용
- 게시글 수정 전에 비밀번호 검증 API 호출
- 상세 조회수와 홈 인기 게시글 표시
- 챗봇 대화 이력 전달 및 관련 장소·게시글 상세 연결
- 데스크톱·태블릿·모바일 반응형 UI

## 배포

Netlify에서 다음 설정으로 배포합니다.

- Build command: `npm run build`
- Publish directory: `dist`
- 환경변수: Netlify 프로젝트 설정에서 등록

Vue Router history mode를 사용하므로 새로고침 시에도 `index.html`이 반환되도록 SPA redirect 설정이 필요합니다.
