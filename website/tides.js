const STATION_ID = "TEC2791";
const TIME_ZONE = "America/New_York";

const fallbackPredictions = [
  { t: "2026-08-05 00:19", v: "1.9", type: "H" },
  { t: "2026-08-05 06:36", v: "0.0", type: "L" },
  { t: "2026-08-05 13:07", v: "2.2", type: "H" },
  { t: "2026-08-05 19:33", v: "0.4", type: "L" },
  { t: "2026-08-06 01:13", v: "1.7", type: "H" },
  { t: "2026-08-06 07:27", v: "0.0", type: "L" },
  { t: "2026-08-06 14:07", v: "2.3", type: "H" },
  { t: "2026-08-06 20:42", v: "0.5", type: "L" },
  { t: "2026-08-07 02:14", v: "1.6", type: "H" },
  { t: "2026-08-07 08:26", v: "0.0", type: "L" },
  { t: "2026-08-07 15:13", v: "2.4", type: "H" },
  { t: "2026-08-07 21:54", v: "0.4", type: "L" }
];

const $ = (id) => document.getElementById(id);

function localDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function ymd(date = new Date()) {
  const p = localDateParts(date);
  return `${p.year}${p.month}${p.day}`;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function parseNoaaTime(value) {
  const [datePart, timePart] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const localGuess = new Date(year, month - 1, day, hour, minute);
  return localGuess;
}

function formatClock(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, ...options }).format(date);
}

function eventLabel(event) {
  return event.type === "H" ? "High tide" : "Low tide";
}

function normalize(predictions) {
  return predictions.map((prediction) => ({
    ...prediction,
    date: parseNoaaTime(prediction.t),
    height: Number(prediction.v)
  })).sort((a, b) => a.date - b.date);
}

async function fetchPredictions() {
  const now = new Date();
  const begin = ymd(addDays(now, -1));
  const end = ymd(addDays(now, 7));
  const params = new URLSearchParams({
    product: "predictions",
    application: "ProjectLighthouse",
    begin_date: begin,
    end_date: end,
    datum: "MLLW",
    station: STATION_ID,
    time_zone: "lst_ldt",
    units: "english",
    interval: "hilo",
    format: "json"
  });

  const response = await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${params}`);
  if (!response.ok) throw new Error(`NOAA request failed (${response.status})`);
  const data = await response.json();
  if (!data.predictions?.length) throw new Error(data.error?.message || "No predictions returned");
  return normalize(data.predictions);
}

function getTodayEvents(events) {
  const today = formatDate(new Date(), { year: "numeric", month: "2-digit", day: "2-digit" });
  return events.filter((event) => formatDate(event.date, { year: "numeric", month: "2-digit", day: "2-digit" }) === today);
}

function renderHero(events) {
  const now = new Date();
  const upcoming = events.filter((event) => event.date > now);
  const next = upcoming[0];
  const following = upcoming[1];
  if (!next) throw new Error("No future tide found");

  $("nextTideIcon").textContent = next.type === "H" ? "↑" : "↓";
  $("nextTideType").textContent = eventLabel(next);
  $("nextTideTime").textContent = `${formatClock(next.date)} · ${formatDate(next.date, { weekday: "long", month: "short", day: "numeric" })}`;
  $("nextTideHeight").textContent = `${next.height.toFixed(1)} ft`;
  $("tideTrend").textContent = next.type === "H" ? "Rising" : "Falling";
  $("followingTide").textContent = following ? `${following.type === "H" ? "High" : "Low"} ${formatClock(following.date)}` : "—";
  $("guidanceTitle").textContent = next.type === "H" ? "Water is rising" : "Water is falling";
  $("guidanceText").textContent = next.type === "H"
    ? "The tide is building toward high water. Beach width will continue shrinking, inlet current will strengthen, and the better surf-fishing window often develops through the final hours of the rise."
    : "The tide is draining toward low water. Expect more exposed beach and bars, stronger outgoing current near the inlet, and generally easier access along the shoreline.";

  const updateCountdown = () => {
    const diff = next.date - new Date();
    if (diff <= 0) return renderHero(events);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    $("countdown").textContent = `${hours} hr ${minutes} min away`;
  };
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

function renderToday(events) {
  const todayEvents = getTodayEvents(events);
  $("todayDate").textContent = formatDate(new Date(), { weekday: "long", month: "long", day: "numeric" });
  $("todayEvents").innerHTML = todayEvents.map((event) => `
    <article class="event-card">
      <span>${eventLabel(event)}</span>
      <strong>${formatClock(event.date)}</strong>
      <small>${event.height.toFixed(1)} ft</small>
    </article>
  `).join("");
  drawCurve(todayEvents);
}

function drawCurve(events) {
  const svg = $("tideCurve");
  if (events.length < 2) {
    svg.innerHTML = "";
    return;
  }
  const width = 900;
  const height = 260;
  const padX = 52;
  const padY = 35;
  const values = events.map((event) => event.height);
  const min = Math.min(...values) - .25;
  const max = Math.max(...values) + .25;
  const points = events.map((event, index) => {
    const x = padX + (index / (events.length - 1)) * (width - padX * 2);
    const y = height - padY - ((event.height - min) / (max - min)) * (height - padY * 2);
    return { x, y, event };
  });
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  svg.innerHTML = `
    <defs>
      <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#5ab7ce" stop-opacity=".42" />
        <stop offset="100%" stop-color="#5ab7ce" stop-opacity=".04" />
      </linearGradient>
    </defs>
    <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="#cbdde3" />
    <path d="${path} L ${points.at(-1).x} ${height - padY} L ${points[0].x} ${height - padY} Z" fill="url(#fill)" />
    <path d="${path}" fill="none" stroke="#13759a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    ${points.map((point) => `
      <circle cx="${point.x}" cy="${point.y}" r="8" fill="#fff" stroke="#0b2a3d" stroke-width="4" />
      <text x="${point.x}" y="${point.y - 18}" text-anchor="middle" font-family="Inter" font-size="14" font-weight="800" fill="#10212c">${point.event.height.toFixed(1)} ft</text>
      <text x="${point.x}" y="${height - 10}" text-anchor="middle" font-family="Inter" font-size="13" fill="#657681">${formatClock(point.event.date)}</text>
    `).join("")}
  `;
}

function renderUpcoming(events) {
  const now = new Date();
  const upcoming = events.filter((event) => event.date > now).slice(0, 8);
  $("upcomingList").innerHTML = upcoming.map((event) => `
    <article class="upcoming-row">
      <time>${formatDate(event.date, { weekday: "short", month: "short", day: "numeric" })}</time>
      <strong>${event.type === "H" ? "↑ High tide" : "↓ Low tide"} · ${formatClock(event.date)}</strong>
      <span>${event.height.toFixed(1)} ft</span>
    </article>
  `).join("");
}

function renderWeek(events) {
  const grouped = new Map();
  events.forEach((event) => {
    const key = formatDate(event.date, { year: "numeric", month: "2-digit", day: "2-digit" });
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(event);
  });
  const days = [...grouped.values()].filter((group) => group[0].date >= new Date(Date.now() - 86400000)).slice(0, 7);
  $("weekTable").innerHTML = days.map((group) => {
    const date = group[0].date;
    return `
      <article class="day-column">
        <h3>${formatDate(date, { weekday: "long" })}</h3>
        <span>${formatDate(date, { month: "short", day: "numeric" })}</span>
        ${group.map((event) => `
          <div class="day-event">
            <span>${event.type === "H" ? "High" : "Low"} ${formatClock(event.date)}</span>
            <strong>${event.height.toFixed(1)}′</strong>
          </div>
        `).join("")}
      </article>
    `;
  }).join("");
}

async function init() {
  let events;
  try {
    events = await fetchPredictions();
    $("updatedLabel").textContent = "Live NOAA predictions · local Hatteras time (EST/EDT automatically)";
  } catch (error) {
    console.error(error);
    events = normalize(fallbackPredictions);
    $("updatedLabel").textContent = "NOAA annual-table fallback · local Hatteras time";
    $("updatedLabel").classList.add("error-text");
  }
  renderHero(events);
  renderToday(events);
  renderUpcoming(events);
  renderWeek(events);
}

init();
