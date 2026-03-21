class DataStates {
  static WAITING = 1;
  static LOADED = 2;
  static FAILED = 3;
}

class Data {
  _state = DataStates.WAITING;
  _data = [];
  _tbody;

  constructor(fileName) {
    this._readData(fileName);
  }

  async _readData(fileName) {
    this._state = DataStates.WAITING

    try {
      const response = await fetch(fileName);
      const data = await response.text();
  
      const rows = data.split("\n")
      rows.forEach((row, index) => {
        if (index == 0) return;
        const fields = row.split("\t")
  
        this._data.push({
          id: Number(fields[0]) || -1,
          hely: fields[1],
          tipus: fields[2],
          ipcim: fields[3]
        });
      });
  
      this._state = DataStates.LOADED;
      console.log(this._data);
    } catch (err) {
      this._state = DataStates.FAILED;
      console.error(err);
    }
  }

  async render() {
    while (this._state === DataStates.WAITING)
      await new Promise(resolve => setTimeout(resolve, 100));

    if (this._state === DataStates.FAILED) return;

    if (!this._tbody)
      this._tbody = document.querySelector("#data-table tbody");

    this._tbody.innerHTML = "";

    this._data.forEach((row, index) => {
      const tr = document.createElement("tr");
      this._tbody.appendChild(tr)
   
      Object.values(row).forEach(value => {
        const td = document.createElement("td");
        td.innerText = value;
        tr.appendChild(td);
      })

      const buttons = document.createElement("td");
      tr.appendChild(buttons);

      buttons.innerHTML = `
        <div id="data-index-${index}" class="data-buttons">
          <button onclick="onUpdateClick(${index})">Módosítás</button>
          <button onclick="onDeleteClick(${index})" class="red-btn">Törlés</button>
        </div>
      `
    })
  }

  create(values) {
    if (this._state !== DataStates.LOADED) return;
    this._data.push(values);
  }

  update(index, newValues) {
    if (this._state !== DataStates.LOADED) return;
    this._data[index] = newValues;
  }

  delete(index) {
    if (this._state !== DataStates.LOADED) return;
    this._data.splice(index, 1);
  }

  get(id) {
    for (let i = 0; i < this._data.length; i++) {
      const element = this._data[i];
      if (element.id === id)
        return element;
    }

    return null;
  }

  getByIndex(index) {
    return this._data[index];
  }
}

const data = new Data("gep.txt");

const idInput = document.querySelector("#update-table input#id");
const helyInput = document.querySelector("#update-table input#hely");
const tipusInput = document.querySelector("#update-table input#tipus");
const ipcimInput = document.querySelector("#update-table input#ipcim");

const utableTitle = document.getElementById("update-table-title");
const createBtn = document.getElementById("button-create");
const updateBtn = document.getElementById("button-update");


function getDataFromUpdateTable() {
  const id = idInput.value.trim();
  const hely = helyInput.value.trim();
  const tipus = tipusInput.value.trim();
  const ipcim = ipcimInput.value.trim();

  if (!id || id === "" || isNaN(id) || data.get(id))
    return "Hibás ID!";

  if (!hely || hely === "")
    return "Hibás hely!";

  if (!tipus || tipus === "")
    return "Hibás típus!";

  if (!ipcim || ipcim === "" || !/^\d+\.\d+\.\d+\.\d+$/.test(ipcim))
    return "Hibás IP-cím!";

  return { id, hely, tipus, ipcim };
}

function clearUpdateTable() {
  idInput.value = "";
  helyInput.value = "";
  tipusInput.value = "";
  ipcimInput.value = "";
}


function onCreateClick() {
  const values = getDataFromUpdateTable();
  if (typeof values === "string") return console.warn(values);

  data.create(values);
  data.render();

  clearUpdateTable();
  window.scrollTo({ top: document.body.clientHeight, behavior: 'smooth' });
}


let updateIndex = null;

function onUpdateClick(index) {
  utableTitle.textContent = "Adat módosítása";
  updateBtn.style.display = "block";
  createBtn.style.display = "none";

  const values = data.getByIndex(index);

  idInput.value = values.id;
  helyInput.value = values.hely;
  tipusInput.value = values.tipus;
  ipcimInput.value = values.ipcim;

  updateIndex = index;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onConfirmUpdateClick() {
  if (!updateIndex) return;

  const values = getDataFromUpdateTable();
  if (typeof values === "string") return console.warn(values);

  data.update(updateIndex, values);
  data.render();

  clearUpdateTable();
  utableTitle.textContent = "Új adat hozzáadása";
  updateBtn.style.display = "none";
  createBtn.style.display = "block";
  
  const element = document.getElementById(`data-index-${updateIndex}`)
  const position = element.getBoundingClientRect();
  window.scrollTo({ top: position.top + window.scrollY - window.innerHeight/2, behavior: 'smooth' });
  
  updateIndex = null;
}


function onDeleteClick(index) {
  data.delete(index);
  data.render();

  clearUpdateTable();
  utableTitle.textContent = "Új adat hozzáadása";
  updateBtn.style.display = "none";
  createBtn.style.display = "block";

  updateIndex = null;
}


document.addEventListener("DOMContentLoaded", () => {
  data.render();
});