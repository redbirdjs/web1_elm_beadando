import {useState, useEffect} from 'react';
import './App.css'

function App() {
  const [id, setId] = useState('');
  const [nev, setNev] = useState('');
  const [kategoria, setKategoria] = useState('');
  const [modifyIndex, setModifyIndex] = useState<number | undefined>(undefined);
  const [modifyData, setModifyData] = useState<string[]>([]);

  const [items, setItems] = useState<string[]>([]);

  const addItem = (e: any) => {
    e.preventDefault(); // alapértelmezett form action megállítása

    setItems(() => [...items, `${id}\t${nev}\t${kategoria}`]); // új elem hozzáadása a lista végéhez
  }

  // módosításhoz adatok beállítása state-ekbe
  const handleUpdateClick = (index: number) => {
    setModifyData(items[index].split('\t'));
    setModifyIndex(index);
  }

  const handleModifyUpdate = (idx: number, value: string) => {
    const newData = [...modifyData];
    newData[idx] = value;
    setModifyData(newData);
  }

  const closeModifyForm = () => {
    setModifyIndex(undefined);
  }

  // elem módosítása
  const updateItem = (e: any, index: number) => {
    e.preventDefault();

    const newItems = [...items];
    newItems[index] = modifyData.join('\t');
    setItems(() => newItems);
    setModifyIndex(undefined);
  }

  // elem törlése
  const deleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);

    setItems(() => newItems);
  }

  // adatok betöltése txt fájlból egy tömbbe
  useEffect(() => {
    (async() => {
      const response = await fetch('/szoftver.txt');

      const data = (await response.text()).split('\n');
      data.splice(0, 1); // első sor törlése
      setItems(() => data);
    })();
  }, []);

  return (
      <>
        {
            modifyIndex !== undefined &&
            <section className={"modify-form"}>
              <div>
                <div className={"modify-form-header"}>
                  <h1>Adatok módosítás</h1>
                  <button className={"modify-form-close"} onClick={closeModifyForm} title={"Ablak bezárása"}>X</button>
                </div>
                <form>
                  <div className={"form-item"}>
                    <label>Id</label>
                    <input type="number" id={"id"} name={"id"} value={modifyData[0]} onChange={(e) => handleModifyUpdate(0, e.target.value)} required />
                  </div>
                  <div className={"form-item"}>
                    <label>Név</label>
                    <input type="text" id={"nev"} name={"nev"} value={modifyData[1]} onChange={(e) => handleModifyUpdate(1, e.target.value)} required />
                  </div>
                  <div className={"form-item"}>
                    <label>Kategória</label>
                    <input type="text" id={"kategoria"} name={"kategoria"} value={modifyData[2]} onChange={(e) => handleModifyUpdate(2, e.target.value)} required />
                  </div>
                  <input type={"submit"} onClick={(e) => updateItem(e, modifyIndex)} className={"btn modify-btn"} value={"Módosítás"} />
                </form>
              </div>
            </section>
        }
        <main>
          <h1>React CRUD - Szoftverek</h1>
          <section>
            <form className={"add-form"}>
              <div className={"form-item"}>
                <label>Id</label>
                <input type="number" id={"id"} name={"id"} value={id} onChange={(e) => setId(e.target.value)} required />
              </div>
              <div className={"form-item"}>
                <label>Név</label>
                <input type="text" id={"nev"} name={"nev"} value={nev} onChange={(e) => setNev(e.target.value)} required />
              </div>
              <div className={"form-item"}>
                <label>Kategória</label>
                <input type="text" id={"kategoria"} name={"kategoria"} value={kategoria} onChange={(e) => setKategoria(e.target.value)} required />
              </div>
              <input type={"submit"} onClick={addItem} className={"btn add-btn last"} value={"Hozzáadás"} />
            </form>
          </section>
          <section>
            <h2>Adatok</h2>
            <table>
              <thead>
                <tr>
                  <th>Id</th><th>Név</th><th>Kategória</th><th>Műveletek</th>
                </tr>
              </thead>
              <tbody id={"table-body"}>
                {
                  items.length != 0 ?
                      items.map((item, index) => {
                        const data = item.split('\t');

                        return (
                            <tr key={index}>
                              <td>{data[0]}</td>
                              <td>{data[1]}</td>
                              <td>{data[2]}</td>
                              <td>
                                <div className={"row-actions"}>
                                  <button className={"btn"} onClick={() => handleUpdateClick(index)}>Módosítás</button>
                                  <button className={"btn delete"} onClick={() => deleteItem(index)}>Törlés</button>
                                </div>
                              </td>
                            </tr>
                        )
                      })
                      : <tr><td colSpan={4} className={"empty-table"}>A lista üres.</td></tr>
                }
              </tbody>
            </table>
          </section>
        </main>
      </>
  )
}

export default App
