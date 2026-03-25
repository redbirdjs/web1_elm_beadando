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
        deleteBtn.className = "delete-btn";
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

async function createData() {
    const nev = document.getElementById("nev");
    const kategoria = document.getElementById("kategoria");

    const response = await fetch("/php/backend.php", {
        method: "post",
        body: JSON.stringify({
            nev: nev.value,
            kategoria: kategoria.value
        })
    });

    const { result } = await response.json();
    data.push(result);

    nev.value = "";
    kategoria.value = "";
    refreshTable(data);
}

function changeToModify(id) {
    const idx = data.findIndex(v => v.id === id);
    const rows = document.querySelectorAll("#data-rows tr");
    const row = rows[idx];

    const cols = row.children;
    const nevInput = document.createElement("input");
    nevInput.type = "text";
    nevInput.value = cols[1].textContent;

    const kategoriaInput = document.createElement("input");
    kategoriaInput.type = "text";
    kategoriaInput.value = cols[2].textContent;

    cols[1].innerHTML = '';
    cols[1].appendChild(nevInput);
    cols[2].innerHTML = '';
    cols[2].appendChild(kategoriaInput);

    const confirmButton = cols[3].children[0];
    confirmButton.innerHTML = "Megerősítés";
    confirmButton.onclick = () => modifyData(id, { nev: nevInput.value, kategoria: kategoriaInput.value });
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