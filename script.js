/* generlmoo dashboard - black + neon blue */

:root{
  --bg: #05080f;
  --card: rgba(11, 18, 32, 0.78);
  --card2: rgba(9, 14, 26, 0.72);
  --stroke: rgba(0, 229, 255, 0.18);
  --stroke2: rgba(255,255,255,0.06);
  --neon: #00e5ff;
  --text: #e6f1ff;
  --muted: #7aa2c2;
  --good: #39ff88;
  --bad: #ff3b6b;
  --warn: #ffd166;
  --shadow: 0 18px 60px rgba(0,0,0,0.55);
  --radius: 20px;
  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
}

*{ box-sizing: border-box; }
html,body{ height: 100%; }
body{
  margin: 0;
  font-family: var(--sans);
  color: var(--text);
  background: radial-gradient(1100px 500px at 20% 0%, rgba(0,229,255,0.08), transparent 55%),
              radial-gradient(900px 600px at 90% 30%, rgba(0,229,255,0.06), transparent 55%),
              var(--bg);
  overflow-x: hidden;
}

/* background effects */
.bg-grid{
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(0,229,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.08) 1px, transparent 1px);
  background-size: 72px 72px;
  opacity: 0.12;
  mask-image: radial-gradient(800px 500px at 40% 0%, black 30%, transparent 70%);
  pointer-events: none;
}
.bg-glow{
  position: fixed; inset: -40%;
  background: radial-gradient(circle at 30% 20%, rgba(0,229,255,0.12), transparent 50%);
  filter: blur(40px);
  opacity: 0.9;
  pointer-events: none;
}

.wrap{
  max-width: 980px;
  margin: 0 auto;
  padding: 28px 18px 40px;
}

.top{
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.top-left{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

/* --- Mascot face (sprite sheet) --- */
.mascot{
  --x: 0px;
  --y: 0px;
  --sheet-w: 178px;
  --sheet-h: 90px;

  appearance: none;
  padding: 0;
  width: 44px;
  height: 44px;
  display: block;
  flex-shrink: 0;
  line-height: 0;
  font-size: 0;
  border-radius: 14px;
  border: 1px solid rgba(0,229,255,0.22);
  background-color: rgba(0,0,0,0.20);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 10px 30px rgba(0,229,255,0.10);
  position: relative;
  overflow: hidden;
  cursor: pointer;

  background-image:
    url("/assets/faces.png"),
    radial-gradient(60px 60px at 30% 20%, rgba(0,229,255,0.20), transparent 55%);
  background-repeat: no-repeat, no-repeat;
  background-size: var(--sheet-w) var(--sheet-h), cover;
  background-position: var(--x) var(--y), center;
}

.mascot:focus-visible{
  outline: 2px solid rgba(0,229,255,0.55);
  outline-offset: 2px;
}

.mascot-static{
  position:absolute;
  inset: 0;
  opacity: 0;
  background:
    repeating-linear-gradient(0deg,
      rgba(255,255,255,0.08) 0px,
      rgba(255,255,255,0.08) 1px,
      rgba(0,0,0,0) 2px,
      rgba(0,0,0,0) 4px);
  mix-blend-mode: overlay;
  pointer-events: none;
}

.mascot.is-switching .mascot-static{
  opacity: 0.55;
  animation: tvStatic 140ms steps(2) infinite;
}

@keyframes tvStatic{
  0% { transform: translateY(0px); filter: blur(0.2px); }
  50%{ transform: translateY(-1px); filter: blur(0.6px); }
  100%{ transform: translateY(0px); filter: blur(0.2px); }
}

.weather-chip{
  width: 260px;
  padding: 12px 12px 10px;
  border-radius: 16px;
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg, rgba(11,18,32,0.9), rgba(9,14,26,0.75));
  box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 14px 40px rgba(0,0,0,0.35);
}
.weather-chip-head{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.weather-chip-title{
  font-size: 12px;
  letter-spacing: 0.3px;
  color: rgba(230,241,255,0.86);
}
.weather-chip-btn{
  appearance: none;
  border: 1px solid rgba(0,229,255,0.18);
  background: rgba(0,0,0,0.18);
  color: rgba(230,241,255,0.88);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: transform .12s ease, border-color .12s ease, box-shadow .12s ease;
}
.weather-chip-btn:hover{
  transform: translateY(-1px);
  border-color: rgba(0,229,255,0.35);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 12px 28px rgba(0,229,255,0.08);
}
.weather-chip-btn:active{ transform: translateY(0px); }
.weather-chip-line{
  margin-top: 10px;
}
.weather-chip-sub{
  margin-top: 6px;
}
.weather-chip-state{
  display: none;
}

.brand{
  display:flex;
  align-items:center;
  gap: 12px;
}

.logo{
  width: 44px; height: 44px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(0,229,255,0.14), rgba(0,229,255,0.04));
  border: 1px solid var(--stroke);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 10px 30px rgba(0,229,255,0.10);
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 6px;
}
.logo-dot{
  width: 7px; height: 7px;
  border-radius: 999px;
  background: rgba(0,229,255,0.75);
  box-shadow: 0 0 12px rgba(0,229,255,0.65);
}

h1{
  font-size: 22px;
  margin: 0;
  letter-spacing: 0.4px;
}
.accent{ color: var(--neon); text-shadow: 0 0 10px rgba(0,229,255,0.35); }
.sub{ margin: 4px 0 0; color: var(--muted); font-size: 13px; }

.top-actions{ display:flex; gap: 10px; align-items:center; }

.chip{
  appearance: none;
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg, rgba(11,18,32,0.9), rgba(9,14,26,0.7));
  color: var(--text);
  border-radius: 999px;
  padding: 10px 12px;
  font-size: 13px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset;
  display:flex;
  align-items:center;
  gap: 8px;
  transition: transform .12s ease, border-color .12s ease, box-shadow .12s ease;
}
.chip:hover{
  transform: translateY(-1px);
  border-color: rgba(0,229,255,0.35);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 12px 28px rgba(0,229,255,0.08);
}
.chip:active{ transform: translateY(0px); }
.chip-dot{
  width: 8px; height: 8px;
  border-radius: 999px;
  background: rgba(0,229,255,0.75);
  box-shadow: 0 0 12px rgba(0,229,255,0.55);
}

.cards{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}
@media (max-width: 720px){
  .top{ flex-direction: column; align-items:flex-start; }
  .weather-chip{ width: 100%; }
  .cards{ grid-template-columns: 1fr; }
}

.card{
  position: relative;
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg, var(--card), var(--card2));
  box-shadow: var(--shadow);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: transform .14s ease, border-color .14s ease, box-shadow .14s ease;
}
.card::before{
  content:"";
  position:absolute;
  inset:-1px;
  background: radial-gradient(600px 200px at 20% 0%, rgba(0,229,255,0.18), transparent 60%);
  opacity: 0.45;
  pointer-events:none;
}
.card:hover{
  transform: translateY(-2px);
  border-color: rgba(0,229,255,0.38);
  box-shadow: 0 22px 70px rgba(0,0,0,0.62), 0 0 0 1px rgba(0,229,255,0.10) inset;
}
.card:active{ transform: translateY(0px); }

.card-head{
  display:flex;
  justify-content: space-between;
  align-items:center;
  margin-bottom: 10px;
}
.icon{
  font-size: 20px;
  width: 36px; height: 36px;
  border-radius: 14px;
  display:flex; align-items:center; justify-content:center;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.18);
}

h2{
  margin: 6px 0 4px;
  font-size: 16px;
  letter-spacing: 0.2px;
}
.muted{ color: var(--muted); font-size: 13px; margin: 0; }
.mono{ font-family: var(--mono); font-size: 12px; color: rgba(230,241,255,0.82); margin-top: 12px; }

.status{
  display:flex;
  align-items:center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.18);
}
.status-dot{
  width: 9px; height: 9px;
  border-radius: 999px;
  background: rgba(122,162,194,0.65);
  box-shadow: 0 0 0 2px rgba(122,162,194,0.14);
}
.status-text{ font-size: 12px; color: rgba(230,241,255,0.78); }

.status[data-status="up"] .status-dot{
  background: var(--good);
  box-shadow: 0 0 14px rgba(57,255,136,0.40), 0 0 0 2px rgba(57,255,136,0.14);
}
.status[data-status="down"] .status-dot{
  background: var(--bad);
  box-shadow: 0 0 14px rgba(255,59,107,0.35), 0 0 0 2px rgba(255,59,107,0.14);
}
.status[data-status="unknown"] .status-dot{
  background: var(--warn);
  box-shadow: 0 0 14px rgba(255,209,102,0.22), 0 0 0 2px rgba(255,209,102,0.12);
}

.panel{
  margin-top: 14px;
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.06);
  background: linear-gradient(180deg, rgba(11,18,32,0.55), rgba(9,14,26,0.35));
  box-shadow: 0 14px 50px rgba(0,0,0,0.45);
}
.panel-row{
  display:grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
}
@media (max-width: 820px){
  .panel-row{ grid-template-columns: 1fr; }
}
h3{
  margin: 0 0 8px;
  font-size: 14px;
  letter-spacing: 0.2px;
  color: rgba(230,241,255,0.92);
}
.kv{ margin-bottom: 10px; }
.k{ font-size: 12px; color: rgba(230,241,255,0.72); margin-bottom: 4px; }
.v{ font-size: 12px; }

.foot{
  margin-top: 16px;
  display:flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.sep{ margin: 0 8px; opacity: 0.5; }

/* --- Chat widget --- */
.chat{
  position: fixed;
  right: 18px;
  bottom: 18px;
  width: 320px;
  max-width: calc(100vw - 36px);
  border-radius: 18px;
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg, rgba(11,18,32,0.95), rgba(9,14,26,0.88));
  box-shadow: 0 18px 60px rgba(0,0,0,0.6);
  z-index: 20;
  overflow: hidden;
}
.chat-head{
  display:flex;
  align-items:center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.18);
}
.chat-title{
  display:flex;
  align-items:center;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.3px;
  color: rgba(230,241,255,0.9);
}
.chat-dot{
  width: 8px; height: 8px;
  border-radius: 999px;
  background: rgba(122,162,194,0.65);
  box-shadow: 0 0 0 2px rgba(122,162,194,0.14);
}
.chat-status{
  color: rgba(122,162,194,0.9);
}
.chat-toggle{
  appearance: none;
  border: 1px solid rgba(0,229,255,0.18);
  background: rgba(0,0,0,0.18);
  color: rgba(230,241,255,0.9);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  cursor: pointer;
}
.chat-body{
  padding: 10px 12px 12px;
  display: grid;
  gap: 10px;
}
.chat-meta{
  display:flex;
  align-items:center;
  gap: 8px;
}
.chat-label{
  font-size: 11px;
  color: rgba(230,241,255,0.7);
}
.chat-input{
  flex: 1;
  min-width: 0;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.22);
  color: var(--text);
  border-radius: 10px;
  padding: 6px 8px;
  font-size: 12px;
}
.chat-input::placeholder{ color: rgba(122,162,194,0.7); }
.chat-messages{
  height: 200px;
  overflow-y: auto;
  display: grid;
  gap: 8px;
  padding-right: 2px;
}
.chat-msg{
  display: grid;
  gap: 2px;
  padding: 6px 8px;
  border-radius: 12px;
  background: rgba(0,0,0,0.22);
  border: 1px solid rgba(255,255,255,0.06);
}
.chat-msg.self{
  border-color: rgba(0,229,255,0.25);
  background: rgba(0,229,255,0.08);
}
.chat-msg-meta{
  display:flex;
  gap: 8px;
  font-size: 11px;
  color: rgba(230,241,255,0.7);
}
.chat-msg-text{
  font-size: 12px;
}
.chat-form{
  display:flex;
  gap: 8px;
}
.chat-send{
  appearance: none;
  border: 1px solid rgba(0,229,255,0.22);
  background: rgba(0,0,0,0.18);
  color: rgba(230,241,255,0.9);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
}
.chat-collapsed .chat-body{
  display: none;
}
.chat-collapsed .chat-toggle{
  content: "Open";
}
.chat:not(.chat-collapsed) .chat-messages{
  height: 380px;
}
.chat-banned .chat-dot{
  background: var(--warn);
  box-shadow: 0 0 14px rgba(255,209,102,0.28), 0 0 0 2px rgba(255,209,102,0.16);
}
.chat-banned .chat-status{ color: rgba(255,209,102,0.9); }
.chat-online .chat-dot{
  background: var(--good);
  box-shadow: 0 0 14px rgba(57,255,136,0.35), 0 0 0 2px rgba(57,255,136,0.14);
}
.chat-online .chat-status{ color: rgba(57,255,136,0.9); }
.chat-offline .chat-dot{
  background: var(--bad);
  box-shadow: 0 0 14px rgba(255,59,107,0.35), 0 0 0 2px rgba(255,59,107,0.14);
}
.chat-offline .chat-status{ color: rgba(255,59,107,0.85); }

@media (max-width: 720px){
  .chat{
    right: 12px;
    bottom: 12px;
    width: calc(100vw - 24px);
  }
}
