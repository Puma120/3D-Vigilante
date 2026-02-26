const CONFIGS = {
  registrado: {
    acento: "#10b981",
    icono: "✓",
    titulo: "¡Impresión registrada!",
    mensajes: [
      "Al terminar tu impresión, recuerda levantar toda tu basura: soportes, rebabas y cualquier pieza que haya quedado en la placa.",
      "Antes de empezar, revisa que la impresora esté en buen estado y lista para usarse.",
    ],
  },
  completado: {
    acento: "#10b981",
    icono: "✓",
    titulo: "¡Impresión completada!",
    mensajes: [
      "No olvides recoger tu pieza y levantar toda tu basura de la placa: soportes, rebabas y material sobrante.",
      "Revisa que la impresora haya quedado en buen estado para que el siguiente alumno pueda usarla sin problema.",
    ],
  },
  cancelado: {
    acento: "#f59e0b",
    icono: "!",
    titulo: "Impresión cancelada",
    mensajes: [
      "Revisa con cuidado que la impresora esté bien y no haya ningún daño.",
      "Avisa a Puma o al Profesor Rafael para que inspeccionen la impresora antes de que alguien más la use.",
      "No olvides retirar tu impresión y dejar todo limpio.",
    ],
  },
};

export default function Notificacion({ tipo, onClose }) {
  const config = CONFIGS[tipo];
  if (!config) return null;

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div
        className="notif-card"
        style={{ "--notif-acento": config.acento }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notif-icono" style={{ background: config.acento + "22", color: config.acento }}>
          {config.icono}
        </div>
        <h3 className="notif-titulo">{config.titulo}</h3>
        <ul className="notif-mensajes">
          {config.mensajes.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
        <button className="btn-primary notif-btn" onClick={onClose} style={{ background: config.acento }}>
          Entendido
        </button>
      </div>
    </div>
  );
}
