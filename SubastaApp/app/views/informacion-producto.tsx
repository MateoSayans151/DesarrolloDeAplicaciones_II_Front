import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";
import productoService, { ProductoResponse } from "@/models/services/productoService";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDIENTE:  { label: "En revisión",  color: "#d4af37" },
  ACEPTADO:   { label: "Publicado",    color: "#2ecc71" },
  RECHAZADO:  { label: "Rechazado",    color: "#e74c3c" },
  DEVUELTO:   { label: "Devuelto",     color: "#e67e22" },
  EN_SUBASTA: { label: "En subasta",   color: "#3498db" },
  VENDIDO:    { label: "Vendido",      color: "#9b59b6" },
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

export default function InformacionProductoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [producto, setProducto] = useState<ProductoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    productoService.obtener(Number(id))
      .then(setProducto)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <ScreenLayout activeTab="productos">
        <ActivityIndicator color={C.gold} style={{ marginTop: 40 }} />
      </ScreenLayout>
    );
  }

  if (!producto) {
    return (
      <ScreenLayout activeTab="productos">
        <Text style={s.empty}>No se pudo cargar el producto.</Text>
      </ScreenLayout>
    );
  }

  const status = STATUS_MAP[producto.estado] ?? { label: producto.estado, color: C.gold };

  return (
    <ScreenLayout activeTab="productos">
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
        <MaterialIcons name="chevron-left" size={22} color={C.gold} />
        <Text style={s.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={s.card}>
        <View style={s.statusRow}>
          <View style={[s.dot, { backgroundColor: status.color }]} />
          <Text style={[s.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
        <Text style={s.title}>{producto.descripcionCompleta}</Text>
      </View>

      {producto.fotos && producto.fotos.length > 0 && (
        <>
          <Text style={s.sectionTitle}>FOTOS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {producto.fotos.map((b64, i) => (
                <Image
                  key={i}
                  source={{ uri: `data:image/jpeg;base64,${b64}` }}
                  style={s.foto}
                />
              ))}
            </View>
          </ScrollView>
        </>
      )}

      <Text style={s.sectionTitle}>INFORMACIÓN BÁSICA</Text>
      <View style={s.infoCard}>
        <Row label="Artista / Diseñador" value={producto.artista ?? producto.disenador} />
        <Row label="Historia" value={producto.historia} />
        <Row label="Ubicación de depósito" value={producto.ubicacionDeposito} />
      </View>

      <Text style={s.sectionTitle}>FINANZAS Y SEGURO</Text>
      <View style={s.infoCard}>
        <Row label="Aseguradora" value={producto.aseguradora} />
        <Row label="Póliza de seguro" value={producto.polizaSeguro} />
        <Row label="Monto asegurado" value={producto.montoAsegurado != null ? `${producto.monedaAsegurado ?? ""} $${producto.montoAsegurado}`.trim() : null} />
      </View>

      <Text style={s.sectionTitle}>DECLARACIONES</Text>
      <View style={s.infoCard}>
        <View style={s.row}>
          <MaterialIcons name={producto.origenLicitoDeclarado ? "check-circle" : "cancel"} size={18} color={producto.origenLicitoDeclarado ? "#2ecc71" : "#e74c3c"} />
          <Text style={s.rowValue}>Origen lícito declarado</Text>
        </View>
        <View style={s.row}>
          <MaterialIcons name={producto.propietarioDeclarado ? "check-circle" : "cancel"} size={18} color={producto.propietarioDeclarado ? "#2ecc71" : "#e74c3c"} />
          <Text style={s.rowValue}>Propietario declarado</Text>
        </View>
        {producto.motivoRechazo ? (
          <View style={s.motivoWrap}>
            <Text style={s.motivoLabel}>Motivo de rechazo:</Text>
            <Text style={s.motivoText}>{producto.motivoRechazo}</Text>
          </View>
        ) : null}
      </View>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backText: { color: C.gold, fontFamily: "serif", fontSize: 16, fontWeight: "700" },
  card: { backgroundColor: C.card, borderColor: C.blueLine, borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 18 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontFamily: "serif", fontSize: 13, fontWeight: "800" },
  title: { color: C.gold, fontFamily: "serif", fontSize: 17, fontWeight: "900", lineHeight: 22 },
  sectionTitle: { color: C.brightGold, fontFamily: "serif", fontSize: 13, fontWeight: "900", letterSpacing: 1.5, marginBottom: 8, marginTop: 4 },
  infoCard: { backgroundColor: C.card, borderColor: C.blueLine, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 16, gap: 8 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  rowLabel: { color: C.muted, fontFamily: "serif", fontSize: 13, minWidth: 130 },
  rowValue: { color: C.gold, fontFamily: "serif", fontSize: 13, flex: 1 },
  motivoWrap: { marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: C.blueLine },
  motivoLabel: { color: "#e74c3c", fontFamily: "serif", fontSize: 12, fontWeight: "800", marginBottom: 4 },
  motivoText: { color: C.muted, fontFamily: "serif", fontSize: 13, lineHeight: 18 },
  empty: { color: C.muted, fontFamily: "serif", fontSize: 14, textAlign: "center", marginTop: 40 },
  foto: { width: 140, height: 140, borderRadius: 10, backgroundColor: "#202f3a" },
});
