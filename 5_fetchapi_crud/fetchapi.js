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
        deleteBtn.onclick = () => deleteData(row.id);
        buttons.appendChild(deleteBtn);

        tr.appendChild(buttons);
        tableBody.appendChild(tr);
    }
}

async function fetchData() {
    const response = await fetch("/php/backend.php");

    const result = await response.json();
    data.push(...result);

    refreshTable(data);
}

async function deleteData(id) {
    const response = await fetch(`/php/backend.php?id=${id}`, {
        method: "DELETE"
    });

    const result = await response.json();
    console.log(result);

    const idx = data.findIndex(v => v.id === id);
    data.splice(idx, 1);

    refreshTable(data);
}

fetchData();