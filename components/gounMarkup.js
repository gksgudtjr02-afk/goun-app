export const GOUN_MARKUP = `

  <!-- ===================== 1. ONBOARDING ===================== -->
  <section id="view-onboarding" class="view active">
    <div class="onboard-wrap">
      <div class="onboard-logo">
        <div class="goun-logo-mask" aria-label="고운"></div>
        <p>Discover Your K-Beauty Match</p>
      </div>
      <div class="onboard-status">
        <div class="pin-pulse"><i data-icon="map-pin"></i></div>
        <p class="muted">내 위치를 확인하고 있어요</p>
        <div class="flag-row">
          <span class="flag active">🇰🇷</span>
          <span class="flag">🇺🇸</span>
          <span class="flag">🇯🇵</span>
          <span class="flag">🇻🇳</span>
        </div>
        <div class="lang-pill"><i data-icon="language"></i> 한국어로 설정됨</div>
      </div>
      <button class="btn-primary btn-block" id="btn-enter" data-nav="login">시작하기</button>
    </div>
  </section>

  <!-- ===================== 1b. LOGIN / SIGNUP ===================== -->
  <section id="view-login" class="view">
    <div class="login-wrap">
      <div class="login-top">
        <span class="logo-mark"><span class="logo-glow"></span>고</span>
        <h2>고운 시작하기</h2>
        <p class="muted center">가입하고 나에게 맞는 K-뷰티를 찾아보세요</p>
      </div>

      <div class="login-social">
        <button class="social-btn social-kakao" id="social-kakao-btn"><i data-icon="message-circle"></i> 카카오로 계속하기</button>
        <button class="social-btn social-apple" id="social-apple-btn"><i data-icon="user"></i> Apple로 계속하기</button>
        <button class="social-btn social-google" id="social-google-btn"><i data-icon="mail"></i> Google로 계속하기</button>
      </div>

      <div class="login-divider"><span>또는</span></div>

      <div class="login-fields">
        <input class="login-input" type="email" id="login-email" placeholder="이메일 주소" autocomplete="email">
        <input class="login-input" type="password" id="login-password" placeholder="비밀번호 (6자 이상)" autocomplete="current-password">
      </div>

      <button class="btn-primary btn-block" id="login-continue-btn">시작하기</button>
      <p class="muted center small login-terms">계속 진행하면 <span class="link-text">이용약관</span> 및 <span class="link-text">개인정보처리방침</span>에 동의하게 됩니다</p>
    </div>
  </section>

  <!-- ===================== 2. HOME (DISCOVERY GRID) ===================== -->
  <section id="view-home" class="view">
    <header class="home-header">
      <span class="brand"><span class="goun-header-mark" aria-label="고운"></span></span>
      <div class="header-icons">
        <button class="icon-btn" data-nav="wishlist" aria-label="위시리스트"><i data-icon="heart"></i></button>
        <button class="icon-btn" aria-label="검색"><i data-icon="search"></i></button>
      </div>
    </header>

    <button class="weather-strip" data-nav="touchup">
      <i data-icon="cloud"></i>
      <span><strong>서울 미세먼지 나쁨</strong> · 오늘은 클렌징 두 번 신경 써주세요</span>
      <i data-icon="chevron-right" class="chev"></i>
    </button>

    <div class="hero-banner" id="hero-banner">
      <span class="hero-eyebrow"><i data-icon="flame"></i> 지금 가장 인기</span>
      <h2 class="hero-title">사쿠라의 광채 스킨케어 루틴</h2>
      <p class="hero-sub">21.7k명이 좋아했어요 · 세럼 3종 사용</p>
    </div>

    <button class="touchup-banner" data-nav="touchup">
      <i data-icon="repeat"></i>
      <div>
        <strong>오전 룩, 아직 잘 유지되고 있을까요?</strong>
        <span>지금 화장 상태 체크하기</span>
      </div>
      <i data-icon="chevron-right" class="chev"></i>
    </button>

    <div class="quad-banner-grid">
      <button class="mini-banner mini-banner-color" data-nav="color">
        <i data-icon="palette"></i>
        <strong>퍼스널 컬러 진단</strong>
        <span>내 웜톤/쿨톤 찾기</span>
      </button>
      <button class="mini-banner mini-banner-battle" data-nav="battle">
        <i data-icon="swords"></i>
        <strong>화장 배틀</strong>
        <span>내 vs 친구 투표</span>
      </button>
      <button class="mini-banner mini-banner-scan" data-nav="scanner">
        <i data-icon="scan"></i>
        <strong>성분 스캐너</strong>
        <span>내 피부에 맞을까?</span>
      </button>
      <button class="mini-banner mini-banner-rank" data-nav="ranking">
        <i data-icon="trophy"></i>
        <strong>주간 랭킹</strong>
        <span>이번 주 인기 TOP</span>
      </button>
    </div>

    <div class="chip-row">
      <button class="chip active" data-filter="all">전체</button>
      <button class="chip" data-filter="base">쿠션/베이스</button>
      <button class="chip" data-filter="lip">립</button>
      <button class="chip" data-filter="skin">스킨케어</button>
    </div>

    <div class="grid" id="feed-grid"></div>
  </section>

  <!-- ===================== 2b. FULLSCREEN PLAYER (overlay) ===================== -->
  <section id="view-player" class="view player-view">
    <div class="player-top">
      <button class="icon-btn ghost" id="player-close" aria-label="닫기"><i data-icon="x"></i></button>
      <div class="player-user"><span class="flag-sm" id="player-flag">🇰🇷</span><span id="player-name">민지</span></div>
      <span class="translate-pill"><i data-icon="language"></i> 번역됨</span>
    </div>

    <div class="player-stage">
      <div class="player-avatar"><i data-icon="user"></i></div>
    </div>

    <div class="player-side">
      <button class="side-btn" id="like-btn"><i data-icon="heart"></i><span id="like-count">12.4k</span></button>
      <button class="side-btn"><i data-icon="message-circle"></i><span>832</span></button>
      <button class="side-btn"><i data-icon="shopping-bag"></i><span>구매</span></button>
      <button class="side-btn" id="player-share-btn"><i data-icon="share"></i><span>공유</span></button>
    </div>

    <div class="player-bottom">
      <p class="player-caption" id="player-caption">"이 쿠션 하나로 끝! 완전 강추"</p>
      <button class="buy-pill"><i data-icon="shopping-cart"></i> 올리브영에서 바로 구매</button>
      <button class="btn-primary btn-block try-btn" id="try-look-btn"><i data-icon="wand"></i> 이 화장법 따라해보기</button>
    </div>
  </section>

  <!-- ===================== 3. AI DIAGNOSIS CAMERA ===================== -->
  <section id="view-camera" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="home"><i data-icon="chevron-left"></i></button>
      <span>AI 스킨체크</span>
      <button class="icon-btn" data-nav="touchup" aria-label="화장 고치기"><i data-icon="repeat"></i></button>
    </header>

    <div class="camera-stage">
      <div class="camera-avatar"><i data-icon="user"></i></div>
      <span class="tag tag-tl">T존 유분 감지</span>
      <span class="tag tag-br">립 번짐 감지</span>
      <span class="timer-pill" id="cam-timer">00:00 / 00:15</span>
    </div>

    <div class="camera-controls">
      <button class="icon-btn"><i data-icon="photo"></i></button>
      <button class="shutter" id="shutter-btn"></button>
      <button class="icon-btn"><i data-icon="camera-rotate"></i></button>
    </div>
  </section>

  <!-- ===================== 3b. DIAGNOSIS RESULT ===================== -->
  <section id="view-result" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="home"><i data-icon="chevron-left"></i></button>
      <span>진단 결과</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad">
      <div class="compare-row">
        <div class="compare-card">
          <span class="compare-label">오늘 사진</span>
          <div class="thumb"><i data-icon="user"></i>
            <span class="mini-tag mini-tl">T존 유분</span>
            <span class="mini-tag mini-bl">립 번짐</span>
          </div>
        </div>
        <div class="compare-card">
          <span class="compare-label">베스트 메이크업</span>
          <div class="thumb"><i data-icon="user"></i>
            <span class="score-badge">9.8/10</span>
          </div>
        </div>
      </div>

      <div class="info-box">
        <span class="info-title">AI 분석 태그</span>
        <p class="muted">수분감 보통 · 광채 점수 9.2 · 붉은기 낮음</p>
      </div>

      <div class="advice-block">
        <h3>개선 제안</h3>
        <ul>
          <li>T존에 가벼운 파우더로 유분 잡기</li>
          <li>지속력 좋은 매트 립틴트 추천</li>
          <li>번들거리는 부위엔 프라이머 소량 추가</li>
        </ul>
      </div>

      <div class="product-row">
        <div class="product-card"><div class="product-icon"><i data-icon="flask"></i></div><span>이니스프리<br>노세범 파우더</span></div>
        <div class="product-card"><div class="product-icon"><i data-icon="droplet"></i></div><span>페리페라<br>잉크벨벳 #01</span></div>
        <div class="product-card"><div class="product-icon"><i data-icon="bottle"></i></div><span>에뛰드하우스<br>블러 프라이머</span></div>
      </div>

      <button class="btn-secondary btn-block" id="save-look-btn"><i data-icon="bookmark"></i> 오늘 룩 저장하기</button>
      <button class="btn-primary btn-block hidden" id="check-now-btn" data-nav="touchup"><i data-icon="repeat"></i> 지금 상태 비교하기</button>
      <button class="btn-outline btn-block" data-nav="color"><i data-icon="palette"></i> 퍼스널 컬러 진단 보기</button>
      <button class="btn-outline btn-block" data-nav="camera">다시 촬영하기</button>
    </div>
  </section>

  <!-- ===================== 3d. PERSONAL COLOR RESULT ===================== -->
  <section id="view-color" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="home"><i data-icon="chevron-left"></i></button>
      <span>퍼스널 컬러</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad">
      <div class="color-result-card">
        <span class="color-eyebrow">AI 분석 결과</span>
        <h2 class="color-type-name" id="color-type-name">봄 웜톤</h2>
        <p class="color-type-desc" id="color-type-desc">화사하고 밝은 웜톤이에요. 생기 있고 화사한 색이 잘 어울려요.</p>
      </div>

      <div class="color-type-tabs" id="color-type-tabs"></div>

      <div class="palette-section">
        <span class="section-label">나에게 어울리는 컬러</span>
        <div class="palette-row" id="palette-row"></div>
      </div>

      <div class="color-product-section">
        <span class="section-label">이 톤에 맞는 추천 제품</span>
        <div class="product-select-list" id="color-products"></div>
      </div>

      <button class="btn-primary btn-block" id="share-color-btn"><i data-icon="share"></i> 결과 공유하기</button>
    </div>
  </section>

  <!-- ===================== 3e. MAKEUP BATTLE ===================== -->
  <section id="view-battle" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="home"><i data-icon="chevron-left"></i></button>
      <span>화장 배틀</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad">
      <p class="muted center">둘 중 더 잘 어울리는 화장에 투표해주세요</p>

      <div class="battle-stage">
        <button class="battle-card" id="battle-left" data-side="left">
          <div class="battle-avatar"><i data-icon="user"></i></div>
          <span class="battle-name">민지 🇰🇷</span>
          <span class="battle-pct" id="battle-pct-left">52%</span>
        </button>
        <div class="battle-vs">VS</div>
        <button class="battle-card" id="battle-right" data-side="right">
          <div class="battle-avatar"><i data-icon="user"></i></div>
          <span class="battle-name">Sakura 🇯🇵</span>
          <span class="battle-pct" id="battle-pct-right">48%</span>
        </button>
      </div>

      <div class="battle-bar">
        <div class="battle-bar-fill" id="battle-bar-fill" style="width:52%"></div>
      </div>
      <p class="muted center small" id="battle-vote-count">1,204명 참여</p>

      <button class="btn-outline btn-block" id="battle-next-btn"><i data-icon="repeat"></i> 다음 배틀 보기</button>
      <button class="btn-outline btn-block" id="battle-share-btn"><i data-icon="share"></i> 이 배틀 공유하기</button>
      <button class="btn-primary btn-block" id="battle-upload-btn"><i data-icon="camera"></i> 내 화장으로 배틀 만들기</button>
    </div>
  </section>

  <!-- ===================== 3f. INGREDIENT SCANNER ===================== -->
  <section id="view-scanner" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="home"><i data-icon="chevron-left"></i></button>
      <span>성분 스캐너</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad">
      <div class="scanner-stage" id="scanner-stage">
        <i data-icon="scan" class="scanner-icon"></i>
        <p class="muted center">성분표나 바코드를 사각형 안에 맞춰주세요</p>
        <div class="scanner-frame"></div>
      </div>
      <button class="btn-primary btn-block" id="scan-btn"><i data-icon="camera"></i> 스캔하기</button>

      <div class="scanner-result hidden" id="scanner-result">
        <div class="scan-score-card">
          <span class="scan-score-num">78</span>
          <span class="scan-score-label">내 피부 궁합 점수</span>
        </div>
        <div class="ingredient-list">
          <div class="ingredient-row good">
            <i data-icon="check"></i>
            <div><strong>나이아신아마이드</strong><span>미백·진정에 도움, 내 피부 타입에 적합</span></div>
          </div>
          <div class="ingredient-row good">
            <i data-icon="check"></i>
            <div><strong>히알루론산</strong><span>수분 보충, 모든 피부 타입에 안전</span></div>
          </div>
          <div class="ingredient-row caution">
            <i data-icon="alert"></i>
            <div><strong>향료(Fragrance)</strong><span>민감성 피부는 자극 가능성 있음, 소량 테스트 권장</span></div>
          </div>
        </div>
        <button class="btn-outline btn-block" id="scan-again-btn">다시 스캔하기</button>
      </div>
    </div>
  </section>

  <!-- ===================== 3g. WEEKLY RANKING ===================== -->
  <section id="view-ranking" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="home"><i data-icon="chevron-left"></i></button>
      <span>주간 랭킹</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad">
      <div class="rank-tabs">
        <button class="rank-tab active" data-rank="look">인기 룩</button>
        <button class="rank-tab" data-rank="creator">크리에이터</button>
      </div>
      <div class="rank-list" id="rank-list"></div>
    </div>
  </section>

  <!-- ===================== 3h. WISHLIST ===================== -->
  <section id="view-wishlist" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="home"><i data-icon="chevron-left"></i></button>
      <span>위시리스트</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad">
      <p class="muted center" id="wishlist-empty-msg">아직 담은 제품이 없어요</p>
      <div class="product-select-list" id="wishlist-list"></div>
    </div>
  </section>

  <!-- ===================== 3c. TOUCH-UP CHECK ===================== -->
  <section id="view-touchup" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="home"><i data-icon="chevron-left"></i></button>
      <span>리터치 체크</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad">
      <p class="muted center" id="touchup-time">오전 9:12에 저장한 룩과 비교했어요</p>

      <div class="compare-row">
        <div class="compare-card">
          <span class="compare-label"><i data-icon="star"></i> 오전 저장 룩</span>
          <div class="thumb"><i data-icon="user"></i></div>
        </div>
        <div class="compare-card">
          <span class="compare-label">지금</span>
          <div class="thumb"><i data-icon="user"></i>
            <span class="mini-tag mini-tl danger">유분 증가</span>
            <span class="mini-tag mini-bl danger">립 지워짐</span>
          </div>
        </div>
      </div>

      <div class="info-box">
        <span class="info-title">일치율</span>
        <div class="progress"><div class="progress-fill" style="width:64%"></div></div>
        <span class="progress-num">64%</span>
      </div>

      <div class="advice-block">
        <h3>오전 룩으로 되돌리려면</h3>
        <ul>
          <li>T존에 블로팅 티슈로 유분 제거 후 파우더 덧바르기</li>
          <li>지워진 립 라인 위에 같은 컬러로 다시 덧바르기</li>
          <li class="muted-item">볼 홍조는 아직 유지되고 있어요</li>
        </ul>
      </div>

      <button class="btn-primary btn-block" data-nav="camera">고친 후 다시 체크하기</button>
    </div>
  </section>

  <!-- ===================== 4. VIRTUAL BEAUTY LAB ===================== -->
  <section id="view-lab" class="view">
    <header class="sub-header">
      <span></span>
      <span>AI 뷰티랩</span>
      <span class="ticket-pill"><i data-icon="ticket"></i> 티켓 1장</span>
    </header>

    <div class="scroll-pad">
      <div class="lab-stage">
        <div class="lab-avatar" id="lab-avatar"><i data-icon="user"></i></div>
        <span class="applying-pill" id="applying-pill">가상 적용 중</span>
      </div>

      <div class="search-box">
        <i data-icon="search"></i>
        <input class="search-input" id="lab-search" placeholder="제품명으로 검색 (예: 쿠션, 틴트, 세럼)">
      </div>

      <div class="product-select-list" id="lab-products"></div>

      <button class="btn-primary btn-block hidden" id="buy-selected-btn">이 제품 구매하러 가기</button>
      <button class="btn-outline btn-block" id="try-selected-btn">발라보기</button>
      <p class="muted center small">포인트 320P 보유 · 체험권 1장 500P</p>
    </div>
  </section>

  <!-- ===================== 5. PREMIUM CHECKOUT ===================== -->
  <section id="view-checkout" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="lab"><i data-icon="chevron-left"></i></button>
      <span>프리미엄 구독</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad">
      <div class="crown-badge"><i data-icon="crown"></i></div>
      <h2 class="center">고운 프리미엄</h2>
      <p class="muted center">전 제품 무제한 가상 체험</p>

      <div class="plan-row">
        <button class="plan-card active" data-plan="monthly">
          <span class="plan-name">월간</span>
          <span class="plan-price">$4.99</span>
          <span class="plan-unit">/ month</span>
        </button>
        <button class="plan-card" data-plan="yearly">
          <span class="plan-badge">33% 할인</span>
          <span class="plan-name">연간</span>
          <span class="plan-price">$39.99</span>
          <span class="plan-unit">/ year</span>
        </button>
      </div>

      <div class="pay-box">
        <span class="section-label">결제 수단</span>
        <div class="pay-input"><i data-icon="credit-card"></i> 카드 번호 입력</div>
        <p class="secure-note"><i data-icon="lock"></i> Stripe로 안전하게 결제됩니다</p>
      </div>

      <button class="btn-primary btn-block" id="subscribe-btn">구독 시작하기</button>
      <p class="muted center small">언제든 해지 가능 · 앱스토어 수수료 없음</p>
    </div>
  </section>

  <!-- ===================== 6. MY PAGE ===================== -->
  <section id="view-mypage" class="view">
    <header class="sub-header">
      <span></span>
      <span>마이페이지</span>
      <button class="icon-btn" id="logout-btn" aria-label="로그아웃"><i data-icon="log-out"></i></button>
    </header>

    <div class="scroll-pad">
      <div class="profile-row">
        <div class="avatar-circle">민지</div>
        <div>
          <p class="profile-name" id="profile-user-name">민지 <span>🇰🇷</span></p>
          <p class="muted small" id="profile-user-email">뷰티 크리에이터</p>
        </div>
        <span class="tier-badge tier-power"><i data-icon="star"></i> 파워 크리에이터</span>
      </div>

      <div class="tier-progress-card">
        <div class="tier-progress-top">
          <span>파워 크리에이터 · 수수료 45%</span>
          <span class="muted small">앰버서더까지 2,400P</span>
        </div>
        <div class="progress"><div class="progress-fill tier-fill" style="width:68%"></div></div>
        <div class="tier-levels">
          <span>일반 30%</span>
          <span class="current">파워 45%</span>
          <span>앰버서더 50%+</span>
        </div>
      </div>

      <div class="points-card">
        <span class="muted small">이번 달 적립 포인트</span>
        <p class="points-num">42,300P</p>
        <div class="points-actions">
          <button class="btn-primary">현금 전환</button>
          <button class="btn-outline">기프티콘 교환</button>
        </div>
      </div>

      <h3 class="section-title">포인트 내역</h3>
      <div class="history-list">
        <div class="history-row">
          <span><i data-icon="shopping-bag"></i> 영상 내 제품 구매 적립</span>
          <span class="plus">+1,200P</span>
        </div>
        <div class="history-row">
          <span><i data-icon="user-plus"></i> 친구 초대 보너스</span>
          <span class="plus">+500P</span>
        </div>
        <div class="history-row">
          <span><i data-icon="flask"></i> 체험권 구매 사용</span>
          <span class="minus">-500P</span>
        </div>
      </div>

      <button class="advertiser-link" data-nav="adinquiry">
        <span>광고주이신가요?</span>
        <span class="advertiser-link-cta">광고 문의하기 <i data-icon="chevron-right"></i></span>
      </button>
    </div>
  </section>

  <!-- ===================== AD INQUIRY ===================== -->
  <section id="view-adinquiry" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="mypage"><i data-icon="chevron-left"></i></button>
      <span>광고 문의</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad" id="adinquiry-form-wrap">
      <p class="muted" style="margin-bottom:16px;">고운의 유저에게 브랜드를 알려보세요. 문의 남겨주시면 검토 후 24시간 내 연락드려요.</p>

      <div class="ad-field-group">
        <label class="ad-label">브랜드/회사명</label>
        <input class="login-input" id="ad-company" placeholder="예: 이니스프리">
      </div>
      <div class="ad-field-group">
        <label class="ad-label">담당자 연락처</label>
        <input class="login-input" id="ad-contact" placeholder="이메일 또는 전화번호">
      </div>
      <div class="ad-field-group">
        <label class="ad-label">희망 광고 지면</label>
        <div class="ad-option-grid">
          <button class="ad-option active" data-slot="feed">피드 스폰서 영상</button>
          <button class="ad-option" data-slot="hero">히어로 배너</button>
          <button class="ad-option" data-slot="lab">뷰티랩 프리미엄 노출</button>
          <button class="ad-option" data-slot="rank">주간 랭킹 배너</button>
        </div>
      </div>
      <div class="ad-field-group">
        <label class="ad-label">희망 게재 기간</label>
        <div class="ad-option-grid">
          <button class="ad-option active" data-dur="7">1주</button>
          <button class="ad-option" data-dur="14">2주</button>
          <button class="ad-option" data-dur="30">1개월</button>
        </div>
      </div>
      <div class="ad-price-preview" id="ad-price-preview">
        예상 광고비 <strong id="ad-price-num">500,000원</strong> <span class="muted small">(VAT 별도, 세금계산서 발행)</span>
      </div>
      <div class="ad-field-group">
        <label class="ad-label">전달하고 싶은 메시지</label>
        <textarea class="login-input ad-textarea" id="ad-message" placeholder="캠페인 목적, 소재 준비 여부 등 자유롭게 적어주세요"></textarea>
      </div>

      <button class="btn-primary btn-block" id="ad-submit-btn">문의 보내기</button>
    </div>

    <div class="scroll-pad hidden" id="adinquiry-success">
      <div class="ad-success-icon"><i data-icon="check"></i></div>
      <h3 class="center">문의가 접수됐어요</h3>
      <p class="muted center">24시간 내 담당자가 연락드려요.<br>승인되면 아래에서 바로 광고를 등록하실 수 있어요.</p>
      <div class="ad-status-card">
        <span class="ad-status-badge pending" id="ad-status-badge">검토 중</span>
        <span class="muted small">보통 24시간 이내 승인 여부를 안내해드려요</span>
      </div>
      <button class="btn-outline btn-block" id="ad-simulate-approve-btn">(데모) 승인 완료 후 등록해보기</button>
    </div>
  </section>

  <!-- ===================== PREMIUM AD SELF-SERVE ===================== -->
  <section id="view-admanage" class="view">
    <header class="sub-header">
      <button class="icon-btn" data-nav="mypage"><i data-icon="chevron-left"></i></button>
      <span>프리미엄 광고 등록</span>
      <span class="spacer"></span>
    </header>

    <div class="scroll-pad">
      <div class="ad-approved-badge"><i data-icon="check"></i> 승인 완료 · 광고 등록이 가능해요</div>

      <div class="ad-upload-box">
        <i data-icon="photo"></i>
        <span>광고 소재 업로드</span>
        <span class="muted small">권장 비율 9:16, 최대 50MB</span>
      </div>

      <div class="ad-field-group">
        <label class="ad-label">광고 문구 (헤드라인)</label>
        <input class="login-input" id="ad-headline" placeholder="예: 지금 이니스프리 신제품 만나보세요">
      </div>

      <div class="ad-field-group">
        <label class="ad-label">노출 지면</label>
        <div class="ad-option-grid">
          <button class="ad-option active" data-slot2="feed">피드 스폰서 영상</button>
          <button class="ad-option" data-slot2="hero">히어로 배너</button>
          <button class="ad-option" data-slot2="lab">뷰티랩 프리미엄 노출</button>
          <button class="ad-option" data-slot2="rank">주간 랭킹 배너</button>
        </div>
      </div>

      <div class="ad-field-group">
        <label class="ad-label">게재 기간</label>
        <div class="ad-option-grid">
          <button class="ad-option active" data-dur2="7">1주</button>
          <button class="ad-option" data-dur2="14">2주</button>
          <button class="ad-option" data-dur2="30">1개월</button>
        </div>
      </div>

      <div class="ad-price-preview">
        결제 금액 <strong id="ad-price-num2">500,000원</strong> <span class="muted small">(VAT 별도)</span>
      </div>

      <button class="btn-primary btn-block" id="ad-pay-btn"><i data-icon="credit-card"></i> 결제하고 게재하기</button>
    </div>
  </section>

  <!-- ===================== PREMIUM LOCK MODAL ===================== -->
  <div id="lock-modal" class="modal-backdrop">
    <div class="modal-card">
      <div class="modal-lock"><i data-icon="lock"></i></div>
      <h3>오늘의 체험 완료</h3>
      <p class="muted">오늘 발라본 룩, 마음에 드셨나요?<br>프리미엄으로 1,000여 개 제품을<br>무제한으로 조합해볼 수 있어요.</p>
      <div class="modal-compare">
        <div><span class="modal-num">1개</span><span class="muted small">무료 컬러</span></div>
        <div class="modal-divider"></div>
        <div><span class="modal-num accent">1,000개+</span><span class="muted small">프리미엄</span></div>
      </div>
      <button class="btn-primary btn-block" data-nav="checkout" id="modal-upgrade">프리미엄 시작하기</button>
      <button class="btn-text btn-block" id="modal-dismiss">내일 다시 올게요</button>
    </div>
  </div>

  <!-- ===================== SUBSCRIBE SUCCESS TOAST ===================== -->
  <div id="toast" class="toast"><i data-icon="check"></i><span id="toast-text">완료되었어요</span></div>

  <!-- ===================== BOTTOM NAV ===================== -->
  <nav id="bottom-nav" class="bottom-nav">
    <button class="nav-btn active" data-nav="home"><i data-icon="home"></i><span>홈</span></button>
    <button class="nav-btn" data-nav="camera"><i data-icon="camera"></i><span>스킨체크</span></button>
    <button class="nav-btn" data-nav="lab"><i data-icon="sparkles"></i><span>뷰티랩</span></button>
    <button class="nav-btn" data-nav="mypage"><i data-icon="user"></i><span>마이</span></button>
  </nav>

`;
