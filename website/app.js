const moduleData = {
  beaches: {
    title: "Beaches",
    cards: [
      ["Rip current risk", "Moderate"],
      ["Surf", "2–3 ft"],
      ["Water temperature", "78°F"],
      ["Access status", "Ramp data planned"]
    ]
  },
  map: {
    title: "Island Map",
    cards: [
      ["Communities", "7 Hatteras Island villages"],
      ["Beach accesses", "Planned"],
      ["ORV ramps", "Planned"],
      ["Points of interest", "Planned"]
    ]
  }
};

const pageRoutes = {
  weather: "weather.html",
  tides: "tides.html",
  marine: "marine.html",
  cameras: "cameras.html",
  roads: "roads.html",
  ferry: "ferry.html",
  alerts: "alerts.html"
};

const dialog = document.getElementById("detailDialog");
const detailTitle = document.getElementById("detailTitle");
const detailBody = document.getElementById("detailBody");
const closeDialog = document.getElementById("closeDialog");
const communitySelect = document.getElementById("communitySelect");
const dashboardTitle = document.getElementById("dashboardTitle");

document.querySelectorAll(".module").forEach((button) => {
  button.addEventListener("click", () => {
    const moduleName = button.dataset.module;

    if (pageRoutes[moduleName]) {
      const community = communitySelect?.value || "Buxton";
      const query = moduleName === "weather" ? `?community=${encodeURIComponent(community)}` : "";
      window.location.href = `${pageRoutes[moduleName]}${query}`;
      return;
    }

    const data = moduleData[moduleName];
    if (!data) return;

    detailTitle.textContent = data.title;
    detailBody.innerHTML = `
      <div class="detail-grid">
        ${data.cards.map(([label, value]) => `
          <div class="detail-card">
            <strong>${label}</strong>
            <span>${value}</span>
          </div>
        `).join("")}
      </div>
      <div class="prototype-note">
        This module is still in development.
      </div>
    `;
    dialog.showModal();
  });
});

closeDialog.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside = (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
  if (!inside) dialog.close();
});

communitySelect.addEventListener("change", (event) => {
  dashboardTitle.textContent = event.target.value;
});
