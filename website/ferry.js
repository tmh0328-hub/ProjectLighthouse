const EXPANDED_SCHEDULE = [
  "05:00","06:00","07:00","08:00","08:30","09:00","10:00","10:30","11:00","11:30","12:00","13:00","13:30","14:00","14:30","15:00","16:00","16:30","17:00","17:30","18:00","19:30","20:00","21:00","23:00","24:00"
];

const REDUCED_SCHEDULE = [
  "05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","20:00","21:00","23:00","24:00"
];

function minutesFromMidnight(value) {
  const [hour, minute] = value.split(":").map(Number);
  return (hour === 24 ? 1440 : hour * 60) + minute;
}

function formatTime(value) {
  const [hourValue, minute] = value.split(":").map(Number);
  const hour = hourValue === 24 ? 0 : hourValue;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2,"0")} ${suffix}`;
}

function getScheduleForDate(date) {
  const year = date.getFullYear();
  const expandedStart = new Date(year, 2, 31);
  const expandedEnd = new Date(year, 9, 19, 23, 59, 59);
  if (date >= expandedStart && date <= expandedEnd) {
    return { name: "Expanded schedule", dates: "Mar 31–Oct 19", times: EXPANDED_SCHEDULE };
  }
  return { name: "Reduced schedule", dates: "Oct 20–Dec 31", times: REDUCED_SCHEDULE };
}

function updateFerryPage() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const schedule = getScheduleForDate(now);
  const departures = schedule.times.map((time) => ({ time, minutes: minutesFromMidnight(time) }));
  const next = departures.find((departure) => departure.minutes >= currentMinutes);

  document.getElementById("seasonBadge").textContent = `${schedule.name} · ${schedule.dates}`;
  document.getElementById("scheduleHeading").textContent = `${now.toLocaleDateString(undefined,{weekday:"long"})} departures`;

  if (next) {
    const difference = next.minutes - currentMinutes;
    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;
    document.getElementById("nextDeparture").textContent = formatTime(next.time);
    document.getElementById("countdown").textContent = difference === 0 ? "Departing now" : `Departs in ${hours ? `${hours} hr ` : ""}${minutes} min`;
    document.getElementById("serviceNote").textContent = "Scheduled departure based on the published 2026 timetable.";
  } else {
    document.getElementById("nextDeparture").textContent = "5:00 AM";
    document.getElementById("countdown").textContent = "First departure tomorrow";
    document.getElementById("serviceNote").textContent = "Today's published departures have finished.";
  }

  document.getElementById("scheduleGrid").innerHTML = departures.map((departure) => {
    const classes = ["departure"];
    if (departure.minutes < currentMinutes) classes.push("past");
    if (next && departure.time === next.time) classes.push("next");
    return `<div class="${classes.join(" ")}">${formatTime(departure.time)}</div>`;
  }).join("");
}

updateFerryPage();
setInterval(updateFerryPage, 30000);
