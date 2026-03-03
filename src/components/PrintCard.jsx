import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
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

export default function PrintCard({ impresion, onNotif, hayImprimiendo }) {
  const { id, nombre, descripcion, filamento, notas, estado, fecha } = impresion;
  const [confirmar, setConfirmar] = useState(false);
  const [bloqueo, setBloqueo] = useState(false);

  const cambiarEstado = async (nuevoEstado) => {
    try {
      await updateDoc(doc(db, "impresiones", id), { estado: nuevoEstado });
      if ((nuevoEstado === "completado" || nuevoEstado === "cancelado") && onNotif) {
        onNotif(nuevoEstado);
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

  const handleIniciar = () => {
    if (hayImprimiendo) {
      setBloqueo(true);
    } else {
      cambiarEstado("imprimiendo");
    }
  };

  return (
    <>
      {confirmar && (
        <ConfirmDialog
          mensaje={`Se eliminará el registro de "${nombre}" de forma permanente.`}
          onConfirm={confirmarEliminar}
          onCancel={() => setConfirmar(false)}
        />
      )}
      {bloqueo && (
        <div className="notif-overlay" onClick={() => setBloqueo(false)}>
          <div
            className="notif-card"
            style={{ "--notif-acento": "#f59e0b" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notif-icono" style={{ background: "#f59e0b22", color: "#f59e0b" }}>!</div>
            <h3 className="notif-titulo">Impresora ocupada</h3>
            <p className="notif-subtitulo">
              Solo puede haber una pieza imprimiendo a la vez. Completa o cancela la impresión actual antes de iniciar otra.
            </p>
            <div className="confirm-actions">
              <button className="btn-primary" onClick={() => setBloqueo(false)}>Entendido</button>
            </div>
          </div>
        </div>
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
          {estado === "pendiente" && (
            <button className="btn-accion btn-iniciar" onClick={handleIniciar}>
              Iniciar impresión
            </button>
          )}
          {estado === "imprimiendo" && (
            <>
              <button className="btn-accion btn-completar" onClick={() => cambiarEstado("completado")}>
                Completado
              </button>
              <button className="btn-accion btn-cancelar-accion" onClick={() => cambiarEstado("cancelado")}>
                Cancelado
              </button>
            </>
          )}
          <button className="btn-delete" onClick={handleEliminar} aria-label="Eliminar">
            Eliminar
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
