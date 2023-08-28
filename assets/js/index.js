const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const displayTable = document.querySelector(".displaySection table tbody");


document.addEventListener("DOMContentLoaded", () => {
  loadTableData();
});

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.type === "application/vnd.ms-excel" || file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = function (event) {
        const filename = file.name;
        const date = getCurrentDate();
        const fileContent = event.target.result; // This is the content of the file

        addRowToTable(filename, date);
        saveDataToLocalStorage(filename, date, fileContent); // Save filename, date, and content
      };
      reader.readAsText(file);
    } else {
      console.log("Please upload a valid CSV file");
    }
  }
});


function addRowToTable(filename, date) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${filename}</td>
    <td>${date}</td>
    <td onclick="location.href ='/${filename}'"><i class="fa-solid fa-eye"></i></td>
  `;
  displayTable.appendChild(newRow);
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

function loadTableData() {
  const storedData = JSON.parse(localStorage.getItem("tableData")) || [];
  storedData.forEach(({ filename, date }) => {
    addRowToTable(filename, date);
  });
}

function saveDataToLocalStorage(filename, date, content) {
  const storedData = JSON.parse(localStorage.getItem("tableData")) || [];
  storedData.push({ filename, date });
  localStorage.setItem("tableData", JSON.stringify(storedData));

  // Now, save the content associated with the filename in local storage
  localStorage.setItem(filename, content);
}
