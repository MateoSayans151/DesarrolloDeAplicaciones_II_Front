import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";
import productoService, { ProductoResponse } from "@/models/services/productoService";

function ProductoCard({ item, onAprobado }: { item: ProductoResponse; onAprobado: () => void }) {
  const [precioBase, setPrecioBase] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modo, setModo] = useState<null | "aprobar" | "rechazar">(null);

  const handleAprobar = async () => {
    const precio = parseFloat(precioBase.replace(",", "."));
    if (isNaN(precio) || precio <= 0) { setError("Ingresá un precio válido."); return; }
    setLoading(true);
    setError(null);
    try {
      await productoService.aprobar(item.id, precio);
      onAprobado();
    } catch (e: any) {
      setError(e.message ?? "No se pudo aprobar.");
    } finally {
      setLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!motivo.trim()) { setError("Ingresá un motivo."); return; }
    setLoading(true);
    setError(null);
    try {
      await productoService.rechazar(item.id, motivo.trim());
      onAprobado();
    } catch (e: any) {
      setError(e.message ?? "No se pudo rechazar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.card}>
      <Text style={s.cardTitle} numberOfLines={2}>{item.descripcionCompleta}</Text>
      {item.artista ? <Text style={s.cardMeta}>Artista: {item.artista}</Text> : null}
      {item.montoAsegurado != null ? (
        <Text style={s.cardMeta}>
          Valor pretendido: {item.monedaAsegurado ?? ""} ${item.montoAsegurado}
        </Text>
      ) : null}

      {modo === "aprobar" ? (
        <View style={s.approveRow}>
          <TextInput
            style={s.input}
            placeholder="Precio base..."
            placeholderTextColor="#3a5070"
            keyboardType="decimal-pad"
            value={precioBase}
            onChangeText={setPrecioBase}
          />
          <TouchableOpacity style={[s.confirmBtn, loading && { opacity: 0.5 }]} onPress={handleAprobar} disabled={loading}>
            {loading ? <ActivityIndicator color="#111" size="small" /> : <Text style={s.confirmBtnText}>OK</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={s.cancelBtn} onPress={() => { setModo(null); setError(null); }}>
            <Text style={s.cancelBtnText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : modo === "rechazar" ? (
        <View style={s.approveRow}>
          <TextInput
            style={s.input}
            placeholder="Motivo de rechazo..."
            placeholderTextColor="#3a5070"
            value={motivo}
            onChangeText={setMotivo}
          />
          <TouchableOpacity style={[s.rechazarConfirmBtn, loading && { opacity: 0.5 }]} onPress={handleRechazar} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.rechazarConfirmBtnText}>OK</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={s.cancelBtn} onPress={() => { setModo(null); setError(null); }}>
            <Text style={s.cancelBtnText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          <TouchableOpacity style={s.aprobarBtn} onPress={() => setModo("aprobar")} activeOpacity={0.8}>
            <MaterialIcons name="check-circle" size={15} color="#111" />
            <Text style={s.aprobarBtnText}>APROBAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.rechazarBtn} onPress={() => setModo("rechazar")} activeOpacity={0.8}>
            <MaterialIcons name="cancel" size={15} color="#fff" />
            <Text style={s.rechazarBtnText}>RECHAZAR</Text>
          </TouchableOpacity>
        </View>
      )}

      {error ? (
        <View style={s.errorRow}>
          <MaterialIcons name="error-outline" size={13} color="#e74c3c" />
          <Text style={s.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

function ProductoSimpleCard({ item, pillLabel, pillStyle, precio }: { item: ProductoResponse; pillLabel: string; pillStyle: any; precio?: number | null }) {
  return (
    <View style={s.card}>
      <Text style={s.cardTitle} numberOfLines={2}>{item.descripcionCompleta}</Text>
      {item.artista ? <Text style={s.cardMeta}>Artista: {item.artista}</Text> : null}
      {precio != null ? <Text style={s.cardMeta}>Precio acordado: ${precio}</Text> : null}
      <View style={[s.estadoPill, pillStyle]}>
        <Text style={s.estadoText}>{pillLabel}</Text>
      </View>
    </View>
  );
}

export default function AdminProductosScreen() {
  const [pendientes, setPendientes] = useState<ProductoResponse[]>([]);
  const [propuestasEnviadas, setPropuestasEnviadas] = useState<ProductoResponse[]>([]);
  const [listosParaCatalogo, setListosParaCatalogo] = useState<ProductoResponse[]>([]);
  const [enSubasta, setEnSubasta] = useState<ProductoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const todos = await productoService.listarTodos();
      setPendientes(todos.filter((p) => p.estado === "PENDIENTE_INSPECCION"));
      setPropuestasEnviadas(todos.filter((p) => p.estado === "PROPUESTA_ENVIADA"));
      setListosParaCatalogo(todos.filter((p) => p.estado === "ACEPTADO_POR_USUARIO"));
      setEnSubasta(todos.filter((p) => p.estado === "INCLUIDO_EN_SUBASTA"));
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  return (
    <ScreenLayout activeTab="admin-productos" paddingBottom={110}>
      <Text style={s.title}>PRODUCTOS PENDIENTES</Text>
      <Text style={s.subtitle}>Revisá, aprobá o rechazá los artículos antes de fijarles un precio.</Text>

      {loading ? (
        <ActivityIndicator color={C.gold} style={{ marginTop: 20 }} />
      ) : pendientes.length === 0 ? (
        <Text style={s.empty}>No hay productos pendientes de aprobación.</Text>
      ) : (
        <View style={s.list}>
          {pendientes.map((item) => (
            <ProductoCard key={item.id} item={item} onAprobado={cargar} />
          ))}
        </View>
      )}

      {!loading && (
        <>
          <Text style={[s.title, { marginTop: 24, fontSize: 18 }]}>PROPUESTA ENVIADA</Text>
          <Text style={s.subtitle}>Esperando que el vendedor acepte o rechace el precio propuesto.</Text>
          {propuestasEnviadas.length === 0 ? (
            <Text style={s.empty}>No hay propuestas esperando respuesta.</Text>
          ) : (
            <View style={s.list}>
              {propuestasEnviadas.map((item) => (
                <ProductoSimpleCard key={item.id} item={item} pillLabel="ESPERANDO RESPUESTA" pillStyle={s.estadoPropuesta} precio={item.precioPropuesto} />
              ))}
            </View>
          )}

          <Text style={[s.title, { marginTop: 24, fontSize: 18 }]}>LISTOS PARA CATÁLOGO</Text>
          <Text style={s.subtitle}>El vendedor aceptó el precio; se pueden agregar a un catálogo.</Text>
          {listosParaCatalogo.length === 0 ? (
            <Text style={s.empty}>No hay productos listos para agregar a un catálogo.</Text>
          ) : (
            <View style={s.list}>
              {listosParaCatalogo.map((item) => (
                <ProductoSimpleCard key={item.id} item={item} pillLabel="ACEPTADO POR USUARIO" pillStyle={s.estadoAceptado} precio={item.precioPropuesto} />
              ))}
            </View>
          )}

          <Text style={[s.title, { marginTop: 24, fontSize: 18 }]}>EN SUBASTA</Text>
          <Text style={s.subtitle}>Artículos ya incluidos en un catálogo/subasta.</Text>
          {enSubasta.length === 0 ? (
            <Text style={s.empty}>No hay productos en subasta aún.</Text>
          ) : (
            <View style={s.list}>
              {enSubasta.map((item) => (
                <ProductoSimpleCard key={item.id} item={item} pillLabel="EN SUBASTA" pillStyle={s.estadoEnSubasta} precio={item.precioPropuesto} />
              ))}
            </View>
          )}
        </>
      )}
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  title: { color: C.gold, fontFamily: "serif", fontSize: 22, fontWeight: "900", marginBottom: 4 },
  subtitle: { color: C.muted, fontFamily: "serif", fontSize: 12, marginBottom: 16, lineHeight: 18 },
  list: { gap: 10 },
  empty: { color: "#3a5070", fontFamily: "serif", fontSize: 14, textAlign: "center", marginTop: 20 },
  card: { backgroundColor: C.card, borderColor: C.blueLine, borderRadius: 14, borderWidth: 1, padding: 12 },
  cardTitle: { color: C.gold, fontFamily: "serif", fontSize: 14, fontWeight: "900", marginBottom: 4, lineHeight: 20 },
  cardMeta: { color: C.muted, fontFamily: "serif", fontSize: 12, marginBottom: 2 },
  approveRow: { flexDirection: "row", gap: 8, marginTop: 10, alignItems: "center" },
  input: { flex: 1, backgroundColor: "#050f1e", borderColor: "#0f2540", borderWidth: 1, borderRadius: 8, color: "#e5e2c6", fontFamily: "serif", fontSize: 13, paddingHorizontal: 10, height: 36 },
  confirmBtn: { backgroundColor: C.brightGold, borderRadius: 8, paddingHorizontal: 14, height: 36, alignItems: "center", justifyContent: "center" },
  confirmBtnText: { color: "#111", fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  cancelBtn: { borderColor: C.blueLine, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 36, alignItems: "center", justifyContent: "center" },
  cancelBtnText: { color: C.muted, fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  aprobarBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.brightGold, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, alignSelf: "flex-start" },
  aprobarBtnText: { color: "#111", fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  rechazarBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#c0392b", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, alignSelf: "flex-start" },
  rechazarBtnText: { color: "#fff", fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  rechazarConfirmBtn: { backgroundColor: "#c0392b", borderRadius: 8, paddingHorizontal: 14, height: 36, alignItems: "center", justifyContent: "center" },
  rechazarConfirmBtnText: { color: "#fff", fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  errorText: { color: "#e74c3c", fontFamily: "serif", fontSize: 11, flex: 1 },
  estadoPill: { alignSelf: "flex-start", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 },
  estadoPropuesta: { backgroundColor: "rgba(212,175,55,0.15)", borderColor: C.gold, borderWidth: 1 },
  estadoAceptado: { backgroundColor: "rgba(46,204,113,0.15)", borderColor: "#2ecc71", borderWidth: 1 },
  estadoEnSubasta: { backgroundColor: "rgba(52,152,219,0.15)", borderColor: "#3498db", borderWidth: 1 },
  estadoText: { fontFamily: "serif", fontSize: 10, fontWeight: "900", color: C.gold },
});
