import { useEffect, useMemo, useRef, useState } from "react";
import { EmergencyCommandMap } from "./EmergencyCommandMap";
import {
  CLIENT_COPY_BY_LANGUAGE,
  CLIENT_PROFILE_COPY,
  CROSS_MATCH_SYSTEMS,
  LANGUAGE_OPTIONS,
  SOS_LOG_SEQUENCE,
  TRACE_CLIENTS,
  TRAUMA_RESOURCES,
  createIncident,
  formatClock,
  formatElapsed,
  getActivationGroups,
  getDemoHelpServices,
} from "./traceData";
import {
  generateConditionBrief,
  generateTraumaHandoff,
  sealAuditPayload,
} from "./traceApi";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

:root {
  --red: #ff4d4d;
  --red-soft: rgba(255, 77, 77, 0.14);
  --green: #2ee59d;
  --blue: #59a7ff;
  --amber: #ffb347;
  --violet: #a482ff;
  --cyan: #55d9ff;
  --bg: #060a10;
  --bg-alt: #0b111a;
  --bg-panel: rgba(12, 18, 28, 0.96);
  --bg-panel-soft: rgba(255, 255, 255, 0.03);
  --border: rgba(255, 255, 255, 0.08);
  --text: #edf2fa;
  --text-mid: #a2b2c9;
  --text-dim: #66768e;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
}

body {
  background:
    radial-gradient(circle at top left, rgba(89, 167, 255, 0.08), transparent 24%),
    radial-gradient(circle at top right, rgba(255, 77, 77, 0.08), transparent 24%),
    linear-gradient(180deg, #060a10 0%, #0a1017 100%);
  color: var(--text);
  font-family: "DM Sans", sans-serif;
}

button,
input,
select,
textarea {
  font: inherit;
}

.trace-root,
.trace-app {
  min-height: 100vh;
}

.trace-app {
  display: flex;
  flex-direction: column;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 24px;
  background: rgba(7, 11, 17, 0.92);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(16px);
}

.brand {
  font-family: "Bebas Neue", sans-serif;
  font-size: 30px;
  letter-spacing: 0.2em;
  color: white;
  line-height: 1;
}

.brand span {
  color: var(--red);
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.topbar-right {
  justify-content: flex-end;
  flex-wrap: wrap;
}

.role-pill,
.status-pill,
.mini-status,
.section-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid transparent;
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.role-pill {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border);
  color: var(--text-mid);
}

.status-pill {
  color: var(--red);
  background: rgba(255, 77, 77, 0.1);
  border-color: rgba(255, 77, 77, 0.22);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 14px currentColor;
  animation: pulseDot 1.5s ease-in-out infinite;
}

.topbar-button,
.ghost-button,
.primary-button,
.danger-button {
  border: 0;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.topbar-button,
.ghost-button {
  padding: 10px 14px;
  color: var(--text-mid);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
}

.topbar-button:hover,
.ghost-button:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.16);
  color: white;
}

.primary-button,
.danger-button {
  padding: 12px 16px;
  background: linear-gradient(180deg, #ff4d4d 0%, #c51f1f 100%);
  color: white;
  font-family: "Space Mono", monospace;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  box-shadow: 0 0 24px rgba(255, 77, 77, 0.22);
}

.primary-button:hover,
.danger-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 30px rgba(255, 77, 77, 0.3);
}

.primary-button:disabled,
.danger-button:disabled,
.ghost-button:disabled,
.topbar-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  box-shadow: none;
  transform: none;
}

.danger-button {
  background: linear-gradient(180deg, #ff7b3d 0%, #d14b18 100%);
}

.trace-main {
  flex: 1;
  min-height: 0;
}

.section-tag {
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 2.8px;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 8px;
}

.panel {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  padding: 18px;
}

.panel h2,
.panel h3,
.panel h4,
.panel p {
  margin-top: 0;
}

.panel-title {
  margin: 0 0 8px;
  font-size: 20px;
  color: white;
}

.panel-copy {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-mid);
}

.copy-muted {
  color: var(--text-dim);
}

.role-gate {
  min-height: 100vh;
  padding: 40px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.role-gate-shell {
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 24px;
}

.role-gate-hero {
  padding: 36px;
  border: 1px solid var(--border);
  background:
    radial-gradient(circle at top left, rgba(89, 167, 255, 0.1), transparent 30%),
    linear-gradient(180deg, rgba(11, 17, 26, 0.98) 0%, rgba(7, 11, 17, 0.98) 100%);
}

.hero-title {
  margin: 0 0 14px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 72px;
  line-height: 0.92;
  letter-spacing: 0.08em;
  color: white;
}

.hero-copy {
  margin: 0 0 20px;
  max-width: 540px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-mid);
}

.hero-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.hero-feature {
  padding: 14px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}

.hero-feature strong {
  display: block;
  margin-bottom: 5px;
  color: white;
  font-size: 13px;
}

.hero-feature span {
  color: var(--text-dim);
  font-size: 12px;
  line-height: 1.6;
}

.login-grid {
  display: grid;
  gap: 16px;
  align-content: start;
}

.login-card {
  padding: 22px;
  border: 1px solid var(--border);
  background: rgba(10, 15, 24, 0.96);
}

.login-card h3 {
  margin: 0 0 8px;
  font-size: 22px;
  color: white;
}

.login-card p {
  margin: 0 0 14px;
  font-size: 13px;
  color: var(--text-mid);
  line-height: 1.7;
}

.login-highlights {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 0 18px;
  padding: 0;
  list-style: none;
}

.login-highlights li {
  padding-left: 12px;
  border-left: 2px solid rgba(255, 255, 255, 0.08);
  color: var(--text-dim);
  font-size: 12px;
  line-height: 1.6;
}

.client-layout {
  padding: 24px;
  display: grid;
  gap: 20px;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr) minmax(0, 0.9fr);
  gap: 20px;
}

.profile-select-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.profile-card {
  width: 100%;
  text-align: left;
  padding: 14px;
  border: 1px solid var(--border);
  background: var(--bg-panel-soft);
  color: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.profile-card:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.16);
}

.profile-card.selected {
  border-color: rgba(255, 77, 77, 0.36);
  background: rgba(255, 77, 77, 0.08);
}

.profile-card:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.profile-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-badge {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 77, 77, 0.08);
  border: 1px solid rgba(255, 77, 77, 0.22);
  color: var(--red);
  font-family: "Bebas Neue", sans-serif;
  font-size: 24px;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.profile-name {
  margin-bottom: 2px;
  font-size: 15px;
  font-weight: 600;
  color: white;
}

.profile-address {
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.6;
}

.hero-center {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 100%;
  background:
    radial-gradient(circle at center, rgba(255, 77, 77, 0.14), transparent 48%),
    linear-gradient(180deg, rgba(12, 18, 28, 0.98) 0%, rgba(8, 12, 19, 0.98) 100%);
}

.hero-center h2 {
  margin: 0;
  font-family: "Bebas Neue", sans-serif;
  font-size: 52px;
  letter-spacing: 0.08em;
  line-height: 0.94;
}

.hero-center p {
  margin: 0;
  max-width: 360px;
  color: var(--text-mid);
  font-size: 14px;
  line-height: 1.7;
}

.sos-button {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  border: 0;
  background: linear-gradient(180deg, #ff4d4d 0%, #c51f1f 100%);
  color: white;
  font-family: "Bebas Neue", sans-serif;
  font-size: 46px;
  letter-spacing: 0.16em;
  cursor: pointer;
  box-shadow:
    0 0 46px rgba(255, 77, 77, 0.36),
    0 0 92px rgba(255, 77, 77, 0.14);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sos-button:hover {
  transform: scale(1.02);
  box-shadow:
    0 0 56px rgba(255, 77, 77, 0.44),
    0 0 110px rgba(255, 77, 77, 0.18);
}

.sos-button:disabled {
  cursor: not-allowed;
  opacity: 0.72;
  box-shadow: none;
  transform: none;
}

.status-banner {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  text-align: left;
}

.banner-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.banner-copy {
  margin: 0;
  color: var(--text-mid);
  font-size: 12px;
  line-height: 1.6;
}

.inline-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.language-switch {
  display: inline-flex;
  padding: 4px;
  gap: 4px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
}

.language-button {
  min-width: 72px;
  padding: 10px 12px;
  border: 0;
  cursor: pointer;
  color: var(--text-mid);
  background: transparent;
  font-family: "Space Mono", monospace;
  font-size: 11px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.language-button:hover {
  color: white;
  transform: translateY(-1px);
}

.language-button.active {
  color: white;
  background: rgba(255, 77, 77, 0.16);
}

.translation-note {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-dim);
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.risk-row {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr) 46px;
  gap: 10px;
  align-items: center;
}

.risk-row span {
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--text-dim);
}

.risk-bar {
  height: 5px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.risk-fill {
  height: 100%;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
}

.panel-full {
  grid-column: 1 / -1;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.checklist li {
  padding-left: 14px;
  border-left: 2px solid rgba(255, 255, 255, 0.08);
  color: var(--text-mid);
  font-size: 13px;
  line-height: 1.7;
}

.ai-summary {
  margin: 0 0 14px;
  color: var(--text-mid);
  font-size: 13px;
  line-height: 1.7;
}

.ai-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.ai-list-item {
  padding: 12px;
  border: 1px solid var(--border);
  background: rgba(89, 167, 255, 0.04);
  color: var(--text-mid);
  font-size: 12px;
  line-height: 1.6;
}

.panel-action-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.panel-action-row .panel-title {
  margin-bottom: 0;
}

.client-location-card {
  margin-top: 16px;
  padding: 14px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}

.client-location-card h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: white;
}

.client-location-card p {
  margin: 0;
  color: var(--text-mid);
  font-size: 12px;
  line-height: 1.7;
}

.gemini-loader-card {
  margin-top: 12px;
  padding: 16px;
  border: 1px solid rgba(89, 167, 255, 0.18);
  background:
    radial-gradient(circle at top left, rgba(89, 167, 255, 0.12), transparent 34%),
    rgba(255, 255, 255, 0.02);
  overflow: hidden;
}

.gemini-loader-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gemini-loader-orbit {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(89, 167, 255, 0.16);
  border-top-color: var(--blue);
  animation: spinGemini 1s linear infinite;
  flex-shrink: 0;
}

.gemini-loader-copy strong {
  display: block;
  margin-bottom: 4px;
  color: white;
  font-size: 13px;
}

.gemini-loader-copy span {
  color: var(--text-dim);
  font-size: 12px;
  line-height: 1.6;
}

.gemini-loader-bars {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.gemini-loader-bar {
  position: relative;
  height: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.gemini-loader-bar::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(89, 167, 255, 0.3), transparent);
  transform: translateX(-100%);
  animation: shimmerGemini 1.2s ease-in-out infinite;
}

.gemini-loader-bar:nth-child(2)::after {
  animation-delay: 0.15s;
}

.gemini-loader-bar:nth-child(3)::after {
  animation-delay: 0.3s;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 10px;
  font-family: "Space Mono", monospace;
  font-size: 11px;
  line-height: 1.5;
}

.log-time {
  color: var(--text-dim);
}

.log-row.critical .log-copy {
  color: #ffadad;
}

.log-row.success .log-copy {
  color: #8ef2c2;
}

.log-row.normal .log-copy {
  color: var(--text-mid);
}

.admin-layout {
  min-height: calc(100vh - 68px);
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
}

.admin-menu {
  padding: 20px 16px;
  border-right: 1px solid var(--border);
  background:
    linear-gradient(180deg, rgba(11, 16, 25, 0.98) 0%, rgba(8, 12, 19, 0.98) 100%);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-menu h2 {
  margin: 0 0 8px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 40px;
  line-height: 0.94;
  letter-spacing: 0.06em;
}

.admin-tab {
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-mid);
  cursor: pointer;
}

.admin-tab.active {
  border-color: rgba(255, 77, 77, 0.34);
  background: rgba(255, 77, 77, 0.08);
  color: white;
}

.admin-tab-label {
  display: block;
  margin-bottom: 4px;
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.admin-tab-copy {
  font-size: 12px;
  line-height: 1.5;
  color: inherit;
}

.admin-main {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
  padding: 18px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}

.admin-header h3 {
  margin: 6px 0 8px;
  font-size: 22px;
}

.admin-header p {
  margin: 0;
  max-width: 720px;
  color: var(--text-mid);
  font-size: 13px;
  line-height: 1.7;
}

.admin-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.timer-value {
  font-family: "Bebas Neue", sans-serif;
  font-size: 54px;
  letter-spacing: 0.08em;
  color: var(--red);
  line-height: 0.9;
}

.timer-label {
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--text-dim);
  text-transform: uppercase;
}

.stats-grid,
.command-grid,
.dispatch-grid,
.handoff-grid {
  display: grid;
  gap: 18px;
}

.stats-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.stat-card {
  padding: 16px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}

.stat-card strong {
  display: block;
  margin-bottom: 6px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 34px;
  line-height: 1;
  color: white;
}

.stat-card span {
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--text-dim);
  text-transform: uppercase;
}

.command-grid {
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.9fr);
}

.dispatch-grid {
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
}

.group-list,
.service-grid,
.crossmatch-list,
.audit-list,
.form-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-card,
.service-card,
.cross-card,
.audit-row-card,
.form-card,
.selected-service-card {
  padding: 16px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
}

.group-card h4,
.service-card h4,
.cross-card h4,
.form-card h4,
.selected-service-card h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: white;
}

.service-top,
.cross-top,
.audit-top,
.form-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.service-meta,
.cross-meta,
.audit-meta,
.form-meta {
  color: var(--text-dim);
  font-size: 12px;
  line-height: 1.6;
}

.service-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mini-status {
  padding: 5px 9px;
}

.tone-green {
  color: var(--green);
  background: rgba(46, 229, 157, 0.1);
  border-color: rgba(46, 229, 157, 0.24);
}

.tone-blue {
  color: var(--blue);
  background: rgba(89, 167, 255, 0.1);
  border-color: rgba(89, 167, 255, 0.24);
}

.tone-amber {
  color: var(--amber);
  background: rgba(255, 179, 71, 0.1);
  border-color: rgba(255, 179, 71, 0.24);
}

.tone-violet {
  color: var(--violet);
  background: rgba(164, 130, 255, 0.12);
  border-color: rgba(164, 130, 255, 0.24);
}

.tone-cyan {
  color: var(--cyan);
  background: rgba(85, 217, 255, 0.1);
  border-color: rgba(85, 217, 255, 0.24);
}

.tone-red {
  color: var(--red);
  background: rgba(255, 77, 77, 0.1);
  border-color: rgba(255, 77, 77, 0.22);
}

.tone-dim {
  color: var(--text-mid);
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border);
}

.briefing-card {
  white-space: pre-wrap;
  color: var(--text-mid);
  font-size: 13px;
  line-height: 1.75;
}

.cross-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 18px;
}

.cross-card p,
.form-card p,
.group-card p,
.service-card p,
.selected-service-card p {
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-mid);
}

.audit-row-card {
  display: grid;
  gap: 8px;
}

.audit-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 1px;
}

.audit-copy {
  margin: 0;
  color: white;
  font-size: 13px;
}

.seal-snippet {
  font-family: "Space Mono", monospace;
  font-size: 10px;
  color: var(--text-dim);
  word-break: break-all;
}

.waiting-card {
  padding: 26px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.02);
}

.waiting-card h4 {
  margin: 0 0 8px;
  font-size: 18px;
}

.waiting-card p {
  margin: 0;
  color: var(--text-mid);
  line-height: 1.7;
}

.trace-map-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 320px;
  min-height: 520px;
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(8, 12, 19, 0.98) 0%, rgba(12, 16, 24, 0.98) 100%);
}

.trace-map-stage {
  position: relative;
  min-height: 520px;
  border-right: 1px solid var(--border);
}

.trace-map-google-state {
  display: flex;
}

.trace-map-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.trace-map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(6, 10, 16, 0.38);
  backdrop-filter: blur(4px);
  z-index: 3;
}

.trace-map-loading-card {
  padding: 16px;
  border: 1px solid var(--border);
  background: rgba(7, 11, 17, 0.9);
  max-width: 280px;
}

.trace-map-loading-card p {
  margin: 0;
  color: var(--text-mid);
  font-size: 12px;
  line-height: 1.7;
}

.trace-map-card {
  position: absolute;
  z-index: 2;
  padding: 12px 14px;
  border: 1px solid var(--border);
  background: rgba(7, 11, 17, 0.84);
  backdrop-filter: blur(10px);
}

.trace-map-card-left {
  top: 16px;
  left: 16px;
  min-width: 230px;
}

.trace-map-card-right {
  top: 16px;
  right: 16px;
}

.trace-map-title {
  font-family: "Bebas Neue", sans-serif;
  font-size: 28px;
  line-height: 1;
  letter-spacing: 0.08em;
  color: white;
}

.trace-map-meta {
  margin-top: 6px;
  font-family: "Space Mono", monospace;
  font-size: 11px;
  color: var(--text-dim);
}

.trace-map-legend {
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  background: rgba(7, 11, 17, 0.84);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--text-dim);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.red {
  background: var(--red);
  box-shadow: 0 0 10px rgba(255, 77, 77, 0.85);
}

.legend-dot.green {
  background: var(--green);
  box-shadow: 0 0 10px rgba(46, 229, 157, 0.8);
}

.legend-dot.blue {
  background: var(--blue);
  box-shadow: 0 0 10px rgba(89, 167, 255, 0.8);
}

.legend-dot.orange {
  background: var(--amber);
  box-shadow: 0 0 10px rgba(255, 179, 71, 0.85);
}

.trace-map-rail {
  padding: 16px;
  overflow-y: auto;
}

.trace-map-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trace-map-service {
  text-align: left;
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  color: inherit;
  cursor: pointer;
}

.trace-map-service.selected {
  border-color: rgba(255, 77, 77, 0.34);
  background: rgba(255, 77, 77, 0.08);
}

.trace-map-service-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.trace-map-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.trace-map-bullet.red {
  background: var(--red);
}

.trace-map-bullet.green {
  background: var(--green);
}

.trace-map-bullet.blue {
  background: var(--blue);
}

.trace-map-bullet.amber {
  background: var(--amber);
}

.trace-map-bullet.violet {
  background: var(--violet);
}

.trace-map-bullet.cyan {
  background: var(--cyan);
}

.trace-map-service-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.trace-map-service-meta {
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--text-dim);
  margin-bottom: 6px;
}

.trace-map-service-copy {
  color: var(--text-mid);
  font-size: 12px;
  line-height: 1.6;
}

.trace-map-service-status {
  margin-top: 8px;
  font-family: "Space Mono", monospace;
  font-size: 10px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  color: white;
}

.trace-map-empty {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 28px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.02);
}

.trace-map-empty h3 {
  margin: 0 0 8px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 34px;
  letter-spacing: 0.08em;
}

.trace-map-empty p {
  margin: 0;
  color: var(--text-mid);
  line-height: 1.8;
}

@keyframes pulseDot {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.35;
    transform: scale(0.72);
  }
}

@keyframes spinGemini {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmerGemini {
  to {
    transform: translateX(100%);
  }
}

@media (max-width: 1180px) {
  .hero-grid,
  .dispatch-grid,
  .command-grid,
  .cross-grid {
    grid-template-columns: 1fr;
  }

  .trace-map-shell {
    grid-template-columns: 1fr;
  }

  .trace-map-stage {
    border-right: 0;
    border-bottom: 1px solid var(--border);
    min-height: 420px;
  }
}

@media (max-width: 960px) {
  .role-gate-shell,
  .admin-layout,
  .stats-grid,
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .admin-menu {
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }

  .hero-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .topbar {
    height: auto;
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
  }

  .topbar-left,
  .topbar-right {
    width: 100%;
    justify-content: space-between;
  }

  .client-layout,
  .admin-main,
  .role-gate {
    padding: 16px;
  }

  .hero-title {
    font-size: 54px;
  }

  .hero-center h2 {
    font-size: 42px;
  }

  .sos-button {
    width: 156px;
    height: 156px;
    font-size: 38px;
  }

  .admin-header {
    flex-direction: column;
  }

  .admin-header-right {
    align-items: flex-start;
  }

  .trace-map-card-right {
    top: auto;
    right: auto;
    left: 16px;
    bottom: 88px;
  }

  .trace-map-legend {
    display: none;
  }

  .panel-action-row {
    flex-direction: column;
  }
}
`;

const CLIENT_LOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 12000,
  maximumAge: 30000,
};

function createAsyncState() {
  return {
    status: "idle",
    data: null,
    error: "",
  };
}

function createClientLocationState() {
  return {
    status: "idle",
    coords: null,
    accuracy: null,
    updatedAt: null,
    address: "",
    zone: "",
    error: "",
  };
}

function formatCoordinates(coords) {
  return `Lat ${coords.lat.toFixed(5)}, Lng ${coords.lng.toFixed(5)}`;
}

function getClientLocationErrorMessage(error) {
  switch (error?.code) {
    case 1:
      return "Location access was denied. TRACE is falling back to the demo client location until GPS access is allowed.";
    case 2:
      return "TRACE could not read the device location. The demo client location is staying active for now.";
    case 3:
      return "Location capture timed out. TRACE is still using the demo client location.";
    default:
      return "TRACE could not capture a live device location. The demo client location is still active.";
  }
}

function captureClientLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "This browser does not support live geolocation. TRACE is using the demo client location."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          accuracy:
            typeof position.coords.accuracy === "number"
              ? Math.round(position.coords.accuracy)
              : null,
          updatedAt: new Date().toISOString(),
        });
      },
      error => reject(new Error(getClientLocationErrorMessage(error))),
      CLIENT_LOCATION_OPTIONS
    );
  });
}

function buildClientLocationState(location) {
  return {
    status: "ready",
    coords: location.coords,
    accuracy: location.accuracy,
    updatedAt: location.updatedAt,
    address: formatCoordinates(location.coords),
    zone: location.accuracy
      ? `Live device location | +/- ${location.accuracy} m`
      : "Live device location",
    error: "",
  };
}

function applyClientLocationToProfile(profile, locationState) {
  if (!locationState.coords) {
    return {
      ...profile,
      locationSource: "demo",
      locationAccuracy: null,
    };
  }

  return {
    ...profile,
    coords: locationState.coords,
    address: locationState.address || profile.address,
    zone: locationState.zone || profile.zone,
    locationSource: "live",
    locationAccuracy: locationState.accuracy,
  };
}

function applyIncidentLocationToProfile(profile, incident) {
  return {
    ...profile,
    coords: incident.coords,
    address: incident.address || profile.address,
    zone: incident.zone || profile.zone,
    locationSource: incident.locationSource || "demo",
    locationAccuracy: incident.locationAccuracy ?? null,
  };
}

function getClientLocationPanelCopy(profile, clientLocation) {
  if (clientLocation.status === "ready") {
    const capturedAt = clientLocation.updatedAt
      ? ` Captured at ${new Date(clientLocation.updatedAt).toLocaleTimeString()}.`
      : "";
    const accuracyCopy = clientLocation.accuracy
      ? ` Accuracy about +/- ${clientLocation.accuracy} meters.`
      : "";
    const retainedLock = clientLocation.error
      ? ` Last live lock retained. ${clientLocation.error}`
      : "";

    return {
      status: "clear",
      title: "Live GPS ready",
      copy: `TRACE will use ${profile.address} for the client's SOS pin.${accuracyCopy}${capturedAt}${retainedLock}`,
    };
  }

  if (clientLocation.status === "locating") {
    return {
      status: "syncing",
      title: "Locating device",
      copy:
        "TRACE is requesting browser location so the SOS package lands on the client's real position instead of the demo profile.",
    };
  }

  if (clientLocation.status === "error") {
    return {
      status: "review",
      title: "Using fallback profile location",
      copy: `${clientLocation.error} Current fallback: ${profile.address}.`,
    };
  }

  return {
    status: "queued",
    title: "GPS not captured yet",
    copy:
      "Allow device location before triggering SOS if you want the live Google map to center on the client's actual position.",
  };
}

function createServiceState(profile, mode = "standby") {
  return getDemoHelpServices(profile).map(service => ({
    ...service,
    status:
      mode === "active"
        ? service.category === "responder"
          ? "en-route"
          : service.category === "authority"
            ? "alerted"
            : "syncing"
        : mode === "resolved"
          ? "resolved"
          : "standby",
    lastUpdate: null,
  }));
}

function createActivationState(profile, mode = "standby") {
  return getActivationGroups(profile).map(group => ({
    ...group,
    status:
      mode === "active"
        ? group.tone === "trusted"
          ? "notified"
          : "alerted"
        : mode === "resolved"
          ? "resolved"
          : "standby",
    lastAlert: null,
  }));
}

function createInitialCrossMatchState() {
  return {
    cycleCount: 0,
    lastSweepAt: null,
    nextSweepIn: 90,
    records: CROSS_MATCH_SYSTEMS.map(system => ({
      ...system,
      status: "queued",
      result: "Waiting for active case",
      note: "No silent sweep has run yet.",
    })),
  };
}

function getLanguageCopy(language) {
  return CLIENT_COPY_BY_LANGUAGE[language] ?? CLIENT_COPY_BY_LANGUAGE.en;
}

function normalizeLanguage(language) {
  return LANGUAGE_OPTIONS.some(option => option.code === language)
    ? language
    : "en";
}

function buildLocalizedClientCopy(profile, incidentActive, language) {
  const copy = getLanguageCopy(language);
  const profileCopy = CLIENT_PROFILE_COPY[profile.id]?.[language] ?? {};

  return {
    ...copy,
    statusMessage: incidentActive
      ? copy.incidentActive
      : copy.incidentIdle,
    profileCondition: profileCopy.condition ?? profile.condition,
    profileSituation: profileCopy.situation ?? profile.situation,
  };
}

function buildCrossMatchRecords(profile, cycleCount) {
  return CROSS_MATCH_SYSTEMS.map(system => {
    if (system.id === "hospital") {
      return {
        ...system,
        status: "clear",
        result: "No confirmed admission",
        note: `${cycleCount + 2} intake feeds scanned. No direct match for ${profile.name}.`,
      };
    }

    if (system.id === "shelter") {
      if (profile.threatRisk > 85 && cycleCount > 1) {
        return {
          ...system,
          status: "review",
          result: "Manual review queued",
          note: "One anonymized late check-in partially matches behavior and timing.",
        };
      }

      return {
        ...system,
        status: "clear",
        result: "No confirmed shelter intake",
        note: `${cycleCount + 1} partner shelter check-ins swept silently.`,
      };
    }

    return {
      ...system,
      status: "clear",
      result: "No transit recovery signal",
      note: "Lost-and-found and mobility records scanned for silent trace evidence.",
    };
  });
}

function resolveStatusTone(status) {
  switch (status) {
    case "resolved":
    case "on-scene":
    case "clear":
      return "tone-green";
    case "syncing":
    case "en-route":
      return "tone-blue";
    case "alerted":
    case "notified":
    case "review":
      return "tone-amber";
    case "queued":
      return "tone-dim";
    default:
      return "tone-red";
  }
}

function resolveStatusLabel(status) {
  switch (status) {
    case "en-route":
      return "En route";
    case "on-scene":
      return "On scene";
    case "notified":
      return "Notified";
    case "syncing":
      return "Syncing";
    case "resolved":
      return "Resolved";
    case "queued":
      return "Queued";
    case "clear":
      return "Clear";
    case "review":
      return "Review";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getServiceActionLabel(service) {
  if (service.category === "service") {
    return "Refresh sync";
  }

  if (service.status === "standby") {
    return "Send alert";
  }

  if (service.status === "alerted") {
    return "Mark en route";
  }

  if (service.status === "en-route") {
    return "Mark on scene";
  }

  return "Review";
}

function buildBriefing(profile, incident) {
  return [
    `Incident ${incident ? incident.id : "standby"}`,
    `Client: ${profile.name}, ${profile.age}`,
    `Condition: ${profile.condition}`,
    `Primary language: ${profile.language}`,
    `Zone: ${profile.zone}`,
    `Situation: ${profile.situation}`,
    "Instruction: keep the briefing unified so the client never has to retell the story repeatedly.",
  ].join("\n");
}

function buildIncidentReport({ incident, profile, services, auditTrail, traumaHandoff }) {
  const lines = [
    "TRACE INCIDENT REPORT",
    "====================",
    `Incident: ${incident.id}`,
    `Status: ${incident.status}`,
    `Client: ${profile.name}, ${profile.age}`,
    `Condition: ${profile.condition}`,
    `Language: ${profile.language}`,
    `Address: ${incident.address || profile.address}`,
    `Zone: ${incident.zone}`,
    `Location source: ${incident.locationSource || profile.locationSource || "demo"}`,
    `Triggered at: ${incident.triggeredAt}`,
    `Resolved at: ${incident.resolvedAt ?? "Pending"}`,
    `Resolution notes: ${incident.resolutionNotes || "Pending resolution."}`,
    "",
    "SERVICE STATUS",
    ...services.map(
      service =>
        `- ${service.name}: ${resolveStatusLabel(service.status)} | ${service.distanceLabel} | ETA ${service.etaMinutes} min`
    ),
    "",
    "AUDIT TRAIL",
    ...auditTrail
      .slice()
      .reverse()
      .map(
        entry =>
          `- ${entry.timestamp} | ${entry.kind.toUpperCase()} | ${entry.message} | seal=${entry.seal}`
      ),
  ];

  if (traumaHandoff) {
    lines.push(
      "",
      "POST-CRISIS HANDOFF",
      `Headline: ${traumaHandoff.reportHeadline}`,
      `Victim support: ${traumaHandoff.victimSupport}`,
      `Family support: ${traumaHandoff.familySupport}`,
      `Forms route: ${traumaHandoff.formTitle}`
    );
  }

  return lines.join("\n");
}

function StatusChip({ status }) {
  return (
    <span className={`mini-status ${resolveStatusTone(status)}`}>
      {resolveStatusLabel(status)}
    </span>
  );
}

function RoleGate({ onChoose }) {
  return (
    <div className="role-gate">
      <div className="role-gate-shell">
        <section className="role-gate-hero">
          <div className="section-tag">TRACE launch</div>
          <h1 className="hero-title">
            Two entry points.
            <br />
            One crisis record.
          </h1>
          <p className="hero-copy">
            Start as the client who triggers SOS or as the app admin who
            monitors, dispatches responders, runs silent cross-match checks, and
            closes the case with a post-crisis trauma handoff.
          </p>
          <div className="hero-list">
            <div className="hero-feature">
              <strong>Simultaneous activation</strong>
              <span>
                Verified responders, trusted contacts, and authorities receive
                the same briefing at once.
              </span>
            </div>
            <div className="hero-feature">
              <strong>Shared live map</strong>
              <span>
                Real Google Maps anchor the client location while nearby help
                services stay as TRACE demo coordination nodes.
              </span>
            </div>
            <div className="hero-feature">
              <strong>Silent cross-match</strong>
              <span>
                BigQuery and Pub/Sub are modeled as timed hospital, shelter, and
                transit sweeps every 90 seconds.
              </span>
            </div>
            <div className="hero-feature">
              <strong>Encrypted legal record</strong>
              <span>
                Every event is timestamped and sealed into an incident-ready
                audit trail.
              </span>
            </div>
          </div>
        </section>

        <section className="login-grid">
          <article className="login-card">
            <div className="section-tag">Login profile</div>
            <h3>App Admin</h3>
            <p>
              Monitors the case, dispatches help services, runs silent
              cross-match sweeps, and resolves the incident.
            </p>
            <ul className="login-highlights">
              <li>Dedicated responder alert menu</li>
              <li>Shared map and synchronized service lanes</li>
              <li>Auto-generated trauma handoff after recovery</li>
            </ul>
            <button className="primary-button" type="button" onClick={() => onChoose("admin")}>
              Enter admin console
            </button>
          </article>

          <article className="login-card">
            <div className="section-tag">Login profile</div>
            <h3>Client</h3>
            <p>
              Presses SOS from the main dashboard, switches local language guidance,
              and sees a simplified live case picture.
            </p>
            <ul className="login-highlights">
              <li>SOS button restored to the main dashboard</li>
              <li>Built-in English, Hindi, and Tamil language switch</li>
              <li>Gemini condition explanation with immediate measures</li>
            </ul>
            <button className="primary-button" type="button" onClick={() => onChoose("client")}>
              Enter client dashboard
            </button>
          </article>
        </section>
      </div>
    </div>
  );
}

function ClientView({
  profile,
  profiles,
  incident,
  elapsed,
  localizedCopy,
  language,
  onLanguageChange,
  aiBrief,
  onGenerateAiBrief,
  sosPhase,
  onTriggerSos,
  logs,
  onSelectProfile,
  services,
  selectedServiceId,
  onSelectService,
  syncStatus,
  clientLocation,
  onRefreshLocation,
}) {
  const activeCaseLocked = Boolean(incident) || sosPhase === "activating";
  const locationPanel = getClientLocationPanelCopy(profile, clientLocation);

  return (
    <div className="client-layout">
      <div className="hero-grid">
        <section className="panel">
          <div className="section-tag">{localizedCopy.dashboardTag}</div>
          <h2 className="panel-title">{localizedCopy.profileTitle}</h2>
          <p className="panel-copy">{localizedCopy.subtitle}</p>

          <div className="profile-select-list">
            {profiles.map(item => (
              <button
                key={item.id}
                type="button"
                className={`profile-card ${item.id === profile.id ? "selected" : ""}`}
                disabled={activeCaseLocked}
                onClick={() => onSelectProfile(item.id)}
              >
                <div className="profile-card-top">
                  <div className="profile-badge">{item.callSign}</div>
                  <div>
                    <div className="profile-name">{item.name}</div>
                    <div className="profile-address">
                      {item.id === profile.id ? profile.address : item.address}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="client-location-card">
            <div className="service-top">
              <div>
                <div className="section-tag">Live location</div>
                <h4>{locationPanel.title}</h4>
              </div>
              <StatusChip status={locationPanel.status} />
            </div>
            <p>{locationPanel.copy}</p>
            <div className="service-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={onRefreshLocation}
                disabled={clientLocation.status === "locating"}
              >
                {clientLocation.status === "ready" ? "Refresh GPS" : "Use device GPS"}
              </button>
            </div>
          </div>
        </section>

        <section className="panel hero-center">
          <div className="section-tag">{localizedCopy.title}</div>
          <h2>{profile.name}</h2>
          <p>{localizedCopy.statusMessage}</p>
          <button
            className="sos-button"
            type="button"
            disabled={sosPhase === "activating"}
            onClick={onTriggerSos}
          >
            {sosPhase === "activating"
              ? "LIVE"
              : incident?.status === "active"
                ? "SOS"
                : "SOS"}
          </button>
          <div className="status-banner">
            <div className="banner-title">
              {incident?.status === "active"
                ? `${localizedCopy.incidentActiveLabelPrefix} ${incident.id} active`
                : incident?.status === "resolved"
                  ? localizedCopy.statusResolvedLabel
                  : localizedCopy.statusStandbyLabel}
            </div>
            <p className="banner-copy">
              {incident?.status === "active"
                ? `${localizedCopy.incidentActive} Elapsed ${formatElapsed(elapsed)}.`
                : incident?.status === "resolved"
                  ? localizedCopy.resolvedMessage
                  : localizedCopy.incidentIdle}
            </p>
          </div>
        </section>

        <section className="panel">
          <div className="section-tag">{localizedCopy.languageTitle}</div>
          <h2 className="panel-title">{localizedCopy.profileCondition}</h2>
          <p className="panel-copy">{localizedCopy.languageBody}</p>

          <div className="inline-control">
            <div className="language-switch" role="group" aria-label="Client language">
              {LANGUAGE_OPTIONS.map(option => (
                <button
                  key={option.code}
                  type="button"
                  className={`language-button ${language === option.code ? "active" : ""}`}
                  onClick={() => onLanguageChange(option.code)}
                  aria-pressed={language === option.code}
                  title={option.name}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <StatusChip status="clear" />
          </div>

          <div className="translation-note">{localizedCopy.languageNote}</div>

          <div className="risk-list">
            {[
              ["Medical", profile.medicalRisk, profile.medicalRisk > 70 ? "var(--red)" : "var(--amber)"],
              ["Mobility", profile.mobilityRisk, "var(--blue)"],
              ["Threat", profile.threatRisk, profile.threatRisk > 80 ? "var(--red)" : "var(--amber)"],
            ].map(([label, value, color]) => (
              <div key={label} className="risk-row">
                <span>{label}</span>
                <div className="risk-bar">
                  <div className="risk-fill" style={{ width: `${value}%`, background: color }} />
                </div>
                <span>{value}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-tag">{localizedCopy.checklistTitle}</div>
          <ul className="checklist">
            <li>{localizedCopy.checklistOne}</li>
            <li>{localizedCopy.checklistTwo}</li>
            <li>{localizedCopy.checklistThree}</li>
          </ul>
          <div className="translation-note" style={{ marginTop: 18 }}>
            {localizedCopy.profileSituation}
          </div>
        </section>

        <section className="panel">
          <div className="section-tag">{localizedCopy.aiTitle}</div>
          <div className="panel-action-row">
            <h3 className="panel-title">{localizedCopy.aiBody}</h3>
            <button
              type="button"
              className="ghost-button"
              onClick={onGenerateAiBrief}
              disabled={aiBrief.status === "loading"}
            >
              {aiBrief.data ? "Refresh Gemini" : "Show Gemini"}
            </button>
          </div>
          {aiBrief.status === "idle" && (
            <p className="panel-copy">
              Request the Gemini summary only when you want the condition guide on
              screen.
            </p>
          )}
          {aiBrief.status === "loading" && (
            <div className="gemini-loader-card">
              <div className="gemini-loader-top">
                <div className="gemini-loader-orbit" />
                <div className="gemini-loader-copy">
                  <strong>Gemini is preparing the client summary</strong>
                  <span>
                    TRACE is turning the client profile into a short condition
                    explanation before showing it on screen.
                  </span>
                </div>
              </div>
              <div className="gemini-loader-bars">
                <div className="gemini-loader-bar" />
                <div className="gemini-loader-bar" />
                <div className="gemini-loader-bar" />
              </div>
            </div>
          )}
          {aiBrief.data && (
            <>
              <p className="ai-summary">{aiBrief.data.summary}</p>
              <div className="ai-list">
                {aiBrief.data.actions.map(action => (
                  <div key={action} className="ai-list-item">
                    {action}
                  </div>
                ))}
              </div>
              <div className="translation-note">
                Source: {aiBrief.data.source === "gemini" ? "Gemini" : "TRACE fallback guide"}
                {aiBrief.error ? ` | ${aiBrief.error}` : ""}
              </div>
            </>
          )}
          {aiBrief.error && !aiBrief.data && (
            <p className="panel-copy">AI guidance is temporarily unavailable.</p>
          )}
        </section>

        <section className="panel">
          <div className="section-tag">Activation log</div>
          <div className="log-list">
            {logs.length === 0 && (
              <div className="banner-copy">No SOS activation log yet.</div>
            )}
            {logs.map((log, index) => (
              <div key={`${log.time}-${index}`} className={`log-row ${log.tone}`}>
                <span className="log-time">{log.time}</span>
                <span className="log-copy">{log.message}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function AdminView({
  profile,
  incident,
  elapsed,
  adminTab,
  onSelectTab,
  services,
  selectedService,
  selectedServiceId,
  onSelectService,
  onAdvanceService,
  onResolveCase,
  onResetDemo,
  onDownloadReport,
  onResendAlerts,
  activationGroups,
  crossMatchState,
  onRunCrossMatch,
  auditTrail,
  traumaHandoffState,
  onGenerateTraumaHandoff,
  adminAiSummary,
  onGenerateAdminAiSummary,
  syncStatus,
}) {
  const incidentLive = incident?.status === "active";
  const briefing = buildBriefing(profile, incident);
  const traumaHandoff = traumaHandoffState.data;

  const tabButtons = [
    {
      id: "monitor",
      label: "Monitor",
      copy: "Shared live map, synchronized lanes, and the active case overview.",
    },
    {
      id: "dispatch",
      label: "Dispatch",
      copy: "Dedicated menu for sending alerts to responders and help services.",
    },
    {
      id: "crossmatch",
      label: "Cross-match",
      copy: "Silent 90-second hospital, shelter, and transit sweeps.",
    },
    {
      id: "evidence",
      label: "Evidence",
      copy: "Encrypted legal record with timestamps for every event.",
    },
    {
      id: "handoff",
      label: "Handoff",
      copy: "Post-crisis incident report and mental health routing.",
    },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-menu">
        <div className="section-tag">Admin login</div>
        <h2>Command Admin</h2>
        <p className="panel-copy">
          Monitor everything, dispatch the right responders, and close the case
          with a trauma-informed handoff.
        </p>

        {tabButtons.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab ${adminTab === tab.id ? "active" : ""}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <span className="admin-tab-label">{tab.label}</span>
            <span className="admin-tab-copy">{tab.copy}</span>
          </button>
        ))}
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <div className="section-tag">Admin case state</div>
            <h3>
              {incident
                ? `${profile.name} locked in ${incident.zone}`
                : `${profile.name} staged for the next SOS`}
            </h3>
            <p>
              {incidentLive
                ? "TRACE has already activated simultaneous alerts, shared map sync, silent cross-match, and encrypted event capture."
                : incident?.status === "resolved"
                  ? "The field case is resolved. Review the evidence trail and trauma handoff below."
                  : "Wait for the client to trigger SOS, then use Dispatch to tune the responder flow and close the loop once the client is safe."}
            </p>
          </div>

          <div className="admin-header-right">
            <div className="timer-value">{formatElapsed(elapsed)}</div>
            <div className="timer-label">
              {incident ? "elapsed" : "standby"} | {syncStatus}
            </div>
            <div className="inline-control">
              <button
                type="button"
                className="ghost-button"
                disabled={!incident}
                onClick={onDownloadReport}
              >
                Download report
              </button>
              <button
                type="button"
                className="ghost-button"
                disabled={!incidentLive}
                onClick={() => onResendAlerts("admin")}
              >
                Re-send alerts
              </button>
              <button
                type="button"
                className="danger-button"
                disabled={!incidentLive}
                onClick={onResolveCase}
              >
                Resolve case
              </button>
              <button type="button" className="ghost-button" onClick={onResetDemo}>
                Reset demo
              </button>
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <strong>{services.filter(item => item.category === "responder").length}</strong>
            <span>Responder nodes</span>
          </div>
          <div className="stat-card">
            <strong>{activationGroups.length}</strong>
            <span>Alert groups</span>
          </div>
          <div className="stat-card">
            <strong>{auditTrail.length}</strong>
            <span>Encrypted events</span>
          </div>
          <div className="stat-card">
            <strong>{crossMatchState.cycleCount}</strong>
            <span>Silent sweeps</span>
          </div>
        </div>

        {adminTab === "monitor" && (
          <div className="command-grid">
            <section className="panel">
              <EmergencyCommandMap
                incident={incident}
                profile={incident ? profile : null}
                services={services}
                selectedServiceId={selectedServiceId}
                onSelectService={onSelectService}
                syncStatus={syncStatus}
                title="Responder shared live map"
                mapVariant="google"
              />
            </section>

            <div className="group-list">
              <section className="selected-service-card">
                <div className="section-tag">Selected service</div>
                <h4>{selectedService?.name ?? "No service selected"}</h4>
                <p>
                  {selectedService
                    ? `${selectedService.description} Current status: ${resolveStatusLabel(
                        selectedService.status
                      )}.`
                    : "Select a service from the map rail to inspect its lane."}
                </p>
                {selectedService && (
                  <div className="service-actions">
                    <StatusChip status={selectedService.status} />
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => onAdvanceService(selectedService.id)}
                    >
                      {getServiceActionLabel(selectedService)}
                    </button>
                  </div>
                )}
              </section>

              <section className="group-card">
                <div className="section-tag">Activate Simultaneously</div>
                <h4>Unified briefing</h4>
                <p className="briefing-card">{briefing}</p>
              </section>

              <section className="group-card">
                <div className="section-tag">AI field guidance</div>
                <div className="service-top">
                  <h4>Gemini summary</h4>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={onGenerateAdminAiSummary}
                    disabled={adminAiSummary.status === "loading"}
                  >
                    {adminAiSummary.data ? "Regenerate" : "Run Gemini"}
                  </button>
                </div>

                {adminAiSummary.status === "idle" && (
                  <p>
                    Run Gemini only when command needs a fresh field summary for
                    this case.
                  </p>
                )}

                {adminAiSummary.status === "loading" && (
                  <div className="gemini-loader-card">
                    <div className="gemini-loader-top">
                      <div className="gemini-loader-orbit" />
                      <div className="gemini-loader-copy">
                        <strong>Gemini is building the field summary</strong>
                        <span>
                          TRACE is translating the client profile into a concise
                          command-ready briefing.
                        </span>
                      </div>
                    </div>
                    <div className="gemini-loader-bars">
                      <div className="gemini-loader-bar" />
                      <div className="gemini-loader-bar" />
                      <div className="gemini-loader-bar" />
                    </div>
                  </div>
                )}

                {adminAiSummary.status === "ready" && adminAiSummary.data && (
                  <>
                    <p>{adminAiSummary.data.summary}</p>
                    <div className="ai-list">
                      {adminAiSummary.data.actions.map(action => (
                        <div key={action} className="ai-list-item">
                          {action}
                        </div>
                      ))}
                    </div>
                    <div className="translation-note">
                      Source:{" "}
                      {adminAiSummary.data.source === "gemini"
                        ? "Gemini"
                        : "TRACE fallback guide"}
                      {adminAiSummary.error ? ` | ${adminAiSummary.error}` : ""}
                    </div>
                  </>
                )}
              </section>
            </div>
          </div>
        )}

        {adminTab === "dispatch" && (
          <div className="dispatch-grid">
            <section className="panel">
              <div className="section-tag">Responder dispatch menu</div>
              <div className="service-grid">
                {services.map(service => (
                  <article key={service.id} className="service-card">
                    <div className="service-top">
                      <div>
                        <h4>{service.name}</h4>
                        <div className="service-meta">
                          {service.distanceLabel} | ETA {service.etaMinutes} min | {service.lane}
                        </div>
                      </div>
                      <StatusChip status={service.status} />
                    </div>
                    <p>{service.description}</p>
                    <div className="service-actions">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => onAdvanceService(service.id)}
                        disabled={!incidentLive && service.category !== "service"}
                      >
                        {getServiceActionLabel(service)}
                      </button>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => onSelectService(service.id)}
                      >
                        Focus on map
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-tag">Alert groups</div>
              <div className="group-list">
                {activationGroups.map(group => (
                  <article key={group.id} className="group-card">
                    <div className="service-top">
                      <h4>{group.label}</h4>
                      <StatusChip status={group.status} />
                    </div>
                    <p>
                      {group.channel}
                      {group.lastAlert ? ` | last alert ${group.lastAlert}` : ""}
                    </p>
                    <div className="translation-note" style={{ marginTop: 10 }}>
                      {group.members.join(", ")}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {adminTab === "crossmatch" && (
          <div className="cross-grid">
            <section className="panel">
              <div className="section-tag">Silent Hospital Cross-Match</div>
              <div className="service-actions" style={{ marginBottom: 16 }}>
                <StatusChip
                  status={incidentLive ? "syncing" : crossMatchState.lastSweepAt ? "clear" : "queued"}
                />
                <button
                  type="button"
                  className="ghost-button"
                  disabled={!incidentLive}
                  onClick={onRunCrossMatch}
                >
                  Run silent sweep now
                </button>
              </div>
              <div className="crossmatch-list">
                {crossMatchState.records.map(record => (
                  <article key={record.id} className="cross-card">
                    <div className="cross-top">
                      <div>
                        <h4>{record.label}</h4>
                        <div className="cross-meta">
                          {record.stack} | cadence {record.cadence}
                        </div>
                      </div>
                      <StatusChip status={record.status} />
                    </div>
                    <p>{record.result}</p>
                    <div className="translation-note">{record.note}</div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-tag">Sweep cadence</div>
              <h3 className="panel-title">Every 90 seconds</h3>
              <p className="panel-copy">
                TRACE silently pings nearby hospital admissions, shelter
                check-ins, and transit lost-and-found systems against the active
                case profile.
              </p>
              <div className="risk-list">
                <div className="risk-row">
                  <span>Cycles</span>
                  <div className="risk-bar">
                    <div
                      className="risk-fill"
                      style={{
                        width: `${Math.min(100, crossMatchState.cycleCount * 14)}%`,
                        background: "var(--blue)",
                      }}
                    />
                  </div>
                  <span>{crossMatchState.cycleCount}</span>
                </div>
                <div className="risk-row">
                  <span>Next</span>
                  <div className="risk-bar">
                    <div
                      className="risk-fill"
                      style={{
                        width: `${((90 - crossMatchState.nextSweepIn) / 90) * 100}%`,
                        background: "var(--amber)",
                      }}
                    />
                  </div>
                  <span>{crossMatchState.nextSweepIn}s</span>
                </div>
              </div>
              <div className="translation-note" style={{ marginTop: 16 }}>
                Last sweep:{" "}
                {crossMatchState.lastSweepAt
                  ? new Date(crossMatchState.lastSweepAt).toLocaleTimeString()
                  : "Not started"}
              </div>
            </section>
          </div>
        )}

        {adminTab === "evidence" && (
          <div className="dispatch-grid">
            <section className="panel">
              <div className="section-tag">Encrypted audit record</div>
              <div className="audit-list">
                {auditTrail.length === 0 && (
                  <div className="waiting-card">
                    <h4>No events sealed yet</h4>
                    <p>Once the case starts, TRACE will timestamp and encrypt every major action.</p>
                  </div>
                )}
                {auditTrail.map(entry => (
                  <article key={entry.id} className="audit-row-card">
                    <div className="audit-meta">
                      <span>{entry.kind.toUpperCase()}</span>
                      <span>{entry.timestamp}</span>
                    </div>
                    <p className="audit-copy">{entry.message}</p>
                    <div className="seal-snippet">{entry.seal}</div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-tag">Legal record status</div>
              <div className="group-list">
                <article className="group-card">
                  <h4>Timestamped evidence</h4>
                  <p>
                    Every data point is written with a timestamp the moment it is
                    created so the legal record is built while the crisis is
                    still live.
                  </p>
                </article>
                <article className="group-card">
                  <h4>Encryption seal</h4>
                  <p>
                    Each event receives an encrypted seal generated in-browser so
                    the audit log is presentation-ready even before backend
                    archival.
                  </p>
                </article>
                <article className="group-card">
                  <h4>Incident report export</h4>
                  <p>
                    Use Download report to export the current case, responder
                    states, and sealed event trail.
                  </p>
                </article>
              </div>
            </section>
          </div>
        )}

        {adminTab === "handoff" && (
          <div className="handoff-grid">
            <section className="panel">
              <div className="service-top">
                <div>
                  <div className="section-tag">Post-Crisis Trauma Handoff</div>
                  <h3 className="panel-title">
                    {incident?.status === "resolved"
                      ? "Recovery package"
                      : "Awaiting case resolution"}
                  </h3>
                </div>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={onGenerateTraumaHandoff}
                  disabled={
                    incident?.status !== "resolved" ||
                    traumaHandoffState.status === "loading"
                  }
                >
                  {traumaHandoff ? "Regenerate handoff" : "Generate handoff"}
                </button>
              </div>

              {incident?.status !== "resolved" && (
                <div className="waiting-card">
                  <h4>Waiting for case resolution</h4>
                  <p>
                    Resolve the case first, then TRACE will generate the
                    structured trauma handoff and mental health routing package.
                  </p>
                </div>
              )}

              {incident?.status === "resolved" &&
                traumaHandoffState.status === "loading" && (
                  <div className="gemini-loader-card">
                    <div className="gemini-loader-top">
                      <div className="gemini-loader-orbit" />
                      <div className="gemini-loader-copy">
                        <strong>TRACE is building the handoff package</strong>
                        <span>
                          Gemini is drafting the post-crisis victim, family, and
                          forms routing summary now.
                        </span>
                      </div>
                    </div>
                    <div className="gemini-loader-bars">
                      <div className="gemini-loader-bar" />
                      <div className="gemini-loader-bar" />
                      <div className="gemini-loader-bar" />
                    </div>
                  </div>
                )}

              {incident?.status === "resolved" &&
                traumaHandoffState.status === "error" &&
                !traumaHandoff && (
                  <div className="waiting-card">
                    <h4>Handoff generation failed</h4>
                    <p>{traumaHandoffState.error}</p>
                  </div>
                )}

              {traumaHandoff && (
                <>
                  <div className="group-list">
                    <article className="group-card">
                      <h4>{traumaHandoff.reportHeadline}</h4>
                      <p>{traumaHandoff.victimSupport}</p>
                    </article>
                    <article className="group-card">
                      <h4>Family route</h4>
                      <p>{traumaHandoff.familySupport}</p>
                    </article>
                    <article className="group-card">
                      <h4>Forms API route</h4>
                      <p>{traumaHandoff.formTitle}</p>
                    </article>
                  </div>
                  <div className="translation-note">
                    Source:{" "}
                    {traumaHandoff.source === "gemini"
                      ? "Gemini"
                      : "TRACE fallback handoff"}
                    {traumaHandoffState.error
                      ? ` | ${traumaHandoffState.error}`
                      : ""}
                  </div>
                </>
              )}
            </section>

            {traumaHandoff && (
              <section className="panel">
                <div className="section-tag">Mental health routing</div>
                <div className="form-list">
                  {TRAUMA_RESOURCES.map(resource => (
                    <article key={resource.id} className="form-card">
                      <div className="form-top">
                        <h4>{resource.name}</h4>
                        <StatusChip status="notified" />
                      </div>
                      <p>{resource.action}</p>
                      <div className="translation-note">{resource.owner}</div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const geminiModel = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
  const auditSecret =
    import.meta.env.VITE_TRACE_AUDIT_SECRET || "trace-demo-audit-secret";

  const [sessionRole, setSessionRole] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(TRACE_CLIENTS[0].id);
  const [incident, setIncident] = useState(null);
  const [services, setServices] = useState(() =>
    createServiceState(TRACE_CLIENTS[0])
  );
  const [activationGroups, setActivationGroups] = useState(() =>
    createActivationState(TRACE_CLIENTS[0])
  );
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [dispatchLogs, setDispatchLogs] = useState([]);
  const [sosPhase, setSosPhase] = useState("idle");
  const [adminTab, setAdminTab] = useState("monitor");
  const [crossMatchState, setCrossMatchState] = useState(
    createInitialCrossMatchState
  );
  const [auditTrail, setAuditTrail] = useState([]);
  const [traumaHandoffState, setTraumaHandoffState] = useState(
    createAsyncState
  );
  const [elapsed, setElapsed] = useState(0);
  const [language, setLanguage] = useState(() => {
    try {
      return normalizeLanguage(
        window.localStorage.getItem("trace-client-language") || "en"
      );
    } catch {
      return "en";
    }
  });
  const [aiBrief, setAiBrief] = useState(createAsyncState);
  const [adminAiSummary, setAdminAiSummary] = useState(createAsyncState);
  const [clientLocation, setClientLocation] = useState(createClientLocationState);

  const logTimeoutsRef = useRef([]);
  const selectedProfileRef = useRef(TRACE_CLIENTS[0]);

  const baseSelectedProfile = useMemo(
    () => TRACE_CLIENTS.find(profile => profile.id === selectedProfileId) ?? TRACE_CLIENTS[0],
    [selectedProfileId]
  );
  const selectedProfile = useMemo(
    () => applyClientLocationToProfile(baseSelectedProfile, clientLocation),
    [baseSelectedProfile, clientLocation]
  );
  const incidentProfile = useMemo(
    () =>
      incident
        ? applyIncidentLocationToProfile(
            TRACE_CLIENTS.find(profile => profile.id === incident.profileId) ??
              baseSelectedProfile,
            incident
          )
        : null,
    [baseSelectedProfile, incident]
  );
  const displayProfile = incidentProfile ?? selectedProfile;
  const localizedCopy = useMemo(
    () =>
      buildLocalizedClientCopy(
        displayProfile,
        incident?.status === "active",
        language
      ),
    [displayProfile, incident?.status, language]
  );
  const selectedService =
    services.find(service => service.id === selectedServiceId) ?? services[0] ?? null;
  const syncStatus =
    incident?.status === "active"
      ? "Firebase sync live"
      : incident?.status === "resolved"
        ? "Case synced and sealed"
        : "Waiting for active case";

  const pushAudit = (kind, message, payload = {}) => {
    const timestamp = new Date().toISOString();
    const entryId = `AUD-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

    sealAuditPayload({ kind, message, payload, timestamp }, auditSecret).then(seal => {
      setAuditTrail(current => [
        {
          id: entryId,
          kind,
          message,
          timestamp,
          payload,
          seal,
        },
        ...current,
      ]);
    });
  };

  const clearScheduledLogs = () => {
    logTimeoutsRef.current.forEach(timerId => window.clearTimeout(timerId));
    logTimeoutsRef.current = [];
  };

  useEffect(() => () => clearScheduledLogs(), []);

  useEffect(() => {
    if (!sessionRole) {
      return;
    }

    pushAudit("session", `${sessionRole} signed into TRACE`, { role: sessionRole });
  }, [sessionRole]);

  useEffect(() => {
    selectedProfileRef.current = selectedProfile;
  }, [selectedProfile]);

  useEffect(() => {
    try {
      window.localStorage.setItem("trace-client-language", normalizeLanguage(language));
    } catch {
      return;
    }
  }, [language]);

  const requestClientLocation = async () => {
    setClientLocation(current => ({
      ...current,
      status: "locating",
      error: "",
    }));

    try {
      const liveLocation = await captureClientLocation();
      const nextLocationState = buildClientLocationState(liveLocation);
      setClientLocation(nextLocationState);
      return nextLocationState;
    } catch (error) {
      setClientLocation(current => ({
        ...current,
        status: current.coords ? "ready" : "error",
        error: error.message,
      }));
      return null;
    }
  };

  useEffect(() => {
    if (sessionRole !== "client") {
      return;
    }

    void requestClientLocation();
  }, [sessionRole]);

  useEffect(() => {
    if (!services.some(service => service.id === selectedServiceId)) {
      setSelectedServiceId(services[0]?.id ?? null);
    }
  }, [selectedServiceId, services]);

  useEffect(() => {
    if (incident) {
      return;
    }

    const standbyServices = createServiceState(selectedProfile);
    setServices(standbyServices);
    setActivationGroups(createActivationState(selectedProfile));
    setCrossMatchState(createInitialCrossMatchState());
    setSelectedServiceId(standbyServices[0]?.id ?? null);
  }, [incident, selectedProfile]);

  useEffect(() => {
    setAiBrief(createAsyncState());
  }, [displayProfile?.id, incident?.id, incident?.status, sessionRole]);

  useEffect(() => {
    setAdminAiSummary(createAsyncState());
  }, [displayProfile?.id, incident?.id, incident?.status]);

  useEffect(() => {
    if (!incident) {
      setElapsed(0);
      return;
    }

    const updateElapsed = () => {
      const endTime =
        incident.status === "resolved" && incident.resolvedAt
          ? new Date(incident.resolvedAt).getTime()
          : Date.now();
      setElapsed(Math.max(0, Math.floor((endTime - incident.startTime) / 1000)));
    };

    updateElapsed();

    if (incident.status === "resolved") {
      return;
    }

    const timer = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(timer);
  }, [incident]);

  const performCrossMatchSweep = source => {
    if (!incidentProfile || incident?.status !== "active") {
      return;
    }

    const now = Date.now();
    setCrossMatchState(current => {
      const cycleCount = current.cycleCount + 1;
      return {
        cycleCount,
        lastSweepAt: now,
        nextSweepIn: 90,
        records: buildCrossMatchRecords(incidentProfile, cycleCount),
      };
    });

    setServices(current =>
      current.map(service =>
        service.category === "service"
          ? {
              ...service,
              status: "syncing",
              lastUpdate: new Date(now).toISOString(),
            }
          : service
      )
    );

    pushAudit("crossmatch", `Silent cross-match sweep ${source}`, {
      incidentId: incident.id,
      profileId: incidentProfile.id,
      source,
    });
  };

  useEffect(() => {
    if (!incidentProfile || incident?.status !== "active") {
      return;
    }

    performCrossMatchSweep("initial");

    const cadenceTimer = window.setInterval(() => {
      performCrossMatchSweep("scheduled");
    }, 90000);

    const countdownTimer = window.setInterval(() => {
      setCrossMatchState(current => {
        if (!current.lastSweepAt) {
          return current;
        }

        const remaining = Math.max(
          0,
          90 - Math.floor((Date.now() - current.lastSweepAt) / 1000)
        );

        return {
          ...current,
          nextSweepIn: remaining,
        };
      });
    }, 1000);

    return () => {
      window.clearInterval(cadenceTimer);
      window.clearInterval(countdownTimer);
    };
  }, [incident?.id, incident?.status, incidentProfile]);

  const requestClientAiBrief = () => {
    if (!displayProfile) {
      return;
    }

    setAiBrief({
      status: "loading",
      data: null,
      error: "",
    });

    pushAudit("ai", "Client requested Gemini summary", {
      profileId: displayProfile.id,
      incidentId: incident?.id ?? null,
    });

    generateConditionBrief({
      apiKey: geminiApiKey,
      model: geminiModel,
      profile: displayProfile,
      incidentActive: incident?.status === "active",
    })
      .then(data => {
        setAiBrief({
          status: "ready",
          data,
          error: data.error || "",
        });
      })
      .catch(error => {
        setAiBrief({
          status: "ready",
          data: null,
          error: error.message,
        });
      });
  };

  const requestTraumaHandoff = (requestedBy = "admin") => {
    if (!incident || !incidentProfile || incident.status !== "resolved") {
      return;
    }

    setTraumaHandoffState(current => ({
      status: "loading",
      data: current.data,
      error: "",
    }));

    if (requestedBy === "admin") {
      pushAudit("handoff", "Admin requested trauma handoff generation", {
        incidentId: incident.id,
      });
    }

    generateTraumaHandoff({
      apiKey: geminiApiKey,
      model: geminiModel,
      profile: incidentProfile,
      incident,
    })
      .then(data => {
        setTraumaHandoffState({
          status: "ready",
          data: {
            ...data,
            createdAt: new Date().toISOString(),
          },
          error: data.error || "",
        });
        pushAudit("handoff", "Post-crisis trauma handoff generated", {
          incidentId: incident.id,
          source: data.source,
          requestedBy,
        });
      })
      .catch(error => {
        setTraumaHandoffState({
          status: "error",
          data: null,
          error: error.message,
        });
        pushAudit("handoff", "Trauma handoff generation failed", {
          incidentId: incident.id,
          requestedBy,
          error: error.message,
        });
      });
  };

  useEffect(() => {
    if (!incidentProfile || incident?.status !== "resolved") {
      return;
    }

    if (traumaHandoffState.status !== "idle") {
      return;
    }

    requestTraumaHandoff("system");
  }, [incident?.id, incident?.status, incidentProfile, traumaHandoffState.status]);

  const triggerSos = () => {
    if (sosPhase === "activating") {
      return;
    }

    if (incident?.status === "active") {
      resendAlerts("client");
      return;
    }

    clearScheduledLogs();
    setDispatchLogs([]);
    setTraumaHandoffState(createAsyncState());
    setSosPhase("activating");

    if (clientLocation.status !== "ready") {
      void requestClientLocation();
    }

    SOS_LOG_SEQUENCE.forEach(entry => {
      const timeoutId = window.setTimeout(() => {
        setDispatchLogs(current => [
          ...current,
          {
            time: formatClock(new Date()),
            message: entry.message,
            tone: entry.tone,
          },
        ]);
      }, entry.delay);

      logTimeoutsRef.current.push(timeoutId);
    });

    const finalizeId = window.setTimeout(() => {
      const activeProfile = selectedProfileRef.current;
      const nextIncident = createIncident(activeProfile);
      const liveServices = createServiceState(activeProfile, "active");
      const liveGroups = createActivationState(activeProfile, "active");

      setIncident(nextIncident);
      setServices(liveServices);
      setActivationGroups(
        liveGroups.map(group => ({
          ...group,
          lastAlert: new Date().toISOString(),
        }))
      );
      setCrossMatchState(createInitialCrossMatchState());
      setSelectedServiceId(liveServices[0]?.id ?? null);
      setSosPhase("active");
      setDispatchLogs(current => [
        ...current,
        {
          time: formatClock(new Date()),
          message:
            "Activate Simultaneously briefing sent to responders, trusted contacts, and authorities.",
          tone: "success",
        },
      ]);

      pushAudit("sos", "Client triggered SOS", {
        incidentId: nextIncident.id,
        profileId: activeProfile.id,
      });
      pushAudit("dispatch", "Activate Simultaneously sent automatically", {
        incidentId: nextIncident.id,
        profileId: activeProfile.id,
      });
    }, 3600);

    logTimeoutsRef.current.push(finalizeId);
  };

  const resendAlerts = source => {
    if (!incident || !incidentProfile) {
      return;
    }

    setServices(current =>
      current.map(service => {
        if (service.status === "resolved") {
          return service;
        }

        return {
          ...service,
          status:
            service.category === "responder"
              ? "en-route"
              : service.category === "authority"
                ? "alerted"
                : "syncing",
          lastUpdate: new Date().toISOString(),
        };
      })
    );

    setActivationGroups(current =>
      current.map(group => ({
        ...group,
        status: group.tone === "trusted" ? "notified" : "alerted",
        lastAlert: new Date().toISOString(),
      }))
    );

    setDispatchLogs(current => [
      ...current,
      {
        time: formatClock(new Date()),
        message:
          "Simultaneous alerts refreshed for responders, trusted contacts, and authorities.",
        tone: "normal",
      },
    ]);

    pushAudit("dispatch", `Activate Simultaneously re-sent by ${source}`, {
      incidentId: incident.id,
      source,
    });
  };

  const requestAdminAiSummary = () => {
    if (!displayProfile) {
      return;
    }

    setAdminAiSummary({
      status: "loading",
      data: null,
      error: "",
    });

    pushAudit("ai", "Admin requested Gemini summary", {
      profileId: displayProfile.id,
      incidentId: incident?.id ?? null,
    });

    generateConditionBrief({
      apiKey: geminiApiKey,
      model: geminiModel,
      profile: displayProfile,
      incidentActive: incident?.status === "active",
    })
      .then(data => {
        setAdminAiSummary({
          status: "ready",
          data,
          error: data.error || "",
        });
      })
      .catch(error => {
        setAdminAiSummary({
          status: "ready",
          data: null,
          error: error.message,
        });
      });
  };

  const advanceService = serviceId => {
    const target = services.find(service => service.id === serviceId);

    if (!target) {
      return;
    }

    let nextStatus = target.status;

    if (target.category === "service") {
      nextStatus = "syncing";
    } else if (target.status === "standby") {
      nextStatus = "alerted";
    } else if (target.status === "alerted") {
      nextStatus = "en-route";
    } else if (target.status === "en-route") {
      nextStatus = "on-scene";
    }

    setServices(current =>
      current.map(service =>
        service.id === serviceId
          ? {
              ...service,
              status: nextStatus,
              lastUpdate: new Date().toISOString(),
            }
          : service
      )
    );

    pushAudit("service", `${target.name} updated to ${nextStatus}`, {
      serviceId,
      nextStatus,
      incidentId: incident?.id ?? null,
    });
  };

  const resolveCase = () => {
    if (!incident || !incidentProfile) {
      return;
    }

    const leadResponder =
      services.find(
        service =>
          service.category === "responder" &&
          (service.status === "on-scene" || service.status === "en-route")
      ) ?? services.find(service => service.category === "responder");
    const shelterRoute =
      services.find(service => service.type === "shelter")?.name ?? "Safe shelter route";
    const notes = `Resolved by ${leadResponder?.name ?? "field team"}. Client stabilized and routed through ${shelterRoute}.`;

    setIncident(current =>
      current
        ? {
            ...current,
            status: "resolved",
            resolvedAt: new Date().toISOString(),
            resolutionNotes: notes,
          }
        : current
    );
    setServices(current =>
      current.map(service => ({
        ...service,
        status: "resolved",
        lastUpdate: new Date().toISOString(),
      }))
    );
    setActivationGroups(current =>
      current.map(group => ({
        ...group,
        status: "resolved",
        lastAlert: new Date().toISOString(),
      }))
    );
    setSosPhase("resolved");
    setDispatchLogs(current => [
      ...current,
      {
        time: formatClock(new Date()),
        message: "Client located. TRACE is generating the trauma handoff package.",
        tone: "success",
      },
    ]);

    pushAudit("resolution", "Case resolved and handoff requested", {
      incidentId: incident.id,
      leadResponder: leadResponder?.name ?? null,
    });
    setAdminTab("handoff");
  };

  const resetDemo = () => {
    clearScheduledLogs();
    setIncident(null);
    setServices(createServiceState(selectedProfile));
    setActivationGroups(createActivationState(selectedProfile));
    setSelectedServiceId(null);
    setDispatchLogs([]);
    setSosPhase("idle");
    setAdminTab("monitor");
    setCrossMatchState(createInitialCrossMatchState());
    setTraumaHandoffState(createAsyncState());
    setElapsed(0);
    pushAudit("system", "Demo reset to standby", { profileId: selectedProfile.id });
  };

  const downloadReport = () => {
    if (!incident || !incidentProfile) {
      return;
    }

    const report = buildIncidentReport({
      incident,
      profile: incidentProfile,
      services,
      auditTrail,
      traumaHandoff: traumaHandoffState.data,
    });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
    anchor.download = `${incident.id}_trace_report.txt`;
    anchor.click();
  };

  if (!sessionRole) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="trace-root">
          <RoleGate onChoose={setSessionRole} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="trace-app">
        <header className="topbar">
          <div className="topbar-left">
            <div className="brand">
              T<span>.</span>R<span>.</span>A<span>.</span>C<span>.</span>E
            </div>
            <span className="role-pill">
              {sessionRole === "admin" ? "App admin" : "Client"}
            </span>
            {incident && (
              <span className="status-pill">
                <span className="status-dot" />
                {incident.status === "active" ? "Active incident" : "Resolved case"}
              </span>
            )}
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="topbar-button"
              onClick={() =>
                setSessionRole(current => (current === "admin" ? "client" : "admin"))
              }
            >
              Switch role
            </button>
            <button
              type="button"
              className="topbar-button"
              onClick={() => setSessionRole(null)}
            >
              Log out
            </button>
          </div>
        </header>

        <main className="trace-main">
          {sessionRole === "client" ? (
            <ClientView
              profile={displayProfile}
              profiles={TRACE_CLIENTS}
              incident={incident}
              elapsed={elapsed}
              localizedCopy={localizedCopy}
              language={language}
              onLanguageChange={nextLanguage =>
                setLanguage(normalizeLanguage(nextLanguage))
              }
              aiBrief={aiBrief}
              onGenerateAiBrief={requestClientAiBrief}
              sosPhase={sosPhase}
              onTriggerSos={triggerSos}
              logs={dispatchLogs}
              onSelectProfile={setSelectedProfileId}
              services={services}
              selectedServiceId={selectedServiceId}
              onSelectService={setSelectedServiceId}
              syncStatus={syncStatus}
              clientLocation={clientLocation}
              onRefreshLocation={requestClientLocation}
            />
          ) : (
            <AdminView
              profile={displayProfile}
              incident={incident}
              elapsed={elapsed}
              adminTab={adminTab}
              onSelectTab={setAdminTab}
              services={services}
              selectedService={selectedService}
              selectedServiceId={selectedServiceId}
              onSelectService={setSelectedServiceId}
              onAdvanceService={advanceService}
              onResolveCase={resolveCase}
              onResetDemo={resetDemo}
              onDownloadReport={downloadReport}
              onResendAlerts={resendAlerts}
              activationGroups={activationGroups}
              crossMatchState={crossMatchState}
              onRunCrossMatch={() => performCrossMatchSweep("manual")}
              auditTrail={auditTrail}
              traumaHandoffState={traumaHandoffState}
              onGenerateTraumaHandoff={() => requestTraumaHandoff("admin")}
              adminAiSummary={adminAiSummary}
              onGenerateAdminAiSummary={requestAdminAiSummary}
              syncStatus={syncStatus}
            />
          )}
        </main>
      </div>
    </>
  );
}
