import { useState } from "react";
import PrintList from "./components/PrintList";
import PrintForm from "./components/PrintForm";
import "./App.css";

export default function App() {
  const [mostrarForm, setMostrarForm] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <div>
              <h1>Vigilante 3D </h1>
              <p>Registro de impresiones 3D del salón</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setMostrarForm(true)}>
            + Nueva impresión
          </button>
        </div>
      </header>

      <main className="app-main">
        <PrintList />
      </main>

      {mostrarForm && <PrintForm onClose={() => setMostrarForm(false)} />}
    </div>
  );
}
