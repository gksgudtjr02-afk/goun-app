import { startCameraPreview, stopStream, capturePhotoWithMakeup } from './virtualTryOn';

/* ---------- Icon system: inline SVG, no external font dependency ---------- */
const ICONS = {
  'map-pin':'<path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
  'language':'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>',
  'search':'<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
  'x':'<path d="M18 6L6 18M6 6l12 12"/>',
  'user':'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'heart':'<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.6z"/>',
  'message-circle':'<path d="M21 11.5a8.38 8.38 0 01-9.5 8.3 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 018-8.5h.5a8.48 8.48 0 018 8v.5z"/>',
  'shopping-bag':'<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/>',
  'shopping-cart':'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/>',
  'wand':'<path d="M4 20L20 4"/><path d="M15 4l1.5 1.5M18.5 7.5L20 9M9 4l1.5 1.5M4 15l1.5 1.5"/>',
  'chevron-left':'<path d="M15 18l-6-6 6-6"/>',
  'chevron-right':'<path d="M9 18l6-6-6-6"/>',
  'photo':'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  'camera-rotate':'<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="3.5"/>',
  'bookmark':'<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>',
  'star':'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/>',
  'ticket':'<path d="M2 9a2 2 0 012-2h16a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 000-4z"/>',
  'lock':'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  'sparkles':'<path d="M12 2l1.6 4.9L18 8.5l-4.4 1.6L12 15l-1.6-4.9L6 8.5l4.4-1.6z"/><path d="M19 15l.7 2.1 2.1.7-2.1.9-.7 2.1-.7-2.1-2.1-.9 2.1-.7z"/>',
  'crown':'<path d="M2 20h20M4 20l-1.2-9 5.2 4 4-7 4 7 5.2-4L19 20"/>',
  'credit-card':'<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  'home':'<path d="M3 12l9-9 9 9"/><path d="M9 21V12h6v9"/>',
  'camera':'<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
  'check':'<path d="M20 6L9 17l-5-5"/>',
  'flask':'<path d="M9 2v6L4.5 18a2 2 0 001.8 3h11.4a2 2 0 001.8-3L15 8V2"/><path d="M9 2h6"/>',
  'droplet':'<path d="M12 2s7 8 7 13a7 7 0 01-14 0c0-5 7-13 7-13z"/>',
  'bottle':'<rect x="7" y="4" width="10" height="17" rx="2"/><path d="M7 9h10"/>',
  'user-plus':'<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  'flame':'<path d="M12 2c-3 5-6 7-6 11a6 6 0 0012 0c0-2-1-3-2-5 0 2-1 3-2 3 0-3-1-5-2-9z"/>',
  'repeat':'<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>',
  'tag':'<path d="M20.6 12.6L12 21.2l-9.2-9.2V3h9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  'palette':'<circle cx="13.5" cy="6.5" r="1.2"/><circle cx="17.5" cy="10.5" r="1.2"/><circle cx="8.5" cy="7.5" r="1.2"/><circle cx="6.5" cy="12.5" r="1.2"/><path d="M12 2a10 10 0 000 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a5 5 0 005-5c0-4.4-4.5-8-10-8z"/>',
  'swords':'<path d="M5 3l6 6M19 3l-6 6M3 21l6-6M21 21l-6-6"/><path d="M9 9l-6 6M15 9l6 6"/>',
  'share':'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-3.9M8.6 13.5l6.8 3.9"/>',
  'mail':'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  'cloud':'<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>',
  'scan':'<path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/>',
  'trophy':'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0z"/><path d="M17 5h3a2 2 0 01-2 4M7 5H4a2 2 0 002 4"/>',
  'alert':'<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>',
  'log-out':'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  'eye':'<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>'
};

/* ---------- Feed data: loaded from Supabase, with a mock fallback ---------- */
let FEED = [];
const FEED_FALLBACK = [
  {flag:'🇰🇷', name:'민지', likes:'12.4k', cat:'base', caption:'"이 쿠션 하나로 끝! 완전 강추"'},
  {flag:'🇺🇸', name:'Taylor', likes:'8.1k', cat:'lip', caption:'"이 립 컬러 완전 내 스타일"'},
  {flag:'🇯🇵', name:'Sakura', likes:'21.7k', cat:'skin', hot:true, caption:'"세럼 하나로 광채 피부 완성"'},
  {flag:'🇻🇳', name:'Linh', likes:'5.6k', cat:'base', caption:'"베이스 커버력 실화냐"'},
  {flag:'🇰🇷', name:'하은', likes:'3.2k', cat:'lip', caption:'"틴트 발색 미쳤어요"'},
  {flag:'🇩🇪', name:'Anna', likes:'9.9k', cat:'skin', caption:'"수분 폭탄 스킨케어 루틴"'},
];

const LAB_PRODUCTS_FALLBACK = [
  {brand:'페리페라', name:'잉크벨벳 #01 코랄', price:'12,000원', color:'#D4537E', type:'lip', locked:false},
  {brand:'클리오', name:'러스터 립 틴트', price:'15,000원', color:'#E0997B', type:'lip', locked:false},
  {brand:'에뛰드', name:'드로잉 틴트 브라운', price:'9,900원', color:'#B54848', type:'lip', locked:false},
  {brand:'롬앤', name:'쥬시 래스팅 틴트', price:'10,800원', color:'#C64E6B', type:'lip', locked:true},
  {brand:'3CE', name:'벨벳 립 틴트', price:'19,000원', color:'#7A2E3A', type:'lip', locked:true},
  {brand:'이니스프리', name:'노세범 쿠션', price:'18,000원', color:'#E8C9A8', type:'base', locked:true},
  {brand:'페리페라', name:'글리터 아이 섀도우 브론즈', price:'11,000원', color:'#B87B4A', type:'eye', locked:false},
  {brand:'클리오', name:'프로 아이 팔레트 코랄', price:'22,000원', color:'#D98E6B', type:'eye', locked:true},
  {brand:'에뛰드', name:'플레이 컬러 아이즈 브라운', price:'13,500원', color:'#8C5A3C', type:'eye', locked:true},
  {brand:'롬앤', name:'글래스팅 워터 블러셔 코랄', price:'9,500원', color:'#F0879C', type:'blush', locked:false},
  {brand:'에뛰드', name:'블러셔 포켓 피치', price:'8,500원', color:'#F4A08C', type:'blush', locked:true},
  {brand:'이니스프리', name:'미네랄 블러셔 로즈', price:'12,000원', color:'#E58BA0', type:'blush', locked:true},
];
let LAB_PRODUCTS = LAB_PRODUCTS_FALLBACK;
const TYPE_ICON = { lip:'droplet', base:'flask', skin:'bottle', eye:'eye', blush:'sparkles' };

// Curated multi-product combos (lip+eye+blush at once). Named by style, not by a
// real person, to avoid using anyone's likeness without their consent.
const LOOK_PRESETS = [
  {
    id: 'daily-clean',
    name: '청순 데일리 룩',
    desc: '자연스러운 코랄 립 + 웜톤 아이 + 은은한 블러셔',
    products: {
      lip: { type:'lip', color:'#E0997B', brand:'고운 룩', name:'청순 데일리 립' },
      eye: { type:'eye', color:'#B87B4A', brand:'고운 룩', name:'청순 데일리 아이' },
      blush: { type:'blush', color:'#F4A08C', brand:'고운 룩', name:'청순 데일리 블러셔' },
    },
  },
  {
    id: 'glossy-pink',
    name: '글로시 핑크 룩',
    desc: '생기 있는 핑크 립 + 펄 아이 + 화사한 블러셔',
    products: {
      lip: { type:'lip', color:'#D4537E', brand:'고운 룩', name:'글로시 핑크 립' },
      eye: { type:'eye', color:'#D98E6B', brand:'고운 룩', name:'글로시 핑크 아이' },
      blush: { type:'blush', color:'#F0879C', brand:'고운 룩', name:'글로시 핑크 블러셔' },
    },
  },
  {
    id: 'warm-brown',
    name: '웜톤 브라운 룩',
    desc: '차분한 브라운 립 + 스모키 아이 + 로즈 블러셔',
    products: {
      lip: { type:'lip', color:'#7A2E3A', brand:'고운 룩', name:'웜톤 브라운 립' },
      eye: { type:'eye', color:'#8C5A3C', brand:'고운 룩', name:'웜톤 브라운 아이' },
      blush: { type:'blush', color:'#E58BA0', brand:'고운 룩', name:'웜톤 브라운 블러셔' },
    },
  },
];

const COLOR_TYPES = {
  spring:{ label:'봄 웜톤', desc:'화사하고 밝은 웜톤이에요. 생기 있고 화사한 색이 잘 어울려요.', palette:['#FF9F6B','#FFD166','#FFB4A2','#F4A259','#FFE29A'] },
  summer:{ label:'여름 쿨톤', desc:'부드럽고 차분한 쿨톤이에요. 은은하고 파스텔한 색이 잘 어울려요.', palette:['#F2A6C1','#C9B6E4','#A9C6E8','#E8C4D8','#B8D8D8'] },
  autumn:{ label:'가을 웜톤', desc:'깊고 진한 웜톤이에요. 차분하고 중후한 색이 잘 어울려요.', palette:['#B5651D','#8A5A44','#C97B3D','#6B5B3A','#A9744F'] },
  winter:{ label:'겨울 쿨톤', desc:'선명하고 강한 쿨톤이에요. 또렷하고 대비감 있는 색이 잘 어울려요.', palette:['#C0163E','#1B1B3A','#5D2E8C','#0F5C8C','#E5006D'] },
};

const RANK_LOOKS_FALLBACK = [
  {rank:1, flag:'🇯🇵', name:'Sakura', likes:'21.7k', title:'광채 스킨케어 루틴'},
  {rank:2, flag:'🇰🇷', name:'민지', likes:'12.4k', title:'코랄 쿠션 메이크업'},
  {rank:3, flag:'🇺🇸', name:'Taylor', likes:'8.1k', title:'데일리 립 컬러'},
  {rank:4, flag:'🇩🇪', name:'Anna', likes:'6.3k', title:'수분 폭탄 루틴'},
  {rank:5, flag:'🇻🇳', name:'Linh', likes:'5.6k', title:'커버력 베이스 메이크업'},
];
const RANK_CREATORS_FALLBACK = [
  {rank:1, flag:'🇯🇵', name:'Sakura', likes:'포인트 8.2만', title:'파워 크리에이터'},
  {rank:2, flag:'🇰🇷', name:'민지', likes:'포인트 4.2만', title:'파워 크리에이터'},
  {rank:3, flag:'🇺🇸', name:'Taylor', likes:'포인트 3.1만', title:'일반 크리에이터'},
];
let RANK_LOOKS = RANK_LOOKS_FALLBACK;
let RANK_CREATORS = RANK_CREATORS_FALLBACK;

const AD_BASE_PRICE = { feed: 700000, hero: 500000, lab: 300000, rank: 200000 };
const AD_DURATION_MULT = { 7: 1, 14: 1.8, 30: 3.2 };

/**
 * Boots the whole GOUN prototype UI + wires real Supabase auth for
 * login / signup / logout / OAuth. Runs once against the DOM injected by
 * <GounApp>; guarded so React 18 dev-mode double-invoke doesn't
 * double-register listeners.
 */
export function initGounApp(root, supabase) {
  if (!root || root.dataset.gounInit) return () => {};
  root.dataset.gounInit = '1';

  // Capture ?ref=<uuid> from an invite link before it's lost to navigation;
  // applied to the new profile's referred_by once the user actually signs up.
  try {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && /^[0-9a-f-]{36}$/i.test(ref)) {
      localStorage.setItem('goun_ref', ref);
    }
  } catch {}

  function paintIcons(scope = document) {
    scope.querySelectorAll('[data-icon]').forEach(el => {
      const body = ICONS[el.getAttribute('data-icon')];
      if (!body) return;
      el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
    });
  }

  function renderGrid(filter = 'all', keyword = '') {
    const grid = document.getElementById('feed-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const q = keyword.trim().toLowerCase();
    const filtered = FEED.filter(v =>
      (filter === 'all' || v.cat === filter) &&
      (!q || v.name.toLowerCase().includes(q) || v.caption.toLowerCase().includes(q))
    );
    if (filtered.length === 0) {
      grid.innerHTML = '<p class="muted center feed-empty">검색 결과가 없어요</p>';
      return;
    }
    filtered.forEach(v => {
      const item = document.createElement('div');
      item.className = 'grid-item';
      item.innerHTML = `
        <div class="thumb-fill" data-icon="user"></div>
        <span class="grid-flag">${v.flag}</span>
        ${v.hot ? '<span class="grid-badge">인기</span>' : ''}
        <span class="grid-like"><span data-icon="heart"></span> ${v.likes}</span>
      `;
      item.addEventListener('click', () => openPlayer(v));
      grid.appendChild(item);
    });
    paintIcons(grid);
  }

  async function loadFeed() {
    const { data, error } = await supabase
      .from('feed_items')
      .select('flag, name, likes, cat, hot, caption')
      .order('created_at', { ascending: false });
    FEED = (!error && data && data.length) ? data : FEED_FALLBACK;
    const activeFilter = document.querySelector('.chip.active')?.getAttribute('data-filter') || 'all';
    renderGrid(activeFilter, document.getElementById('feed-search-input')?.value || '');
  }

  /* ---------- Navigation ---------- */
  function goTo(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + id)?.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const navBtn = document.querySelector(`.nav-btn[data-nav="${id}"]`);
    if (navBtn) navBtn.classList.add('active');
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = ['home', 'camera', 'lab', 'mypage'].includes(id) ? 'flex' : 'none';
    }
    window.scrollTo(0, 0);
  }

  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => goTo(el.getAttribute('data-nav')));
  });

  /* ---------- Onboarding flag carousel ---------- */
  const flags = document.querySelectorAll('.flag');
  let flagIdx = 0;
  const flagInterval = setInterval(() => {
    flags.forEach(f => f.classList.remove('active'));
    if (flags.length) flags[flagIdx % flags.length].classList.add('active');
    flagIdx++;
  }, 900);
  document.getElementById('btn-enter')?.addEventListener('click', () => goTo('login'));

  /* ---------- Chip filter ---------- */
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderGrid(chip.getAttribute('data-filter'), document.getElementById('feed-search-input')?.value || '');
    });
  });

  /* ---------- Feed search ---------- */
  const feedSearchBox = document.getElementById('feed-search-box');
  const feedSearchInput = document.getElementById('feed-search-input');
  document.getElementById('feed-search-toggle')?.addEventListener('click', () => {
    const isHidden = feedSearchBox.classList.contains('hidden');
    if (isHidden) {
      feedSearchBox.classList.remove('hidden');
      feedSearchInput.focus();
    } else {
      feedSearchBox.classList.add('hidden');
      feedSearchInput.value = '';
      const activeFilter = document.querySelector('.chip.active')?.getAttribute('data-filter') || 'all';
      renderGrid(activeFilter);
    }
  });
  feedSearchInput?.addEventListener('input', () => {
    const activeFilter = document.querySelector('.chip.active')?.getAttribute('data-filter') || 'all';
    renderGrid(activeFilter, feedSearchInput.value);
  });

  /* ---------- Player ---------- */
  let currentVideo = null;
  function openPlayer(v) {
    currentVideo = v;
    document.getElementById('player-flag').textContent = v.flag;
    document.getElementById('player-name').textContent = v.name;
    document.getElementById('player-caption').textContent = v.caption;
    document.getElementById('like-count').textContent = v.likes;
    document.getElementById('like-btn').classList.remove('liked');
    goTo('player');
  }
  document.getElementById('player-close')?.addEventListener('click', () => goTo('home'));
  document.getElementById('like-btn')?.addEventListener('click', function () {
    this.classList.toggle('liked');
  });
  document.getElementById('try-look-btn')?.addEventListener('click', () => {
    showToast('이 룩의 컬러를 가상 연구소에 불러왔어요');
    goTo('lab');
  });

  /* ---------- Camera & diagnosis ---------- */
  document.getElementById('shutter-btn')?.addEventListener('click', function () {
    let t = 0;
    const timer = document.getElementById('cam-timer');
    this.disabled = true;
    const interval = setInterval(() => {
      t++;
      timer.textContent = `00:0${t} / 00:15`;
      if (t >= 3) {
        clearInterval(interval);
        this.disabled = false;
        timer.textContent = '00:00 / 00:15';
        goTo('result');
      }
    }, 250);
  });
  document.getElementById('save-look-btn')?.addEventListener('click', function () {
    showToast('오늘 룩을 저장했어요. 오후에 비교해보세요!');
    this.classList.add('hidden');
    document.getElementById('check-now-btn').classList.remove('hidden');
  });

  /* ---------- Virtual Lab: product search & select ---------- */
  let selectedProducts = {}; // type -> product, so lip+eye+blush can be combined
  let tryOnStream = null;
  let tryOnProducts = [];

  function showTryOnLive() {
    document.getElementById('tryon-video')?.classList.remove('hidden');
    document.getElementById('tryon-result')?.classList.add('hidden');
    document.getElementById('tryon-shutter-wrap')?.classList.remove('hidden');
    document.getElementById('tryon-result-actions')?.classList.add('hidden');
  }

  async function closeTryOn() {
    document.getElementById('tryon-modal')?.classList.remove('show');
    stopStream(tryOnStream);
    tryOnStream = null;
    tryOnProducts = [];
    showTryOnLive();
  }

  async function openTryOn(products) {
    const modal = document.getElementById('tryon-modal');
    const video = document.getElementById('tryon-video');
    const statusEl = document.getElementById('tryon-status');
    const pill = document.getElementById('tryon-product-pill');
    if (!modal || !video) return;

    tryOnProducts = products;
    pill.textContent = products.length === 1
      ? `${products[0].brand} · ${products[0].name}`
      : `${products.length}개 제품 동시 적용`;
    statusEl.textContent = '카메라를 준비하고 있어요...';
    statusEl.classList.remove('error');
    showTryOnLive();
    modal.classList.add('show');

    if (!navigator.mediaDevices?.getUserMedia) {
      statusEl.textContent = '이 브라우저는 카메라를 지원하지 않아요';
      statusEl.classList.add('error');
      return;
    }

    try {
      tryOnStream = await startCameraPreview(video);
      statusEl.textContent = '얼굴이 잘 보이게 맞추고 촬영 버튼을 눌러주세요';
    } catch (err) {
      console.error('[tryon] camera-error', err);
      statusEl.textContent = '카메라를 사용할 수 없어요. 브라우저 설정에서 카메라 권한을 허용해주세요';
      statusEl.classList.add('error');
    }
  }

  document.getElementById('tryon-close-btn')?.addEventListener('click', closeTryOn);

  document.getElementById('tryon-shutter-btn')?.addEventListener('click', async () => {
    const video = document.getElementById('tryon-video');
    const resultCanvas = document.getElementById('tryon-result');
    const statusEl = document.getElementById('tryon-status');
    if (!video || !resultCanvas || !tryOnProducts.length) return;

    statusEl.textContent = 'AI가 화장을 입히고 있어요...';
    statusEl.classList.remove('error');
    try {
      const { canvas, faceFound } = await capturePhotoWithMakeup(video, tryOnProducts);
      resultCanvas.width = canvas.width;
      resultCanvas.height = canvas.height;
      resultCanvas.getContext('2d').drawImage(canvas, 0, 0);

      document.getElementById('tryon-video')?.classList.add('hidden');
      resultCanvas.classList.remove('hidden');
      document.getElementById('tryon-shutter-wrap')?.classList.add('hidden');
      document.getElementById('tryon-result-actions')?.classList.remove('hidden');
      statusEl.textContent = faceFound ? '' : '얼굴을 못 찾았어요. 다시 찍어주세요';
      statusEl.classList.toggle('error', !faceFound);
    } catch (err) {
      console.error('[tryon] capture-error', err);
      statusEl.textContent = 'AI 모델을 불러오지 못했어요. 인터넷 연결을 확인하고 다시 시도해주세요';
      statusEl.classList.add('error');
    }
  });

  document.getElementById('tryon-retake-btn')?.addEventListener('click', () => {
    showTryOnLive();
    document.getElementById('tryon-status').textContent = '얼굴이 잘 보이게 맞추고 촬영 버튼을 눌러주세요';
    document.getElementById('tryon-status').classList.remove('error');
  });

  async function loadProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('brand, name, price, color, type, locked')
      .order('created_at', { ascending: true });
    LAB_PRODUCTS = (!error && data && data.length) ? data : LAB_PRODUCTS_FALLBACK;
    renderLabProducts(document.getElementById('lab-search')?.value || '');
    renderColorResult(currentColorType);
  }

  let labTypeFilter = 'all';

  function renderLabProducts(keyword = '') {
    const list = document.getElementById('lab-products');
    if (!list) return;
    list.innerHTML = '';
    const filtered = LAB_PRODUCTS.filter(p =>
      (labTypeFilter === 'all' || p.type === labTypeFilter) &&
      (p.brand + p.name).toLowerCase().includes(keyword.toLowerCase())
    );
    filtered.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'product-item' + (p.locked ? ' locked' : '');
      btn.dataset.name = p.name;
      const inWishlist = wishlist.some(w => w.name === p.name);
      btn.innerHTML = `
        <span class="product-thumb" style="background:linear-gradient(145deg, ${p.color}, ${p.color}cc)">
          <span data-icon="${TYPE_ICON[p.type] || 'flask'}"></span>
          <span class="product-color-dot" style="background:${p.color}"></span>
        </span>
        <span class="product-info">
          <span class="product-brand">${p.brand}</span><br>
          <span class="product-name">${p.name}</span><br>
          <span class="product-price">${p.price}</span>
        </span>
        <span class="wish-heart ${inWishlist ? 'active' : ''}" data-icon="heart"></span>
        ${p.locked ? '<span class="lock-icon" data-icon="lock"></span>' : '<span class="check-icon" data-icon="check" style="visibility:hidden"></span>'}
      `;
      btn.addEventListener('click', () => selectLabProduct(p, btn));
      const heart = btn.querySelector('.wish-heart');
      heart.addEventListener('click', async e => {
        e.stopPropagation();
        if (!currentUserId) { showToast('로그인 후 이용해주세요'); return; }
        const inList = wishlist.some(w => w.name === p.name);
        heart.classList.toggle('active', !inList);
        if (inList) await removeFromWishlist(p.name);
        else await addToWishlist(p);
      });
      list.appendChild(btn);
    });
    paintIcons(list);
    syncLabSelectionUI();
  }

  function syncLabSelectionUI() {
    const selectedNames = new Set(Object.values(selectedProducts).map(p => p.name));
    document.querySelectorAll('#lab-products .product-item').forEach(el => {
      const isSelected = selectedNames.has(el.dataset.name);
      el.classList.toggle('selected', isSelected);
      const chk = el.querySelector('.check-icon');
      if (chk) chk.style.visibility = isSelected ? 'visible' : 'hidden';
    });
    const count = Object.keys(selectedProducts).length;
    document.getElementById('buy-selected-btn').classList.toggle('hidden', count === 0);
    const tryBtn = document.getElementById('try-selected-btn');
    tryBtn.innerHTML = `<i data-icon="camera"></i> ${count > 1 ? `발라보기 (${count}개 동시 적용)` : '발라보기 (카메라 켜기)'}`;
    paintIcons(tryBtn);
  }

  function selectLabProduct(p, btn) {
    if (p.locked) {
      document.getElementById('lock-modal').classList.add('show');
      return;
    }
    // Tapping a product toggles it within its own category (lip/eye/blush/base),
    // so several categories can be combined but only one shade per category at a time.
    if (selectedProducts[p.type]?.name === p.name) {
      delete selectedProducts[p.type];
    } else {
      selectedProducts[p.type] = p;
    }
    syncLabSelectionUI();

    const count = Object.keys(selectedProducts).length;
    document.getElementById('lab-avatar').style.color = p.color;
    document.getElementById('applying-pill').textContent = count ? `${count}개 제품 적용 중` : '가상 적용 중';
  }

  function renderLookPresets() {
    const row = document.getElementById('look-preset-row');
    if (!row) return;
    row.innerHTML = LOOK_PRESETS.map(preset => `
      <button class="look-preset-card" data-preset="${preset.id}">
        <span class="look-preset-swatches">
          ${Object.values(preset.products).map(p => `<span style="background:${p.color}"></span>`).join('')}
        </span>
        <span class="look-preset-name">${preset.name}</span>
        <span class="look-preset-desc">${preset.desc}</span>
      </button>
    `).join('');
    row.querySelectorAll('.look-preset-card').forEach(card => {
      const preset = LOOK_PRESETS.find(look => look.id === card.dataset.preset);
      card.addEventListener('click', () => applyLookPreset(preset));
    });
  }

  function applyLookPreset(preset) {
    selectedProducts = { ...preset.products };
    syncLabSelectionUI();
    document.getElementById('applying-pill').textContent = preset.name;
    openTryOn(Object.values(selectedProducts));
  }

  document.getElementById('lab-search')?.addEventListener('input', function () {
    renderLabProducts(this.value);
  });
  document.querySelectorAll('#lab-type-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#lab-type-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      labTypeFilter = chip.getAttribute('data-lab-type');
      renderLabProducts(document.getElementById('lab-search')?.value || '');
    });
  });
  document.getElementById('try-selected-btn')?.addEventListener('click', () => {
    const products = Object.values(selectedProducts);
    if (!products.length) { showToast('먼저 제품을 선택해주세요'); return; }
    openTryOn(products);
  });
  document.getElementById('buy-selected-btn')?.addEventListener('click', () => {
    const names = Object.values(selectedProducts).map(p => p.name).join(', ');
    showToast(`쿠팡에서 ${names} 구매 페이지로 이동해요`);
  });
  document.getElementById('modal-dismiss')?.addEventListener('click', () => document.getElementById('lock-modal').classList.remove('show'));
  document.getElementById('modal-upgrade')?.addEventListener('click', () => document.getElementById('lock-modal').classList.remove('show'));

  /* ---------- Checkout ---------- */
  document.querySelectorAll('.plan-card').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('active'));
      p.classList.add('active');
    });
  });
  document.getElementById('subscribe-btn')?.addEventListener('click', () => {
    showToast('프리미엄 구독이 시작됐어요 🎉');
    setTimeout(() => goTo('lab'), 900);
  });

  /* ---------- Toast ---------- */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toast-text').textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- Hero banner ---------- */
  document.getElementById('hero-banner')?.addEventListener('click', () => {
    const hot = FEED.find(v => v.hot);
    if (hot) openPlayer(hot);
  });

  /* ---------- Personal Color ---------- */
  let currentColorType = 'spring';

  function renderColorResult(typeKey) {
    currentColorType = typeKey;
    const t = COLOR_TYPES[typeKey];
    document.getElementById('color-type-name').textContent = t.label;
    document.getElementById('color-type-desc').textContent = t.desc;

    const palette = document.getElementById('palette-row');
    palette.innerHTML = t.palette.map(c => `<span class="palette-swatch" style="background:${c}"></span>`).join('');

    const tabs = document.getElementById('color-type-tabs');
    if (!tabs.dataset.built) {
      tabs.innerHTML = Object.entries(COLOR_TYPES).map(([k, v]) =>
        `<button class="color-type-tab${k === typeKey ? ' active' : ''}" data-type="${k}">${v.label}</button>`
      ).join('');
      tabs.dataset.built = '1';
      tabs.querySelectorAll('.color-type-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.querySelectorAll('.color-type-tab').forEach(x => x.classList.remove('active'));
          tab.classList.add('active');
          renderColorResult(tab.getAttribute('data-type'));
        });
      });
    } else {
      tabs.querySelectorAll('.color-type-tab').forEach(x => {
        x.classList.toggle('active', x.getAttribute('data-type') === typeKey);
      });
    }

    const list = document.getElementById('color-products');
    list.innerHTML = '';
    LAB_PRODUCTS.slice(0, 3).forEach(p => {
      const item = document.createElement('div');
      item.className = 'product-item';
      item.innerHTML = `
        <span class="product-thumb" style="background:linear-gradient(145deg, ${p.color}, ${p.color}cc)">
          <span data-icon="${TYPE_ICON[p.type] || 'flask'}"></span>
          <span class="product-color-dot" style="background:${p.color}"></span>
        </span>
        <span class="product-info">
          <span class="product-brand">${p.brand}</span><br>
          <span class="product-name">${p.name}</span><br>
          <span class="product-price">${p.price}</span>
        </span>`;
      list.appendChild(item);
    });
    paintIcons(list);
  }

  /* ---------- Auth: real Supabase login / signup / logout / OAuth ---------- */
  function updateProfileUI(user) {
    const nameEl = document.getElementById('profile-user-name');
    const emailEl = document.getElementById('profile-user-email');
    if (!user) {
      if (nameEl) nameEl.innerHTML = '민지 <span>🇰🇷</span>';
      if (emailEl) emailEl.textContent = '뷰티 크리에이터';
      return;
    }
    const displayName = user.email ? user.email.split('@')[0] : '고운 회원';
    if (nameEl) nameEl.innerHTML = `${displayName} <span>🇰🇷</span>`;
    if (emailEl) emailEl.textContent = user.email || '';
  }

  async function awardPoints(userId, amount, label) {
    const { data: p } = await supabase.from('profiles').select('points').eq('id', userId).maybeSingle();
    const current = p?.points ?? 0;
    await supabase.from('profiles').update({ points: current + amount }).eq('id', userId);
    await supabase.from('point_history').insert({ user_id: userId, label, amount });
  }

  // First real activity (adding a wishlist item) after signing up via an
  // invite link pays out both the referrer and the referred user, once.
  async function maybeRewardReferral() {
    if (!currentUserId) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('referred_by, referral_rewarded')
      .eq('id', currentUserId)
      .maybeSingle();
    if (!profile?.referred_by || profile.referral_rewarded) return;

    await supabase.from('profiles').update({ referral_rewarded: true }).eq('id', currentUserId);
    await awardPoints(currentUserId, 300, '친구 초대로 받은 포인트');
    await awardPoints(profile.referred_by, 500, '친구 초대 성공 포인트');
    showToast('친구 초대 보너스 300P를 받았어요!');
    loadProfilePoints(currentUserId);
  }

  async function loadProfilePoints(userId) {
    let { data: profile } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) {
      let referredBy = null;
      try {
        const ref = localStorage.getItem('goun_ref');
        if (ref && ref !== userId) referredBy = ref;
      } catch {}

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, points: 500, referred_by: referredBy });
      if (insertError && referredBy) {
        // referred_by likely didn't match a real user; retry without it
        await supabase.from('profiles').insert({ id: userId, points: 500 });
      }
      await supabase.from('point_history').insert({ user_id: userId, label: '가입 환영 포인트', amount: 500 });
      profile = { points: 500 };
      try { localStorage.removeItem('goun_ref'); } catch {}
    }

    const pointsEl = document.getElementById('points-num');
    if (pointsEl) pointsEl.textContent = `${profile.points.toLocaleString('ko-KR')}P`;

    const { data: history } = await supabase
      .from('point_history')
      .select('label, amount')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const list = document.getElementById('history-list');
    const emptyMsg = document.getElementById('history-empty');
    if (!list || !emptyMsg) return;
    if (!history || history.length === 0) {
      list.innerHTML = '';
      emptyMsg.classList.remove('hidden');
      return;
    }
    emptyMsg.classList.add('hidden');
    list.innerHTML = history.map(h => `
      <div class="history-row">
        <span><i data-icon="${h.amount >= 0 ? 'shopping-bag' : 'flask'}"></i> ${h.label}</span>
        <span class="${h.amount >= 0 ? 'plus' : 'minus'}">${h.amount >= 0 ? '+' : ''}${h.amount.toLocaleString('ko-KR')}P</span>
      </div>
    `).join('');
    paintIcons(list);
  }

  const loginBtn = document.getElementById('login-continue-btn');
  loginBtn?.addEventListener('click', async () => {
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
      showToast('이메일과 비밀번호를 입력해주세요');
      return;
    }
    if (password.length < 6) {
      showToast('비밀번호는 6자 이상이어야 해요');
      return;
    }

    loginBtn.disabled = true;
    const originalLabel = loginBtn.textContent;
    loginBtn.textContent = '확인 중...';

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (!signInError) {
        return; // onAuthStateChange -> SIGNED_IN handles navigation.
      }

      if (signInError.message.toLowerCase().includes('invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          showToast(signUpError.message);
          return;
        }
        if (signUpData.session) {
          return; // onAuthStateChange -> SIGNED_IN handles navigation.
        }
        showToast('가입 확인 이메일을 보냈어요. 메일함을 확인해주세요');
        return;
      }

      showToast(signInError.message);
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = originalLabel;
    }
  });

  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
  });

  document.getElementById('invite-share-btn')?.addEventListener('click', async () => {
    if (!currentUserId) { showToast('로그인 후 이용해주세요'); return; }
    const link = `${window.location.origin}/?ref=${currentUserId}`;
    const shareText = '고운에서 나랑 같이 K-뷰티 취향 찾아볼래? 가입하면 포인트 받아가!';
    if (navigator.share) {
      try {
        await navigator.share({ title: '고운 초대', text: shareText, url: link });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      showToast('초대 링크를 복사했어요');
    } catch {
      showToast(link);
    }
  });

  document.getElementById('delete-account-btn')?.addEventListener('click', async () => {
    if (!currentUserId) { showToast('로그인 후 이용해주세요'); return; }
    const confirmed = window.confirm('정말 탈퇴하시겠어요? 위시리스트, 포인트 등 모든 데이터가 영구적으로 삭제되고 되돌릴 수 없어요.');
    if (!confirmed) return;

    const btn = document.getElementById('delete-account-btn');
    btn.disabled = true;
    btn.textContent = '탈퇴 처리 중...';

    try {
      const res = await fetch('/api/delete-account', { method: 'POST' });
      const body = await res.json();
      if (!res.ok) {
        showToast(body.error || '탈퇴 처리에 실패했어요');
        return;
      }
      await supabase.auth.signOut();
      showToast('탈퇴가 완료됐어요. 그동안 이용해주셔서 감사해요');
    } catch {
      showToast('탈퇴 처리에 실패했어요, 다시 시도해주세요');
    } finally {
      btn.disabled = false;
      btn.textContent = '회원 탈퇴';
    }
  });

  const OAUTH_PROVIDERS = { 'social-kakao-btn': 'kakao', 'social-apple-btn': 'apple', 'social-google-btn': 'google' };
  // 카카오는 아직 이메일 제공 권한이 비즈 심사 전이라, account_email이 섞이면
  // KOE205로 인가 자체가 막힘. 닉네임/프로필 사진만 명시적으로 요청.
  const OAUTH_SCOPES = { kakao: 'profile_nickname profile_image' };
  Object.entries(OAUTH_PROVIDERS).forEach(([btnId, provider]) => {
    document.getElementById(btnId)?.addEventListener('click', async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...(OAUTH_SCOPES[provider] ? { scopes: OAUTH_SCOPES[provider] } : {}),
        },
      });
      if (error) showToast(error.message);
    });
  });

  let authListenerActive = true;
  const { data: authSubscription } = supabase.auth.onAuthStateChange((event, session) => {
    if (!authListenerActive) return;
    if (event === 'SIGNED_IN' && session) {
      currentUserId = session.user.id;
      updateProfileUI(session.user);
      loadWishlist(currentUserId);
      loadProfilePoints(currentUserId);
      showToast('환영해요! 고운을 시작해볼까요');
      goTo('home');
    } else if (event === 'SIGNED_OUT') {
      currentUserId = null;
      wishlist = [];
      updateProfileUI(null);
      renderWishlist();
      renderLabProducts(document.getElementById('lab-search')?.value || '');
      const pointsEl = document.getElementById('points-num');
      if (pointsEl) pointsEl.textContent = '0P';
      document.getElementById('history-list').innerHTML = '';
      document.getElementById('history-empty')?.classList.add('hidden');
      showToast('로그아웃 됐어요');
      goTo('login');
    }
  });

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      currentUserId = session.user.id;
      updateProfileUI(session.user);
      loadWishlist(currentUserId);
      loadProfilePoints(currentUserId);
      goTo('home');
    }
  });

  /* ---------- Native share (Instagram/TikTok/KakaoTalk 등, Web Share API) ---------- */
  async function shareContent(title, text, url) {
    url = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        showToast('공유 완료!');
      } catch (err) {
        if (err.name !== 'AbortError') showToast('공유가 취소됐어요');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
        showToast('공유 링크를 복사했어요 (이 브라우저는 공유창을 지원하지 않아요)');
      } catch (e) {
        showToast('공유하기를 지원하지 않는 환경이에요');
      }
    }
  }

  document.getElementById('player-share-btn')?.addEventListener('click', () => {
    if (!currentVideo) return;
    shareContent(
      `${currentVideo.name}님의 룩 - 고운`,
      currentVideo.caption + ' #고운 #GOUN #K뷰티'
    );
  });
  document.getElementById('share-color-btn')?.addEventListener('click', () => {
    shareContent(
      `내 퍼스널 컬러는 ${COLOR_TYPES[currentColorType].label}!`,
      '고운에서 내 퍼스널 컬러를 진단받았어요 ✨ #고운 #GOUN #퍼스널컬러'
    );
  });
  /* ---------- Ingredient Scanner ---------- */
  document.getElementById('scan-btn')?.addEventListener('click', function () {
    this.disabled = true;
    showToast('성분표를 분석하고 있어요...');
    setTimeout(() => {
      document.getElementById('scanner-result').classList.remove('hidden');
      this.classList.add('hidden');
      document.getElementById('scanner-stage').classList.add('hidden');
      paintIcons(document.getElementById('scanner-result'));
    }, 900);
  });
  document.getElementById('scan-again-btn')?.addEventListener('click', () => {
    document.getElementById('scanner-result').classList.add('hidden');
    document.getElementById('scanner-stage').classList.remove('hidden');
    document.getElementById('scan-btn').classList.remove('hidden');
    document.getElementById('scan-btn').disabled = false;
  });

  /* ---------- Weekly Ranking ---------- */
  async function loadRankings() {
    const { data, error } = await supabase
      .from('rankings')
      .select('category, rank, flag, name, likes, title')
      .order('rank', { ascending: true });
    if (!error && data && data.length) {
      RANK_LOOKS = data.filter(r => r.category === 'look');
      RANK_CREATORS = data.filter(r => r.category === 'creator');
    } else {
      RANK_LOOKS = RANK_LOOKS_FALLBACK;
      RANK_CREATORS = RANK_CREATORS_FALLBACK;
    }
    const activeTab = document.querySelector('.rank-tab.active')?.getAttribute('data-rank') || 'look';
    renderRanking(activeTab);
  }

  function renderRanking(type) {
    const list = document.getElementById('rank-list');
    if (!list) return;
    const data = type === 'creator' ? RANK_CREATORS : RANK_LOOKS;
    list.innerHTML = data.map(r => `
      <div class="rank-row">
        <span class="rank-num ${r.rank <= 3 ? 'top' : ''}">${r.rank}</span>
        <span class="rank-avatar"><span data-icon="user"></span></span>
        <span class="rank-info">
          <span class="rank-name">${r.flag} ${r.name}</span>
          <span class="rank-title">${r.title}</span>
        </span>
        <span class="rank-likes"><span data-icon="heart"></span> ${r.likes}</span>
      </div>
    `).join('');
    paintIcons(list);
  }
  document.querySelectorAll('.rank-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.rank-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderRanking(tab.getAttribute('data-rank'));
    });
  });

  /* ---------- Wishlist (persisted in Supabase, per user) ---------- */
  let wishlist = [];
  let currentUserId = null;

  async function loadWishlist(userId) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('brand, name, price, color, type')
      .eq('user_id', userId);
    if (error) { showToast('위시리스트를 불러오지 못했어요'); return; }
    wishlist = data || [];
    renderWishlist();
    renderLabProducts(document.getElementById('lab-search')?.value || '');
  }

  async function addToWishlist(product) {
    const { brand, name, price, color, type } = product;
    const wasFirstItem = wishlist.length === 0;
    wishlist.push({ brand, name, price, color, type });
    renderWishlist();
    showToast('위시리스트에 담았어요');
    const { error } = await supabase
      .from('wishlist_items')
      .insert({ user_id: currentUserId, brand, name, price, color, type });
    if (error) {
      wishlist = wishlist.filter(w => w.name !== name);
      renderWishlist();
      renderLabProducts(document.getElementById('lab-search')?.value || '');
      showToast('저장에 실패했어요, 다시 시도해주세요');
    } else if (wasFirstItem) {
      maybeRewardReferral();
    }
  }

  async function removeFromWishlist(name) {
    const removed = wishlist.find(w => w.name === name);
    wishlist = wishlist.filter(w => w.name !== name);
    renderWishlist();
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', currentUserId)
      .eq('name', name);
    if (error && removed) {
      wishlist.push(removed);
      renderWishlist();
      renderLabProducts(document.getElementById('lab-search')?.value || '');
      showToast('삭제에 실패했어요, 다시 시도해주세요');
    }
  }

  function renderWishlist() {
    const list = document.getElementById('wishlist-list');
    const emptyMsg = document.getElementById('wishlist-empty-msg');
    if (!list || !emptyMsg) return;
    if (wishlist.length === 0) {
      list.innerHTML = '';
      emptyMsg.classList.remove('hidden');
      return;
    }
    emptyMsg.classList.add('hidden');
    list.innerHTML = wishlist.map(p => `
      <div class="product-item">
        <span class="product-thumb" style="background:linear-gradient(145deg, ${p.color}, ${p.color}cc)">
          <span data-icon="${TYPE_ICON[p.type] || 'flask'}"></span>
          <span class="product-color-dot" style="background:${p.color}"></span>
        </span>
        <span class="product-info">
          <span class="product-brand">${p.brand}</span><br>
          <span class="product-name">${p.name}</span><br>
          <span class="product-price">${p.price}</span>
        </span>
      </div>
    `).join('');
    paintIcons(list);
  }

  /* ---------- Advertising: inquiry & self-serve ---------- */
  let adSlot = 'feed', adDuration = 7;
  let adSlot2 = 'feed', adDuration2 = 7;

  function fmtWon(n) { return n.toLocaleString('ko-KR') + '원'; }
  function calcAdPrice(slot, dur) { return Math.round(AD_BASE_PRICE[slot] * AD_DURATION_MULT[dur]); }

  document.querySelectorAll('[data-slot]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-slot]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adSlot = btn.getAttribute('data-slot');
      document.getElementById('ad-price-num').textContent = fmtWon(calcAdPrice(adSlot, adDuration));
    });
  });
  document.querySelectorAll('[data-dur]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-dur]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adDuration = Number(btn.getAttribute('data-dur'));
      document.getElementById('ad-price-num').textContent = fmtWon(calcAdPrice(adSlot, adDuration));
    });
  });
  document.querySelectorAll('[data-slot2]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-slot2]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adSlot2 = btn.getAttribute('data-slot2');
      document.getElementById('ad-price-num2').textContent = fmtWon(calcAdPrice(adSlot2, adDuration2));
    });
  });
  document.querySelectorAll('[data-dur2]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-dur2]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adDuration2 = Number(btn.getAttribute('data-dur2'));
      document.getElementById('ad-price-num2').textContent = fmtWon(calcAdPrice(adSlot2, adDuration2));
    });
  });

  document.getElementById('ad-submit-btn')?.addEventListener('click', () => {
    const company = document.getElementById('ad-company').value.trim();
    if (!company) { showToast('브랜드/회사명을 입력해주세요'); return; }
    document.getElementById('adinquiry-form-wrap').classList.add('hidden');
    document.getElementById('adinquiry-success').classList.remove('hidden');
    paintIcons(document.getElementById('adinquiry-success'));
    showToast('광고 문의가 접수됐어요');
  });
  document.getElementById('ad-simulate-approve-btn')?.addEventListener('click', () => {
    document.getElementById('ad-status-badge').textContent = '승인 완료';
    document.getElementById('ad-status-badge').classList.remove('pending');
    document.getElementById('ad-status-badge').classList.add('approved');
    setTimeout(() => goTo('admanage'), 500);
  });
  document.getElementById('ad-pay-btn')?.addEventListener('click', () => {
    showToast('결제가 완료됐어요. 광고가 곧 게재돼요!');
    setTimeout(() => goTo('mypage'), 900);
  });

  /* ---------- Init ---------- */
  document.getElementById('bottom-nav').style.display = 'none';
  loadFeed();
  renderLabProducts();
  renderLookPresets();
  renderColorResult('spring');
  loadProducts();
  renderRanking('look');
  loadRankings();
  renderWishlist();
  paintIcons(root);

  return () => {
    authListenerActive = false;
    clearInterval(flagInterval);
    authSubscription?.subscription?.unsubscribe();
    stopStream(tryOnStream);
  };
}
