const POINT_URL = "https://api.weather.gov/points/35.05471,-75.75892";

const $ = (id) => document.getElementById(id);

function extractSeas(text = "") {
  const match = text.match(/Seas?\s+(?:around\s+)?([^.]+?ft)/i);
  return match ? match[1].replace(/\s+/g, " ").trim() : "See details";
}

function formatUpdated(value) {
  if (!value) return "Update time unavailable";
  return `Updated ${new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    timeZone: "America/New_York", timeZoneName: "short"
  }).format(new Date(value))}`;
}

function renderPeriod(period) {
  const seas = extractSeas(period.detailedForecast);
  return `
    <article class="forecast-card">
      <span>${period.isDaytime ? "DAY" : "NIGHT"}</span>
      <h3>${period.name}</h3>
      <div class="mini">
        <strong>${period.windDirection || "Wind"} ${period.windSpeed || "—"}</strong>
        <strong>Seas ${seas}</strong>
      </div>
      <p>${period.detailedForecast}</p>
    </article>
  `;
}

async function loadMarineForecast() {
  try {
    const pointResponse = await fetch(POINT_URL, {
      headers: { Accept: "application/geo+json" }
    });
    if (!pointResponse.ok) throw new Error(`Point lookup failed (${pointResponse.status})`);

    const pointData = await pointResponse.json();
    const forecastUrl = pointData?.properties?.forecast;
    if (!forecastUrl) throw new Error("NWS did not return a forecast endpoint for this point.");

    const forecastResponse = await fetch(forecastUrl, {
      headers: { Accept: "application/geo+json" }
    });
    if (!forecastResponse.ok) throw new Error(`Forecast request failed (${forecastResponse.status})`);

    const forecastData = await forecastResponse.json();
    const periods = forecastData?.properties?.periods || [];
    if (!periods.length) throw new Error("No forecast periods were returned.");

    const current = periods[0];
    $("currentName").textContent = current.name;
    $("currentDetail").textContent = current.detailedForecast;
    $("currentWind").textContent = `${current.windDirection || ""} ${current.windSpeed || "—"}`.trim();
    $("currentSeas").textContent = extractSeas(current.detailedForecast);
    $("updatedAt").textContent = formatUpdated(forecastData.properties.updated);
    $("forecastGrid").innerHTML = periods.slice(1, 10).map(renderPeriod).join("");
  } catch (error) {
    console.error(error);
    $("currentName").textContent = "Marine forecast unavailable";
    $("currentDetail").textContent = "The National Weather Service feed could not be loaded. Use the official forecast link below for current conditions.";
    $("currentWind").textContent = "—";
    $("currentSeas").textContent = "—";
    $("updatedAt").textContent = "Live feed unavailable";
    $("forecastGrid").innerHTML = `<div class="error">Unable to load live NWS marine data. The official source link remains available below.</div>`;
  }
}

loadMarineForecast();