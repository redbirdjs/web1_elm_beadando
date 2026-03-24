const data = [];
const tableBody = document.getElementById("data-rows");

function refreshTable(data) {
    tableBody.innerHTML = "";
    for (const row of data) {
        const tr = document.createElement("tr");
        for (const key in row) {
            const td = document.createElement("td");
            td.textContent = row[key];
            tr.appendChild(td);
        }

        const buttons = document.createElement("td");
        const modifyBtn = document.createElement("button");
        modifyBtn.innerHTML = "Módosítás";
        buttons.appendChild(modifyBtn);
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Törlés";
        buttons.appendChild(deleteBtn);

        tr.appendChild(buttons);
        tableBody.appendChild(tr);
    }
}

