
const jsPDF = window.jspdf.jsPDF;

let permitToCompany = {};
fetch("permit_list.json").then(res => res.json()).then(data => {
  permitToCompany = data;
});

function autoFillCompany() {
  const permit = document.getElementById("permit").value;
  document.getElementById("company").value = permitToCompany[permit] || "";
}

function updateWeekday() {
  const val = document.getElementById("date").value;
  if (!val) return;
  const d = new Date(val);
  const wd = ['日','月','火','水','木','金','土'][d.getDay()];
  document.getElementById("weekday").value = wd;
}

let entries = [];
let currentMonthFilter = "2025-05";
let currentDayFilter = "";

function addEntry() {
  const row = [
    document.getElementById("date").value,
    document.getElementById("weekday").value,
    document.getElementById("weather").value,
    document.getElementById("permit").value,
    document.getElementById("company").value,
    `札幌 ${document.getElementById("plate_num1").value}${document.getElementById("plate_kana").value}${document.getElementById("plate_num2").value}`,
    document.getElementById("type").value,
    parseInt(document.getElementById("count").value),
    (parseInt(document.getElementById("count").value) * 6.0).toFixed(1)
  ];
  entries.push(row);
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";
  entries.forEach((row, i) => {
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
    btn.onclick = () => { entries.splice(i,1); renderTable(); };
    td.appendChild(btn);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
}

function downloadPDF() {
  const doc = new jsPDF();
  doc.addFileToVFS("NotoSansJP-Regular.ttf", "AAEAAAALAIAAAwAwT1MvMg8SBTkAAAC8");
  doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
  doc.setFont("NotoSansJP", "normal");
  doc.text("テストPDF出力：日本語表示OK", 10, 10);
  doc.save("test.pdf");
}

window.onload = () => {
  renderTable();
};
