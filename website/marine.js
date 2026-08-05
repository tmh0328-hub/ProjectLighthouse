const PRODUCT_LIST_URL = "https://api.weather.gov/products/types/CWF/locations/MHX";
const ZONE_ID = "AMZ154";

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

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/geo+json, application/json" },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`NWS request failed (${response.status})`);
  return response.json();
}

function cleanText(text = "") {
  return text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function extractZoneSection(productText) {
  const normalized = productText.replace(/\r/g, "");
  const start = normalized.indexOf(`${ZONE_ID}-`);
  if (start === -1) throw new Error(`${ZONE_ID} was not found in the latest coastal waters forecast.`);

  const remainder = normalized.slice(start);
  const end = remainder.indexOf("$$");
  return cleanText(end === -1 ? remainder : remainder.slice(0, end));
}

function parsePeriods(zoneText) {
  const matches = [...zoneText.matchAll(/^\.([^\n.]+)\.\.\.\s*([\s\S]*?)(?=^\.[^\n.]+\.\.\.|\s*$)/gm)];

  return matches.map((match, index) => ({
    number: index + 1,
    name: match[1].trim().replace(/\s+/g, " "),
    detailedForecast: cleanText(match[2]).replace(/\n/g, " ")
  })).filter((period) => period.detailedForecast);
}

function renderPeriod(period) {
  const detail = period.detailedForecast;
  return `
    <article class="forecast-card">
      <span>MARINE</span>
      <h3>${period.name}</h3>
      <div class="mini">
        <strong>${extractWind(detail)}</strong>
        <strong>Seas ${extractSeas(detail)}</strong>
      </div>
      <p>${detail}</p>
    </article>
  `;
}

async function getLatestMarineProduct() {
  const listData = await fetchJson(PRODUCT_LIST_URL);
  const products = Array.isArray(listData?.["@graph"]) ? listData["@graph"] : [];
  if (!products.length) throw new Error("NWS returned no coastal waters forecast products.");

  products.sort((a, b) => new Date(b.issuanceTime || 0) - new Date(a.issuanceTime || 0));
  const latest = products[0];
  const productId = latest.id || latest["@id"]?.split("/").pop();
  if (!productId) throw new Error("The latest NWS marine product did not include an ID.");

  const product = await fetchJson(`https://api.weather.gov/products/${productId}`);
  return {
    text: product.productText || product?.properties?.productText || "",
    issued: product.issuanceTime || latest.issuanceTime || null
  };
}

async function loadMarineForecast() {
  try {
    const product = await getLatestMarineProduct();
    const zoneText = extractZoneSection(product.text);
    const periods = parsePeriods(zoneText);

    if (!periods.length) throw new Error("No forecast periods could be parsed from the NWS marine product.");

    const current = periods[0];
    $("currentName").textContent = current.name;
    $("currentDetail").textContent = current.detailedForecast;
    $("currentWind").textContent = extractWind(current.detailedForecast);
    $("currentSeas").textContent = extractSeas(current.detailedForecast);
    $("updatedAt").textContent = formatUpdated(product.issued);
    $("forecastGrid").innerHTML = periods.slice(1, 10).map(renderPeriod).join("");
  } catch (error) {
    console.error("Marine forecast error:", error);
    $("currentName").textContent = "Marine forecast unavailable";
    $("currentDetail").textContent = "The National Weather Service coastal waters forecast could not be loaded. Use the official forecast link below for current conditions.";
    $("currentWind").textContent = "—";
    $("currentSeas").textContent = "—";
    $("updatedAt").textContent = "Live feed unavailable";
    $("forecastGrid").innerHTML = `<div class="error">Unable to load live NWS marine data. The official source link remains available below.</div>`;
  }
}

loadMarineForecast();
