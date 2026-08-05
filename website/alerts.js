const ALERTS_URL = "https://api.weather.gov/alerts/active?point=35.2677,-75.5424";
const alertList = document.getElementById("alertList");
const alertStatus = document.getElementById("alertStatus");
const refreshButton = document.getElementById("refreshAlerts");

function formatDate(value) {
  if (!value) return "Not specified";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York"
  }).format(new Date(value));
}

function severityClass(severity) {
  const value = (severity || "").toLowerCase();
  if (["extreme", "severe"].includes(value)) return "severe";
  if (["minor"].includes(value)) return "minor";
  return "moderate";
}

function renderEmpty() {
  alertStatus.textContent = "No active NWS alerts for Buxton";
  alertList.innerHTML = `
    <section class="alert-card minor empty-state">
      <strong>✓ No active National Weather Service alerts</strong>
      <p>Other official sources remain available below for road, ferry, park and county notices.</p>
    </section>
  `;
}

function renderAlerts(features) {
  if (!features.length) {
    renderEmpty();
    return;
  }

  alertStatus.textContent = `${features.length} active NWS alert${features.length === 1 ? "" : "s"}`;
  alertList.innerHTML = features.map(({ properties }) => `
    <article class="alert-card ${severityClass(properties.severity)}">
      <div class="alert-badges">
        <span class="badge">NWS</span>
        <span class="badge">${properties.severity || "Unknown severity"}</span>
        <span class="badge">${properties.urgency || "Unknown urgency"}</span>
      </div>
      <h2>${properties.event || "Weather alert"}</h2>
      <p>${properties.headline || properties.description || "See the official alert for details."}</p>
      <div class="alert-meta">
        <div><span>Effective</span><strong>${formatDate(properties.effective)}</strong></div>
        <div><span>Expires</span><strong>${formatDate(properties.expires)}</strong></div>
      </div>
      <a class="alert-link" href="${properties['@id'] || ALERTS_URL}" target="_blank" rel="noopener noreferrer">Open official alert →</a>
    </article>
  `).join("");
}

async function loadAlerts() {
  refreshButton.disabled = true;
  refreshButton.textContent = "Checking…";
  alertStatus.textContent = "Checking National Weather Service…";
  alertList.innerHTML = "";

  try {
    const response = await fetch(ALERTS_URL, {
      headers: { "Accept": "application/geo+json" }
    });
    if (!response.ok) throw new Error(`NWS request failed: ${response.status}`);
    const data = await response.json();
    renderAlerts(data.features || []);
  } catch (error) {
    console.error(error);
    alertStatus.textContent = "Live NWS feed unavailable";
    alertList.innerHTML = `
      <section class="alert-card severe empty-state">
        <strong>Unable to load live alerts</strong>
        <p>Use the official source links below to verify current conditions.</p>
        <a class="alert-link" href="${ALERTS_URL}" target="_blank" rel="noopener noreferrer">Open NWS alerts →</a>
      </section>
    `;
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "Refresh";
  }
}

refreshButton.addEventListener("click", loadAlerts);
loadAlerts();
