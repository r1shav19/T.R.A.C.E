// T.R.A.C.E. — Complete React App (Single File)
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
:root {
  --red:#FF2D2D;--red-glow:rgba(255,45,45,0.25);--orange:#FF6B1A;
  --yellow:#FFD600;--green:#00FF88;--blue:#3B8BFF;
  --bg:#07090E;--bg2:#0C0F18;--bg3:#111622;
  --border:rgba(255,255,255,0.07);--border-red:rgba(255,45,45,0.25);
  --text:#E8EAF2;--text-dim:#5A6278;--text-mid:#9BA3BC;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;}
.app{display:flex;flex-direction:column;min-height:100vh;}
.navbar{display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:56px;background:var(--bg2);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}
.nav-logo{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:0.2em;color:white;}
.nav-logo span{color:var(--red);}
.nav-tabs{display:flex;gap:4px;}
.nav-tabs button{background:none;border:none;color:var(--text-dim);font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;padding:6px 14px;border-radius:4px;cursor:pointer;transition:all 0.2s;text-transform:uppercase;}
.nav-tabs button:hover{color:var(--text);background:rgba(255,255,255,0.04);}
.nav-tabs button.active{color:var(--red);background:rgba(255,45,45,0.08);}
.nav-right{display:flex;align-items:center;gap:12px;}
.nav-alert{display:flex;align-items:center;gap:6px;font-family:'Space Mono',monospace;font-size:10px;color:var(--red);letter-spacing:2px;background:rgba(255,45,45,0.08);border:1px solid var(--border-red);padding:4px 12px;border-radius:100px;}
.language-switcher{position:relative;}
.language-button{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.03);border:1px solid var(--border);color:var(--text);font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.5px;padding:8px 12px;border-radius:999px;cursor:pointer;transition:all 0.2s;text-transform:uppercase;}
.language-button:hover{border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);}
.language-label{color:var(--text-dim);}
.language-caret{font-size:9px;color:var(--red);}
.language-menu{position:absolute;top:calc(100% + 8px);right:0;min-width:210px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:8px;display:flex;flex-direction:column;gap:4px;box-shadow:0 18px 48px rgba(0,0,0,0.28);}
.language-option{background:transparent;border:none;border-radius:8px;color:var(--text-mid);cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-family:'DM Sans',sans-serif;font-size:13px;padding:10px 12px;text-align:left;transition:all 0.2s;}
.language-option:hover{background:rgba(255,255,255,0.04);color:var(--text);}
.language-option.active{background:rgba(255,45,45,0.08);color:var(--text);border:1px solid var(--border-red);}
.language-native{color:var(--text-dim);font-size:12px;}
.translate-anchor{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;}
.goog-te-banner-frame.skiptranslate{display:none!important;}
body{top:0!important;}
.main{flex:1;}
.pulse-dot{display:inline-block;width:6px;height:6px;background:var(--red);border-radius:50%;animation:pulseDot 1.5s infinite;}
@keyframes pulseDot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.3;transform:scale(0.5);}}
.section-tag{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:3px;color:var(--red);text-transform:uppercase;margin-bottom:8px;}
.btn-primary{background:var(--red);color:white;border:none;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:2px;padding:12px 28px;border-radius:2px;cursor:pointer;transition:all 0.2s;text-transform:uppercase;}
.btn-primary:hover{background:#e02020;box-shadow:0 0 20px rgba(255,45,45,0.4);}
.btn-primary:disabled{background:var(--text-dim);cursor:not-allowed;box-shadow:none;}
.btn-ghost{background:transparent;color:var(--text-mid);border:1px solid var(--border);font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1px;padding:10px 20px;border-radius:2px;cursor:pointer;transition:all 0.2s;}
.btn-ghost:hover{border-color:rgba(255,255,255,0.2);color:var(--text);}
.badge{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1.5px;padding:3px 10px;border-radius:100px;text-transform:uppercase;}
.badge.red{background:rgba(255,45,45,0.1);color:var(--red);border:1px solid rgba(255,45,45,0.2);}
.badge.green{background:rgba(0,255,136,0.1);color:var(--green);border:1px solid rgba(0,255,136,0.2);}
.badge.yellow{background:rgba(255,214,0,0.1);color:var(--yellow);border:1px solid rgba(255,214,0,0.2);}
.badge.blue{background:rgba(59,139,255,0.1);color:var(--blue);border:1px solid rgba(59,139,255,0.2);}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px);}to{opacity:1;transform:translateX(0);}}
.fade-up{animation:fadeUp 0.5s ease both;}
.fade-in{animation:fadeIn 0.4s ease both;}
.risk-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.risk-key{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:1px;width:60px;flex-shrink:0;}
.risk-track{flex:1;height:3px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;}
.risk-fill{height:100%;border-radius:2px;transition:width 1s ease;}
.risk-val{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);width:28px;text-align:right;}

/* SOS */
.sos-page{display:grid;grid-template-columns:340px 1fr;min-height:calc(100vh - 56px);}
.sos-left{border-right:1px solid var(--border);padding:28px 20px;overflow-y:auto;}
.sos-title{font-family:'Bebas Neue',sans-serif;font-size:38px;letter-spacing:0.04em;line-height:1;margin-bottom:20px;color:white;}
.profile-list{display:flex;flex-direction:column;gap:10px;}
.profile-card{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:14px;cursor:pointer;transition:all 0.2s;}
.profile-card:hover{border-color:rgba(255,255,255,0.15);}
.profile-card.selected{border-color:var(--border-red);background:rgba(255,45,45,0.04);}
.profile-card-header{display:flex;align-items:center;gap:12px;}
.profile-avatar{width:36px;height:36px;background:var(--bg3);border:1px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--red);flex-shrink:0;}
.profile-avatar.large{width:44px;height:44px;font-size:22px;}
.profile-name{font-size:14px;font-weight:600;color:var(--text);}
.profile-condition{font-size:11px;color:var(--text-dim);margin-top:2px;}
.profile-details{margin-top:14px;padding-top:14px;border-top:1px solid var(--border);}
.detail-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;gap:16px;}
.detail-row span:first-child{color:var(--text-dim);flex-shrink:0;}
.detail-row span:last-child{color:var(--text);text-align:right;}
.sos-right{display:flex;align-items:center;justify-content:center;padding:40px;background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(255,45,45,0.04) 0%,transparent 70%);}
.sos-trigger-zone{text-align:center;display:flex;flex-direction:column;align-items:center;gap:24px;}
.sos-instruction{font-size:15px;color:var(--text-dim);max-width:300px;line-height:1.6;}
.sos-instruction strong{color:var(--text);}
.sos-btn-wrap{position:relative;width:160px;height:160px;display:flex;align-items:center;justify-content:center;}
.sos-ring{position:absolute;border-radius:50%;border:1px solid rgba(255,45,45,0.2);animation:ringPulse 3s infinite;}
.sos-ring-1{width:160px;height:160px;}
.sos-ring-2{width:200px;height:200px;animation-delay:1s;}
@keyframes ringPulse{0%,100%{opacity:0.4;transform:scale(1);}50%{opacity:0.1;transform:scale(1.05);}}
.sos-btn{width:120px;height:120px;border-radius:50%;background:var(--red);border:none;color:white;font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:4px;cursor:pointer;transition:all 0.15s;box-shadow:0 0 40px rgba(255,45,45,0.4),0 0 80px rgba(255,45,45,0.15);position:relative;z-index:1;user-select:none;}
.sos-btn:active,.sos-btn.arming{transform:scale(0.95);box-shadow:0 0 60px rgba(255,45,45,0.6);}
.sos-progress-ring{position:absolute;width:160px;height:160px;top:0;left:0;}
.sos-hint{font-family:'Space Mono',monospace;font-size:10px;color:var(--text-dim);letter-spacing:2px;text-transform:uppercase;}
.sos-active{width:100%;max-width:520px;display:flex;flex-direction:column;gap:20px;}
.sos-active-header{display:flex;align-items:center;gap:8px;}
.sos-active-profile{display:flex;align-items:center;gap:14px;background:var(--bg2);border:1px solid var(--border-red);border-radius:4px;padding:16px;}
.log-feed{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:16px;max-height:260px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;}
.log-entry{display:flex;gap:12px;font-family:'Space Mono',monospace;font-size:11px;padding:4px 0;animation:slideIn 0.3s ease both;}
.log-time{color:var(--text-dim);flex-shrink:0;}
.log-normal .log-msg{color:var(--text-mid);}
.log-critical .log-msg{color:var(--red);}
.log-success .log-msg{color:var(--green);}
.log-cursor{font-family:'Space Mono',monospace;font-size:14px;color:var(--red);animation:blink 1s infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.sos-active-actions{display:flex;flex-direction:column;gap:8px;}

/* DASHBOARD */
.dashboard{display:flex;flex-direction:column;height:calc(100vh - 56px);}
.dash-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 56px);padding:40px 20px;text-align:center;gap:16px;}
.dash-empty-title{font-family:'Bebas Neue',sans-serif;font-size:52px;letter-spacing:0.05em;line-height:1;color:white;}
.dash-empty p{font-size:14px;color:var(--text-dim);}
.dash-standby-grid{display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;justify-content:center;}
.standby-card{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:16px 20px;text-align:center;min-width:110px;}
.standby-letter{font-family:'Bebas Neue',sans-serif;font-size:40px;color:var(--red);opacity:0.4;line-height:1;}
.standby-text{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:1px;margin-top:4px;}
.dash-header{display:flex;justify-content:space-between;align-items:flex-start;padding:14px 24px;background:var(--bg2);border-bottom:1px solid var(--border);}
.dash-id{display:flex;align-items:center;gap:8px;font-family:'Space Mono',monospace;font-size:12px;color:var(--red);letter-spacing:2px;margin-bottom:4px;}
.dash-victim{font-size:15px;font-weight:600;margin-bottom:2px;}
.dash-zone{font-size:12px;color:var(--text-dim);}
.dash-header-right{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:4px;}
.dash-timer{font-family:'Bebas Neue',sans-serif;font-size:36px;color:var(--red);letter-spacing:0.1em;line-height:1;}
.dash-timer-label{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:3px;}
.dash-tabs{display:flex;border-bottom:1px solid var(--border);padding:0 24px;}
.dash-tabs button{background:none;border:none;border-bottom:2px solid transparent;color:var(--text-dim);font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;padding:12px 16px;cursor:pointer;transition:all 0.2s;margin-bottom:-1px;}
.dash-tabs button:hover{color:var(--text);}
.dash-tabs button.active{color:var(--red);border-bottom-color:var(--red);}
.dash-content{flex:1;overflow:hidden;}

/* MAP */
.map-container{position:relative;width:100%;height:100%;min-height:calc(100vh - 180px);overflow:hidden;background:#070B10;}
.map-canvas{width:100%;height:100%;display:block;}
.map-overlay-tl{position:absolute;top:16px;left:16px;background:rgba(7,9,14,0.85);border:1px solid var(--border);border-radius:2px;padding:10px 14px;backdrop-filter:blur(4px);}
.map-label{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:3px;color:var(--red);text-transform:uppercase;margin-bottom:3px;}
.map-coords{font-family:'Space Mono',monospace;font-size:11px;color:var(--text-dim);}
.map-legend{position:absolute;bottom:16px;left:16px;display:flex;flex-direction:column;gap:6px;background:rgba(7,9,14,0.85);border:1px solid var(--border);border-radius:2px;padding:10px 14px;}
.legend-item{display:flex;align-items:center;gap:8px;font-family:'Space Mono',monospace;font-size:10px;color:var(--text-dim);letter-spacing:1px;}
.legend-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.legend-dot.red{background:var(--red);box-shadow:0 0 6px var(--red);}
.legend-dot.green{background:var(--green);box-shadow:0 0 6px var(--green);}
.legend-dot.orange{background:var(--orange);box-shadow:0 0 6px var(--orange);}
.map-aggressor-alert{position:absolute;top:16px;left:50%;transform:translateX(-50%);background:rgba(255,107,26,0.1);border:1px solid rgba(255,107,26,0.4);border-radius:2px;padding:8px 16px;font-family:'Space Mono',monospace;font-size:10px;color:var(--orange);letter-spacing:1.5px;display:flex;align-items:center;gap:8px;white-space:nowrap;}
.map-responder-chips{position:absolute;bottom:16px;right:16px;display:flex;flex-direction:column;gap:6px;}
.resp-chip{display:flex;align-items:center;gap:8px;background:rgba(7,9,14,0.9);border:1px solid var(--border);border-radius:2px;padding:8px 12px;cursor:pointer;transition:border-color 0.2s;backdrop-filter:blur(4px);}
.resp-chip:hover{border-color:rgba(0,255,136,0.3);}
.resp-chip-name{font-family:'Space Mono',monospace;font-size:10px;color:var(--text-mid);}

/* RESPONDER */
.resp-panel{display:grid;grid-template-columns:320px 1fr;height:100%;overflow:hidden;}
.resp-list{border-right:1px solid var(--border);padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;}
.panel-section-title{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:3px;color:var(--text-dim);text-transform:uppercase;padding:4px 0;border-bottom:1px solid var(--border);margin-bottom:8px;}
.resp-item{display:flex;gap:12px;padding:12px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;cursor:pointer;transition:all 0.2s;}
.resp-item:hover{border-color:rgba(255,255,255,0.15);}
.resp-item.selected{border-color:var(--border-red);background:rgba(255,45,45,0.04);}
.resp-emoji{font-size:22px;flex-shrink:0;line-height:1.4;}
.resp-info-block{flex:1;min-width:0;}
.resp-name-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:3px;}
.resp-name{font-size:13px;font-weight:600;}
.resp-role-text{font-family:'Space Mono',monospace;font-size:9px;color:var(--red);letter-spacing:1px;margin-bottom:3px;}
.resp-dist{font-size:11px;color:var(--text-dim);}
.crowd-alert{background:var(--bg2);border:1px solid rgba(255,214,0,0.2);border-radius:4px;padding:12px;margin-bottom:8px;}
.crowd-alert.confirmed{border-color:rgba(0,255,136,0.2);}
.crowd-alert-header{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.crowd-time{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:1px;}
.crowd-msg{font-size:12px;color:var(--text-mid);line-height:1.5;}
.resp-detail{padding:24px;overflow-y:auto;}
.resp-detail-header{display:flex;gap:16px;align-items:flex-start;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border);}
.resp-detail-stats{display:flex;gap:24px;}
.detail-stat{text-align:center;}
.detail-stat-val{font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--text);line-height:1;}
.detail-stat-key{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:2px;margin-top:2px;}
.task-list{display:flex;flex-direction:column;gap:6px;margin-top:8px;}
.task-item{display:flex;gap:12px;padding:10px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:2px;}
.task-num{font-family:'Bebas Neue',sans-serif;font-size:20px;color:rgba(255,45,45,0.3);line-height:1.2;flex-shrink:0;}
.task-text{font-size:13px;color:var(--text-mid);line-height:1.5;}
.gemini-brief{background:rgba(59,139,255,0.05);border:1px solid rgba(59,139,255,0.15);border-radius:4px;padding:14px;margin-top:8px;}
.gemini-tag{font-family:'Space Mono',monospace;font-size:9px;color:var(--blue);letter-spacing:2px;margin-bottom:8px;}
.gemini-brief p{font-size:13px;color:var(--text-dim);line-height:1.7;}
.gemini-brief strong{color:var(--text);}

/* EVIDENCE */
.evidence-page{display:grid;grid-template-columns:1fr 300px;height:100%;overflow:hidden;}
.evidence-list{padding:20px;overflow-y:auto;border-right:1px solid var(--border);}
.evidence-header-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.ev-timeline{display:flex;flex-direction:column;}
.ev-item{display:flex;gap:12px;margin-bottom:4px;}
.ev-line-wrap{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:16px;}
.ev-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:4px;}
.ev-dot.green{background:var(--green);box-shadow:0 0 6px rgba(0,255,136,0.4);}
.ev-dot.blue{background:var(--blue);box-shadow:0 0 6px rgba(59,139,255,0.4);}
.ev-dot.yellow{background:var(--yellow);box-shadow:0 0 6px rgba(255,214,0,0.4);}
.ev-connector{width:1px;flex:1;min-height:20px;background:var(--border);margin:4px 0;}
.ev-content{flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:10px 12px;margin-bottom:8px;}
.ev-top-row{display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;}
.ev-icon{font-size:14px;}
.ev-type{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--text-dim);flex:1;}
.ev-ts{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);}
.ev-label{font-size:13px;font-weight:500;margin-bottom:3px;}
.ev-detail{font-size:11px;color:var(--text-dim);}
.ev-pending{display:flex;align-items:center;gap:8px;padding:8px 0;font-family:'Space Mono',monospace;font-size:10px;color:var(--text-dim);letter-spacing:1px;}
.ev-pending-dot{width:8px;height:8px;border-radius:50%;background:var(--text-dim);animation:pulseDot 1.5s infinite;}
.evidence-right{padding:20px;overflow-y:auto;}
.vault-stats{display:flex;gap:12px;margin:12px 0;}
.vault-stat-card{flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:12px;text-align:center;}
.vault-stat-val{font-family:'Bebas Neue',sans-serif;font-size:32px;line-height:1;margin-bottom:4px;}
.vault-stat-key{font-family:'Space Mono',monospace;font-size:8px;color:var(--text-dim);letter-spacing:2px;}
.profile-lock-card{background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:12px;margin:12px 0;}
.lock-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;gap:12px;}
.lock-row:last-child{border-bottom:none;}
.lock-key{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:1px;flex-shrink:0;}
.lock-val{color:var(--text);text-align:right;}
.report-card{background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:16px;margin-top:12px;}
.compile-bar{height:3px;background:var(--border);border-radius:2px;overflow:hidden;margin-top:12px;}
.compile-fill{height:100%;background:var(--yellow);border-radius:2px;transition:width 1s linear;}

/* CROSSMATCH */
.crossmatch-page{display:grid;grid-template-columns:1fr 1fr;height:100%;overflow:hidden;}
.crossmatch-left{padding:20px;overflow-y:auto;border-right:1px solid var(--border);}
.db-list{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
.db-card{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:14px;transition:border-color 0.3s;}
.db-card.scanning{border-color:rgba(255,214,0,0.3);}
.db-card.done{border-color:rgba(0,255,136,0.2);}
.db-card-header{display:flex;align-items:flex-start;gap:10px;}
.db-icon{font-size:18px;flex-shrink:0;margin-top:1px;}
.db-info{flex:1;}
.db-label{font-size:13px;font-weight:500;margin-bottom:3px;}
.db-systems{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:0.5px;line-height:1.5;}
.db-status{flex-shrink:0;}
.db-progress-bar{height:2px;background:var(--border);border-radius:1px;margin-top:10px;overflow:hidden;}
.db-progress-fill{height:100%;border-radius:1px;}
.db-scanning-text{font-family:'Space Mono',monospace;font-size:9px;color:var(--yellow);letter-spacing:1px;margin-top:6px;animation:blink 1s infinite;}
.crossmatch-summary{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:16px;}
.summary-stats{display:flex;gap:20px;}
.summary-stat{text-align:center;flex:1;}
.summary-val{font-family:'Bebas Neue',sans-serif;font-size:36px;line-height:1;}
.summary-key{font-family:'Space Mono',monospace;font-size:8px;color:var(--text-dim);letter-spacing:2px;margin-top:2px;}
.crossmatch-right{padding:20px;overflow-y:auto;}
.gemini-trigger{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:24px;text-align:center;}
.gemini-loading{display:flex;flex-direction:column;align-items:center;padding:40px 20px;}
.gemini-spinner{width:32px;height:32px;border:2px solid var(--border);border-top-color:var(--blue);border-radius:50%;animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.gemini-error-note{background:rgba(255,107,26,0.08);border:1px solid rgba(255,107,26,0.2);border-radius:4px;padding:10px 14px;font-size:11px;color:var(--orange);margin-bottom:12px;font-family:'Space Mono',monospace;letter-spacing:0.5px;line-height:1.5;}
.gemini-result{display:flex;flex-direction:column;gap:12px;}
.gemini-risk-banner{border:1px solid;border-radius:4px;padding:12px 16px;display:flex;align-items:center;}
.gemini-section{background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:12px;}
.gemini-section-title{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--text-dim);margin-bottom:8px;}
.gemini-text{font-size:12px;color:var(--text-mid);line-height:1.6;}
.priority-zone{display:flex;gap:8px;margin-bottom:4px;}
.priority-num{font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--red);opacity:0.5;line-height:1.2;flex-shrink:0;}
.do-item{font-size:11px;color:var(--green);margin-bottom:4px;line-height:1.5;}
.dont-item{font-size:11px;color:var(--red);margin-bottom:4px;line-height:1.5;}

/* PROFILE PAGE */
.profile-page{display:grid;grid-template-columns:260px 1fr;min-height:calc(100vh - 56px);}
.profile-sidebar{border-right:1px solid var(--border);padding:20px 16px;display:flex;flex-direction:column;gap:8px;}
.profile-list-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;cursor:pointer;transition:all 0.2s;}
.profile-list-item:hover{border-color:rgba(255,255,255,0.15);}
.profile-list-item.selected{border-color:var(--border-red);background:rgba(255,45,45,0.04);}
.profile-list-avatar{width:32px;height:32px;background:var(--bg3);border:1px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--red);flex-shrink:0;}
.profile-list-name{font-size:13px;font-weight:500;}
.profile-list-cond{font-size:11px;color:var(--text-dim);margin-top:1px;}
.profile-detail{padding:28px;overflow-y:auto;}
.pd-header{display:flex;align-items:center;gap:16px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border);}
.pd-avatar{width:52px;height:52px;background:var(--bg2);border:1px solid var(--border-red);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:26px;color:var(--red);flex-shrink:0;}
.pd-name{font-size:18px;font-weight:600;}
.pd-cond{font-size:12px;color:var(--text-dim);margin:2px 0;}
.pd-id{font-family:'Space Mono',monospace;font-size:10px;color:var(--red);letter-spacing:2px;}
.pd-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.pd-section{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:16px;}
.pd-row{display:flex;flex-direction:column;gap:2px;margin-bottom:10px;}
.pd-key{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:1.5px;}
.pd-val{font-size:13px;color:var(--text);line-height:1.5;}
.bias-card{background:rgba(0,255,136,0.03);border:1px solid rgba(0,255,136,0.12);border-radius:4px;padding:14px;margin-top:8px;}
.pd-edit{max-width:500px;}
.edit-field{margin-bottom:14px;}
.edit-label{display:block;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--text-dim);margin-bottom:6px;}
.edit-input{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:10px 12px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color 0.2s;}
.edit-input:focus{border-color:rgba(255,45,45,0.4);}
.edit-actions{display:flex;gap:10px;margin-top:20px;}

/* INNOVATION PAGE */
.innovation-page{padding:32px 24px 40px;display:flex;flex-direction:column;gap:24px;min-height:calc(100vh - 56px);background:
radial-gradient(circle at top right,rgba(59,139,255,0.12),transparent 28%),
radial-gradient(circle at top left,rgba(255,45,45,0.12),transparent 24%),
linear-gradient(180deg,#07090E 0%,#0C0F18 100%);}
.innovation-hero{display:grid;grid-template-columns:1.25fr 0.9fr;gap:20px;align-items:stretch;}
.innovation-hero-card,.innovation-stack-intro{background:rgba(12,15,24,0.82);border:1px solid var(--border);border-radius:18px;padding:24px;backdrop-filter:blur(8px);}
.innovation-hero h1{font-family:'Bebas Neue',sans-serif;font-size:68px;letter-spacing:0.08em;line-height:0.95;color:white;margin-bottom:14px;}
.innovation-lead{font-size:16px;color:var(--text-mid);line-height:1.7;max-width:760px;}
.innovation-pills{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;}
.innovation-pill{padding:8px 12px;border-radius:999px;border:1px solid rgba(59,139,255,0.25);background:rgba(59,139,255,0.08);font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.4px;color:var(--blue);text-transform:uppercase;}
.innovation-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px;}
.innovation-stat{background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:14px;}
.innovation-stat-value{font-family:'Bebas Neue',sans-serif;font-size:34px;color:white;line-height:1;}
.innovation-stat-label{font-family:'Space Mono',monospace;font-size:9px;color:var(--text-dim);letter-spacing:2px;margin-top:6px;text-transform:uppercase;}
.innovation-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;}
.innovation-card{background:rgba(12,15,24,0.88);border:1px solid var(--border);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:12px;min-height:220px;}
.innovation-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.innovation-card-index{font-family:'Bebas Neue',sans-serif;font-size:34px;color:rgba(255,45,45,0.5);line-height:1;}
.innovation-card-title{font-size:18px;font-weight:600;color:white;line-height:1.3;}
.innovation-card-body{font-size:13px;color:var(--text-mid);line-height:1.7;}
.innovation-card-detail{font-size:12px;color:var(--text-dim);line-height:1.6;padding-top:12px;border-top:1px solid var(--border);}
.stack-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;}
.stack-card{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:10px;}
.stack-title{font-size:15px;font-weight:600;color:white;line-height:1.4;}
.stack-tool{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1.2px;color:var(--blue);text-transform:uppercase;}
.stack-copy{font-size:12px;color:var(--text-dim);line-height:1.6;}

@media(max-width:768px){
  .navbar{height:auto;padding:12px 16px;flex-wrap:wrap;gap:12px;}
  .nav-tabs{order:3;width:100%;overflow-x:auto;padding-bottom:4px;}
  .nav-right{margin-left:auto;}
  .language-menu{right:auto;left:0;}
  .sos-page,.resp-panel,.evidence-page,.crossmatch-page,.profile-page{grid-template-columns:1fr;}
  .sos-left,.resp-list,.crossmatch-left,.profile-sidebar{border-right:none;border-bottom:1px solid var(--border);}
  .pd-grid{grid-template-columns:1fr;}
  .innovation-hero,.innovation-grid,.stack-grid,.innovation-stat-grid{grid-template-columns:1fr;}
  .innovation-page{padding:24px 16px 32px;}
  .innovation-hero h1{font-size:48px;}
}
`;

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const VICTIM_PROFILES = [
  { id: "P001", name: "Eleanor M.", age: 72, condition: "Dementia — Stage 2", language: "Tagalog / English", behavior: "Seeks enclosed spaces, avoids crowds", medicalRisk: 85, mobilityRisk: 40, threatRisk: 20, contact: "Maria (daughter) +63 912 345 6789" },
  { id: "P002", name: "James K.", age: 8, condition: "Autism Spectrum — Non-verbal", language: "English", behavior: "Drawn to water, may not respond to name", medicalRisk: 60, mobilityRisk: 75, threatRisk: 35, contact: "Kevin (father) +63 917 234 5678" },
  { id: "P003", name: "Priya S.", age: 34, condition: "Domestic Violence — Active Threat", language: "Hindi / English", behavior: "Will hide, avoid eye contact with strangers", medicalRisk: 90, mobilityRisk: 80, threatRisk: 95, contact: "Safe house +63 918 888 0000" },
];

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "Hindi" },
  { code: "bn", label: "Bengali", nativeLabel: "Bangla" },
  { code: "ta", label: "Tamil", nativeLabel: "Tamil" },
  { code: "te", label: "Telugu", nativeLabel: "Telugu" },
  { code: "es", label: "Spanish", nativeLabel: "Espanol" },
  { code: "fr", label: "French", nativeLabel: "Francais" },
  { code: "ar", label: "Arabic", nativeLabel: "Arabic" },
  { code: "pt", label: "Portuguese", nativeLabel: "Portugues" },
  { code: "tl", label: "Tagalog", nativeLabel: "Tagalog" },
];

const INNOVATION_LAYERS = [
  {
    title: "Gemini-Powered Victim Profiling at Trigger",
    summary: "The moment SOS fires, TRACE generates a dynamic field profile so responders arrive with behavioral context, not just a face and location.",
    detail: "Profiles can model medical vulnerability, likely movement pattern, primary language, and whether the incident matches a repeat wandering history or a first-time disappearance.",
  },
  {
    title: "Crowd-Sourced Vision Network",
    summary: "Nearby opted-in users receive a discreet behavioral alert and last-known zone instead of a victim photo, turning the community into privacy-safe passive scanners.",
    detail: "It acts like a hyper-local, real-time alert layer for active searches while keeping sensitive identity data protected.",
  },
  {
    title: "Threat Vector Detection",
    summary: "TRACE models the threat, not just the victim, and escalates when movement patterns suggest trafficking corridors, highway transfer, or border-proximity risk.",
    detail: "When the pattern crosses a threshold, the platform can recommend an interception path for law enforcement before the window closes.",
  },
  {
    title: "Silent Hospital Cross-Match",
    summary: "Every 90 seconds, TRACE can silently check nearby hospital admissions, shelter check-ins, and transit lost-and-found systems against the live case.",
    detail: "That replaces the hours-later manual phone tree responders usually rely on today.",
  },
  {
    title: "Post-Crisis Trauma Handoff",
    summary: "Finding the person does not end the workflow. TRACE can auto-generate a structured incident report and route mental-health follow-up for both victim and family.",
    detail: "The recovery handoff becomes immediate, documented, and consistent across responders.",
  },
  {
    title: "Attacker Proximity Alert",
    summary: "In domestic-violence cases, TRACE can compare the aggressor's last-known location against the active search zone and silently reroute responders.",
    detail: "Victim contacts are protected, and the aggressor is never tipped off that the search posture changed.",
  },
];

const GOOGLE_STACK = [
  {
    capability: "Behavioral risk profiling",
    tool: "Gemini Pro",
    description: "Builds responder-ready subject briefings directly from the victim profile at trigger time.",
  },
  {
    capability: "Threat vector and route prediction",
    tool: "Vertex AI + Maps Routes API",
    description: "Scores trafficking or evasion patterns and predicts the most probable interception path.",
  },
  {
    capability: "Hospital and shelter silent cross-match",
    tool: "BigQuery + Pub/Sub",
    description: "Continuously checks distributed intake signals without waiting on manual outreach.",
  },
  {
    capability: "Crowd-sourced scanner network",
    tool: "Firebase + Maps Nearby Search",
    description: "Pushes hyper-local behavioral alerts to opted-in devices around the active search zone.",
  },
  {
    capability: "Aggressor proximity modeling",
    tool: "Maps Distance Matrix API",
    description: "Measures whether an attacker is drifting into the victim's route or responder perimeter.",
  },
  {
    capability: "Trauma handoff automation",
    tool: "Gemini + Google Forms API",
    description: "Creates incident summaries and downstream support handoff workflows as soon as the case closes.",
  },
];

const TRACE_LANGUAGE_STORAGE_KEY = "trace-language";

const LOG_SEQUENCE = [
  { delay: 0, msg: "Safe zone breach detected", type: "critical" },
  { delay: 700, msg: "Device signal acquiring...", type: "normal" },
  { delay: 1400, msg: "Last GPS coordinates locked", type: "normal" },
  { delay: 2100, msg: "Gemini AI profile generating...", type: "normal" },
  { delay: 3000, msg: "Bias correction check — PASSED ✓", type: "success" },
  { delay: 3800, msg: "Risk assessment complete", type: "normal" },
  { delay: 4600, msg: "Dispatching 3 nearest responders...", type: "critical" },
  { delay: 5400, msg: "Hospital DB cross-match initiated", type: "normal" },
  { delay: 6200, msg: "Evidence vault — recording active", type: "success" },
  { delay: 7000, msg: "SOS fully activated. Response underway.", type: "success" },
];

const RESPONDERS_DATA = [
  { id: "R1", name: "Officer Chen", unit: "Unit 7", role: "LEAD SEARCH — ZONE A", emoji: "👮", eta: 120, status: "en-route", distance: "0.8 km", tasks: ["Sweep Zone A (north block)", "Report all visual sightings", "Maintain comms with Medic B"] },
  { id: "R2", name: "Medic Team B", unit: "Ambulance 12", role: "MEDICAL STANDBY", emoji: "🚑", eta: 180, status: "en-route", distance: "1.2 km", tasks: ["Stage at Zone B entry point", "Prepare trauma kit", "Await visual confirmation before approach"] },
  { id: "R3", name: "Maria Santos", unit: "Volunteer", role: "PASSIVE SCANNER — ZONE C", emoji: "🙋", distance: "0.3 km", eta: 40, status: "active", tasks: ["Scan Zone C (market area)", "Do NOT approach — observe only", "Report to R1 immediately if spotted"] },
];

const CROWD_ALERTS = [
  { id: "C1", time: 18, msg: "Civilian match — elderly female, Zone C market area", confidence: 72, confirmed: false },
  { id: "C2", time: 45, msg: "Possible match — Zone A building entrance, ground floor", confidence: 58, confirmed: false },
];

const EVIDENCE_TIMELINE = [
  { t: 0, type: "GPS", icon: "📍", label: "Last known coordinates locked", detail: "Coordinates captured and sealed", status: "encrypted" },
  { t: 5, type: "GEOFENCE", icon: "🔴", label: "Safe zone breach recorded", detail: "Perimeter exit — south boundary", status: "encrypted" },
  { t: 12, type: "AUDIO", icon: "🎙️", label: "Ambient audio fragment captured", detail: "4.2s clip — background noise detected", status: "encrypted" },
  { t: 20, type: "MOVEMENT", icon: "📡", label: "Movement trajectory logged", detail: "Bearing: 220° SW — walking pace", status: "synced" },
  { t: 30, type: "CLASSIFICATION", icon: "⚖️", label: "Bias correction audit saved", detail: "Classification: MISSING — override logged", status: "secured" },
  { t: 45, type: "HOSPITAL", icon: "🏥", label: "Hospital DB query logged", detail: "3 facilities checked — no match found", status: "synced" },
  { t: 60, type: "TRANSIT", icon: "🚌", label: "Transit systems scanned", detail: "MRT, Bus Line 7 — no match found", status: "synced" },
  { t: 90, type: "SHELTER", icon: "🏠", label: "Shelter check-in scan complete", detail: "2 shelters in radius — no match", status: "synced" },
  { t: 120, type: "REPORT", icon: "📄", label: "Legal incident report generated", detail: "Full PDF compiled with all timestamps", status: "secured" },
];

const DATABASES = [
  { id: "hospital", label: "Hospital Admissions", icon: "🏥", systems: ["Philippine General Hospital", "St. Luke's Medical", "Makati Medical Center", "Manila Doctors"] },
  { id: "shelter", label: "Emergency Shelters", icon: "🏠", systems: ["DSWD Evacuation Center A", "Barangay 402 Shelter", "Red Cross Manila Hub"] },
  { id: "transit", label: "Transit Lost & Found", icon: "🚌", systems: ["MRT Line 1", "MRT Line 2", "Bus Line 7", "PNR Station"] },
  { id: "police", label: "Police Blotter", icon: "👮", systems: ["Manila PNP District 1", "PNP District 4", "QCPD North"] },
];

/* ═══════════════════════════════════════════
   SOS PAGE
═══════════════════════════════════════════ */
function SOSPage({ onTrigger, incident }) {
  const [selected, setSelected] = useState(VICTIM_PROFILES[0]);
  const [phase, setPhase] = useState("idle");
  const [holdProgress, setHoldProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const holdTimer = useRef(null);
  const holdStart = useRef(null);
  const elapsedTimer = useRef(null);

  useEffect(() => { if (incident) setPhase("active"); }, [incident]);
  useEffect(() => {
    if (phase === "active") { elapsedTimer.current = setInterval(() => setElapsed(e => e + 1), 1000); }
    return () => clearInterval(elapsedTimer.current);
  }, [phase]);

  const startHold = () => {
    if (phase !== "idle") return;
    setPhase("arming"); holdStart.current = Date.now();
    holdTimer.current = setInterval(() => {
      const p = Math.min(100, ((Date.now() - holdStart.current) / 2000) * 100);
      setHoldProgress(p);
      if (p >= 100) { clearInterval(holdTimer.current); triggerSOS(); }
    }, 30);
  };
  const cancelHold = () => { if (phase !== "arming") return; clearInterval(holdTimer.current); setPhase("idle"); setHoldProgress(0); };
  const triggerSOS = () => {
    setPhase("triggered"); setLogs([]);
    LOG_SEQUENCE.forEach(({ delay, msg, type }) => {
      setTimeout(() => setLogs(l => [...l, { msg, type, time: new Date().toLocaleTimeString("en", { hour12: false }) }]), delay);
    });
    setTimeout(() => {
      setPhase("active");
      onTrigger({ id: `TR-${Date.now().toString().slice(-6)}`, profile: selected, coords: { lat: 14.5995 + (Math.random() - 0.5) * 0.01, lng: 120.9842 + (Math.random() - 0.5) * 0.01 }, startTime: Date.now(), zone: "Zone 4B — Eastside District" });
    }, 7500);
  };
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="sos-page">
      <div className="sos-left">
        <div className="section-tag">// DEPENDENT PROFILE</div>
        <h2 className="sos-title">Who are you<br />protecting?</h2>
        <div className="profile-list">
          {VICTIM_PROFILES.map(p => (
            <div key={p.id} className={`profile-card ${selected.id === p.id ? "selected" : ""}`} onClick={() => phase === "idle" && setSelected(p)}>
              <div className="profile-card-header">
                <div className="profile-avatar">{p.name.charAt(0)}</div>
                <div><div className="profile-name">{p.name}, {p.age}</div><div className="profile-condition">{p.condition}</div></div>
                {selected.id === p.id && <div className="badge green" style={{ marginLeft: "auto" }}>ACTIVE</div>}
              </div>
              {selected.id === p.id && (
                <div className="profile-details fade-in">
                  <div className="detail-row"><span>Language</span><span>{p.language}</span></div>
                  <div className="detail-row"><span>Behavior</span><span>{p.behavior}</span></div>
                  <div style={{ marginTop: 12 }}>
                    <div className="risk-row"><span className="risk-key">MEDICAL</span><div className="risk-track"><div className="risk-fill" style={{ width: `${p.medicalRisk}%`, background: p.medicalRisk > 70 ? "var(--red)" : "var(--yellow)" }} /></div><span className="risk-val">{p.medicalRisk}%</span></div>
                    <div className="risk-row"><span className="risk-key">MOBILITY</span><div className="risk-track"><div className="risk-fill" style={{ width: `${p.mobilityRisk}%`, background: "var(--blue)" }} /></div><span className="risk-val">{p.mobilityRisk}%</span></div>
                    <div className="risk-row"><span className="risk-key">THREAT</span><div className="risk-track"><div className="risk-fill" style={{ width: `${p.threatRisk}%`, background: p.threatRisk > 80 ? "var(--red)" : "var(--orange)" }} /></div><span className="risk-val">{p.threatRisk}%</span></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="sos-right">
        {phase === "idle" && (
          <div className="sos-trigger-zone fade-in">
            <div className="section-tag" style={{ textAlign: "center" }}>// EMERGENCY TRIGGER</div>
            <p className="sos-instruction">Hold the button for 2 seconds to activate T.R.A.C.E. for <strong>{selected.name}</strong></p>
            <div className="sos-btn-wrap">
              <div className="sos-ring sos-ring-1" /><div className="sos-ring sos-ring-2" />
              <button className="sos-btn" onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold} onTouchStart={startHold} onTouchEnd={cancelHold}>SOS</button>
            </div>
            <p className="sos-hint">Hold to activate · Release to cancel</p>
          </div>
        )}
        {phase === "arming" && (
          <div className="sos-trigger-zone fade-in">
            <div className="section-tag" style={{ textAlign: "center" }}>// ARMING...</div>
            <div className="sos-btn-wrap">
              <svg className="sos-progress-ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,45,45,0.15)" strokeWidth="4" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--red)" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 54}`} strokeDashoffset={`${2 * Math.PI * 54 * (1 - holdProgress / 100)}`}
                  strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
              </svg>
              <button className="sos-btn arming" onMouseUp={cancelHold} onMouseLeave={cancelHold} onTouchEnd={cancelHold}>{Math.round(holdProgress)}%</button>
            </div>
            <p className="sos-hint" style={{ color: "var(--red)" }}>Keep holding...</p>
          </div>
        )}
        {(phase === "triggered" || phase === "active") && (
          <div className="sos-active fade-in">
            <div className="sos-active-header"><div className="pulse-dot" /><span className="section-tag" style={{ margin: 0 }}>{phase === "triggered" ? "ACTIVATING T.R.A.C.E..." : `INCIDENT ACTIVE — ${fmt(elapsed)}`}</span></div>
            <div className="sos-active-profile">
              <div className="profile-avatar large">{selected.name.charAt(0)}</div>
              <div><div className="profile-name">{selected.name}, {selected.age}</div><div className="profile-condition">{selected.condition}</div></div>
              <div className="badge red" style={{ marginLeft: "auto", alignSelf: "flex-start" }}>{phase === "triggered" ? "INIT" : "LIVE"}</div>
            </div>
            <div className="log-feed">
              <div className="section-tag">// SYSTEM LOG</div>
              {logs.map((l, i) => <div key={i} className={`log-entry log-${l.type}`}><span className="log-time">{l.time}</span><span className="log-msg">{l.msg}</span></div>)}
              {phase === "triggered" && <div className="log-cursor">_</div>}
            </div>
            {phase === "active" && <div className="sos-active-actions fade-up"><div className="badge green">✓ RESPONSE ACTIVE</div><p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 8 }}>Switch to <strong style={{ color: "var(--text)" }}>Command</strong> tab to view live map & responders</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIVE MAP
═══════════════════════════════════════════ */
function LiveMap({ incident, elapsed }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({ responders: [], tick: 0 });
  const [aggressorAlert, setAggressorAlert] = useState(false);
  const cx = incident?.coords?.lng ?? 120.9842;
  const cy = incident?.coords?.lat ?? 14.5995;

  useEffect(() => {
    stateRef.current.responders = [
      { id: "R1", emoji: "👮", x: cx - 0.006, y: cy - 0.004, speed: 0.0008 },
      { id: "R2", emoji: "🚑", x: cx + 0.005, y: cy + 0.005, speed: 0.0006 },
      { id: "R3", emoji: "🙋", x: cx + 0.007, y: cy - 0.003, speed: 0.0005 },
    ];
  }, [cx, cy]);

  useEffect(() => { if (incident?.profile?.threatRisk > 80 && elapsed > 30) setAggressorAlert(true); }, [elapsed, incident]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const W = () => canvas.width, H = () => canvas.height;
    const toScreen = (lng, lat) => ({ x: (lng - (cx - 0.02)) * (W() / 0.04), y: H() - (lat - (cy - 0.02)) * (H() / 0.04) });

    const draw = () => {
      stateRef.current.tick++;
      const t = stateRef.current.tick;
      const w = W(), h = H();
      ctx.fillStyle = "#070B10"; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.025)"; ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 8;
      [[0.2, 0, 0.2, 1], [0.5, 0, 0.5, 1], [0.8, 0, 0.8, 1], [0, 0.3, 1, 0.3], [0, 0.65, 1, 0.65]].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath(); ctx.moveTo(x1 * w, y1 * h); ctx.lineTo(x2 * w, y2 * h); ctx.stroke();
      });
      const victim = toScreen(cx, cy);
      for (let i = 0; i < 3; i++) {
        const r = ((t * 0.8 + i * 30) % 90);
        ctx.beginPath(); ctx.arc(victim.x, victim.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,45,45,${(1 - r / 90) * 0.35})`; ctx.lineWidth = 1; ctx.stroke();
      }
      stateRef.current.responders = stateRef.current.responders.map(r => {
        const dx = cx - r.x, dy = cy - r.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.0005) return { ...r, x: r.x + (dx / dist) * r.speed, y: r.y + (dy / dist) * r.speed };
        return r;
      });
      stateRef.current.responders.forEach(r => {
        const rp = toScreen(r.x, r.y);
        ctx.beginPath(); ctx.setLineDash([4, 8]); ctx.moveTo(rp.x, rp.y); ctx.lineTo(victim.x, victim.y);
        ctx.strokeStyle = "rgba(0,255,136,0.15)"; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(rp.x, rp.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#00FF88"; ctx.shadowColor = "#00FF88"; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
        ctx.font = "13px sans-serif"; ctx.fillText(r.emoji, rp.x - 8, rp.y - 13);
      });
      if (aggressorAlert) {
        const ax = cx + 0.008 + Math.sin(t * 0.02) * 0.001, ay = cy - 0.006 + Math.cos(t * 0.015) * 0.001;
        const ap = toScreen(ax, ay);
        ctx.beginPath(); ctx.arc(ap.x, ap.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#FF6B1A"; ctx.shadowColor = "#FF6B1A"; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,107,26,0.06)"; ctx.beginPath(); ctx.arc(ap.x, ap.y, 30, 0, Math.PI * 2); ctx.fill();
        ctx.font = "12px sans-serif"; ctx.fillText("⚠️", ap.x - 8, ap.y - 13);
      }
      ctx.beginPath(); ctx.arc(victim.x, victim.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#FF2D2D"; ctx.shadowColor = "#FF2D2D"; ctx.shadowBlur = 20; ctx.fill(); ctx.shadowBlur = 0;
      ctx.font = "bold 11px 'Space Mono',monospace"; ctx.fillStyle = "rgba(255,45,45,0.8)"; ctx.fillText("VICTIM", victim.x + 12, victim.y + 4);
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [cx, cy, aggressorAlert]);

  return (
    <div className="map-container">
      <canvas ref={canvasRef} className="map-canvas" />
      <div className="map-overlay-tl"><div className="map-label">LIVE PROBABILITY MAP</div><div className="map-coords">{cy.toFixed(4)}°N · {cx.toFixed(4)}°E</div></div>
      <div className="map-legend">
        <div className="legend-item"><span className="legend-dot red" />VICTIM</div>
        <div className="legend-item"><span className="legend-dot green" />RESPONDERS</div>
        {aggressorAlert && <div className="legend-item"><span className="legend-dot orange" />AGGRESSOR</div>}
      </div>
      {aggressorAlert && <div className="map-aggressor-alert fade-in"><span className="pulse-dot" />⚠ AGGRESSOR PROXIMITY — REROUTING RESPONDERS</div>}
      <div className="map-responder-chips">
        {RESPONDERS_DATA.map(r => (
          <div key={r.id} className="resp-chip"><span>{r.emoji}</span><span className="resp-chip-name">{r.name}</span><span className="badge green" style={{ fontSize: 8 }}>EN ROUTE</span></div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RESPONDER PANEL
═══════════════════════════════════════════ */
function ResponderPanel({ incident, elapsed }) {
  const [responders, setResponders] = useState(RESPONDERS_DATA);
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState("R1");

  useEffect(() => {
    setResponders(prev => prev.map(r => ({ ...r, eta: Math.max(0, r.eta - elapsed), status: elapsed >= r.eta ? "on-scene" : r.status })));
    setAlerts(CROWD_ALERTS.filter(a => elapsed >= a.time));
  }, [elapsed]);

  const confirm = id => setAlerts(prev => prev.map(a => a.id === id ? { ...a, confirmed: true } : a));
  const sel = responders.find(r => r.id === selected);

  return (
    <div className="resp-panel">
      <div className="resp-list">
        <div className="panel-section-title">DEPLOYED UNITS</div>
        {responders.map(r => (
          <div key={r.id} className={`resp-item ${selected === r.id ? "selected" : ""}`} onClick={() => setSelected(r.id)}>
            <div className="resp-emoji">{r.emoji}</div>
            <div className="resp-info-block">
              <div className="resp-name-row"><span className="resp-name">{r.name}</span><span className={`badge ${r.status === "on-scene" ? "green" : r.status === "active" ? "blue" : "yellow"}`}>{r.status === "on-scene" ? "ON SCENE" : r.status === "active" ? "ACTIVE" : `${r.eta}s`}</span></div>
              <div className="resp-role-text">{r.role}</div>
              <div className="resp-dist">{r.distance} · {r.unit}</div>
            </div>
          </div>
        ))}
        {alerts.length > 0 && (<>
          <div className="panel-section-title" style={{ marginTop: 12 }}>CROWD SCANNER ALERTS</div>
          {alerts.map(a => (
            <div key={a.id} className={`crowd-alert ${a.confirmed ? "confirmed" : ""}`}>
              <div className="crowd-alert-header"><span className="crowd-time">T+{a.time}s</span><span className={`badge ${a.confidence > 70 ? "yellow" : "blue"}`}>{a.confidence}% MATCH</span>{a.confirmed && <span className="badge green">CONFIRMED</span>}</div>
              <div className="crowd-msg">{a.msg}</div>
              {!a.confirmed && <button className="btn-ghost" style={{ marginTop: 8, fontSize: 10, padding: "6px 12px" }} onClick={() => confirm(a.id)}>CONFIRM SIGHTING</button>}
            </div>
          ))}
        </>)}
      </div>
      <div className="resp-detail">
        {sel && <div className="fade-in">
          <div className="resp-detail-header">
            <div style={{ fontSize: 32 }}>{sel.emoji}</div>
            <div><div style={{ fontSize: 16, fontWeight: 600 }}>{sel.name}</div><div style={{ fontSize: 12, color: "var(--text-dim)" }}>{sel.unit}</div><div className="section-tag" style={{ marginTop: 4 }}>{sel.role}</div></div>
          </div>
          <div className="resp-detail-stats">
            <div className="detail-stat"><div className="detail-stat-val">{sel.distance}</div><div className="detail-stat-key">DISTANCE</div></div>
            <div className="detail-stat"><div className="detail-stat-val" style={{ color: sel.status === "on-scene" ? "var(--green)" : "var(--yellow)" }}>{sel.status === "on-scene" ? "ON SCENE" : `${sel.eta}s`}</div><div className="detail-stat-key">ETA</div></div>
            <div className="detail-stat"><div className="detail-stat-val" style={{ color: "var(--blue)" }}>{sel.tasks.length}</div><div className="detail-stat-key">TASKS</div></div>
          </div>
          <div className="panel-section-title" style={{ marginTop: 20 }}>ASSIGNED TASKS</div>
          <div className="task-list">{sel.tasks.map((t, i) => <div key={i} className="task-item"><div className="task-num">{String(i + 1).padStart(2, "0")}</div><div className="task-text">{t}</div></div>)}</div>
          <div className="panel-section-title" style={{ marginTop: 20 }}>GEMINI BRIEFING</div>
          <div className="gemini-brief"><div className="gemini-tag">AI GENERATED</div><p>Subject is <strong>{incident?.profile?.name}</strong>, {incident?.profile?.age}. <strong>{incident?.profile?.condition}</strong>. Behavioral pattern: {incident?.profile?.behavior}. Language: {incident?.profile?.language}. Approach calmly — do not use sirens near subject.</p></div>
        </div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EVIDENCE VAULT
═══════════════════════════════════════════ */
const STATUS_COLOR = { encrypted: "green", synced: "blue", secured: "yellow" };

function EvidenceVault({ incident, elapsed }) {
  const visible = EVIDENCE_TIMELINE.filter(e => elapsed >= e.t);
  const reportReady = elapsed >= 120;

  const downloadReport = () => {
    const txt = ["T.R.A.C.E. INCIDENT REPORT", "=".repeat(30), `ID: INC #${incident?.id}`, `Subject: ${incident?.profile?.name}, ${incident?.profile?.age}`, `Condition: ${incident?.profile?.condition}`, `Location: ${incident?.zone}`, `Generated: ${new Date().toISOString()}`, "", "EVIDENCE LOG:", ...visible.map(e => `[${e.type}] ${e.label}`), "", "BIAS CORRECTION: PASSED", "CLASSIFICATION: MISSING PERSON"].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" })); a.download = `TRACE_${incident?.id}.txt`; a.click();
  };

  return (
    <div className="evidence-page">
      <div className="evidence-list">
        <div className="evidence-header-row"><div className="panel-section-title" style={{ margin: 0 }}>LIVE EVIDENCE CAPTURE</div><div className="badge green">{visible.length} ITEMS</div></div>
        <div className="ev-timeline">
          {visible.map((e, i) => (
            <div key={i} className="ev-item fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="ev-line-wrap"><div className={`ev-dot ${STATUS_COLOR[e.status]}`} />{i < visible.length - 1 && <div className="ev-connector" />}</div>
              <div className="ev-content">
                <div className="ev-top-row"><span className="ev-icon">{e.icon}</span><span className="ev-type">{e.type}</span><span className={`badge ${STATUS_COLOR[e.status]}`}>{e.status.toUpperCase()}</span><span className="ev-ts">T+{e.t}s</span></div>
                <div className="ev-label">{e.label}</div><div className="ev-detail">{e.detail}</div>
              </div>
            </div>
          ))}
          {!reportReady && <div className="ev-pending"><div className="ev-pending-dot" /><span>Capturing more evidence...</span></div>}
        </div>
      </div>
      <div className="evidence-right">
        <div className="panel-section-title">VAULT STATUS</div>
        <div className="vault-stats">
          {[["ENCRYPTED", visible.filter(e => e.status === "encrypted").length, "var(--green)"], ["SYNCED", visible.filter(e => e.status === "synced").length, "var(--blue)"], ["SECURED", visible.filter(e => e.status === "secured").length, "var(--yellow)"]].map(([l, v, c]) => (
            <div key={l} className="vault-stat-card"><div className="vault-stat-val" style={{ color: c }}>{v}</div><div className="vault-stat-key">{l}</div></div>
          ))}
        </div>
        <div className="panel-section-title" style={{ marginTop: 16 }}>PROFILE LOCK</div>
        <div className="profile-lock-card">
          {[["NAME", incident?.profile?.name], ["AGE", incident?.profile?.age], ["CONDITION", incident?.profile?.condition], ["LANGUAGE", incident?.profile?.language], ["CLASSIFICATION", "MISSING PERSON"], ["BIAS CHECK", "✓ PASSED"]].map(([k, v]) => (
            <div key={k} className="lock-row"><span className="lock-key">{k}</span><span className="lock-val" style={k === "BIAS CHECK" ? { color: "var(--green)" } : {}}>{v}</span></div>
          ))}
        </div>
        <div className="panel-section-title" style={{ marginTop: 16 }}>LEGAL REPORT</div>
        <div className="report-card">
          {reportReady ? (<><div className="badge green" style={{ marginBottom: 10 }}>REPORT READY</div><p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 14, lineHeight: 1.6 }}>Full incident report compiled with all evidence timestamps and audit trail.</p><button className="btn-primary" onClick={downloadReport}>DOWNLOAD REPORT</button></>) : (<><div className="badge yellow" style={{ marginBottom: 10 }}>COMPILING...</div><p style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 10 }}>Auto-generating legal report. ({Math.max(0, 120 - elapsed)}s remaining)</p><div className="compile-bar"><div className="compile-fill" style={{ width: `${Math.min(100, (elapsed / 120) * 100)}%` }} /></div></>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CROSS-MATCH (with Gemini AI)
═══════════════════════════════════════════ */
const SCAN_DELAY = 8;

function CrossMatch({ incident, elapsed }) {
  const [geminiProfile, setGeminiProfile] = useState(null);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState(null);
  const scanned = DATABASES.filter((_, i) => elapsed >= (i + 1) * SCAN_DELAY);
  const scanning = DATABASES.find((_, i) => elapsed >= i * SCAN_DELAY && elapsed < (i + 1) * SCAN_DELAY);

  const runGemini = async () => {
    if (!incident?.profile) return;
    setGeminiLoading(true); setGeminiError(null); setGeminiProfile(null);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing Gemini API key");
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "You are T.R.A.C.E. crisis AI. Return only valid JSON with keys: riskLevel (CRITICAL|HIGH|MODERATE), approachStrategy (string), searchPriority (array of 3 strings), doList (array of 3 strings), dontList (array of 2 strings), languageTip (string), medicalNote (string). No markdown. No backticks.",
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Generate field briefing: Name:${incident.profile.name}, Age:${incident.profile.age}, Condition:${incident.profile.condition}, Behavior:${incident.profile.behavior}, Language:${incident.profile.language}, Medical risk:${incident.profile.medicalRisk}%`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      });
      if (!res.ok) throw new Error(`Gemini request failed with ${res.status}`);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("") || "";
      setGeminiProfile(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) {
      setGeminiError("Using simulated Gemini profile for demo. Add VITE_GEMINI_API_KEY to enable live Gemini responses.");
      setGeminiProfile({
        riskLevel: incident.profile.medicalRisk > 70 ? "CRITICAL" : "HIGH",
        approachStrategy: `Approach ${incident.profile.name} calmly and quietly — avoid sudden movements or loud commands.`,
        searchPriority: ["Enclosed spaces (buildings, stairwells)", "Nearby water bodies or green spaces", "Market areas with dense crowds"],
        doList: ["Use subject's first name directly", "Speak in primary language first", "Offer physical support immediately"],
        dontList: ["Do not use sirens in proximity", "Do not approach with multiple officers at once"],
        languageTip: `Begin in ${incident.profile.language.split("/")[0].trim()} — switch to secondary language if no response.`,
        medicalNote: `Subject has ${incident.profile.condition} — prepare for disorientation and handle with care.`
      });
    }
    setGeminiLoading(false);
  };

  const riskColor = { CRITICAL: "var(--red)", HIGH: "var(--orange)", MODERATE: "var(--yellow)" };

  return (
    <div className="crossmatch-page">
      <div className="crossmatch-left">
        <div className="panel-section-title">DATABASE CROSS-MATCH</div>
        <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16, lineHeight: 1.6 }}>Silent real-time scan — no manual calls required.</p>
        <div className="db-list">
          {DATABASES.map((db, i) => {
            const done = scanned.find(s => s.id === db.id);
            const isScanning = scanning?.id === db.id;
            const progress = isScanning ? ((elapsed - i * SCAN_DELAY) / SCAN_DELAY) * 100 : done ? 100 : 0;
            return (
              <div key={db.id} className={`db-card ${isScanning ? "scanning" : ""} ${done ? "done" : ""}`}>
                <div className="db-card-header">
                  <span className="db-icon">{db.icon}</span>
                  <div className="db-info"><div className="db-label">{db.label}</div><div className="db-systems">{db.systems.join(" · ")}</div></div>
                  <div className="db-status">
                    {done && <span className="badge green">NO MATCH</span>}
                    {isScanning && <span className="badge yellow">SCANNING</span>}
                    {!done && !isScanning && <span className="badge" style={{ background: "var(--bg3)", color: "var(--text-dim)", border: "1px solid var(--border)" }}>QUEUED</span>}
                  </div>
                </div>
                {(isScanning || done) && <div className="db-progress-bar"><div className="db-progress-fill" style={{ width: `${progress}%`, background: done ? "var(--green)" : "var(--yellow)", transition: isScanning ? "width 0.5s linear" : "none" }} /></div>}
                {isScanning && <div className="db-scanning-text">Scanning {db.systems[0]}...</div>}
              </div>
            );
          })}
        </div>
        <div className="crossmatch-summary">
          <div className="panel-section-title" style={{ marginBottom: 12 }}>SCAN SUMMARY</div>
          <div className="summary-stats">
            <div className="summary-stat"><div className="summary-val">{scanned.length}</div><div className="summary-key">DONE</div></div>
            <div className="summary-stat"><div className="summary-val" style={{ color: "var(--green)" }}>0</div><div className="summary-key">MATCHES</div></div>
            <div className="summary-stat"><div className="summary-val" style={{ color: "var(--yellow)" }}>{DATABASES.length - scanned.length - (scanning ? 1 : 0)}</div><div className="summary-key">QUEUED</div></div>
          </div>
        </div>
      </div>

      <div className="crossmatch-right">
        <div className="panel-section-title">GEMINI AI FIELD BRIEFING</div>
        <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16, lineHeight: 1.6 }}>Real Gemini API call — generates live responder guidance from subject profile.</p>
        {!geminiProfile && !geminiLoading && (
          <div className="gemini-trigger"><div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div><div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Generate AI Briefing</div><div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 16, lineHeight: 1.6 }}>Gemini will analyze {incident?.profile?.name}'s profile and generate field instructions.</div><button className="btn-primary" onClick={runGemini}>RUN GEMINI ANALYSIS</button></div>
        )}
        {geminiLoading && <div className="gemini-loading"><div className="gemini-spinner" /><div className="section-tag" style={{ marginTop: 12 }}>GEMINI ANALYZING...</div></div>}
        {geminiError && <div className="gemini-error-note">{geminiError}</div>}
        {geminiProfile && (
          <div className="gemini-result fade-in">
            <div className="gemini-risk-banner" style={{ borderColor: riskColor[geminiProfile.riskLevel], background: `${riskColor[geminiProfile.riskLevel]}10` }}>
              <span style={{ color: riskColor[geminiProfile.riskLevel], fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: "0.1em" }}>{geminiProfile.riskLevel}</span>
              <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 8 }}>RISK LEVEL</span>
            </div>
            <div className="gemini-section"><div className="gemini-section-title">APPROACH STRATEGY</div><p className="gemini-text">{geminiProfile.approachStrategy}</p></div>
            <div className="gemini-section"><div className="gemini-section-title">SEARCH PRIORITY ZONES</div>{geminiProfile.searchPriority.map((z, i) => <div key={i} className="priority-zone"><span className="priority-num">#{i + 1}</span><span className="gemini-text">{z}</span></div>)}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="gemini-section"><div className="gemini-section-title" style={{ color: "var(--green)" }}>DO</div>{geminiProfile.doList.map((d, i) => <div key={i} className="do-item">✓ {d}</div>)}</div>
              <div className="gemini-section"><div className="gemini-section-title" style={{ color: "var(--red)" }}>DON'T</div>{geminiProfile.dontList.map((d, i) => <div key={i} className="dont-item">✗ {d}</div>)}</div>
            </div>
            <div className="gemini-section"><div className="gemini-section-title">LANGUAGE TIP</div><p className="gemini-text">{geminiProfile.languageTip}</p></div>
            <div className="gemini-section"><div className="gemini-section-title">MEDICAL NOTE</div><p className="gemini-text">{geminiProfile.medicalNote}</p></div>
            <button className="btn-ghost" style={{ marginTop: 12, width: "100%" }} onClick={runGemini}>REGENERATE</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════ */
function ProfilePage() {
  const [profiles, setProfiles] = useState(VICTIM_PROFILES);
  const [selected, setSelected] = useState(VICTIM_PROFILES[0]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const riskColor = v => v > 70 ? "var(--red)" : v > 40 ? "var(--yellow)" : "var(--green)";

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="panel-section-title">REGISTERED DEPENDANTS</div>
        {profiles.map(p => (
          <div key={p.id} className={`profile-list-item ${selected?.id === p.id ? "selected" : ""}`} onClick={() => { setSelected(p); setEditing(false); }}>
            <div className="profile-list-avatar">{p.name.charAt(0)}</div>
            <div><div className="profile-list-name">{p.name}, {p.age}</div><div className="profile-list-cond">{p.condition}</div></div>
          </div>
        ))}
        <button className="btn-ghost" style={{ marginTop: 12, width: "100%", fontSize: 10 }}>+ ADD DEPENDANT</button>
      </div>
      <div className="profile-detail">
        {!editing ? (
          <div className="fade-in">
            <div className="pd-header">
              <div className="pd-avatar">{selected?.name?.charAt(0)}</div>
              <div><div className="pd-name">{selected?.name}, {selected?.age}</div><div className="pd-cond">{selected?.condition}</div><div className="pd-id">{selected?.id}</div></div>
              <button className="btn-ghost" style={{ marginLeft: "auto" }} onClick={() => { setForm({ ...selected }); setEditing(true); }}>EDIT</button>
            </div>
            <div className="pd-grid">
              <div className="pd-section">
                <div className="panel-section-title">BASIC INFO</div>
                {[["Language", selected?.language], ["Behavior", selected?.behavior], ["Emergency Contact", selected?.contact]].map(([k, v]) => (
                  <div key={k} className="pd-row"><span className="pd-key">{k}</span><span className="pd-val">{v}</span></div>
                ))}
              </div>
              <div className="pd-section">
                <div className="panel-section-title">RISK ASSESSMENT</div>
                {[["MEDICAL", selected?.medicalRisk], ["MOBILITY", selected?.mobilityRisk], ["THREAT", selected?.threatRisk]].map(([k, v]) => (
                  <div key={k} className="risk-row"><span className="risk-key">{k}</span><div className="risk-track"><div className="risk-fill" style={{ width: `${v}%`, background: riskColor(v) }} /></div><span className="risk-val">{v}%</span></div>
                ))}
              </div>
            </div>
            <div className="pd-section" style={{ marginTop: 20 }}>
              <div className="panel-section-title">BIAS PROTECTION</div>
              <div className="bias-card"><div className="badge green" style={{ marginBottom: 8 }}>✓ ACTIVE</div><p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>T.R.A.C.E. will automatically flag and override any misclassification of <strong style={{ color: "var(--text)" }}>{selected?.name}</strong> as a "runaway" or low-priority case.</p></div>
            </div>
          </div>
        ) : (
          <div className="pd-edit fade-in">
            <div className="panel-section-title">EDITING — {form.id}</div>
            {[["Name", "name"], ["Age", "age"], ["Condition", "condition"], ["Language", "language"], ["Behavior", "behavior"], ["Emergency Contact", "contact"]].map(([label, key]) => (
              <div key={key} className="edit-field">
                <label className="edit-label">{label}</label>
                <input className="edit-input" value={form[key] || ""} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div className="edit-actions">
              <button className="btn-primary" onClick={() => { setProfiles(prev => prev.map(p => p.id === form.id ? form : p)); setSelected(form); setEditing(false); }}>SAVE</button>
              <button className="btn-ghost" onClick={() => setEditing(false)}>CANCEL</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
function DashboardPage({ incident }) {
  const [tab, setTab] = useState("MAP");
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!incident) return;
    const start = incident.startTime || Date.now();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, [incident]);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (!incident) return (
    <div className="dash-empty">
      <div className="section-tag">// NO ACTIVE INCIDENT</div>
      <h2 className="dash-empty-title">Command Center<br />Standing By</h2>
      <p>Trigger an SOS from the <strong>SOS tab</strong> to activate.</p>
      <div className="dash-standby-grid">
        {["T — TRIGGER", "R — RECONSTRUCT", "A — ACTIVATE", "C — COORDINATE", "E — EVIDENCE"].map((s, i) => (
          <div key={i} className="standby-card"><div className="standby-letter">{s.charAt(0)}</div><div className="standby-text">{s.slice(4)}</div></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div><div className="dash-id"><span className="pulse-dot" />INC #{incident.id}</div><div className="dash-victim">{incident.profile.name}, {incident.profile.age} — {incident.profile.condition}</div><div className="dash-zone">{incident.zone}</div></div>
        <div className="dash-header-right"><div className="dash-timer">{fmt(elapsed)}</div><div className="dash-timer-label">ELAPSED</div><div className="badge red">CRITICAL</div></div>
      </div>
      <div className="dash-tabs">
        {["MAP", "RESPONDERS", "EVIDENCE", "CROSS-MATCH"].map(t => <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <div className="dash-content">
        {tab === "MAP" && <LiveMap incident={incident} elapsed={elapsed} />}
        {tab === "RESPONDERS" && <ResponderPanel incident={incident} elapsed={elapsed} />}
        {tab === "EVIDENCE" && <EvidenceVault incident={incident} elapsed={elapsed} />}
        {tab === "CROSS-MATCH" && <CrossMatch incident={incident} elapsed={elapsed} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
function readGoogTransCookie() {
  const cookie = document.cookie.split("; ").find(entry => entry.startsWith("googtrans="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function writeGoogTransCookie(lang) {
  const value = `/en/${lang}`;
  document.cookie = `googtrans=${encodeURIComponent(value)};path=/`;
  if (window.location.hostname.includes(".")) {
    document.cookie = `googtrans=${encodeURIComponent(value)};path=/;domain=${window.location.hostname}`;
  }
}

function clearGoogTransCookie() {
  document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  if (window.location.hostname.includes(".")) {
    document.cookie = `googtrans=;path=/;domain=${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

function applyGoogleTranslateLanguage(lang, attempt = 0) {
  const combo = document.querySelector(".goog-te-combo");
  if (!combo) {
    if (attempt < 20) {
      window.setTimeout(() => applyGoogleTranslateLanguage(lang, attempt + 1), 300);
    }
    return;
  }
  if (combo.value !== lang) {
    combo.value = lang;
    combo.dispatchEvent(new Event("change"));
  }
}

function LanguageSwitcher({ language, onChange }) {
  const [open, setOpen] = useState(false);
  const activeLanguage = LANGUAGE_OPTIONS.find(option => option.code === language) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const close = event => {
      if (!event.target.closest(".language-switcher")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="language-switcher">
      <button className="language-button" type="button" onClick={event => { event.stopPropagation(); setOpen(prev => !prev); }}>
        <span className="language-label">Language</span>
        <span>{activeLanguage.label}</span>
        <span className="language-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="language-menu">
          {LANGUAGE_OPTIONS.map(option => (
            <button
              key={option.code}
              className={`language-option ${option.code === language ? "active" : ""}`}
              type="button"
              onClick={() => {
                onChange(option.code);
                setOpen(false);
              }}
            >
              <span>{option.label}</span>
              <span className="language-native">{option.nativeLabel}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function InnovationPage() {
  return (
    <div className="innovation-page">
      <div className="innovation-hero">
        <section className="innovation-hero-card">
          <div className="section-tag">// NEXT INNOVATION LAYERS</div>
          <h1>Search Faster.<br />Protect Smarter.</h1>
          <p className="innovation-lead">TRACE is evolving from a reactive emergency workflow into an intelligence layer for missing-person response, domestic violence escape support, and post-crisis recovery.</p>
          <div className="innovation-pills">
            <span className="innovation-pill">Behavioral profiling</span>
            <span className="innovation-pill">Hyper-local scanner network</span>
            <span className="innovation-pill">Threat route prediction</span>
            <span className="innovation-pill">Trauma handoff automation</span>
          </div>
        </section>

        <aside className="innovation-stack-intro">
          <div className="section-tag">// SIGNAL SNAPSHOT</div>
          <p className="innovation-lead" style={{ fontSize: 14 }}>The upgraded Google stack turns TRACE into a live decision engine that can reason over victim behavior, aggressor proximity, healthcare intake signals, and search geography at the same time.</p>
          <div className="innovation-stat-grid">
            <div className="innovation-stat"><div className="innovation-stat-value">90s</div><div className="innovation-stat-label">Cross-match cadence</div></div>
            <div className="innovation-stat"><div className="innovation-stat-value">6</div><div className="innovation-stat-label">New innovation layers</div></div>
            <div className="innovation-stat"><div className="innovation-stat-value">1</div><div className="innovation-stat-label">Shared command picture</div></div>
          </div>
        </aside>
      </div>

      <section>
        <div className="section-tag">// CAPABILITIES</div>
        <div className="innovation-grid">
          {INNOVATION_LAYERS.map((layer, index) => (
            <article key={layer.title} className="innovation-card">
              <div className="innovation-card-top">
                <div className="innovation-card-index">{String(index + 1).padStart(2, "0")}</div>
                <span className="badge blue">LIVE CONCEPT</span>
              </div>
              <div className="innovation-card-title">{layer.title}</div>
              <p className="innovation-card-body">{layer.summary}</p>
              <p className="innovation-card-detail">{layer.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-tag">// GOOGLE TECH STACK</div>
        <div className="stack-grid">
          {GOOGLE_STACK.map(item => (
            <article key={item.capability} className="stack-card">
              <div className="stack-title">{item.capability}</div>
              <div className="stack-tool">{item.tool}</div>
              <p className="stack-copy">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("sos");
  const [incident, setIncident] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem(TRACE_LANGUAGE_STORAGE_KEY) || "en");

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(TRACE_LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    const initializeTranslate = () => {
      if (!window.google?.translate?.TranslateElement) return false;
      if (!window.__TRACE_TRANSLATE_INITIALIZED__) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: LANGUAGE_OPTIONS.map(option => option.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );
        window.__TRACE_TRANSLATE_INITIALIZED__ = true;
      }
      return true;
    };

    window.googleTranslateElementInit = () => {
      initializeTranslate();
      if (language !== "en") {
        applyGoogleTranslateLanguage(language);
      }
    };

    if (!initializeTranslate()) {
      const existingScript = document.querySelector('script[data-trace-translate="true"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.dataset.traceTranslate = "true";
        document.body.appendChild(script);
      }
    }
  }, [language]);

  useEffect(() => {
    const currentCookie = readGoogTransCookie();
    if (language === "en") {
      if (currentCookie && !currentCookie.endsWith("/en")) {
        clearGoogTransCookie();
        window.location.reload();
      }
      return;
    }
    writeGoogTransCookie(language);
    applyGoogleTranslateLanguage(language);
  }, [language]);

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <nav className="navbar">
          <div className="nav-logo">T<span>.</span>R<span>.</span>A<span>.</span>C<span>.</span>E</div>
          <div className="nav-tabs">
            <button className={view === "sos" ? "active" : ""} onClick={() => setView("sos")}>SOS</button>
            <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>Command</button>
            <button className={view === "innovation" ? "active" : ""} onClick={() => setView("innovation")}>Innovation</button>
            <button className={view === "profile" ? "active" : ""} onClick={() => setView("profile")}>Profiles</button>
          </div>
          <div className="nav-right">
            {incident && <div className="nav-alert"><span className="pulse-dot" />ACTIVE INCIDENT</div>}
            <LanguageSwitcher language={language} onChange={setLanguage} />
          </div>
        </nav>
        <div id="google_translate_element" className="translate-anchor" />
        <main className="main">
          {view === "sos" && <SOSPage onTrigger={d => { setIncident(d); }} incident={incident} />}
          {view === "dashboard" && <DashboardPage incident={incident} />}
          {view === "innovation" && <InnovationPage />}
          {view === "profile" && <ProfilePage />}
        </main>
      </div>
    </>
  );
}
