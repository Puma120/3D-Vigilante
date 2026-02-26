export default function ConfirmDialog({ mensaje, onConfirm, onCancel }) {
  return (
    <div className="notif-overlay" onClick={onCancel}>
      <div
        className="notif-card"
        style={{ "--notif-acento": "#ef4444" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notif-icono" style={{ background: "#ef444422", color: "#ef4444" }}>
          !
        </div>
        <h3 className="notif-titulo">¿Estás seguro?</h3>
        <p className="notif-subtitulo">{mensaje}</p>
        <div className="confirm-actions">
          <button className="btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-primary" style={{ background: "#ef4444" }} onClick={onConfirm}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
