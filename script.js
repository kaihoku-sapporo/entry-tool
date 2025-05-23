
const months = ["2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11"];
let entries = JSON.parse(localStorage.getItem("entries") || "[]");
let currentMonthFilter = "2025-05";
let currentDayFilter = "";

let permitToCompany = {};
fetch("permit_list.json").then(res => res.json()).then(data => { permitToCompany = data; });

function autoFillCompany() {
  const permit = document.getElementById("permit").value;
  document.getElementById("company").value = permitToCompany[permit] || "";
}

function updateWeekday() {
  const dateVal = document.getElementById("date").value;
  if (!dateVal) return;
  const date = new Date(dateVal);
  const days = ['日','月','火','水','木','金','土'];
  document.getElementById("weekday").value = days[date.getDay()];
}

function getCubicMeter(type, count) {
  const rates = { "10t": 6.0, "8t": 5.0, "4t": 2.0 };
  return rates[type] * count;
}

function saveToLocal() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function addEntry() {
  const date = document.getElementById("date").value;
  if (!date) return;
  const row = [
    date,
    document.getElementById("weekday").value,
    document.getElementById("weather").value,
    document.getElementById("permit").value,
    document.getElementById("company").value,
    `札幌 ${document.getElementById("plate_num1").value}${document.getElementById("plate_kana").value}${document.getElementById("plate_num2").value}`,
    document.getElementById("type").value,
    parseInt(document.getElementById("count").value),
    getCubicMeter(document.getElementById("type").value, parseInt(document.getElementById("count").value)).toFixed(1)
  ];
  entries.push(row);
  saveToLocal();
  renderTabs();
  renderTable();
}

function renderTabs() {
  const monthTab = document.getElementById("month-tabs");
  const dayTab = document.getElementById("day-tabs");
  monthTab.innerHTML = "";
  dayTab.innerHTML = "";
  months.forEach(month => {
    const btn = document.createElement("button");
    btn.textContent = month.split('-')[1] + "月";
    btn.className = "tab-btn";
    if (month === currentMonthFilter) btn.classList.add("active");
    btn.onclick = () => { currentMonthFilter = month; currentDayFilter = ""; renderTabs(); renderTable(); };
    monthTab.appendChild(btn);
  });
  const days = [...new Set(entries.map(e => e[0]).filter(d => d.startsWith(currentMonthFilter)))];
  days.forEach(date => {
    const btn = document.createElement("button");
    btn.textContent = date.split("-")[2] + "日";
    btn.className = "tab-btn";
    if (date === currentDayFilter) btn.classList.add("active");
    btn.onclick = () => { currentDayFilter = date; renderTabs(); renderTable(); };
    dayTab.appendChild(btn);
  });
}

function clearDayFilter() {
  currentDayFilter = "";
  renderTabs();
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";
  entries.forEach((row, i) => {
    const [date] = row;
    if (date.startsWith(currentMonthFilter) && (currentDayFilter === "" || date === currentDayFilter)) {
      const tr = document.createElement("tr");
      row.forEach(val => {
        const td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
      });
      const td = document.createElement("td");
      const btn = document.createElement("span");
      btn.textContent = "削除";
      btn.style.color = "blue";
      btn.style.cursor = "pointer";
      btn.onclick = () => {
        entries.splice(i, 1);
        saveToLocal();
        renderTabs();
        renderTable();
      };
      td.appendChild(btn);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  });
}

function downloadCSV() {
  let csv = "日付,曜日,天気,許可番号,搬入社名,車番,車種,台数,立米数\n";
  entries.forEach(e => {
    if (e[0]) csv += e.join(",") + "\n";
  });
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = new Date().toISOString().slice(0, 10) + "_搬入記録.csv";
  link.click();
}

window.onload = () => {
  renderTabs();
  renderTable();
};
