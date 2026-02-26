import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import PrintCard from "./PrintCard";

const FILTROS = ["todos", "pendiente", "imprimiendo", "completado", "cancelado"];

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

  const impresionesFiltradas = impresiones.filter((imp) => {
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
        <div className="estado-mensaje">
          {impresiones.length === 0
            ? "No hay impresiones registradas todavía."
            : "No hay impresiones que coincidan con la búsqueda."}
        </div>
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
    </div>
  );
}
