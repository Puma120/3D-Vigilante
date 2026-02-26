import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Notificacion from "./Notificacion";
import ConfirmDialog from "./ConfirmDialog";

const ESTADOS = [
  { value: "pendiente", label: "Pendiente", color: "#f59e0b" },
  { value: "imprimiendo", label: "Imprimiendo", color: "#3b82f6" },
  { value: "completado", label: "Completado", color: "#10b981" },
  { value: "cancelado", label: "Cancelado", color: "#ef4444" },
];

function getBadgeStyle(estado) {
  const found = ESTADOS.find((e) => e.value === estado);
  return {
    backgroundColor: found ? found.color + "22" : "#e5e7eb",
    color: found ? found.color : "#6b7280",
    border: `1px solid ${found ? found.color : "#d1d5db"}`,
  };
}

function formatFecha(timestamp) {
  if (!timestamp) return "—";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PrintCard({ impresion }) {
  const { id, nombre, descripcion, filamento, notas, estado, fecha } = impresion;
  const [notif, setNotif] = useState(null);
  const [confirmar, setConfirmar] = useState(false);

  const handleEstadoChange = async (e) => {
    const nuevoEstado = e.target.value;
    try {
      await updateDoc(doc(db, "impresiones", id), { estado: nuevoEstado });
      if (nuevoEstado === "completado" || nuevoEstado === "cancelado") {
        setNotif(nuevoEstado);
      }
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  const handleEliminar = () => {
    setConfirmar(true);
  };

  const confirmarEliminar = async () => {
    setConfirmar(false);
    try {
      await deleteDoc(doc(db, "impresiones", id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <>
      {notif && <Notificacion tipo={notif} onClose={() => setNotif(null)} />}
      {confirmar && (
        <ConfirmDialog
          mensaje={`Se eliminará el registro de "${nombre}" de forma permanente.`}
          onConfirm={confirmarEliminar}
          onCancel={() => setConfirmar(false)}
        />
      )}
      <div className={`print-card estado-${estado}`}>
      <div className="card-header">
        <div className="card-meta">
          <span className="card-nombre">{nombre}</span>
          <span className="card-fecha">{formatFecha(fecha)}</span>
        </div>
        <span className="badge" style={getBadgeStyle(estado)}>
          {ESTADOS.find((e) => e.value === estado)?.label ?? estado}
        </span>
      </div>

      <p className="card-descripcion">{descripcion}</p>

      <div className="card-footer">
        <span className="filamento-tag">
          {filamento === "propio" ? "Filamento propio" : "Filamento del salón"}
        </span>

        {notas && (
          <p className="card-notas">
            <strong>Notas:</strong> {notas}
          </p>
        )}

        <div className="card-actions">
          <select
            className="estado-select"
            value={estado}
            onChange={handleEstadoChange}
            aria-label="Cambiar estado"
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          <button className="btn-delete" onClick={handleEliminar} aria-label="Eliminar">
            Eliminar
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
