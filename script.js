
const jsPDF = window.jspdf.jsPDF;

let entries = [];

window.updateWeekday = function () {
  const val = document.getElementById("date").value;
  if (!val) return;
  const d = new Date(val);
  const days = ['日','月','火','水','木','金','土'];
  document.getElementById("weekday").value = days[d.getDay()];
};

window.autoFillCompany = function () {
  const map = {
    "5001": "清和建設株式会社",
    "5009": "株式会社古田配管工業所"
  };
  const permit = document.getElementById("permit").value;
  document.getElementById("company").value = map[permit] || "";
};

window.addEntry = function () {
  const row = [
    document.getElementById("date").value,
    document.getElementById("weekday").value,
    document.getElementById("weather").value,
    document.getElementById("permit").value,
    document.getElementById("company").value,
    document.getElementById("plate").value,
    document.getElementById("type").value,
    document.getElementById("count").value,
    (parseInt(document.getElementById("count").value) * 6).toFixed(1)
  ];
  entries.push(row);
  const tbody = document.getElementById("table-body");
  const tr = document.createElement("tr");
  row.forEach(val => {
    const td = document.createElement("td");
    td.textContent = val;
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
};

window.downloadPDF = function () {
  const doc = new jsPDF();
  doc.addFileToVFS("NotoSansJP-Regular.ttf", "AAEAAAALAIAAAwAwT1MvMg8SBTkAAAC8...");
  doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
  doc.setFont("NotoSansJP", "normal");
  doc.setFontSize(12);
  doc.text("日報PDF出力テスト", 10, 10);
  entries.forEach((e, i) => {
    doc.text(e.join(" / "), 10, 20 + i * 10);
  });
  doc.save("日報テスト.pdf");
};
