import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

const serverUrl = "/php/backend.php";

type DataRow = { id: number, nev: string, kategoria: string };

function App() {
  const [data, setData] = useState<DataRow[]>([]);
  
  const [updateFormState, setUpdateFormState] = useState<null | "create" | "update">(null);
  const [id, setId] = useState<string>("");
  const [nev, setNev] = useState<string>("");
  const [kategoria, setKategoria] = useState<string>("");


  async function _create(row: DataRow) {
    await axios.post(serverUrl, row);

    setData(d => [...d, row]);
  }

  async function _update(row: DataRow) {
    await axios.put(serverUrl, row);

    setData(d => {
      const r = d.find(v => v.id === row.id)!;
      r.nev = row.nev;
      r.kategoria = row.kategoria;
      return d;
    });
  }

  async function _delete(id: number) {
    await axios.delete(`${serverUrl}?id=${id}`);
  
    setData(d => {
      const i = d.findIndex(v => v.id === id);
      return d.splice(i, 1);
    });
  }

  async function handleCreateClick() {
    setId("");
    setNev("");
    setKategoria("");
    setUpdateFormState("create");
  }

  async function handleUpdateClick(item: DataRow) {
    setId(String(item.id));
    setNev(item.nev);
    setKategoria(item.kategoria);
    setUpdateFormState("update");
  }

  async function handleDeleteClick(item: DataRow) {
    await _delete(item.id);
    cAlert("success", "Sikeres adattörlés!");
  }

  
  async function handleUpdateFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!updateFormState) return;

    switch (updateFormState) {
      case 'create': {
        const _id = Number(id);
        const row = data.find(v => v.id === Number(_id));
        if (row) return cAlert("error", "A megadott ID már foglalt!");

        const _nev = nev.trim();
        if (_nev.length === 0) return cAlert("error", "Név mező kitöltése kötelező!");

        const _kategoria = kategoria.trim();
        if (_kategoria.length === 0) return cAlert("error", "Kategória mező kitöltése kötelező!");

        await _create({ id: _id, nev: _nev, kategoria: _kategoria });
        break;
      }
      case 'update': {
        const _nev = nev.trim();
        if (_nev.length === 0) return cAlert("error", "Név mező kitöltése kötelező!");

        const _kategoria = kategoria.trim();
        if (_kategoria.length === 0) return cAlert("error", "Kategória mező kitöltése kötelező!");

        await _update({ id: Number(id), nev: _nev, kategoria: _kategoria })
        break;
      }
      default: break;
    }

    cAlert("success", `Sikeres ${updateFormState === 'create' ? 'adatfelvétel' : 'módosítás'}!`)
    setUpdateFormState(null);
  }

  function handleUpdateFormCancel() {
    setUpdateFormState(null);
  }

  function cAlert(type: 'success' | 'info' | 'error', message: string) {
    const d = document.createElement("div");
    d.className = `alert ${type}`;
    d.textContent = message;
    document.body.append(d);
    setTimeout(() => d.remove(), 5000);
  }

  
  useEffect(() => {
    (async () => {
      const results = await axios.get(serverUrl);
      setData(results.data);
    })();
  }, []);


  return (
    <>
      <h1>React Axios CRUD - Szoftverek</h1>

      <form id="update-form" className={updateFormState == null ? "hidden" : ""} onSubmit={handleUpdateFormSubmit} onClick={(e) => e.target === e.currentTarget && handleUpdateFormCancel()}>
        <div className="container">
          <table id="update-table">
            <thead>
              <tr>
                <th colSpan={5}>Új adat hozzáadása</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="number" name="id" id="id" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required={true} disabled={updateFormState == "update"} />
                </td>
                <td>
                  <input type="text" name="nev" id="nev" placeholder="Név" value={nev} onChange={(e) => setNev(e.target.value)} required={true} />
                </td>
                <td>
                  <input type="text" name="kategoria" id="kategoria" placeholder="Kategória" value={kategoria} onChange={(e) => setKategoria(e.target.value)} required={true} />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="data-buttons">
            <button type='submit' className="green-btn">{updateFormState === "create" ? "Hozzáadás" : "Módosítás"}</button>
            <button type='button' className="red-btn" onClick={handleUpdateFormCancel}>Mégse</button>
          </div>
        </div>
      </form>

      <table id="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Kategória</th>
            <th>Műveletek</th>
          </tr>
          <tr>
            <td colSpan={4} className="new-data-row" onClick={() => handleCreateClick()}>+ Új adat felvétele</td>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => 
            <tr key={index}>
              <td>{row.id}</td>
              <td>{row.nev}</td>
              <td>{row.kategoria}</td>
              <td>
                <div id="data-index-${index}" className="data-buttons">
                  <button onClick={() => handleUpdateClick(row)}>Módosítás</button>
                  <button onClick={() => handleDeleteClick(row)} className="red-btn">Törlés</button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export default App