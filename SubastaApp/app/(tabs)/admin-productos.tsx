import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";
import productoService, { ProductoResponse } from "@/models/services/productoService";

function ProductoCard({ item, onAprobado }: { item: ProductoResponse; onAprobado: () => void }) {
  const [precioBase, setPrecioBase] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

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

  return (
    <View style={s.card}>
      <Text style={s.cardTitle} numberOfLines={2}>{item.descripcionCompleta}</Text>
      {item.artista ? <Text style={s.cardMeta}>Artista: {item.artista}</Text> : null}
      {item.montoAsegurado != null ? (
        <Text style={s.cardMeta}>
          Valor pretendido: {item.monedaAsegurado ?? ""} ${item.montoAsegurado}
        </Text>
      ) : null}

      {confirming ? (
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
          <TouchableOpacity style={s.cancelBtn} onPress={() => { setConfirming(false); setError(null); }}>
            <Text style={s.cancelBtnText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={s.aprobarBtn} onPress={() => setConfirming(true)} activeOpacity={0.8}>
          <MaterialIcons name="check-circle" size={15} color="#111" />
          <Text style={s.aprobarBtnText}>APROBAR</Text>
        </TouchableOpacity>
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

export default function AdminProductosScreen() {
  const [pendientes, setPendientes] = useState<ProductoResponse[]>([]);
  const [aprobados, setAprobados] = useState<ProductoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const todos = await productoService.listarTodos();
      setPendientes(todos.filter((p) => p.estado === "PENDIENTE"));
      setAprobados(todos.filter((p) => p.estado === "ACEPTADO" || p.estado === "EN_SUBASTA"));
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(cargar);

  return (
    <ScreenLayout activeTab="admin-productos" paddingBottom={110}>
      <Text style={s.title}>PRODUCTOS PENDIENTES</Text>
      <Text style={s.subtitle}>Revisá y aprobá los artículos antes de agregarlos a un catálogo.</Text>

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
          <Text style={[s.title, { marginTop: 24, fontSize: 18 }]}>PRODUCTOS APROBADOS</Text>
          <Text style={s.subtitle}>Artículos listos para agregar a un catálogo.</Text>
          {aprobados.length === 0 ? (
            <Text style={s.empty}>No hay productos aprobados aún.</Text>
          ) : (
            <View style={s.list}>
              {aprobados.map((item) => (
                <View key={item.id} style={s.card}>
                  <Text style={s.cardTitle} numberOfLines={2}>{item.descripcionCompleta}</Text>
                  {item.artista ? <Text style={s.cardMeta}>Artista: {item.artista}</Text> : null}
                  {item.montoAsegurado != null ? (
                    <Text style={s.cardMeta}>Valor: {item.monedaAsegurado ?? ""} ${item.montoAsegurado}</Text>
                  ) : null}
                  <View style={[s.estadoPill, item.estado === "EN_SUBASTA" ? s.estadoEnSubasta : s.estadoAceptado]}>
                    <Text style={s.estadoText}>{item.estado === "EN_SUBASTA" ? "EN SUBASTA" : "APROBADO"}</Text>
                  </View>
                </View>
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
  aprobarBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.brightGold, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, marginTop: 10, alignSelf: "flex-start" },
  aprobarBtnText: { color: "#111", fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  errorText: { color: "#e74c3c", fontFamily: "serif", fontSize: 11, flex: 1 },
  estadoPill: { alignSelf: "flex-start", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 },
  estadoAceptado: { backgroundColor: "rgba(46,204,113,0.15)", borderColor: "#2ecc71", borderWidth: 1 },
  estadoEnSubasta: { backgroundColor: "rgba(52,152,219,0.15)", borderColor: "#3498db", borderWidth: 1 },
  estadoText: { fontFamily: "serif", fontSize: 10, fontWeight: "900", color: C.gold },
});
