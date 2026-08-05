const MARINE_ZONE_URL = "https://api.weather.gov/zones/forecast/AMZ154/forecast";

const $ = (id) => document.getElementById(id);

function extractSeas(text = "") {
  const match = text.match(/Seas?\s+(?:around\s+)?([^.]+?ft)/i);
  return match ? match[1].replace(/\s+/g, " ").trim() : "See details";
}

function extractWind(text = "") {
  const match = text.match(/\b([NSEW]{1,3}|VRB)\s+winds?\s+([^.]*(?:kt|knots?))/i);
  if (!match) return "See details";
  return `${match[1].toUpperCase()} ${match[2].replace(/\s+/g, " ").trim()}`;
}

function formatUpdated(value) {
  if (!value) return "Update time unavailable";
  return `Updated ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short"
  }).format(new Date(value))}`;
}

function normalizePeriods(data) {
  const periods = data?.properties?.periods;
  return Array.isArray(periods) ? periods : [];
}

function renderPeriod(period) {
  const detail = period.detailedForecast || period.forecast || "Forecast details unavailable.";
  return `
    <article class="forecast-card">
      <span>MARINE</span>
      <h3>${period.name || "Forecast period"}</h3>
      <div class="mini">
        <strong>${extractWind(detail)}</strong>
        <strong>Seas ${extractSeas(detail)}</strong>
      </div>
      <p>${detail}</p>
    </article>
  `;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/geo+json, application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`NWS request failed (${response.status})`);
  }

  return response.json();
}

async function loadMarineForecast() {
  try {
    const forecastData = await fetchJson(MARINE_ZONE_URL);
    const periods = normalizePeriods(forecastData);

    if (!periods.length) {
      throw new Error("No marine forecast periods were returned.");
    }

    const current = periods[0];
    const detail = current.detailedForecast || current.forecast || "Forecast details unavailable.";

    $("currentName").textContent = current.name || "Current marine forecast";
    $("currentDetail").textContent = detail;
    $("currentWind").textContent = extractWind(detail);
    $("currentSeas").textContent = extractSeas(detail);
    $("updatedAt").textContent = formatUpdated(
      forecastData?.properties?.updated || forecastData?.properties?.updateTime
    );
    $("forecastGrid").innerHTML = periods.slice(1, 10).map(renderPeriod).join("");
  } catch (error) {
    console.error("Marine forecast error:", error);
    $("currentName").textContent = "Marine forecast unavailable";
    $("currentDetail").textContent = "The National Weather Service marine-zone feed could not be loaded. Use the official forecast link below for current conditions.";
    $("currentWind").textContent = "—";
    $("currentSeas").textContent = "—";
    $("updatedAt").textContent = "Live feed unavailable";
    $("forecastGrid").innerHTML = `<div class="error">Unable to load live NWS marine data. The official source link remains available below.</div>`;
  }
}

loadMarineForecast();
