const CAMERAS = [
  {
    id: "drivenc",
    name: "DriveNC Traffic Cameras",
    village: "Islandwide",
    category: "Traffic",
    type: "traffic",
    icon: "🚙",
    source: "DriveNC",
    url: "https://www.drivenc.gov/cctv?start=0&length=10&filters%5B0%5D%5Bi%5D=2&filters%5B0%5D%5Bs%5D=Dare&filters%5B1%5D%5Bi%5D=3&filters%5B1%5D%5Bs%5D=NC-12&order%5Bi%5D=1&order%5Bdir%5D=asc",
    description: "Official traffic camera directory filtered to Dare County and NC-12.",
    pin: { top: 17, left: 65 }
  },
  {
    id: "ferry",
    name: "Hatteras Inlet Ferry Cameras",
    village: "Hatteras",
    category: "Ferries",
    type: "ferries",
    icon: "⛴",
    source: "NCDOT Ferry Division",
    url: "https://www.ncdot.gov/travel-maps/ferry-tickets-services/Pages/hatteras-inlet-ferry-cameras.aspx",
    description: "Official terminal camera page for the Hatteras–Ocracoke ferry route.",
    pin: { top: 88, left: 31 }
  },
  {
    id: "nps",
    name: "Cape Hatteras National Seashore",
    village: "Buxton",
    category: "National Park",
    type: "park",
    icon: "🌲",
    source: "National Park Service",
    url: "https://www.nps.gov/media/webcam/view.htm?id=3C1A24D2-97C4-0246-18F62B8B4AC794EE",
    description: "Official National Park Service webcam for Cape Hatteras National Seashore.",
    pin: { top: 76, left: 61 }
  },
  {
    id: "rodanthe",
    name: "Rodanthe Pier Webcam",
    village: "Rodanthe",
    category: "Fishing",
    type: "fishing",
    icon: "🎣",
    source: "Rodanthe Pier LLC",
    url: "https://www.rodanthepierllc.com/webcam",
    description: "Live public view from Rodanthe Pier.",
    pin: { top: 21, left: 67 }
  },
  {
    id: "oregon",
    name: "Oregon Inlet Fishing Center",
    village: "Oregon Inlet",
    category: "Fishing",
    type: "fishing",
    icon: "🎣",
    source: "Oregon Inlet Fishing Center",
    url: "https://www.oregon-inlet.com/webcam/",
    description: "Public webcam from Oregon Inlet Fishing Center.",
    pin: { top: 8, left: 64 }
  }
];

const TOPIC_ORDER = ["Traffic", "Ferries", "National Park", "Fishing"];
const VILLAGE_ORDER = ["Oregon Inlet", "Rodanthe", "Buxton", "Hatteras", "Islandwide"];
let currentView = "topic";
let searchTerm = "";

const $ = (id) => document.getElementById(id);
const cameraView = $("cameraView");
const dialog = $("cameraDialog");

function filteredCameras() {
  if (!searchTerm) return CAMERAS;
  const term = searchTerm.toLowerCase();
  return CAMERAS.filter((camera) =>
    [camera.name, camera.village, camera.category, camera.source, camera.description]
      .join(" ")
      .toLowerCase()
      .includes(term)
  );
}

function iconColor(type) {
  return {
    traffic: "var(--teal)",
    ferries: "var(--blue)",
    park: "var(--green)",
    fishing: "var(--orange)"
  }[type];
}

function cameraCard(camera) {
  return `
    <button class="camera-card" data-camera-id="${camera.id}">
      <div class="camera-icon" style="background:${iconColor(camera.type)}">${camera.icon}</div>
      <div class="camera-copy">
        <h4>${camera.name}</h4>
        <p>${camera.description}</p>
        <span class="camera-source">${camera.source} ↗</span>
      </div>
    </button>
  `;
}

function renderGrouped(field, order) {
  const cameras = filteredCameras();
  const groups = new Map();

  cameras.forEach((camera) => {
    const key = camera[field];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(camera);
  });

  const keys = [...groups.keys()].sort((a, b) => {
    const aIndex = order.indexOf(a) < 0 ? 99 : order.indexOf(a);
    const bIndex = order.indexOf(b) < 0 ? 99 : order.indexOf(b);
    return aIndex - bIndex;
  });

  cameraView.innerHTML = keys.length
    ? keys.map((key) => `
      <section class="group-section">
        <div class="group-heading">
          <h3>${key}</h3>
          <span>${groups.get(key).length} source${groups.get(key).length === 1 ? "" : "s"}</span>
        </div>
        <div class="camera-grid">${groups.get(key).map(cameraCard).join("")}</div>
      </section>
    `).join("")
    : `<section class="group-section">No camera sources match that search.</section>`;
}

function renderMap() {
  const cameras = filteredCameras();
  cameraView.innerHTML = `
    <div class="map-layout">
      <section class="map-panel" aria-label="Approximate camera source locations">
        <div class="map-image"></div>
        ${cameras.map((camera) => `
          <button
            class="map-pin ${camera.type}"
            style="top:${camera.pin.top}%;left:${camera.pin.left}%"
            data-camera-id="${camera.id}"
            title="${camera.name}"
            aria-label="Open ${camera.name}"
          >${camera.icon}</button>
        `).join("")}
      </section>
      <aside class="map-side">
        <div class="legend">
          <strong>Camera types</strong>
          <span><i style="background:var(--teal)"></i>Traffic</span>
          <span><i style="background:var(--blue)"></i>Ferries</span>
          <span><i style="background:var(--green)"></i>National Park</span>
          <span><i style="background:var(--orange)"></i>Fishing</span>
        </div>
        <section class="group-section">
          <p class="eyebrow">MAP VIEW</p>
          <h3>Select a pin</h3>
          <p style="color:var(--muted);line-height:1.55">Pins show approximate source locations. Select one for details and the original camera page.</p>
        </section>
      </aside>
    </div>
  `;
}

function render() {
  const headings = {
    topic: ["By Topic", "Choose a trusted source by camera type."],
    village: ["By Village", "Find the nearest available camera source."],
    map: ["Map View", "Select a pin to open camera details."]
  };

  $("viewTitle").textContent = headings[currentView][0];
  $("viewDescription").textContent = headings[currentView][1];
  $("cameraCount").textContent = filteredCameras().length;

  if (currentView === "topic") renderGrouped("category", TOPIC_ORDER);
  if (currentView === "village") renderGrouped("village", VILLAGE_ORDER);
  if (currentView === "map") renderMap();

  bindCameraButtons();
}

function openCamera(camera) {
  $("dialogCategory").textContent = camera.category.toUpperCase();
  $("dialogTitle").textContent = camera.name;
  $("dialogDescription").textContent = camera.description;
  $("dialogMeta").innerHTML = `
    <div><span>Location</span><strong>${camera.village}</strong></div>
    <div><span>Source</span><strong>${camera.source}</strong></div>
  `;
  $("openCameraLink").href = camera.url;
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
    document.querySelectorAll(".view-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
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
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});

render();
