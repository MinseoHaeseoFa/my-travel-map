/**
 * 나의 여행 지도 (My Travel Map) Hub App
 * - 10선 추천 여행지 쇼케이스 (원형 썸네일 선택 + 검색)
 * - 위치 기반 실시간 현재 날씨 (Geolocation + Open-Meteo + 한국어 역지오코딩)
 * - Google Apps Script 실시간 달성율 연계 (국내 167 · 세계 195 · 명산 100)
 */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwylu_1JxOFwI66iI3X0Fc7IQz7PiA5zJKjrjZkvNF1XzPKVzmvLZSHnB-bilwVdawE/exec';

const DESTINATIONS = [
  {
    id: 1,
    category: 'FEATURED DESTINATION · 세계 여행',
    title: '산토리니',
    country: '그리스 · Santorini, Greece',
    desc: '하얀 절벽 마을과 푸른 돔, 에게해의 황홀한 노을이 반기는 지중해 대표 휴양지',
    image: 'images/dest-01-santorini.jpg',
    url: 'https://world-travel-map-blush.vercel.app/'
  },
  {
    id: 2,
    category: 'FEATURED DESTINATION · 세계 여행',
    title: '아말피 코스트',
    country: '이탈리아 · Amalfi Coast, Italy',
    desc: '가파른 해안 절벽에 보석처럼 박힌 파스텔 마을과 에메랄드빛 지중해 드라이브 코스',
    image: 'images/dest-02-amalfi.jpg',
    url: 'https://world-travel-map-blush.vercel.app/'
  },
  {
    id: 3,
    category: 'FEATURED DESTINATION · 세계 여행',
    title: '인터라켄',
    country: '스위스 · Interlaken, Switzerland',
    desc: '융프라우의 만년설과 에메랄드빛 툰 호수·브리엔츠 호수가 어우러진 알프스 관문',
    image: 'images/dest-03-interlaken.jpg',
    url: 'https://world-travel-map-blush.vercel.app/'
  },
  {
    id: 4,
    category: 'FEATURED DESTINATION · 세계 여행',
    title: '발리 누사페니다',
    country: '인도네시아 · Bali, Indonesia',
    desc: '거친 석회암 절벽과 눈부신 청록빛 바다가 만나는 인도양의 비밀 휴양 섬',
    image: 'images/dest-04-bali.jpg',
    url: 'https://world-travel-map-blush.vercel.app/'
  },
  {
    id: 5,
    category: 'FEATURED DESTINATION · 대한민국 여행',
    title: '제주 성산일출봉',
    country: '대한민국 제주 · Jeju Island, Korea',
    desc: '푸른 바다 위로 솟아오른 거대한 화산 분화구와 아침 햇살이 장관을 이루는 명소',
    image: 'images/dest-05-jeju.jpg',
    url: 'https://korea-travel-map-ebon.vercel.app/'
  },
  {
    id: 6,
    category: 'FEATURED DESTINATION · 100대 명산',
    title: '설악산 울산바위',
    country: '대한민국 강원 · Seoraksan, Korea',
    desc: '웅장한 화강암 암봉과 오색 단풍 능선이 하늘과 맞닿은 대한민국 대표 명산',
    image: 'images/dest-06-seoraksan.jpg',
    url: 'https://mountain-travel-map.vercel.app/'
  },
  {
    id: 7,
    category: 'FEATURED DESTINATION · 대한민국 여행',
    title: '경주 보문호',
    country: '대한민국 경북 · Gyeongju, Korea',
    desc: '천년 고도의 품격과 고요한 호수, 벚꽃이 어우러지는 대한민국 역사 여행지',
    image: 'images/dest-07-gyeongju.jpg',
    url: 'https://korea-travel-map-ebon.vercel.app/'
  },
  {
    id: 8,
    category: 'FEATURED DESTINATION · 세계 여행',
    title: '파리 센강',
    country: '프랑스 · Paris, France',
    desc: '고풍스러운 다리와 황금빛 노을이 강물 위에 반짝이는 낭만의 도시 파리',
    image: 'images/dest-08-paris.jpg',
    url: 'https://world-travel-map-blush.vercel.app/'
  },
  {
    id: 9,
    category: 'FEATURED DESTINATION · 세계 여행',
    title: '교토 아라시야마',
    country: '일본 · Kyoto, Japan',
    desc: '고요한 대나무 숲길과 고즈넉한 목조 사찰이 마음을 쉬게 하는 천년의 도시',
    image: 'images/dest-09-kyoto.jpg',
    url: 'https://world-travel-map-blush.vercel.app/'
  },
  {
    id: 10,
    category: 'FEATURED DESTINATION · 100대 명산',
    title: '한라산 백록담',
    country: '대한민국 제주 · Hallasan, Korea',
    desc: '구름 위 1,947m 정상에 담긴 신비로운 화구호와 끝없는 능선의 감동',
    image: 'images/dest-10-hallasan.jpg',
    url: 'https://mountain-travel-map.vercel.app/'
  }
];

let activeIndex = 0;

function renderThumbStrip() {
  const strip = document.getElementById('thumb-strip');
  if (!strip) return;
  strip.innerHTML = '';

  DESTINATIONS.forEach((dest, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `thumb-btn${idx === activeIndex ? ' active' : ''}`;
    btn.title = `${dest.title} (${dest.country.split('·')[0].trim()})`;
    btn.setAttribute('aria-label', dest.title);
    btn.innerHTML = `<img src="${dest.image}" alt="${dest.title}">`;
    btn.addEventListener('click', () => selectDestination(idx));
    strip.appendChild(btn);
  });
}

function selectDestination(idx) {
  activeIndex = (idx + DESTINATIONS.length) % DESTINATIONS.length;
  const dest = DESTINATIONS[activeIndex];

  const imgEl = document.getElementById('hero-bg-img');
  if (imgEl) {
    imgEl.style.opacity = '0.55';
    imgEl.src = dest.image;
    imgEl.alt = dest.title;
    requestAnimationFrame(() => {
      imgEl.style.opacity = '1';
    });
  }

  document.getElementById('hero-category').textContent = dest.category;
  document.getElementById('hero-title').textContent = dest.title;
  document.getElementById('hero-country').textContent = dest.country;
  document.getElementById('hero-desc').textContent = dest.desc;
  document.getElementById('hero-explore-btn').href = dest.url;

  document.querySelectorAll('.thumb-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === activeIndex);
  });
}

function initHeroControls() {
  renderThumbStrip();
  selectDestination(0);

  document.getElementById('hero-prev')?.addEventListener('click', () => {
    selectDestination(activeIndex - 1);
  });
  document.getElementById('hero-next')?.addEventListener('click', () => {
    selectDestination(activeIndex + 1);
  });

  const searchInput = document.getElementById('dest-search-input');
  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return;
    const foundIdx = DESTINATIONS.findIndex(
      d => d.title.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)
    );
    if (foundIdx !== -1) {
      selectDestination(foundIdx);
    }
  });
}

function weatherCodeToLabel(code) {
  if (code === 0) return '맑음 ☀️';
  if (code === 1 || code === 2) return '구름 조금 ⛅';
  if (code === 3) return '흐림 ☁️';
  if (code >= 45 && code <= 48) return '안개 🌫️';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '비 🌧️';
  if ((code >= 71 && code <= 77) || (code === 85 || code === 86)) return '눈 ❄️';
  if (code >= 95) return '뇌우 ⛈️';
  return '맑음 🌤️';
}

async function fetchWeatherForCoords(lat, lon, fallbackLabel) {
  const tempEl = document.getElementById('weather-temp');
  const condEl = document.getElementById('weather-cond');
  const locEl = document.getElementById('weather-location');

  try {
    const weatherPromise = fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
    ).then(r => r.json());

    const geoPromise = fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ko`
    ).then(r => r.json()).catch(() => null);

    const [weatherJson, geoJson] = await Promise.all([weatherPromise, geoPromise]);

    if (weatherJson && weatherJson.current) {
      const temp = Math.round(weatherJson.current.temperature_2m);
      const code = weatherJson.current.weather_code;
      tempEl.textContent = `${temp}°`;
      condEl.textContent = weatherCodeToLabel(code);
    }

    if (geoJson) {
      const place = [geoJson.city || geoJson.principalSubdivision, geoJson.locality]
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 2)
        .join(' ');
      locEl.textContent = place || fallbackLabel;
    } else {
      locEl.textContent = fallbackLabel;
    }
  } catch (err) {
    console.error('Weather fetch error:', err);
    condEl.textContent = '날씨 확인 실패';
    locEl.textContent = fallbackLabel;
  }
}

function loadLocationWeather() {
  const locEl = document.getElementById('weather-location');
  locEl.textContent = '내 위치 확인 중...';

  if (!navigator.geolocation) {
    fetchWeatherForCoords(36.8151, 127.1139, '천안시 (기본 위치)');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      fetchWeatherForCoords(pos.coords.latitude, pos.coords.longitude, '현재 내 위치');
    },
    () => {
      fetchWeatherForCoords(36.8151, 127.1139, '천안시 (위치 권한 미허용)');
    },
    { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 }
  );
}

async function loadRealAchievements() {
  const syncBadge = document.getElementById('sync-badge');
  if (syncBadge) syncBadge.textContent = '동기화 중...';

  try {
    const [koreaRes, worldRes, mountainRes] = await Promise.all([
      fetch(`${GOOGLE_SCRIPT_URL}?action=korea`).then(r => r.json()).catch(() => null),
      fetch(`${GOOGLE_SCRIPT_URL}?action=world`).then(r => r.json()).catch(() => null),
      fetch(`${GOOGLE_SCRIPT_URL}?action=mountain`).then(r => r.json()).catch(() => null)
    ]);

    const koreaData = (koreaRes && koreaRes.korea) ? koreaRes.korea : {};
    const worldData = (worldRes && worldRes.world) ? worldRes.world : {};
    const mountainData = (mountainRes && mountainRes.mountain) ? mountainRes.mountain : {};

    const koreaCount = Object.values(koreaData).filter(v => Number(v.level) > 0).length;
    const worldCount = Object.values(worldData).filter(v => v.status === 'visited' || Number(v.level) > 0).length;
    const mountainCount = Object.values(mountainData).filter(v => v.status === 'climbed' || v.status === 'visited').length;

    const koreaPct = ((koreaCount / 167) * 100).toFixed(1);
    const worldPct = ((worldCount / 195) * 100).toFixed(1);
    const mountainPct = ((mountainCount / 100) * 100).toFixed(1);

    document.getElementById('korea-stat-text').textContent = `${koreaCount} / 167 시·군 방문`;
    document.getElementById('korea-bar').style.width = `${Math.min(100, Number(koreaPct))}%`;
    document.getElementById('korea-percent').textContent = `${koreaPct}%`;

    document.getElementById('world-stat-text').textContent = `${worldCount} / 195 개국 방문`;
    document.getElementById('world-bar').style.width = `${Math.min(100, Number(worldPct))}%`;
    document.getElementById('world-percent').textContent = `${worldPct}%`;

    document.getElementById('mountain-stat-text').textContent = `${mountainCount} / 100 명산 완등`;
    document.getElementById('mountain-bar').style.width = `${Math.min(100, Number(mountainPct))}%`;
    document.getElementById('mountain-percent').textContent = `${mountainPct}%`;

    const totalPlaces = koreaCount + worldCount + mountainCount;
    document.getElementById('total-summary-title').textContent = `총 ${totalPlaces}곳 기록 중`;
    document.getElementById('total-summary-sub').textContent = `국내 ${koreaCount} · 세계 ${worldCount} · 명산 ${mountainCount}`;

    if (syncBadge) syncBadge.textContent = '실시간 연동';
  } catch (err) {
    console.error('Achievement fetch error:', err);
    if (syncBadge) syncBadge.textContent = '연동 오류';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroControls();
  loadLocationWeather();
  loadRealAchievements();

  document.getElementById('refresh-weather-btn')?.addEventListener('click', loadLocationWeather);
  document.getElementById('btn-sync-refresh')?.addEventListener('click', loadRealAchievements);
});
