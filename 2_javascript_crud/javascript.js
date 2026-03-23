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
    } catch (err) {
      this._state = DataStates.FAILED;
      console.error(err);
      cAlert("error", "Hiba történt az adatok feltöltése közben!");
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



class UpdateForm {
  _main;
  _table;
  _title;
  _inputs;
  _buttons;

  _updateIndex;

  constructor() {
    this._main = document.querySelector("#update-form");
    this._table = document.querySelector("#update-table");
    this._title = this._main.querySelector("th");
    

    this._inputs = {
      id: this._table.querySelector("input#id"),
      hely: this._table.querySelector("input#hely"),
      tipus: this._table.querySelector("input#tipus"),
      ipcim: this._table.querySelector("input#ipcim")
    };


    this._buttons = {
      create: this._main.querySelector("#button-create"),
      update: this._main.querySelector("#button-update"),
      cancel: this._main.querySelector("#button-cancel")
    };

    this._buttons.create.onclick = () => { this.onCreateClick() };
    this._buttons.update.onclick = () => { this.onUpdateClick() };
    this._buttons.cancel.onclick = () => { this.hide() };

    this._main.onclick = (e) => {
      if (e.target !== this._main) return;
      this.hide();
    }

    
    this._updateIndex = null;
    this._main.classList.add("hidden");
  }


  getValuesObject(oldId) {
    const id = Number(this._inputs.id.value.trim());
    const hely = this._inputs.hely.value.trim();
    const tipus = this._inputs.tipus.value.trim();
    const ipcim = this._inputs.ipcim.value.trim();

    if (id !== oldId && (isNaN(id) || data.get(id)))
      return "Hiba! Az [ID] mező kitöltése kötelező és egyedi szám kell legyen.";

    if (!hely || hely === "")
      return "Hiba! A [Hely] mező kitöltése kötelező!";

    if (!tipus || tipus === "")
      return "Hiba! A [Típus] mező kitöltése kötelező!";

    if (!ipcim || ipcim === "" || !/^\d+\.\d+\.\d+\.\d+$/.test(ipcim))
      return "Hiba! Az [IP-cím] mező kitöltése kötelező és IP-cím formátumú kell legyen!";

    return { id, hely, tipus, ipcim };
  }


  showCreateData() {
    Object.values(this._inputs).forEach(input => input.value = "");

    this._title.textContent = "Új adat hozzáadása";
    this._buttons.create.style.display = "block";
    this._buttons.update.style.display = "none";

    this._main.classList.remove("hidden");
  }

  onCreateClick() {
    const values = this.getValuesObject();
    if (typeof values === "string") return cAlert("error", values);

    data.create(values);
    data.render();

    window.scrollTo({ top: document.body.clientHeight, behavior: 'smooth' });
    this.hide();

    cAlert("success", "Sikeres adatfelvétel!")
  }


  showUpdateData(index) {
    const values = data.getByIndex(index);
    Object.keys(values).forEach(key => this._inputs[key].value = values[key]);

    this._title.textContent = "Adat módosítása";
    this._buttons.create.style.display = "none";
    this._buttons.update.style.display = "block";

    this._main.classList.remove("hidden");
    this._updateIndex = index;
  }

  onUpdateClick() {
    if (this._updateIndex === null) return;

    const oldValues = data.getByIndex(this._updateIndex);

    const values = this.getValuesObject(isNaN(oldValues.id) ? Infinity : oldValues.id);
    if (typeof values === "string") return cAlert("error", values);

    data.update(this._updateIndex, values);
    data.render();

    this._updateIndex = null;
    this.hide();

    cAlert("success", "Sikeres módosítás!")
  }


  hide() {
    this._main.classList.add("hidden");
  }
}



const data = new Data("gep.txt");
const form = new UpdateForm();


function cAlert(type, message) {
  const d = document.createElement("div");
  d.className = `alert ${type}`;
  d.textContent = message;
  document.body.append(d);
  setTimeout(() => d.remove(), 5000);
}

function onCreateClick() {
  form.showCreateData();
}

function onUpdateClick(index) {
  form.showUpdateData(index);
}

function onDeleteClick(index) {
  data.delete(index);
  data.render();
  cAlert("success", "Sikeres adattörlés!")
}


document.addEventListener("DOMContentLoaded", () => {
  data.render();
});