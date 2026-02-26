import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Notificacion from "./Notificacion";

const estadoInicial = {
  nombre: "",
  descripcion: "",
  filamento: "salon",
  notas: "",
};

export default function PrintForm({ onClose }) {
  const [form, setForm] = useState(estadoInicial);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [notif, setNotif] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre.trim() || !form.descripcion.trim()) {
      setError("El nombre y la descripción son obligatorios.");
      return;
    }

    setCargando(true);
    try {
      await addDoc(collection(db, "impresiones"), {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        filamento: form.filamento,
        notas: form.notas.trim(),
        estado: "pendiente",
        fecha: serverTimestamp(),
      });
      setForm(estadoInicial);
      setNotif(true);
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Error al guardar el registro. Revisa la configuración de Firebase.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {notif && (
        <Notificacion tipo="registrado" onClose={() => { setNotif(false); if (onClose) onClose(); }} />
      )}
      <div className="form-overlay">
      <div className="form-card">
        <div className="form-header">
          <h2>Nueva Impresión</h2>
          {onClose && (
            <button className="btn-close" onClick={onClose} aria-label="Cerrar">
              ✕
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="print-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del alumno *</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="¿Quién va a imprimir?"
              value={form.nombre}
              onChange={handleChange}
              disabled={cargando}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">¿Qué vas a imprimir? *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describe el objeto a imprimir (nombre, tamaño, para qué sirve, etc.)"
              value={form.descripcion}
              onChange={handleChange}
              disabled={cargando}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Filamento</label>
            <div className="radio-group">
              <label className={`radio-option ${form.filamento === "salon" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="filamento"
                  value="salon"
                  checked={form.filamento === "salon"}
                  onChange={handleChange}
                  disabled={cargando}
                />
                Del salón
              </label>
              <label className={`radio-option ${form.filamento === "propio" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="filamento"
                  value="propio"
                  checked={form.filamento === "propio"}
                  onChange={handleChange}
                  disabled={cargando}
                />
                Propio
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notas">Notas adicionales</label>
            <textarea
              id="notas"
              name="notas"
              placeholder="Cualquier dato extra relevante (opcional)"
              value={form.notas}
              onChange={handleChange}
              disabled={cargando}
              rows={2}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={cargando}>
            {cargando ? "Guardando..." : "Registrar impresión"}
          </button>
        </form>
      </div>
      </div>
    </>
  );
}
