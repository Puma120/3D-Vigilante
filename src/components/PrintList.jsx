import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import PrintCard from "./PrintCard";

const FILTROS = ["todos", "imprimiendo", "completado", "cancelado"];

export default function PrintList() {
  const [impresiones, setImpresiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const q = query(collection(db, "impresiones"), orderBy("fecha", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const datos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setImpresiones(datos);
        setCargando(false);
      },
      (err) => {
        console.error("Error al escuchar la colección:", err);
        setError("No se pudo cargar la lista. Revisa la configuración de Firebase.");
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Cola FIFO: pendientes ordenados del más antiguo al más nuevo
  const cola = [...impresiones]
    .filter((imp) => imp.estado === "pendiente")
    .sort((a, b) => {
      const fechaA = a.fecha?.toDate ? a.fecha.toDate() : new Date(a.fecha);
      const fechaB = b.fecha?.toDate ? b.fecha.toDate() : new Date(b.fecha);
      return fechaA - fechaB;
    });

  const impresionesFiltradas = impresiones
    .filter((imp) => imp.estado !== "pendiente")
    .filter((imp) => {
      const coincideFiltro = filtro === "todos" || imp.estado === filtro;
      const coincideBusqueda =
        busqueda === "" ||
        imp.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        imp.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return coincideFiltro && coincideBusqueda;
    });

  if (cargando) {
    return <div className="estado-mensaje">Cargando registros...</div>;
  }

  if (error) {
    return <div className="estado-mensaje error">{error}</div>;
  }

  return (
    <div className="print-list-container">

      {/* ── Cola de impresión ── */}
      <section className="cola-section">
        <div className="cola-header">
          <h2 className="cola-titulo">Cola de impresión</h2>
          <span className="cola-badge">{cola.length} en espera</span>
        </div>

        {cola.length === 0 ? (
          <p className="cola-vacia">No hay impresiones en espera.</p>
        ) : (
          <div className="cola-scroll">
            {cola.map((imp, index) => (
              <div key={imp.id} className="cola-item-wrapper">
                <div className={`cola-posicion ${index === 0 ? "primero" : ""}`}>
                  {index === 0 ? "Siguiente" : `#${index + 1}`}
                </div>
                <PrintCard impresion={imp} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Historial ── */}
      <section>
        <h2 className="cola-titulo" style={{ marginBottom: "1rem" }}>Historial</h2>

        <div className="list-controls">
          <input
            type="text"
            className="buscador"
            placeholder="Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="filtros">
            {FILTROS.map((f) => (
              <button
                key={f}
                className={`btn-filtro ${filtro === f ? "activo" : ""}`}
                onClick={() => setFiltro(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {impresionesFiltradas.length === 0 ? (
          <div className="estado-mensaje">No hay registros que coincidan.</div>
        ) : (
          <div className="cards-grid">
            {impresionesFiltradas.map((imp) => (
              <PrintCard key={imp.id} impresion={imp} />
            ))}
          </div>
        )}

        <div className="list-stats">
          {impresionesFiltradas.length} registro{impresionesFiltradas.length !== 1 ? "s" : ""}
          {filtro !== "todos" && ` · filtro: ${filtro}`}
        </div>
      </section>
    </div>
  );
}
