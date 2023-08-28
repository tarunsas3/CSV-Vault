const displayTableBody = document.querySelector(
  ".fileDisplaySection table tbody"
);
const searchInput = document.getElementById("searchInput");
let currentSortColumn = null;
let isSortAscending = true;

document.addEventListener("DOMContentLoaded", () => {
  loadFileData(); // Load file data when the page is loaded
  searchInput.addEventListener("input", handleSearch);
});

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const allRows = displayTableBody.querySelectorAll("tr");

  allRows.forEach((row) => {
    const rowText = row.textContent.toLowerCase();
    if (rowText.includes(searchTerm) || searchTerm === "") {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
}

function loadFileData() {
  const fileContent = localStorage.getItem(location.href.split("/")[3]);
  if (fileContent) {
    const rows = parseCSV(fileContent);
    const columnHeaders = rows[0];
    const dataRows = rows.slice(1);

    addTableHeaders(columnHeaders);
    addTableRows(dataRows);
    handleSearch(); // Add this line to initially show all rows
  }
}

function addTableHeaders(columnHeaders) {
  const tableHead = document.querySelector(".fileDisplaySection table thead");
  const headerRow = document.createElement("tr");

  columnHeaders.forEach((header, columnIndex) => {
    const th = document.createElement("th");
    th.textContent = header;

    const sortButton = document.createElement("button");
    sortButton.textContent = "Sort";
    sortButton.classList.add("sort-button");
    sortButton.addEventListener("click", () => handleColumnSort(columnIndex));
    
    th.appendChild(sortButton);
    headerRow.appendChild(th);
  });

  tableHead.appendChild(headerRow);
}

function addTableRows(dataRows) {
  dataRows.forEach((rowData) => {
    const row = document.createElement("tr");
    rowData.forEach((cellData) => {
      const td = document.createElement("td");
      td.textContent = cellData;
      row.appendChild(td);
    });
    displayTableBody.appendChild(row);
  });
}

function parseCSV(csvContent) {
  const lines = csvContent.split("\n");
  const rows = lines.map((line) => line.split(","));
  return rows;
}

function handleColumnSort(columnIndex) {
  const allRows = Array.from(displayTableBody.querySelectorAll("tr"));
  const dataType = detectDataType(allRows[0].children[columnIndex].textContent);

  allRows.sort((rowA, rowB) => {
    const cellA = rowA.children[columnIndex].textContent;
    const cellB = rowB.children[columnIndex].textContent;

    const sortButtons = document.querySelectorAll(".sort-button");
    sortButtons.forEach((button, index) => {
      if (index === columnIndex) {
        button.textContent = isSortAscending ? "↑" : "↓";
      } else {
        button.textContent = "Sort";
      }
    });

    if (dataType === "numeric") {
      return (isSortAscending ? 1 : -1) * (Number(cellA) - Number(cellB));
    } else {
      return (isSortAscending ? 1 : -1) * cellA.localeCompare(cellB);
    }
  });

  isSortAscending = !isSortAscending;
  currentSortColumn = columnIndex;

  allRows.forEach((row) => displayTableBody.appendChild(row));
}

function detectDataType(value) {
  return isNaN(value) ? "text" : "numeric";
}
