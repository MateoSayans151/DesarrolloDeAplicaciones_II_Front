import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";
import subastaService, { SubastaResponse } from "@/models/services/subastaService";
import catalogoService, { CatalogoDetalleResponse } from "@/models/services/catalogoService";
import productoService, { ProductoResponse } from "@/models/services/productoService";

const COMISION_DEFAULT = 10;

// ─── Selector de subasta ──────────────────────────────────────────────────────

function SubastaSelector({
  subastas,
  selected,
  onSelect,
}: {
  subastas: SubastaResponse[];
  selected: SubastaResponse | null;
  onSelect: (s: SubastaResponse) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={s.selectorWrap}>
      <Text style={s.sectionLabel}>SELECCIONÁ UNA SUBASTA</Text>
      <TouchableOpacity style={s.selectorBtn} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={selected ? s.selectorText : s.selectorPlaceholder} numberOfLines={1}>
          {selected
            ? `Subasta #${selected.id} — ${selected.fecha} — ${selected.estado.toUpperCase()}`
            : "Elegí una subasta para gestionar su catálogo…"}
        </Text>
        <MaterialIcons name="expand-more" size={18} color={C.gold} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={s.overlay} onPress={() => setOpen(false)} activeOpacity={1}>
          <View style={s.dropdown}>
            <Text style={s.dropdownTitle}>SUBASTAS</Text>
            {subastas.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={s.dropdownItem}
                onPress={() => { onSelect(sub); setOpen(false); }}
                activeOpacity={0.8}
              >
                <View style={[s.dot, { backgroundColor: sub.estado === "abierta" ? "#4cdf8a" : "#555" }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.dropdownText}>Subasta #{sub.id}</Text>
                  <Text style={s.dropdownMeta}>{sub.fecha} · {sub.estado.toUpperCase()} · {sub.categoria}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function AdminCatalogosScreen() {
  const params = useLocalSearchParams<{ subastaId?: string }>();

  const [subastas, setSubastas] = useState<SubastaResponse[]>([]);
  const [selected, setSelected] = useState<SubastaResponse | null>(null);

  // Estado del catálogo de la subasta seleccionada
  const [catalogo, setCatalogo] = useState<CatalogoDetalleResponse | null>(null);
  const [sinCatalogo, setSinCatalogo] = useState(false);

  // Productos disponibles para agregar
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoResponse[]>([]);

  // Formulario crear catálogo
  const [descripcion, setDescripcion] = useState("");
  const [creandoCatalogo, setCreandoCatalogo] = useState(false);
  const [errorCatalogo, setErrorCatalogo] = useState<string | null>(null);

  // Estado de carga
  const [loadingSubastas, setLoadingSubastas] = useState(true);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Agregar / quitar producto
  const [agregando, setAgregando] = useState<number | null>(null); // id del producto que se está agregando
  const [quitando, setQuitando] = useState<number | null>(null);   // id del item que se está quitando
  const [errorAgregar, setErrorAgregar] = useState<string | null>(null);

  // ── Carga inicial de subastas ──────────────────────────────────────────────

  const cargarSubastas = useCallback(async () => {
    setLoadingSubastas(true);
    try {
      const data = await subastaService.listarTodas();
      const ordenadas = data.sort((a, b) => b.id - a.id);
      setSubastas(ordenadas);

      // Pre-seleccionar si viene parámetro en la URL
      if (params.subastaId) {
        const id = parseInt(params.subastaId);
        const found = ordenadas.find((s) => s.id === id);
        if (found) cargarDetalle(found);
      }
    } finally {
      setLoadingSubastas(false);
    }
  }, [params.subastaId]);

  useFocusEffect(cargarSubastas);

  // ── Cargar detalle del catálogo al seleccionar subasta ────────────────────

  const cargarDetalle = async (sub: SubastaResponse) => {
    setSelected(sub);
    setCatalogo(null);
    setSinCatalogo(false);
    setErrorCatalogo(null);
    setErrorAgregar(null);
    setLoadingDetalle(true);

    try {
      const [det, todos] = await Promise.all([
        catalogoService.obtenerDetallePorSubasta(sub.id).catch((e) => {
          // 404 = no hay catálogo todavía
          if (e?.message?.includes("404") || e?.message?.includes("no encontrado") || e?.message?.toLowerCase().includes("not found")) {
            return null;
          }
          throw e;
        }),
        productoService.listarTodos(),
      ]);

      if (det === null) {
        setSinCatalogo(true);
        setProductosDisponibles(todos.filter((p) => p.estado === "ACEPTADO"));
      } else {
        setCatalogo(det);
        const enCatalogo = new Set(det.items.map((i) => i.producto.id));
        setProductosDisponibles(todos.filter((p) => p.estado === "ACEPTADO" && !enCatalogo.has(p.id)));
      }
    } catch (e: any) {
      setErrorCatalogo(e?.message ?? "Error al cargar el catálogo.");
    } finally {
      setLoadingDetalle(false);
    }
  };

  // ── Crear catálogo ────────────────────────────────────────────────────────

  const handleCrearCatalogo = async () => {
    if (!selected) return;
    if (!descripcion.trim()) { setErrorCatalogo("Ingresá una descripción."); return; }
    setCreandoCatalogo(true);
    setErrorCatalogo(null);
    try {
      await catalogoService.crearAdmin({ descripcion: descripcion.trim(), subasta: selected.id });
      setDescripcion("");
      // Recargar para obtener el catálogo recién creado
      await cargarDetalle(selected);
    } catch (e: any) {
      setErrorCatalogo(e?.message ?? "Error al crear el catálogo.");
    } finally {
      setCreandoCatalogo(false);
    }
  };

  // ── Quitar producto del catálogo ─────────────────────────────────────────

  const handleQuitar = async (itemId: number) => {
    if (!catalogo) return;
    setQuitando(itemId);
    setErrorAgregar(null);
    try {
      await catalogoService.removerItem(catalogo.id, itemId);
      await cargarDetalle(selected!);
    } catch (e: any) {
      setErrorAgregar(e?.message ?? "No se pudo quitar el producto.");
    } finally {
      setQuitando(null);
    }
  };

  // ── Agregar producto al catálogo ──────────────────────────────────────────

  const handleAgregar = async (producto: ProductoResponse) => {
    if (!catalogo) return;
    setAgregando(producto.id);
    setErrorAgregar(null);
    try {
      await catalogoService.agregarItemAdmin(catalogo.id, {
        producto: producto.id,
        precioBase: producto.montoAsegurado ?? 0,
        comision: COMISION_DEFAULT,
      });
      // Refrescar catálogo y lista de disponibles
      await cargarDetalle(selected!);
    } catch (e: any) {
      setErrorAgregar(e?.message ?? "No se pudo agregar el producto.");
    } finally {
      setAgregando(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ScreenLayout activeTab="admin-catalogos" paddingBottom={110}>
      <Text style={s.title}>CATÁLOGOS</Text>

      {/* Selector de subasta */}
      {loadingSubastas ? (
        <ActivityIndicator color={C.gold} style={{ marginTop: 20 }} />
      ) : (
        <SubastaSelector subastas={subastas} selected={selected} onSelect={cargarDetalle} />
      )}

      {/* Loading del catálogo */}
      {loadingDetalle && <ActivityIndicator color={C.gold} style={{ marginTop: 20 }} />}

      {/* Error general */}
      {errorCatalogo ? (
        <View style={s.errorBox}>
          <MaterialIcons name="error-outline" size={14} color="#e74c3c" />
          <Text style={s.errorText}>{errorCatalogo}</Text>
        </View>
      ) : null}

      {/* Sin catálogo → formulario para crear */}
      {!loadingDetalle && sinCatalogo && selected && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Esta subasta no tiene catálogo</Text>
          <Text style={s.cardMeta}>Creá uno para poder agregarle productos.</Text>
          <TextInput
            style={[s.input, { marginTop: 12 }]}
            placeholder="Descripción del catálogo (ej: Obras de arte moderno)"
            placeholderTextColor="#3a5070"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <TouchableOpacity
            style={[s.primaryBtn, creandoCatalogo && { opacity: 0.5 }]}
            onPress={handleCrearCatalogo}
            disabled={creandoCatalogo}
            activeOpacity={0.8}
          >
            {creandoCatalogo
              ? <ActivityIndicator color="#111" size="small" />
              : <Text style={s.primaryBtnText}>CREAR CATÁLOGO</Text>
            }
          </TouchableOpacity>
        </View>
      )}

      {/* Catálogo existente */}
      {!loadingDetalle && catalogo && (
        <>
          {/* Header del catálogo */}
          <View style={s.catalogoHeader}>
            <MaterialIcons name="list-alt" size={16} color={C.gold} />
            <View style={{ flex: 1 }}>
              <Text style={s.catalogoNombre}>{catalogo.descripcion}</Text>
              <Text style={s.catalogoMeta}>Catálogo #{catalogo.id} · {catalogo.items.length} producto{catalogo.items.length !== 1 ? "s" : ""}</Text>
            </View>
          </View>

          {/* Productos en el catálogo */}
          {catalogo.items.length > 0 ? (
            <View style={s.section}>
              <Text style={s.sectionLabel}>EN EL CATÁLOGO</Text>
              {catalogo.items.map((item) => (
                <View key={item.id} style={s.itemRow}>
                  <MaterialIcons name="check-circle" size={16} color="#4cdf8a" />
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemDesc} numberOfLines={2}>{item.producto.descripcionCompleta}</Text>
                    {item.producto.artista ? <Text style={s.itemMeta}>Artista: {item.producto.artista}</Text> : null}
                    <Text style={s.itemMeta}>Precio base: ${item.precioBase}</Text>
                  </View>
                  <TouchableOpacity
                    style={[s.quitarBtn, quitando === item.id && { opacity: 0.4 }]}
                    onPress={() => handleQuitar(item.id)}
                    disabled={quitando !== null || agregando !== null}
                    activeOpacity={0.8}
                  >
                    {quitando === item.id
                      ? <ActivityIndicator color="#e74c3c" size="small" />
                      : <MaterialIcons name="remove-circle-outline" size={20} color="#e74c3c" />
                    }
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={s.emptyHint}>El catálogo está vacío. Agregá productos desde abajo.</Text>
          )}

          {/* Divider */}
          <View style={s.divider} />

          {/* Productos disponibles para agregar */}
          <Text style={s.sectionLabel}>PRODUCTOS APROBADOS DISPONIBLES</Text>
          {errorAgregar ? (
            <View style={s.errorBox}>
              <MaterialIcons name="error-outline" size={14} color="#e74c3c" />
              <Text style={s.errorText}>{errorAgregar}</Text>
            </View>
          ) : null}
          {productosDisponibles.length === 0 ? (
            <Text style={s.emptyHint}>No hay productos aprobados para agregar.</Text>
          ) : (
            productosDisponibles.map((p) => (
              <View key={p.id} style={s.productoRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.itemDesc} numberOfLines={2}>{p.descripcionCompleta}</Text>
                  {p.artista ? <Text style={s.itemMeta}>Artista: {p.artista}</Text> : null}
                  {p.montoAsegurado != null
                    ? <Text style={s.itemMeta}>Precio base: {p.monedaAsegurado ?? ""} ${p.montoAsegurado}</Text>
                    : <Text style={[s.itemMeta, { color: "#e67e22" }]}>Sin precio base cargado</Text>
                  }
                </View>
                <TouchableOpacity
                  style={[s.agregarBtn, agregando === p.id && { opacity: 0.5 }]}
                  onPress={() => handleAgregar(p)}
                  disabled={agregando !== null}
                  activeOpacity={0.8}
                >
                  {agregando === p.id
                    ? <ActivityIndicator color="#111" size="small" />
                    : <><MaterialIcons name="add" size={16} color="#111" /><Text style={s.agregarBtnText}>AGREGAR</Text></>
                  }
                </TouchableOpacity>
              </View>
            ))
          )}
        </>
      )}
    </ScreenLayout>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  title: { color: C.gold, fontFamily: "serif", fontSize: 22, fontWeight: "900", marginBottom: 16 },
  sectionLabel: { color: C.muted, fontFamily: "serif", fontSize: 11, fontWeight: "900", letterSpacing: 1.5, marginBottom: 8 },
  selectorWrap: { marginBottom: 20 },
  selectorBtn: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.card, borderColor: C.blueLine, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  selectorText: { color: "#e5e2c6", fontFamily: "serif", fontSize: 13, flex: 1 },
  selectorPlaceholder: { color: "#3a5070", fontFamily: "serif", fontSize: 13, flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", padding: 20 },
  dropdown: { backgroundColor: "#07162b", borderColor: C.blueLine, borderWidth: 1, borderRadius: 14, overflow: "hidden", maxHeight: 400 },
  dropdownTitle: { color: C.gold, fontFamily: "serif", fontSize: 12, fontWeight: "900", letterSpacing: 2, padding: 14, borderBottomColor: C.blueLine, borderBottomWidth: 1 },
  dropdownItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderBottomColor: C.blueLine, borderBottomWidth: 1 },
  dropdownText: { color: "#e5e2c6", fontFamily: "serif", fontSize: 14, fontWeight: "700" },
  dropdownMeta: { color: C.muted, fontFamily: "serif", fontSize: 11, marginTop: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  card: { backgroundColor: C.card, borderColor: C.blueLine, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 14 },
  cardTitle: { color: C.gold, fontFamily: "serif", fontSize: 15, fontWeight: "900", marginBottom: 4 },
  cardMeta: { color: C.muted, fontFamily: "serif", fontSize: 12 },
  input: { backgroundColor: "#050f1e", borderColor: "#0f2540", borderWidth: 1, borderRadius: 10, color: "#e5e2c6", fontFamily: "serif", fontSize: 13, paddingHorizontal: 12, paddingVertical: 10 },
  primaryBtn: { backgroundColor: C.brightGold, borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 12, flexDirection: "row", justifyContent: "center", gap: 6 },
  primaryBtnText: { color: "#111", fontFamily: "serif", fontSize: 13, fontWeight: "900" },
  catalogoHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: C.card, borderColor: C.gold, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  catalogoNombre: { color: "#e5e2c6", fontFamily: "serif", fontSize: 15, fontWeight: "700" },
  catalogoMeta: { color: C.muted, fontFamily: "serif", fontSize: 11, marginTop: 2 },
  section: { marginBottom: 14 },
  itemRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 10, borderBottomColor: C.blueLine, borderBottomWidth: 1 },
  itemDesc: { color: "#e5e2c6", fontFamily: "serif", fontSize: 13, fontWeight: "700", lineHeight: 18 },
  itemMeta: { color: C.muted, fontFamily: "serif", fontSize: 11, marginTop: 2 },
  itemPrecio: { color: C.gold, fontFamily: "serif", fontSize: 13, fontWeight: "900", minWidth: 60, textAlign: "right" },
  emptyHint: { color: "#3a5070", fontFamily: "serif", fontSize: 13, textAlign: "center", paddingVertical: 12 },
  divider: { height: 1, backgroundColor: C.blueLine, marginVertical: 16 },
  productoRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: C.card, borderColor: C.blueLine, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 },
  agregarBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.brightGold, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, minWidth: 90, justifyContent: "center" },
  agregarBtnText: { color: "#111", fontFamily: "serif", fontSize: 11, fontWeight: "900" },
  quitarBtn: { padding: 4, justifyContent: "center", alignItems: "center" },
  errorBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "rgba(231,76,60,0.1)", borderColor: "#e74c3c", borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 },
  errorText: { color: "#e74c3c", fontFamily: "serif", fontSize: 12, flex: 1 },
});
