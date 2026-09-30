import { startCameraPreview, stopStream, capturePhotoWithMakeup, analyzeLookColors, applyDetectedLook, segmentPerson, compositeOntoBackground } from './virtualTryOn';

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
  'eye':'<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>',
  'mirror':'<circle cx="12" cy="9" r="6"/><path d="M12 15v6M9 21h6"/>'
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
      if (v.image_url) {
        item.style.backgroundImage = `url(${v.image_url})`;
        item.style.backgroundSize = 'cover';
        item.style.backgroundPosition = 'center';
      }
      item.innerHTML = v.image_url ? `
        <span class="grid-who"><span class="grid-who-dot"></span>${v.name}</span>
        ${v.hot ? '<span class="grid-badge">인기</span>' : ''}
        <span class="grid-cap">
          ${v.products?.length ? `<span class="grid-swatches">${v.products.map(p => `<span class="grid-swatch" style="background:${p.color}" title="${p.brand} · ${p.name}"></span>`).join('')}</span>` : ''}
          <span class="grid-cap-title">${v.caption}</span>
          ${v.productLine ? `<span class="grid-cap-sub">${v.productLine}</span>` : ''}
        </span>
        <span class="grid-like"><span data-icon="heart"></span> ${v.likes}</span>
      ` : `
        <div class="thumb-fill" data-icon="user"></div>
        ${v.flag ? `<span class="grid-flag">${v.flag}</span>` : ''}
        ${v.hot ? '<span class="grid-badge">인기</span>' : ''}
        <span class="grid-like"><span data-icon="heart"></span> ${v.likes}</span>
      `;
      item.addEventListener('click', () => openPlayer(v));
      grid.appendChild(item);
    });
    paintIcons(grid);
  }

  // 파우더룸에 실제로 올려진 결과(feed_posts)가 있으면 그걸 홈 피드로 보여주고,
  // 아직 하나도 없으면(초기 상태) 기존 목업 데이터로 폴백한다.
  async function loadFeed() {
    const { data, error } = await supabase
      .from('feed_posts')
      .select('handle, source_type, image_url, caption, products, likes')
      .order('created_at', { ascending: false })
      .limit(60);
    if (!error && data && data.length) {
      FEED = data.map(row => ({
        flag: '',
        name: row.handle ? `@${row.handle}` : '고운 유저',
        likes: String(row.likes ?? 0),
        cat: row.products?.[0]?.type || 'base',
        hot: (row.likes ?? 0) >= 50,
        caption: row.caption || (row.source_type === 'lookfinder' ? '인플루언서 화장법 따라하기 결과' : '뷰티랩 발라보기 결과'),
        productLine: row.products?.[0] ? `${row.products[0].brand} · ${row.products[0].price}` : '',
        products: row.products || [],
        image_url: row.image_url,
      }));
    } else {
      FEED = FEED_FALLBACK;
    }
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
      bottomNav.style.display = ['home', 'ranking', 'powderroom', 'mypage'].includes(id) ? 'flex' : 'none';
    }
    if (id === 'touchup') refreshTouchupView();
    if (id === 'powderroom') loadPowderRoom();
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
    // 댓글 기능은 아직 없음 — 실제 게시물은 정직하게 0, 옛 영상 목업 카드는 그대로 데모 숫자 유지.
    document.getElementById('comment-count').textContent = v.image_url ? '0' : '832';
    const photoEl = document.getElementById('player-photo');
    const avatarEl = document.getElementById('player-avatar');
    if (v.image_url) {
      photoEl.src = v.image_url;
      photoEl.classList.remove('hidden');
      avatarEl.classList.add('hidden');
    } else {
      photoEl.classList.add('hidden');
      avatarEl.classList.remove('hidden');
    }
    const firstProduct = v.products?.[0];
    document.getElementById('player-buy-btn')?.classList.toggle('hidden', !firstProduct);
    const buyListEl = document.getElementById('player-buy-list');
    if (buyListEl) {
      // 쿠팡처럼 매칭된 제품 전부를 각각 탭해서 바로 그 제품으로 갈 수 있게 —
      // 하나로 뭉뚱그린 "구매하러 가기" 버튼 대신 제품별 알약 목록으로.
      buyListEl.innerHTML = (v.products || []).map((p, i) => `
        <button class="buy-pill" data-idx="${i}">
          <span class="buy-pill-dot" style="background:${p.color}"></span>
          ${p.brand} · ${p.name}
        </button>
      `).join('');
      buyListEl.querySelectorAll('.buy-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const product = currentVideo?.products?.[Number(btn.getAttribute('data-idx'))];
          if (!product) return;
          window.open(`https://www.coupang.com/np/search?q=${encodeURIComponent(product.name)}`, '_blank', 'noopener,noreferrer');
        });
      });
    }
    goTo('player');
  }
  document.getElementById('player-close')?.addEventListener('click', () => goTo('home'));
  document.getElementById('like-btn')?.addEventListener('click', function () {
    this.classList.toggle('liked');
  });
  document.getElementById('player-buy-btn')?.addEventListener('click', () => {
    const product = currentVideo?.products?.[0];
    if (!product) return;
    window.open(`https://www.coupang.com/np/search?q=${encodeURIComponent(product.name)}`, '_blank', 'noopener,noreferrer');
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
  /* ---------- Touch-up check: compare saved look vs now, using free MediaPipe color-diff ----------
     Captures happen with an in-page <video> camera (like the 뷰티랩 발라보기 modal), not a native
     file-picker/camera-app handoff — on some Android phones, backgrounding the tab to use the native
     camera app gets the tab reclaimed, and coming back reloads the page and drops all in-flight state. */
  const TOUCHUP_STORAGE_KEY = 'goun_touchup_look';

  function resizeToDataUrl(source, maxW) {
    const sw = source.naturalWidth || source.width;
    const sh = source.naturalHeight || source.height;
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, maxW / sw);
    canvas.width = sw * scale;
    canvas.height = sh * scale;
    canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }

  function withTimeout(promise, ms, message) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
    ]);
  }

  function loadTouchupSavedLook() {
    try {
      const raw = localStorage.getItem(TOUCHUP_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function showTouchupStep(step) {
    document.getElementById('touchup-empty')?.classList.toggle('hidden', step !== 'empty');
    document.getElementById('touchup-step-now')?.classList.toggle('hidden', step !== 'now');
    document.getElementById('touchup-loading')?.classList.toggle('hidden', step !== 'loading');
    document.getElementById('touchup-result')?.classList.toggle('hidden', step !== 'result');
  }

  function refreshTouchupView() {
    const saved = loadTouchupSavedLook();
    if (!saved) {
      showTouchupStep('empty');
      return;
    }
    const savedTime = new Date(saved.savedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const timeEl = document.getElementById('touchup-saved-time');
    if (timeEl) timeEl.textContent = `${savedTime}에 저장한 룩과 비교해요`;
    document.getElementById('touchup-now-error')?.classList.add('hidden');
    showTouchupStep('now');
  }

  function setTouchupNowError(msg) {
    const el = document.getElementById('touchup-now-error');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('hidden', !msg);
  }

  async function handleTouchupSaveCapture(canvas) {
    try {
      const colors = await withTimeout(analyzeLookColors(canvas), 15000, '분석이 너무 오래 걸려요. 다시 시도해주세요');
      if (!colors.faceFound) {
        showToast('사진에서 얼굴을 찾지 못했어요. 다시 시도해주세요');
        return;
      }
      const dataUrl = resizeToDataUrl(canvas, 480);
      localStorage.setItem(TOUCHUP_STORAGE_KEY, JSON.stringify({ dataUrl, colors, savedAt: Date.now() }));
      showToast('오늘 룩을 저장했어요. 나중에 비교해보세요!');
      document.getElementById('save-look-btn')?.classList.add('hidden');
      document.getElementById('check-now-btn')?.classList.remove('hidden');
    } catch (err) {
      console.error('[touchup] save-error', err);
      showToast(`저장에 실패했어요: ${err?.message || err}`);
    }
  }

  async function handleTouchupNowCapture(canvas) {
    const saved = loadTouchupSavedLook();
    setTouchupNowError('');
    if (!saved) {
      setTouchupNowError('저장된 오늘의 룩을 찾지 못했어요. 스킨체크에서 다시 저장해주세요');
      return;
    }

    showTouchupStep('loading');

    try {
      const now = await withTimeout(analyzeLookColors(canvas), 15000, '분석이 너무 오래 걸려요. 다시 시도해주세요');
      if (!now.faceFound) {
        setTouchupNowError('사진에서 얼굴을 찾지 못했어요. 얼굴이 잘 보이게 다시 찍어주세요');
        showTouchupStep('now');
        return;
      }
      const nowDataUrl = resizeToDataUrl(canvas, 480);

      const LIP_FADE_THRESHOLD = 55;
      const BLUSH_FADE_THRESHOLD = 45;
      const OIL_BRIGHTNESS_THRESHOLD = 20;

      // Compare colors *relative to the T-zone (bare skin) in the same photo*, not raw
      // RGB across photos — a shot taken moments later can have noticeably different
      // lighting/white-balance, which shifted every raw color enough to falsely read as
      // "faded" even with zero makeup on. Lip/blush intensity relative to bare skin, and
      // T-zone shine relative to the cheek, cancel out most of that per-shot lighting drift.
      const relativeMetrics = (c) => ({
        lipContrast: (c.lip && c.tzone) ? colorDistance(c.lip, c.tzone) : null,
        blushContrast: (c.blush && c.tzone) ? colorDistance(c.blush, c.tzone) : null,
        oilIndex: (c.tzone && c.blush) ? hexBrightness(c.tzone) - hexBrightness(c.blush) : null,
      });
      const savedM = relativeMetrics(saved.colors);
      const nowM = relativeMetrics(now);

      const lipDist = (savedM.lipContrast != null && nowM.lipContrast != null) ? Math.abs(savedM.lipContrast - nowM.lipContrast) : 0;
      const blushDist = (savedM.blushContrast != null && nowM.blushContrast != null) ? Math.abs(savedM.blushContrast - nowM.blushContrast) : 0;
      const oilDelta = (savedM.oilIndex != null && nowM.oilIndex != null) ? nowM.oilIndex - savedM.oilIndex : 0;

      const lipFaded = lipDist > LIP_FADE_THRESHOLD;
      const blushFaded = blushDist > BLUSH_FADE_THRESHOLD;
      const oilIncreased = oilDelta > OIL_BRIGHTNESS_THRESHOLD;

      const tagsEl = document.getElementById('touchup-tags');
      if (tagsEl) {
        tagsEl.innerHTML = [
          oilIncreased ? '<span class="mini-tag mini-tl danger">유분 증가</span>' : '',
          lipFaded ? '<span class="mini-tag mini-bl danger">립 지워짐</span>' : '',
        ].join('');
      }

      const adviceList = document.getElementById('touchup-advice-list');
      if (adviceList) {
        const items = [];
        items.push(oilIncreased
          ? '<li>T존에 블로팅 티슈로 유분 제거 후 파우더 덧바르기</li>'
          : '<li class="muted-item">유분은 아직 잘 유지되고 있어요</li>');
        items.push(lipFaded
          ? '<li>지워진 립 라인 위에 같은 컬러로 다시 덧바르기</li>'
          : '<li class="muted-item">립 컬러는 아직 유지되고 있어요</li>');
        items.push(blushFaded
          ? '<li>볼에 블러셔를 가볍게 덧발라주기</li>'
          : '<li class="muted-item">볼 홍조는 아직 유지되고 있어요</li>');
        adviceList.innerHTML = items.join('');
      }

      const distScore = (dist) => Math.max(0, 100 - dist / 3);
      const oilScore = Math.max(0, 100 - Math.max(0, oilDelta) * 2);
      const matchPct = Math.round((distScore(lipDist) + distScore(blushDist) + oilScore) / 3);

      document.getElementById('touchup-match-fill').style.width = `${matchPct}%`;
      document.getElementById('touchup-match-num').textContent = `${matchPct}%`;
      document.getElementById('touchup-saved-img').src = saved.dataUrl;
      document.getElementById('touchup-now-img').src = nowDataUrl;
      const savedTime = new Date(saved.savedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      document.getElementById('touchup-time').textContent = `${savedTime}에 저장한 룩과 비교했어요`;

      showTouchupStep('result');
    } catch (err) {
      console.error('[touchup] compare-error', err);
      setTouchupNowError(`비교 중 오류가 났어요: ${err?.message || err}`);
      showTouchupStep('now');
    }
  }

  /* ---------- Shared in-page photo camera: used by touch-up check AND 인플루언서 화장법 selfie capture.
     Opens getUserMedia directly inside the page instead of a file-input capture (which hands off to the
     native camera app and, on some Android phones, gets the tab reloaded while backgrounded — see the
     touch-up "camera bug" note in CLAUDE.md). Callback-based: openPhotoCamera(title, onCapture) shows the
     modal, and onCapture(canvas) is called once with the captured (mirrored) frame after the shutter. ---------- */
  let photoCameraStream = null;
  let photoCameraOnCapture = null;

  async function openPhotoCamera(title, onCapture) {
    photoCameraOnCapture = onCapture;
    const modal = document.getElementById('photo-camera-modal');
    const video = document.getElementById('photo-camera-video');
    const statusEl = document.getElementById('photo-camera-status');
    const titleEl = document.getElementById('photo-camera-title');
    if (!modal || !video) return;

    if (titleEl) titleEl.textContent = title;
    statusEl.textContent = '카메라를 준비하고 있어요...';
    statusEl.classList.remove('error');
    modal.classList.add('show');

    if (!navigator.mediaDevices?.getUserMedia) {
      statusEl.textContent = '이 브라우저는 카메라를 지원하지 않아요';
      statusEl.classList.add('error');
      return;
    }

    try {
      photoCameraStream = await startCameraPreview(video);
      statusEl.textContent = '얼굴이 잘 보이게 맞추고 촬영해주세요';
    } catch (err) {
      console.error('[photo-camera] camera-error', err);
      statusEl.textContent = '카메라를 사용할 수 없어요. 브라우저 설정에서 카메라 권한을 허용해주세요';
      statusEl.classList.add('error');
    }
  }

  function closePhotoCamera() {
    document.getElementById('photo-camera-modal')?.classList.remove('show');
    stopStream(photoCameraStream);
    photoCameraStream = null;
  }

  document.getElementById('photo-camera-close-btn')?.addEventListener('click', closePhotoCamera);

  document.getElementById('photo-camera-shutter-btn')?.addEventListener('click', async () => {
    const video = document.getElementById('photo-camera-video');
    if (!video || !photoCameraStream) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const onCapture = photoCameraOnCapture;
    closePhotoCamera();
    if (onCapture) await onCapture(canvas);
  });

  document.getElementById('save-look-btn')?.addEventListener('click', () => openPhotoCamera('오늘 룩 저장', handleTouchupSaveCapture));
  document.getElementById('touchup-now-btn')?.addEventListener('click', () => openPhotoCamera('지금 사진 찍기', handleTouchupNowCapture));

  document.getElementById('touchup-retry-btn')?.addEventListener('click', () => {
    setTouchupNowError('');
    refreshTouchupView();
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
    renderCreatorProductList();
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
    showToast(`올리브영에서 ${names} 구매 페이지로 이동해요`);
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

  /* ---------- Makeup Battle ---------- */
  let battleVoted = false;
  document.querySelectorAll('.battle-card').forEach(card => {
    card.addEventListener('click', function () {
      if (battleVoted) return;
      battleVoted = true;
      const side = this.getAttribute('data-side');
      document.querySelectorAll('.battle-card').forEach(c => c.classList.remove('voted'));
      this.classList.add('voted');
      document.getElementById('battle-pct-left').textContent = (side === 'left' ? 68 : 32) + '%';
      document.getElementById('battle-pct-right').textContent = (side === 'left' ? 32 : 68) + '%';
      document.getElementById('battle-bar-fill').style.width = (side === 'left' ? 68 : 32) + '%';
      document.getElementById('battle-vote-count').textContent = '1,205명 참여';
      showToast('투표 완료! 결과에 반영됐어요');
    });
  });
  document.getElementById('battle-next-btn')?.addEventListener('click', () => {
    battleVoted = false;
    document.querySelectorAll('.battle-card').forEach(c => c.classList.remove('voted'));
    document.getElementById('battle-pct-left').textContent = '52%';
    document.getElementById('battle-pct-right').textContent = '48%';
    document.getElementById('battle-bar-fill').style.width = '52%';
    document.getElementById('battle-vote-count').textContent = '1,204명 참여';
    showToast('다음 배틀을 불러왔어요');
  });
  document.getElementById('battle-upload-btn')?.addEventListener('click', () => {
    showToast('사진을 올리면 내 배틀이 만들어져요');
    goTo('camera');
  });

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

  // AI 티켓: 무료 2회 제공 후 3회차부터는 포인트로 결제 (990P = 990원 상당).
  // 친구 초대로 받은 포인트(최대 800P)가 자연스럽게 첫 유료 이용을 커버해주는 구조.
  const AI_TICKET_FREE_LIMIT = 2;
  const AI_TICKET_COST_POINTS = 990;

  async function consumeAiTicket(userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('points, ai_ticket_free_used')
      .eq('id', userId)
      .maybeSingle();
    if (!profile) return { ok: false, reason: 'no-profile' };

    if (profile.ai_ticket_free_used < AI_TICKET_FREE_LIMIT) {
      await supabase
        .from('profiles')
        .update({ ai_ticket_free_used: profile.ai_ticket_free_used + 1 })
        .eq('id', userId);
      return { ok: true, method: 'free', remainingFree: AI_TICKET_FREE_LIMIT - profile.ai_ticket_free_used - 1 };
    }

    if (profile.points >= AI_TICKET_COST_POINTS) {
      await awardPoints(userId, -AI_TICKET_COST_POINTS, 'AI 분석 이용권 사용');
      return { ok: true, method: 'point' };
    }

    return { ok: false, reason: 'insufficient-points', pointsNeeded: AI_TICKET_COST_POINTS - profile.points };
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
      currentUserEmail = session.user.email;
      updateProfileUI(session.user);
      loadWishlist(currentUserId);
      loadProfilePoints(currentUserId);
      loadCreatorPage(currentUserId);
      showToast('환영해요! 고운을 시작해볼까요');
      goTo('home');
    } else if (event === 'SIGNED_OUT') {
      currentUserId = null;
      currentUserEmail = null;
      wishlist = [];
      creatorHandle = null;
      creatorBio = null;
      creatorPicks = [];
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
      currentUserEmail = session.user.email;
      updateProfileUI(session.user);
      loadWishlist(currentUserId);
      loadProfilePoints(currentUserId);
      loadCreatorPage(currentUserId);
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
  document.getElementById('battle-share-btn')?.addEventListener('click', () => {
    shareContent(
      '고운 화장 배틀',
      '민지 vs Sakura, 어느 쪽 화장이 더 잘 어울려요? 투표해보세요! #고운 #GOUN #화장배틀'
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
  let currentUserEmail = null;

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

  /* ---------- Creator public page / 파우더룸 ("내 추천 페이지") ---------- */
  let creatorHandle = null;
  let creatorBio = null;
  let creatorPicks = [];

  function slugifyHandle(base) {
    let slug = (base || '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 16);
    if (slug.length < 3) slug = `goun${slug}`;
    return slug;
  }

  // 파우더룸은 모든 유저에게 기본 제공되므로, creator_pages에 아직 행이 없으면
  // 이메일 아이디에서 만든 핸들로 자동 생성한다 (수동 opt-in 단계 없음).
  async function ensureCreatorHandle(userId, email) {
    const base = slugifyHandle(email ? email.split('@')[0] : 'user');
    for (let attempt = 0; attempt < 5; attempt++) {
      const handle = attempt === 0 ? base : `${base}${Math.floor(1000 + Math.random() * 9000)}`;
      const { error } = await supabase.from('creator_pages').insert({ user_id: userId, handle });
      if (!error) return handle;
      if (error.code === '23505') {
        // user_id already has a row (e.g. a concurrent tab created it first) → use that one;
        // otherwise it was the handle string itself that collided → retry with a new suffix.
        const { data: existing } = await supabase
          .from('creator_pages')
          .select('handle')
          .eq('user_id', userId)
          .maybeSingle();
        if (existing?.handle) return existing.handle;
        continue;
      }
      console.error('[powderroom] ensure-handle-error', error);
      return null;
    }
    return null;
  }

  async function loadCreatorPage(userId) {
    let { data: page } = await supabase
      .from('creator_pages')
      .select('handle, bio')
      .eq('user_id', userId)
      .maybeSingle();

    if (!page) {
      const handle = await ensureCreatorHandle(userId, currentUserEmail);
      page = handle ? { handle, bio: null } : null;
    }
    creatorHandle = page?.handle || null;
    creatorBio = page?.bio || null;

    const handleInput = document.getElementById('creatorpage-handle-input');
    const bioInput = document.getElementById('creatorpage-bio-input');
    if (handleInput) handleInput.value = creatorHandle || '';
    if (bioInput) bioInput.value = page?.bio || '';

    document.getElementById('creatorpage-setup')?.classList.toggle('hidden', !!creatorHandle);
    const liveBox = document.getElementById('creatorpage-live');
    liveBox?.classList.toggle('hidden', !creatorHandle);
    if (creatorHandle) {
      const urlEl = document.getElementById('creatorpage-live-url');
      if (urlEl) urlEl.textContent = `${window.location.origin}/c/${creatorHandle}`;
    }

    const { data: picks } = await supabase
      .from('creator_picks')
      .select('brand, name, price, color, type')
      .eq('user_id', userId);
    creatorPicks = picks || [];
    renderCreatorProductList();
  }

  // 룩파인더/뷰티랩 결과 캔버스를 Storage에 올리고 feed_posts에 기록해서
  // 홈 피드 + 내 파우더룸에 나타나게 한다.
  async function postToFeed({ canvas, sourceType, caption, products }) {
    if (!currentUserId) throw new Error('no-user');
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.88));
    if (!blob) throw new Error('canvas-to-blob-failed');

    const path = `${currentUserId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('feed-photos')
      .upload(path, blob, { contentType: 'image/jpeg' });
    if (uploadError) throw uploadError;

    const { data: pub } = supabase.storage.from('feed-photos').getPublicUrl(path);
    const { error: insertError } = await supabase.from('feed_posts').insert({
      user_id: currentUserId,
      handle: creatorHandle,
      source_type: sourceType,
      image_url: pub.publicUrl,
      caption,
      products,
    });
    if (insertError) throw insertError;

    loadFeed();
    if (document.getElementById('view-powderroom')?.classList.contains('active')) loadPowderRoom();
  }

  async function loadPowderRoom() {
    if (!currentUserId) return;
    const avatarEl = document.getElementById('powder-avatar');
    const handleEl = document.getElementById('powder-handle');
    const bioEl = document.getElementById('powder-bio');
    const statsEl = document.getElementById('powder-stats');
    if (avatarEl) avatarEl.textContent = (creatorHandle || '고운')[0].toUpperCase();
    if (handleEl) handleEl.textContent = creatorHandle ? `@${creatorHandle}` : '설정 중...';
    if (bioEl) bioEl.textContent = creatorBio || '아직 소개가 없어요';

    const { data: posts } = await supabase
      .from('feed_posts')
      .select('id, source_type, image_url, products, likes')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false });
    const list = posts || [];
    const totalLikes = list.reduce((sum, p) => sum + (p.likes || 0), 0);
    if (statsEl) statsEl.textContent = `게시물 ${list.length} · 좋아요 ${totalLikes}`;
    const countEl = document.getElementById('powder-count');
    if (countEl) countEl.textContent = list.length ? `${list.length}개` : '';

    const grid = document.getElementById('powder-grid');
    const emptyEl = document.getElementById('powder-empty');
    if (!grid) return;
    emptyEl?.classList.toggle('hidden', list.length > 0);
    grid.innerHTML = list.map(p => `
      <div class="powder-shot" style="background-image:url(${p.image_url});background-size:cover;background-position:center;">
        <span class="dot" style="background:${p.source_type === 'lookfinder' ? 'var(--coral)' : 'var(--purple)'};"></span>
        <button class="powder-shot-delete" data-id="${p.id}" aria-label="삭제"><i data-icon="x"></i></button>
        ${p.products?.length ? `<span class="powder-shot-swatches">${p.products.map(pr => `<span class="grid-swatch" style="background:${pr.color}" title="${pr.brand} · ${pr.name}"></span>`).join('')}</span>` : ''}
        <span class="like"><span data-icon="heart"></span>${p.likes || 0}</span>
      </div>
    `).join('');
    paintIcons(grid);
    grid.querySelectorAll('.powder-shot-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!window.confirm('이 게시물을 삭제할까요?')) return;
        const id = btn.getAttribute('data-id');
        btn.disabled = true;
        const { error } = await supabase.from('feed_posts').delete().eq('id', id).eq('user_id', currentUserId);
        if (error) {
          showToast('삭제에 실패했어요');
          btn.disabled = false;
          return;
        }
        loadPowderRoom();
        loadFeed();
      });
    });
  }

  document.getElementById('powder-share-btn')?.addEventListener('click', () => {
    if (!creatorHandle) { showToast('파우더룸 링크를 준비하고 있어요, 잠시 후 다시 시도해주세요'); return; }
    shareContent('내 파우더룸을 공유해요', '고운에서 발라본 결과들을 구경해보세요 ✨ #고운 #GOUN #파우더룸', `${window.location.origin}/c/${creatorHandle}`);
  });

  function renderCreatorProductList() {
    const list = document.getElementById('creatorpage-product-list');
    if (!list) return;
    const pickedNames = new Set(creatorPicks.map(p => p.name));
    list.innerHTML = LAB_PRODUCTS.filter(p => !p.locked).map(p => {
      const picked = pickedNames.has(p.name);
      return `
        <button class="product-item${picked ? ' selected' : ''}" data-name="${p.name}">
          <span class="product-thumb" style="background:linear-gradient(145deg, ${p.color}, ${p.color}cc)">
            <span data-icon="${TYPE_ICON[p.type] || 'flask'}"></span>
            <span class="product-color-dot" style="background:${p.color}"></span>
          </span>
          <span class="product-info">
            <span class="product-brand">${p.brand}</span><br>
            <span class="product-name">${p.name}</span><br>
            <span class="product-price">${p.price}</span>
          </span>
          <span class="check-icon" data-icon="check" style="visibility:${picked ? 'visible' : 'hidden'}"></span>
        </button>
      `;
    }).join('');
    list.querySelectorAll('.product-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = LAB_PRODUCTS.find(p => p.name === btn.getAttribute('data-name'));
        if (product) toggleCreatorPick(product);
      });
    });
    paintIcons(list);
  }

  async function toggleCreatorPick(product) {
    if (!currentUserId) { showToast('로그인 후 이용해주세요'); return; }
    const { brand, name, price, color, type } = product;
    const already = creatorPicks.some(p => p.name === name);
    if (already) {
      creatorPicks = creatorPicks.filter(p => p.name !== name);
      renderCreatorProductList();
      await supabase.from('creator_picks').delete().eq('user_id', currentUserId).eq('name', name);
    } else {
      creatorPicks.push({ brand, name, price, color, type });
      renderCreatorProductList();
      await supabase.from('creator_picks').insert({ user_id: currentUserId, brand, name, price, color, type });
    }
  }

  document.getElementById('creatorpage-save-btn')?.addEventListener('click', async () => {
    if (!currentUserId) { showToast('로그인 후 이용해주세요'); return; }
    const handle = document.getElementById('creatorpage-handle-input')?.value.trim().toLowerCase();
    const bio = document.getElementById('creatorpage-bio-input')?.value.trim();
    if (!handle || !/^[a-z0-9_]{3,20}$/.test(handle)) {
      showToast('링크 주소는 영문 소문자/숫자/_ 3~20자로 입력해주세요');
      return;
    }
    const btn = document.getElementById('creatorpage-save-btn');
    btn.disabled = true;
    const { error } = await supabase
      .from('creator_pages')
      .upsert({ user_id: currentUserId, handle, bio }, { onConflict: 'user_id' });
    btn.disabled = false;
    if (error) {
      showToast(error.code === '23505' ? '이미 사용 중인 링크 주소예요' : '저장에 실패했어요, 다시 시도해주세요');
      return;
    }
    showToast('페이지가 만들어졌어요!');
    loadCreatorPage(currentUserId);
  });

  document.getElementById('creatorpage-copy-btn')?.addEventListener('click', async () => {
    if (!creatorHandle) return;
    const url = `${window.location.origin}/c/${creatorHandle}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('링크를 복사했어요');
    } catch {
      showToast(url);
    }
  });

  document.getElementById('creatorpage-share-btn')?.addEventListener('click', async () => {
    if (!creatorHandle) return;
    const url = `${window.location.origin}/c/${creatorHandle}`;
    if (navigator.share) {
      try { await navigator.share({ title: '내 고운 추천 페이지', url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showToast('링크를 복사했어요');
      } catch {
        showToast(url);
      }
    }
  });

  /* ---------- Look finder: read colors from a photo, match to our catalog ---------- */
  const LOOKFINDER_TYPE_LABEL = { lip: '입술', eye: '눈', blush: '볼터치' };

  function hexToRgb(hex) {
    return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }

  function colorDistance(hexA, hexB) {
    const [ra, ga, ba] = hexToRgb(hexA);
    const [rb, gb, bb] = hexToRgb(hexB);
    return Math.sqrt((ra - rb) ** 2 + (ga - gb) ** 2 + (ba - bb) ** 2);
  }

  function hexBrightness(hex) {
    const [r, g, b] = hexToRgb(hex);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  function findClosestProduct(type, hex) {
    let best = null, bestDist = Infinity;
    LAB_PRODUCTS.filter(p => p.type === type && !p.locked).forEach(p => {
      const d = colorDistance(hex, p.color);
      if (d < bestDist) { bestDist = d; best = p; }
    });
    return best;
  }

  function renderLookfinderMatch(type, detectedHex) {
    const label = LOOKFINDER_TYPE_LABEL[type];
    const product = detectedHex ? findClosestProduct(type, detectedHex) : null;
    if (!detectedHex || !product) {
      return `<p class="muted small" style="margin-bottom:10px;">${label}: 잘 안 보여서 찾지 못했어요</p>`;
    }
    return `
      <div style="display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:10px;">
        <span style="width:32px;height:32px;border-radius:999px;background:${detectedHex};box-shadow:0 0 0 1px var(--line);flex-shrink:0;"></span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B4ACB2" stroke-width="2" stroke-linecap="round" style="flex-shrink:0;"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        <span style="width:32px;height:32px;border-radius:999px;background:${product.color};flex-shrink:0;"></span>
        <div style="flex-grow:1;min-width:0;">
          <div style="font-size:10.5px;color:var(--ink-faint);">${label} 매칭 제품</div>
          <div style="font-size:13px;font-weight:700;">${product.brand} · ${product.name}</div>
        </div>
      </div>
    `;
  }

  let lookfinderColors = null;
  let lookfinderRefUrl = null;
  let lookfinderRefFile = null; // 원본 파일 — Perfect Corp 연동 시 공개 URL로 다시 올릴 때 씀
  let lookfinderResultCanvas = null;
  let lookfinderBaseCanvas = null; // 배경 적용 전 원본(화장 적용된) 캔버스 — 배경 프리셋 바꿀 때마다 여기서 다시 합성
  let lookfinderMask = null; // segmentPerson() 결과 캐시 — 배경 프리셋끼리 전환할 때 매번 다시 분석하지 않도록

  // 배경 프리셋: 10~20대 타깃이라 톤다운된 파스텔보다 또렷하고 화사한 그라데이션으로.
  // 흰색은 단일 색(그라데이션 없음) — 배열에 색 1개만 넣으면 단색으로 처리됨.
  const LOOKFINDER_BG_PRESETS = {
    white: ['#FFFFFF'],
    coral: ['#FF4D6D', '#7C5CFC'],
    purple: ['#B39DFF', '#5E3FE0'],
    mint: ['#3DE8C0', '#5B8DEF'],
    peach: ['#FFB199', '#FF5F9E'],
    lavender: ['#C9A7FF', '#FF9EC8'],
    sunset: ['#FFC371', '#FF5F6D'],
    sky: ['#89F7FE', '#5B8DEF'],
  };

  function showLookfinderStep(step) {
    document.getElementById('lookfinder-step1')?.classList.toggle('hidden', step !== 'step1');
    document.getElementById('lookfinder-step2')?.classList.toggle('hidden', step !== 'step2');
    document.getElementById('lookfinder-loading')?.classList.toggle('hidden', step !== 'loading');
    document.getElementById('lookfinder-result')?.classList.toggle('hidden', step !== 'result');
  }

  function resetLookfinder() {
    lookfinderColors = null;
    lookfinderRefUrl = null;
    lookfinderRefFile = null;
    lookfinderResultCanvas = null;
    lookfinderBaseCanvas = null;
    lookfinderMask = null;
    document.querySelectorAll('#lookfinder-bg-chips .chip').forEach(c => c.classList.toggle('active', c.getAttribute('data-bg') === 'none'));
    showLookfinderStep('step1');
    const refInput = document.getElementById('lookfinder-ref-input');
    if (refInput) refInput.value = '';
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // 다른 도메인(Perfect Corp 결과 URL 등)에서 온 이미지를 캔버스에 그려도
      // toDataURL/toBlob이 막히지 않으려면 필요함 — 같은 도메인/blob: URL엔 영향 없음.
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  document.getElementById('lookfinder-ref-input')?.addEventListener('change', async function () {
    const file = this.files?.[0];
    if (!file) return;

    showLookfinderStep('loading');
    document.getElementById('lookfinder-loading-text').textContent = '사진 속 화장 색을 분석하고 있어요...';

    try {
      const url = URL.createObjectURL(file);
      const img = await loadImage(url);
      const colors = await withTimeout(analyzeLookColors(img), 15000, '분석이 너무 오래 걸려요. 다시 시도해주세요');
      if (!colors.faceFound) {
        showToast('사진에서 얼굴을 찾지 못했어요. 다른 사진으로 시도해주세요');
        resetLookfinder();
        return;
      }
      lookfinderColors = colors;
      lookfinderRefUrl = url;
      lookfinderRefFile = file;
      showLookfinderStep('step2');
    } catch (err) {
      console.error('[lookfinder] analyze-error', err);
      showToast('분석에 실패했어요. 다시 시도해주세요');
      resetLookfinder();
    }
  });

  document.getElementById('lookfinder-selfie-btn')?.addEventListener('click', () => {
    if (!lookfinderColors) return;
    if (!currentUserId) {
      showToast('로그인 후 이용해주세요');
      return;
    }
    openPhotoCamera('내 사진 촬영', handleLookfinderSelfieCapture);
  });

  // Perfect Corp "AI 메이크업 트랜스퍼" 연동 — PERFECTCORP_API_KEY가 서버에
  // 없으면 /api/makeup-transfer가 501 "not_configured"를 주고, 그러면 이
  // 함수가 던진 에러를 handleLookfinderSelfieCapture가 잡아서 조용히 무료
  // MediaPipe 엔진으로 넘어감 (키 없는 지금도 화면엔 아무 차이 없음, 키
  // 넣는 순간 자동으로 고화질 엔진이 켜짐).
  async function uploadTempPublicPhoto(blob, path) {
    const { error } = await supabase.storage.from('feed-photos').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('feed-photos').getPublicUrl(path);
    return data.publicUrl;
  }

  async function runPerfectCorpMakeupTransfer(selfieCanvas, refFile) {
    const ts = Date.now();
    const selfieBlob = await new Promise(resolve => selfieCanvas.toBlob(resolve, 'image/jpeg', 0.9));
    const [srcUrl, refUrl] = await Promise.all([
      uploadTempPublicPhoto(selfieBlob, `${currentUserId}/pc-tmp/src-${ts}.jpg`),
      uploadTempPublicPhoto(refFile, `${currentUserId}/pc-tmp/ref-${ts}.jpg`),
    ]);

    const startRes = await fetch('/api/makeup-transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ srcUrl, refUrl }),
    });
    const startData = await startRes.json();
    if (!startRes.ok) throw new Error(startData?.error || 'not_configured');

    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 2000));
      const statusRes = await fetch(`/api/makeup-transfer/status?taskId=${encodeURIComponent(startData.taskId)}`);
      const statusData = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusData?.error || 'status_failed');
      if (statusData.task_status === 'success' && statusData.url) return statusData.url;
      if (statusData.task_status === 'error') throw new Error(statusData.error_message || statusData.error || 'transfer_failed');
    }
    throw new Error('timeout');
  }

  async function handleLookfinderSelfieCapture(canvas) {
    if (!lookfinderColors || !currentUserId) return;

    // AI 티켓 제한 테스트 중 임시로 끔 (반복 테스트할 때마다 막혀서 방해됨) —
    // consumeAiTicket() 자체는 그대로 있으니, 다시 켤 땐 아래 줄만 원복하면 됨.
    // const ticket = await consumeAiTicket(currentUserId);
    const ticket = { ok: true, method: 'free', remainingFree: 999 };
    if (!ticket.ok) {
      showToast(`무료 체험을 다 썼고 포인트도 부족해요 (${ticket.pointsNeeded}P 더 필요). 친구를 초대하면 포인트를 받을 수 있어요!`);
      goTo('mypage');
      return;
    }

    showLookfinderStep('loading');
    document.getElementById('lookfinder-loading-text').textContent = '내 얼굴에 화장을 입히고 있어요...';

    try {
      let resultCanvas = null;
      let faceFound = true;

      // 1순위: Perfect Corp 고화질 엔진. 아직 API 키가 없으면 서버가
      // "not_configured"로 즉시 거절하고, 아래 catch에서 조용히 2순위로 넘어감.
      if (lookfinderRefFile) {
        try {
          const resultUrl = await withTimeout(runPerfectCorpMakeupTransfer(canvas, lookfinderRefFile), 30000, 'timeout');
          const resultImg = await loadImage(resultUrl);
          resultCanvas = document.createElement('canvas');
          resultCanvas.width = resultImg.naturalWidth;
          resultCanvas.height = resultImg.naturalHeight;
          resultCanvas.getContext('2d').drawImage(resultImg, 0, 0);
        } catch (pcErr) {
          if (pcErr?.message !== 'not_configured') console.error('[lookfinder] perfectcorp-error', pcErr);
        }
      }

      // 2순위: 무료 MediaPipe 엔진 (Perfect Corp 미설정이거나 실패했을 때)
      if (!resultCanvas) {
        const applied = await withTimeout(applyDetectedLook(canvas, lookfinderColors), 15000, '적용이 너무 오래 걸려요. 다시 시도해주세요');
        resultCanvas = applied.canvas;
        faceFound = applied.faceFound;
      }

      if (!faceFound) {
        showToast('사진에서 얼굴을 찾지 못했어요. 다시 촬영해주세요');
        showLookfinderStep('step2');
        return;
      }
      document.getElementById('lookfinder-ref-img').src = lookfinderRefUrl;
      document.getElementById('lookfinder-selfie-img').src = resultCanvas.toDataURL('image/jpeg', 0.92);
      lookfinderResultCanvas = resultCanvas;
      lookfinderBaseCanvas = resultCanvas;
      lookfinderMask = null;
      document.querySelectorAll('#lookfinder-bg-chips .chip').forEach(c => c.classList.toggle('active', c.getAttribute('data-bg') === 'none'));
      const matches = document.getElementById('lookfinder-matches');
      if (matches) {
        matches.innerHTML = ['lip', 'eye', 'blush'].map(type => renderLookfinderMatch(type, lookfinderColors[type])).join('');
      }
      showLookfinderStep('result');
      loadProfilePoints(currentUserId);
      if (ticket.method === 'free') {
        showToast(ticket.remainingFree > 0 ? `무료 체험 ${ticket.remainingFree}회 남았어요` : '무료 체험을 다 썼어요. 다음부턴 990P가 사용돼요');
      } else {
        showToast('990P를 사용해서 분석했어요');
      }
    } catch (err) {
      console.error('[lookfinder] apply-error', err);
      showToast('적용에 실패했어요. 다시 시도해주세요');
      showLookfinderStep('step2');
    }
  }

  document.querySelectorAll('#lookfinder-bg-chips .chip').forEach(chip => {
    chip.addEventListener('click', async () => {
      if (!lookfinderBaseCanvas) return;
      const key = chip.getAttribute('data-bg');
      document.querySelectorAll('#lookfinder-bg-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      if (key === 'none') {
        lookfinderResultCanvas = lookfinderBaseCanvas;
        document.getElementById('lookfinder-selfie-img').src = lookfinderBaseCanvas.toDataURL('image/jpeg', 0.92);
        return;
      }

      chip.disabled = true;
      try {
        if (!lookfinderMask) {
          lookfinderMask = await withTimeout(segmentPerson(lookfinderBaseCanvas), 15000, '배경 분리가 너무 오래 걸려요. 다시 시도해주세요');
        }
        const preset = LOOKFINDER_BG_PRESETS[key];
        let fill = preset[0];
        if (preset.length > 1) {
          // Gradient must span the actual photo's height, not the AI mask's
          // (much smaller) native resolution — otherwise the color stops finish
          // within the first sliver of the image and the rest renders as one
          // flat solid color instead of a visible gradient.
          const gradient = document.createElement('canvas').getContext('2d').createLinearGradient(0, 0, 0, lookfinderBaseCanvas.height);
          gradient.addColorStop(0, preset[0]);
          gradient.addColorStop(1, preset[1]);
          fill = gradient;
        }
        const composited = compositeOntoBackground(lookfinderBaseCanvas, lookfinderMask.mask, lookfinderMask.w, lookfinderMask.h, fill);
        lookfinderResultCanvas = composited;
        document.getElementById('lookfinder-selfie-img').src = composited.toDataURL('image/jpeg', 0.92);
      } catch (err) {
        console.error('[lookfinder] bg-error', err);
        showToast(`배경 적용에 실패했어요: ${err?.message || err} — 원본으로 유지할게요`);
        chip.classList.remove('active');
        document.querySelector('#lookfinder-bg-chips .chip[data-bg="none"]')?.classList.add('active');
      } finally {
        chip.disabled = false;
      }
    });
  });

  document.getElementById('lookfinder-post-btn')?.addEventListener('click', async () => {
    if (!currentUserId || !lookfinderResultCanvas) return;
    const btn = document.getElementById('lookfinder-post-btn');
    btn.disabled = true;
    try {
      const products = ['lip', 'eye', 'blush']
        .map(type => lookfinderColors?.[type] ? findClosestProduct(type, lookfinderColors[type]) : null)
        .filter(Boolean)
        .map(p => ({ brand: p.brand, name: p.name, price: p.price, color: p.color, type: p.type }));
      await postToFeed({
        canvas: lookfinderResultCanvas,
        sourceType: 'lookfinder',
        caption: '인플루언서 화장법 따라하기 결과',
        products,
      });
      showToast('파우더룸에 올렸어요!');
    } catch (err) {
      console.error('[lookfinder] post-error', err);
      showToast('올리기에 실패했어요. 다시 시도해주세요');
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('lookfinder-share-btn')?.addEventListener('click', () => {
    shareContent('고운에서 인플루언서 화장법 따라해봤어요', '나도 이 룩 따라할 수 있을까? 고운에서 비슷한 제품도 바로 찾아줘요 ✨ #고운 #GOUN');
  });

  document.getElementById('lookfinder-retry-btn')?.addEventListener('click', resetLookfinder);

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
