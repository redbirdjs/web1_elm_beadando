import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

type DataRow = { id: number, nev: string, kategoria: string };

function App() {
  const [data, setData] = useState<DataRow[]>([]);
  
  const [updateFormState, setUpdateFormState] = useState<null | "create" | "update">(null);
  const [id, setId] = useState<string>("");
  const [nev, setNev] = useState<string>("");
  const [kategoria, setKategoria] = useState<string>("");


  async function _create(data: DataRow) {}

  async function _update(data: DataRow) {}

  async function _delete(id: number) {}

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
  }

  
  async function handleUpdateFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!updateFormState) return;

    switch (updateFormState) {
      case 'create':
        
        break;

      case 'update':
        
        break;

      default:
        break;
    }
  }

  
  useEffect(() => {
    (async () => {
      setData(() => [
        { id: 1, nev: "AIR", kategoria: "plug-in" },
        { id: 2, nev: "FastStone Image Viewer", kategoria: "képkezelés" }
      ])
    })();
  }, []);


  return (
    <>
      <h1>React Axios CRUD - Szoftverek</h1>

      <form id="update-form" className={updateFormState == null ? "hidden" : ""} onSubmit={handleUpdateFormSubmit}>
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
            <button type='submit' className="green-btn">{updateFormState == "create" ? "Hozzáadás" : "Módosítás"}</button>
            <button type='button' className="red-btn">Mégse</button>
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
              <td>{row.kategoria}</td>
              <td>{row.nev}</td>
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