const checkedTime = document.getElementById("checkedTime");

if (checkedTime) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  checkedTime.textContent = `Page opened ${formatter.format(new Date())} ET`;
}
