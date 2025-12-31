// generlmoo dashboard - best-effort status checks
// NOTE: Browsers may block cross-origin checks due to CORS. This script still provides a useful "best effort".

const SERVICES = [
  {
    key: "files",
    url: "https://files.generlmoo.me",
    label: "files.generlmoo.me",
    // FileBrowser serves icons under /static/img/icons/ (root /favicon.* returns HTML here).
    probePaths: ["/static/img/icons/favicon.ico", "/static/img/icons/favicon.svg"],
  },
  {
    key: "watch",
    url: "https://watch.generlmoo.me",
    label: "watch.generlmoo.me",
    // Jellyfin (new UI) uses hashed favicon assets under /web/.
    // Note: if Jellyfin is upgraded, these may change; in that case update these paths.
    probePaths: [
      "/web/favicon.bc8d51405ec040305a87.ico",
      "/web/touchicon.f5bbb798cb2c65908633.png",
      "/web/favicon.ico",
      "/favicon.ico",
    ],
  },
  {
    key: "nas",
    url: "https://nas.generlmoo.me",
    label: "nas.generlmoo.me",
    probePaths: ["/favicon.ico", "/favicon.svg"],
  },
  {
    key: "pihole",
    url: "https://pihole.generlmoo.me",
    label: "pihole.generlmoo.me",
    probePaths: ["/admin/img/favicons/favicon.ico", "/admin/favicon.ico", "/favicon.ico"],
  },
];

// --- Mascot face controller (sprite sheet: 4 cols x 2 rows) ---
const mascot = document.getElementById("mascot");

// faces.png layout (4 cols x 2 rows):
// normal | idle1 | sad | interested
// happy  | angry | idle2 | idle3
const FACE = {
  normal: 0,
  idle1: 1,
  sad: 2,
  interested: 3,
  happy: 4,
  angry: 5,
  idle2: 6,
  idle3: 7,
};

let mascotSwitchTimer = null;
let mascotLockTimer = null;
let mascotLockUntil = 0;
let annoyedLevel = 0;
let lastActivityAt = Date.now();
let sleepLevel = 0; // 0=normal, 1=idle1, 2=idle2, 3=idle3
let sleepTimer = null;
let wakeTimer = null;
let isInterested = false;

const IDLE1_MS = 20 * 1000;
const IDLE2_MS = 60 * 1000;
const IDLE3_MS = 70 * 1000;

function setMascotFrame(index) {
  if (!mascot) return;

  const clamped = Math.max(0, Math.min(7, index));
  const col = clamped % 4;
  const row = Math.floor(clamped / 4);

  mascot.classList.add("is-switching");
  // Sprite-sheet tuning for the provided faces.png (364x183px, ~90px tiles with ~1px gutters).
  const sheetW = 364;
  const sheetH = 183;
  const tile = 90;
  const gutter = 1;
  const borderX = 1;
  const borderY = 1;

  const target = 44;
  const scale = target / tile;

  const scaledSheetW = sheetW * scale;
  const scaledSheetH = sheetH * scale;
  mascot.style.setProperty("--sheet-w", `${scaledSheetW}px`);
  mascot.style.setProperty("--sheet-h", `${scaledSheetH}px`);

  const x = -(borderX + col * (tile + gutter)) * scale;
  const y = -(borderY + row * (tile + gutter)) * scale;
  mascot.style.setProperty("--x", `${x}px`);
  mascot.style.setProperty("--y", `${y}px`);

  clearTimeout(mascotSwitchTimer);
  mascotSwitchTimer = setTimeout(() => mascot.classList.remove("is-switching"), 180);
}

function lockMascot(ms) {
  mascotLockUntil = Math.max(mascotLockUntil, Date.now() + ms);
  clearTimeout(mascotLockTimer);
  mascotLockTimer = setTimeout(() => {
    mascotLockUntil = 0;
  }, ms + 25);
}

function setMascotMood(mood, { lockMs = 0 } = {}) {
  if (!mascot) return;
  if (Date.now() < mascotLockUntil) return;
  const idx = FACE[mood] ?? FACE.normal;
  setMascotFrame(idx);
  if (lockMs > 0) lockMascot(lockMs);
}

setMascotFrame(FACE.happy);

function markActivity() {
  lastActivityAt = Date.now();
}

function clearSleepTimers() {
  clearTimeout(sleepTimer);
  sleepTimer = null;
}

function scheduleSleepChecks() {
  if (!mascot) return;
  clearSleepTimers();

  const tick = () => {
    const idleMs = Date.now() - lastActivityAt;

    if (!isInterested) {
      if (idleMs >= IDLE3_MS) {
        if (sleepLevel !== 3) {
          sleepLevel = 3;
          setMascotMood("idle3");
        }
      } else if (idleMs >= IDLE2_MS) {
        if (sleepLevel !== 2) {
          sleepLevel = 2;
          setMascotMood("idle2");
        }
      } else if (idleMs >= IDLE1_MS) {
        if (sleepLevel !== 1) {
          sleepLevel = 1;
          setMascotMood("idle1");
        }
      } else if (sleepLevel !== 0) {
        sleepLevel = 0;
        setMascotMood("normal");
      }
    }

    sleepTimer = setTimeout(tick, 1000);
  };

  tick();
}

function cancelWakeSequence() {
  clearTimeout(wakeTimer);
  wakeTimer = null;
}

function wakeUpSequence() {
  if (!mascot) return;
  if (Date.now() < mascotLockUntil) return;

  cancelWakeSequence();
  if (sleepLevel === 0) return;

  const steps =
    sleepLevel === 3
      ? ["idle3", "idle2", "idle1", "normal"]
      : sleepLevel === 2
        ? ["idle2", "idle1", "normal"]
        : ["idle1", "normal"];
  let idx = 0;

  const next = () => {
    setMascotMood(steps[idx]);
    idx += 1;
    if (idx >= steps.length) {
      sleepLevel = 0;
      if (isInterested) setMascotMood("interested");
      return;
    }
    wakeTimer = setTimeout(next, 140);
  };

  next();
}

function pokeMascot() {
  annoyedLevel = Math.min(6, annoyedLevel + 1);
  if (annoyedLevel >= 3) setMascotFrame(FACE.angry);
  else setMascotFrame(FACE.happy);

  lockMascot(800);
  setTimeout(() => {
    annoyedLevel = Math.max(0, annoyedLevel - 1);
    if (annoyedLevel === 0) {
      if (sleepLevel === 3) setMascotMood("idle3");
      else if (sleepLevel === 2) setMascotMood("idle2");
      else setMascotMood("normal");
    }
  }, 1200);
}

mascot?.addEventListener("click", pokeMascot);
mascot?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    pokeMascot();
  }
});

function attachButtonInterestHandlers() {
  const interactive = Array.from(document.querySelectorAll("button, a, input, select, textarea")).filter(
    (el) => el instanceof HTMLElement && !el.hasAttribute("disabled")
  );

  for (const el of interactive) {
    el.addEventListener("mouseenter", () => {
      isInterested = true;
      if (el.matches?.('[data-service="watch"]')) setMascotMood("happy");
      else if (el.matches?.('[data-service="pihole"]')) setMascotMood("angry");
      else setMascotMood("interested");
    });
    el.addEventListener("mouseleave", () => {
      isInterested = false;
      if (sleepLevel === 3) setMascotMood("idle3");
      else if (sleepLevel === 2) setMascotMood("idle2");
      else if (sleepLevel === 1) setMascotMood("idle1");
      else setMascotMood("normal");
    });
    el.addEventListener("focus", () => {
      isInterested = true;
      if (el.matches?.('[data-service="watch"]')) setMascotMood("happy");
      else if (el.matches?.('[data-service="pihole"]')) setMascotMood("angry");
      else setMascotMood("interested");
    });
    el.addEventListener("blur", () => {
      isInterested = false;
      if (sleepLevel === 3) setMascotMood("idle3");
      else if (sleepLevel === 2) setMascotMood("idle2");
      else if (sleepLevel === 1) setMascotMood("idle1");
      else setMascotMood("normal");
    });
  }
}

function attachActivityHandlers() {
  const onActivity = (e) => {
    if (e && (e.type === "mousemove" || e.type === "pointermove")) {
      const dx = typeof e.movementX === "number" ? e.movementX : 0;
      const dy = typeof e.movementY === "number" ? e.movementY : 0;
      if (dx === 0 && dy === 0) return;
    }
    const wasAsleep = sleepLevel !== 0;
    markActivity();
    if (wasAsleep) wakeUpSequence();
  };

  window.addEventListener("mousemove", onActivity, { passive: true });
  window.addEventListener("pointermove", onActivity, { passive: true });
  window.addEventListener("mousedown", onActivity, { passive: true });
  window.addEventListener("keydown", onActivity, { passive: true });
  window.addEventListener("touchstart", onActivity, { passive: true });
  window.addEventListener("scroll", onActivity, { passive: true });
}

attachButtonInterestHandlers();
attachActivityHandlers();
scheduleSleepChecks();

function joinUrl(base, path) {
  try {
    return new URL(path, base).toString();
  } catch {
    return `${base}${path}`;
  }
}

function probeImage(url, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;

    const finish = (ok) => {
      if (done) return;
      done = true;
      clearTimeout(t);
      img.onload = null;
      img.onerror = null;
      resolve(ok);
    };

    const t = setTimeout(() => finish(false), timeoutMs);
    img.onload = () => finish(true);
    img.onerror = () => finish(false);

    // Cache-bust so we don't keep a stale "success" around.
    const bust = url.includes("?") ? `&_=${Date.now()}` : `?_=${Date.now()}`;
    img.src = `${url}${bust}`;
  });
}

async function probeFetch(url, timeoutMs = 5000) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    
    // Use no-cors mode to bypass CORS restrictions
    // We only care if the request completes, not the response content
    const response = await fetch(url, {
      // Some proxies/apps mishandle HEAD and fail the request entirely; GET is more reliable.
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    // In no-cors mode, response.type will be 'opaque' if request succeeded
    // Any response (even errors) means the server is reachable
    return true;
  } catch (e) {
    // Network error or timeout
    return false;
  }
}

async function checkService(service) {
  const paths =
    Array.isArray(service.probePaths) && service.probePaths.length > 0 ? service.probePaths : ["/favicon.ico"];

  // Use image probes so Cloudflare-origin error pages (HTML) count as Offline.
  for (const p of paths) {
    const ok = await probeImage(joinUrl(service.url, p));
    if (ok) return "up";
  }

  return "down";
}

function setStatus(key, state, text) {
  const card = document.querySelector(`[data-service="${key}"]`);
  if (!card) return;

  const status = card.querySelector(".status");
  const statusText = card.querySelector(".status-text");
  if (!status || !statusText) return;

  status.dataset.status = state;
  statusText.textContent = text;
}

function stampLastCheck() {
  const el = document.getElementById("last-check");
  if (!el) return;
  const now = new Date();
  el.textContent = `Last check: ${now.toLocaleString()}`;
}

async function refreshAll() {
  for (const s of SERVICES) setStatus(s.key, "down", "Offline");
  stampLastCheck();

  await Promise.allSettled(
    SERVICES.map(async (s) => {
      const state = await checkService(s);

      if (state === "up") {
        setStatus(s.key, "up", "Online");
      } else {
        setStatus(s.key, "down", "Offline");
      }
    })
  );

  stampLastCheck();
}

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("btn-refresh").addEventListener("click", () => {
  setMascotMood("sad", { lockMs: 700 });
  refreshAll();
});
refreshAll();

// ---- Weather (Open-Meteo) ----
const weatherBtn = document.getElementById("btn-weather");
const weatherStatus = document.getElementById("weather-status");
const weatherSub = document.getElementById("weather-sub");
const weatherLine = document.getElementById("weather-line");

const WMO = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm hail",
  99: "Heavy hail",
};

function setWeatherUi({ status, sub, line }) {
  if (weatherStatus && typeof status === "string") weatherStatus.textContent = status;
  if (weatherSub && typeof sub === "string") weatherSub.textContent = sub;
  if (weatherLine && typeof line === "string") weatherLine.textContent = line;
}

function getStoredCoords() {
  try {
    const raw = localStorage.getItem("weather.coords.v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.lat !== "number" || typeof parsed.lon !== "number") return null;
    if (typeof parsed.ts !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function storeCoords(lat, lon) {
  try {
    localStorage.setItem("weather.coords.v1", JSON.stringify({ lat, lon, ts: Date.now() }));
  } catch {
    // ignore
  }
}

function getPosition({ timeout = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout,
      maximumAge: 10 * 60 * 1000,
    });
  });
}

async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("weather fetch failed");
  return res.json();
}

async function refreshWeather({ forceLocation = false } = {}) {
  if (!weatherSub || !weatherLine) return;

  const stored = getStoredCoords();
  const canUseStored = stored && !forceLocation;

  // Most browsers require a user gesture for the geolocation permission prompt.
  // On first load, don't request location automatically; wait for the user to click Refresh.
  if (!canUseStored && !forceLocation) {
    setWeatherUi({ status: "idle", sub: "Click Refresh to allow location.", line: "--" });
    return;
  }

  if (canUseStored) {
    setWeatherUi({ status: "fetching", sub: "Updating from last location...", line: "--" });
    try {
      const data = await fetchWeather(stored.lat, stored.lon);
      const c = data.current;
      const desc = WMO[c.weather_code] || `Code ${c.weather_code}`;
      const deg = "\u00B0";
      setWeatherUi({
        status: "live",
        sub: `${desc} - Wind ${Math.round(c.wind_speed_10m)} mph`,
        line: `${Math.round(c.temperature_2m)}${deg}F (feels ${Math.round(c.apparent_temperature)}${deg}F)`,
      });
    } catch {
      setWeatherUi({ status: "failed", sub: "Couldn't fetch weather. Try refresh.", line: "--" });
    }
    return;
  }

  if (!navigator.geolocation) {
    setWeatherUi({ status: "unavailable", sub: "Geolocation not supported in this browser.", line: "--" });
    return;
  }

  if (!window.isSecureContext) {
    setWeatherUi({ status: "unavailable", sub: "Geolocation requires HTTPS.", line: "--" });
    return;
  }

  setWeatherUi({ status: "getting location", sub: "Requesting location permission...", line: "--" });
  try {
    const pos = await getPosition();
    const { latitude, longitude } = pos.coords;
    storeCoords(latitude, longitude);

    setWeatherUi({ status: "fetching", sub: "Fetching weather...", line: "--" });
    const data = await fetchWeather(latitude, longitude);
    const c = data.current;
    const desc = WMO[c.weather_code] || `Code ${c.weather_code}`;
    const deg = "\u00B0";

    setWeatherUi({
      status: "live",
      sub: `${desc} - Wind ${Math.round(c.wind_speed_10m)} mph`,
      line: `${Math.round(c.temperature_2m)}${deg}F (feels ${Math.round(c.apparent_temperature)}${deg}F)`,
    });
  } catch (e) {
    const msg =
      e && typeof e === "object" && "code" in e && e.code === 1
        ? "Location permission denied."
        : "Couldn't get location. Try refresh.";
    setWeatherUi({ status: "denied", sub: msg, line: "--" });
  }
}

weatherBtn?.addEventListener("click", () => {
  setMascotMood("sad", { lockMs: 700 });
  refreshWeather({ forceLocation: true });
});
refreshWeather();
setInterval(() => refreshWeather(), 15 * 60 * 1000);

// Visitor counter
fetch("/counter")
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById("visitor-count");
    if (el && d.visitors !== undefined) {
      el.textContent = `Visitors: ${d.visitors}`;
    }
  })
  .catch(() => {});

// ---- Live chat (WebSocket) ----
const CHAT_WS_URL = "wss://chat.generlmoo.me";
const chatRoot = document.getElementById("chat");
const chatStatus = document.getElementById("chat-status");
const chatDot = document.getElementById("chat-dot");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-message");
const chatName = document.getElementById("chat-name");
const chatToggle = document.getElementById("chat-toggle");

let chatSocket = null;
let chatReconnectTimer = null;
let chatBackoffMs = 1000;
const chatClientId = (() => {
  try {
    const key = "chat.client.id.v1";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = `c_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
    return id;
  } catch {
    return `c_${Math.random().toString(36).slice(2, 10)}`;
  }
})();

function setChatStatus(state) {
  if (!chatRoot || !chatStatus) return;
  chatRoot.classList.remove("chat-online", "chat-offline");
  if (state === "online") {
    chatRoot.classList.add("chat-online");
  } else if (state === "offline") {
    chatRoot.classList.add("chat-offline");
  }
  chatStatus.textContent = state;
}

function appendChatMessage({ name, text, ts, self = false, system = false }) {
  if (!chatMessages) return;
  const wrap = document.createElement("div");
  wrap.className = `chat-msg${self ? " self" : ""}`;
  const meta = document.createElement("div");
  meta.className = "chat-msg-meta";
  const who = document.createElement("span");
  who.textContent = system ? "system" : name || "guest";
  const when = document.createElement("span");
  const time = new Date(ts || Date.now());
  when.textContent = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  meta.appendChild(who);
  meta.appendChild(when);
  const body = document.createElement("div");
  body.className = "chat-msg-text";
  body.textContent = text || "";
  wrap.appendChild(meta);
  wrap.appendChild(body);
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function connectChat() {
  if (!chatRoot || !CHAT_WS_URL) return;
  if (chatSocket && (chatSocket.readyState === 0 || chatSocket.readyState === 1)) return;

  setChatStatus("connecting");
  try {
    chatSocket = new WebSocket(CHAT_WS_URL);
  } catch {
    setChatStatus("offline");
    return;
  }

  chatSocket.addEventListener("open", () => {
    chatBackoffMs = 1000;
    setChatStatus("online");
    appendChatMessage({ text: "Connected.", system: true });
  });

  chatSocket.addEventListener("close", () => {
    setChatStatus("offline");
    appendChatMessage({ text: "Disconnected. Reconnecting...", system: true });
    if (!chatReconnectTimer) {
      chatReconnectTimer = setTimeout(() => {
        chatReconnectTimer = null;
        chatBackoffMs = Math.min(15000, chatBackoffMs * 1.5);
        connectChat();
      }, chatBackoffMs);
    }
  });

  chatSocket.addEventListener("error", () => {
    setChatStatus("offline");
  });

  chatSocket.addEventListener("message", (event) => {
    const raw = typeof event.data === "string" ? event.data : "";
    if (!raw) return;
    if (raw === "connected") {
      appendChatMessage({ text: "Server connected.", system: true });
      return;
    }
    try {
      const msg = JSON.parse(raw);
      if (msg && msg.type === "msg") {
        appendChatMessage({
          name: msg.name,
          text: msg.text,
          ts: msg.ts,
          self: msg.id === chatClientId,
        });
        return;
      }
    } catch {
      // fall through
    }
    appendChatMessage({ text: raw, system: true });
  });
}

if (chatName) {
  try {
    const stored = localStorage.getItem("chat.name.v1");
    if (stored) chatName.value = stored;
  } catch {
    // ignore
  }
  chatName.addEventListener("change", () => {
    try {
      localStorage.setItem("chat.name.v1", chatName.value.trim());
    } catch {
      // ignore
    }
  });
}

chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!chatInput || !chatSocket || chatSocket.readyState !== 1) {
    appendChatMessage({ text: "Chat is offline.", system: true });
    return;
  }
  const text = chatInput.value.trim();
  if (!text) return;
  const name = chatName?.value.trim() || "guest";
  const payload = {
    type: "msg",
    id: chatClientId,
    name,
    text,
    ts: Date.now(),
  };
  chatSocket.send(JSON.stringify(payload));
  chatInput.value = "";
});

chatToggle?.addEventListener("click", () => {
  if (!chatRoot || !chatToggle) return;
  const isCollapsed = chatRoot.classList.toggle("chat-collapsed");
  chatToggle.textContent = isCollapsed ? "Open" : "Close";
  chatToggle.setAttribute("aria-expanded", String(!isCollapsed));
});

if (chatRoot && chatToggle) {
  chatRoot.classList.add("chat-collapsed");
  chatToggle.textContent = "Open";
  chatToggle.setAttribute("aria-expanded", "false");
  connectChat();
}
