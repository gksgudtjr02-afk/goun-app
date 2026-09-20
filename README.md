# GOUN (고운)

K-뷰티 매칭 서비스 GOUN의 Next.js 프로젝트입니다. 기존 HTML/CSS/JS 프로토타입(`고운_prototype-2.html`)의 UI/UX를 그대로 옮기고, Supabase Auth로 실제 회원가입/로그인이 동작하도록 연결했습니다.

## 스택

- **Next.js 15** (App Router)
- **Supabase** — 이메일/비밀번호 및 소셜(카카오/Apple/Google) 인증
- **Vercel** 배포

## 프로젝트 구조

```
app/
  layout.js          루트 레이아웃, 폰트, 전역 메타데이터
  globals.css         프로토타입 style.css 그대로
  page.js             홈 페이지 (GounApp 렌더)
  auth/callback/route.js   OAuth·이메일 확인 리다이렉트 처리
components/
  GounApp.jsx          클라이언트 컴포넌트: 마크업 주입 + 로직 초기화
  gounMarkup.js        프로토타입 #app 내부 마크업(문자열)
  gounAppLogic.js       프로토타입 app.js 로직 + Supabase 인증 연동
lib/
  supabaseClient.js     브라우저용 Supabase 클라이언트
  supabaseServer.js      서버(라우트 핸들러)용 Supabase 클라이언트
middleware.js           모든 요청에서 Supabase 세션 쿠키 갱신
```

## 로컬 개발 설정

### 1. Supabase 프로젝트 준비

1. [supabase.com](https://supabase.com)에서 새 프로젝트를 만듭니다.
2. **Project Settings → API**에서 `Project URL`과 `anon public` 키를 복사합니다.
3. **Authentication → URL Configuration**에서:
   - Site URL: `http://localhost:3000` (배포 후에는 실제 도메인으로 변경)
   - Redirect URLs에 `http://localhost:3000/auth/callback` (그리고 배포 도메인의 `/auth/callback`)을 추가합니다.
4. (선택) 이메일 인증 없이 바로 로그인되게 테스트하려면 **Authentication → Providers → Email**에서 "Confirm email"을 꺼주세요. 켜두면 회원가입 후 확인 메일의 링크를 눌러야 세션이 생성됩니다.
5. (선택) 카카오/Apple/Google 로그인을 쓰려면 **Authentication → Providers**에서 각 제공자를 활성화하고 Client ID/Secret을 등록하세요. 설정 전에는 소셜 버튼을 눌러도 에러 토스트가 뜹니다.

### 2. 환경 변수

```bash
cp .env.local.example .env.local
# .env.local 에 Supabase URL / anon key 입력
```

### 3. 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속 → 온보딩 → 로그인 화면에서 이메일/비밀번호로 시작하기를 누르면:
- 기존 계정이면 로그인
- 없는 계정이면 자동 회원가입 후 로그인 (이메일 확인이 켜져 있으면 확인 메일 안내 토스트 표시)

마이페이지 우측 상단 아이콘으로 로그아웃할 수 있습니다.

## Vercel 배포

1. 이 저장소를 GitHub에 push 합니다.
2. [vercel.com](https://vercel.com)에서 New Project → 저장소 Import.
3. Environment Variables에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 등록합니다.
4. 배포 후 Supabase의 Site URL / Redirect URLs에 실제 Vercel 도메인(`https://xxx.vercel.app/auth/callback`)을 추가합니다.
5. Deploy — 별도 빌드 설정 없이 Next.js 기본 설정으로 동작합니다.

## 참고

- 로그인/회원가입/로그아웃 외의 기능(피드, AI 스킨체크, 뷰티랩, 랭킹, 광고 등)은 프로토타입의 목업 데이터/동작을 그대로 유지합니다. 실제 데이터 연동은 이후 단계에서 Supabase 테이블을 추가해 확장하면 됩니다.
- `npm audit`에서 Next.js가 의존하는 `postcss`의 고위험 경고가 보일 수 있는데, 빌드 도구 내부 의존성이라 이 앱의 런타임에는 영향이 없습니다. Next.js 16 마이너 업그레이드 시 함께 해결됩니다.
