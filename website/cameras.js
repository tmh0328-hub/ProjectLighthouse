const CAMERAS = [
  { id: "rodanthe-placeholder", name: "Rodanthe Camera", village: "Rodanthe", category: "Beaches & Surf", lat: 35.5935, lon: -75.4671, mode: "Live", source: "Pending", cameraUrl: "", embedUrl: "", notes: "Awaiting verified camera source." },
  { id: "avon-placeholder", name: "Avon Camera", village: "Avon", category: "Fishing & Marinas", lat: 35.3510, lon: -75.5104, mode: "Live", source: "Pending", cameraUrl: "", embedUrl: "", notes: "Awaiting verified camera source." },
  { id: "buxton-placeholder", name: "Buxton Camera", village: "Buxton", category: "Beaches & Surf", lat: 35.2677, lon: -75.5424, mode: "Snapshot", source: "Pending", cameraUrl: "", embedUrl: "", notes: "Awaiting verified camera source." },
  { id: "hatteras-placeholder", name: "Hatteras Ferry Camera", village: "Hatteras", category: "Ferries", lat: 35.2193, lon: -75.6904, mode: "Live", source: "Pending", cameraUrl: "", embedUrl: "", notes: "Awaiting verified camera source." },
  { id: "oregon-inlet-placeholder", name: "Oregon Inlet Traffic Camera", village: "Oregon Inlet", category: "Traffic", lat: 35.7959, lon: -75.5480, mode: "Snapshot", source: "Pending", cameraUrl: "", embedUrl: "", notes: "Awaiting verified camera source." }
];

const VILLAGE_ORDER = ["Oregon Inlet", "Rodanthe", "Waves", "Salvo", "Avon", "Buxton", "Frisco", "Hatteras", "Ocracoke"];
const TOPIC_ORDER = ["Traffic", "Ferries", "Beaches & Surf", "Fishing & Marinas", "Weather"];

let currentView = "village";
let searchTerm = "";

const $ = (id) => document.getElementById(id);
const cameraView = $("cameraView");
const dialog = $("cameraDialog");

function filteredCameras() {
  if (!searchTerm) return CAMERAS;
  const term = searchTerm.toLowerCase();
  return CAMERAS.filter((camera) => [camera.name, camera.village, camera.category, camera.source, camera.notes]
    .join(" ")
    .toLowerCase()
    .includes(term));
}

function cameraCard(camera) {
  return `
    <button class="camera-card" data-camera-id="${camera.id}">
      <div class="camera-preview">◉</div>
      <span class="status-pill">${camera.mode}</span>
      <div class="camera-copy">
        <h3>${camera.name}</h3>
        <div class="camera-meta">${camera.village} · ${camera.category}</div>
      </div>
    </button>
  `;
}

function renderGrouped(groupBy, order) {
  const cameras = filteredCameras();
  const groups = new Map();

  cameras.forEach((camera) => {
    const key = camera[groupBy];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(camera);
  });

  const keys = [...groups.keys()].sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  if (!keys.length) {
    cameraView.innerHTML = '<section class="group-section empty-state">No cameras match that search.</section>';
    return;
  }

  cameraView.innerHTML = keys.map((key) => `
    <section class="group-section">
      <div class="group-heading">
        <h2>${key}</h2>
        <span>${groups.get(key).length} camera${groups.get(key).length === 1 ? "" : "s"}</span>
      </div>
      <div class="camera-grid">
        ${groups.get(key).map(cameraCard).join("")}
      </div>
    </section>
  `).join("");
}

function positionForCamera(camera) {
  const minLat = 35.18;
  const maxLat = 35.84;
  const minLon = -75.73;
  const maxLon = -75.43;
  const top = 8 + ((maxLat - camera.lat) / (maxLat - minLat)) * 84;
  const left = 42 + ((camera.lon - minLon) / (maxLon - minLon)) * 16;
  return { top: Math.max(5, Math.min(95, top)), left: Math.max(10, Math.min(90, left)) };
}

function renderMap() {
  const cameras = filteredCameras();
  cameraView.innerHTML = `
    <section class="map-panel">
      <div class="group-heading">
        <div>
          <p class="eyebrow">GEOGRAPHIC VIEW</p>
          <h2>Island camera map</h2>
        </div>
        <span>${cameras.length} camera${cameras.length === 1 ? "" : "s"}</span>
      </div>
      <div class="map-canvas" aria-label="Camera locations on Hatteras Island">
        <div class="island-line" aria-hidden="true"></div>
        ${cameras.map((camera) => {
          const position = positionForCamera(camera);
          return `<button class="map-pin" style="top:${position.top}%;left:${position.left}%" data-camera-id="${camera.id}" aria-label="Open ${camera.name}">◉</button>`;
        }).join("")}
      </div>
      <div class="map-legend">
        ${TOPIC_ORDER.map((topic) => `<span>${topic}</span>`).join("")}
      </div>
    </section>
  `;
}

function render() {
  if (currentView === "village") renderGrouped("village", VILLAGE_ORDER);
  if (currentView === "topic") renderGrouped("category", TOPIC_ORDER);
  if (currentView === "map") renderMap();
  bindCameraButtons();
}

function updateSummary() {
  $("cameraCount").textContent = CAMERAS.length;
  $("villageCount").textContent = new Set(CAMERAS.map((camera) => camera.village)).size;
  $("liveCount").textContent = CAMERAS.filter((camera) => camera.mode === "Live").length;
  $("snapshotCount").textContent = CAMERAS.filter((camera) => camera.mode === "Snapshot").length;
}

function openCamera(camera) {
  $("dialogCategory").textContent = camera.category.toUpperCase();
  $("dialogTitle").textContent = camera.name;
  $("dialogBody").innerHTML = `
    <div class="dialog-preview">
      <div>
        <strong>Camera source pending</strong>
        <p>This view is ready for the verified camera link or embed.</p>
      </div>
    </div>
    <div class="dialog-details">
      <div class="dialog-detail"><span>Village</span><strong>${camera.village}</strong></div>
      <div class="dialog-detail"><span>Category</span><strong>${camera.category}</strong></div>
      <div class="dialog-detail"><span>Feed type</span><strong>${camera.mode}</strong></div>
      <div class="dialog-detail"><span>Source</span><strong>${camera.source}</strong></div>
    </div>
  `;
  dialog.showModal();
}

function bindCameraButtons() {
  document.querySelectorAll("[data-camera-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const camera = CAMERAS.find((item) => item.id === button.dataset.cameraId);
      if (camera) openCamera(camera);
    });
  });
}

document.querySelectorAll(".view-tab").forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;
    document.querySelectorAll(".view-tab").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    render();
  });
});

$("cameraSearch").addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  render();
});

$("closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) dialog.close();
});

updateSummary();
render();
