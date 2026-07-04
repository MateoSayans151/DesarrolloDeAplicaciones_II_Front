import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";
import productoService, { ProductoResponse } from "@/models/services/productoService";
import subastaService, { SubastaResponse } from "@/models/services/subastaService";
import usuarioService from "@/models/services/usuarioService";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDIENTE_INSPECCION:  { label: "En inspección",         color: "#d4af37" },
  RECHAZADO:             { label: "Rechazado",             color: "#e74c3c" },
  PROPUESTA_ENVIADA:     { label: "Propuesta recibida",    color: "#3498db" },
  ACEPTADO_POR_USUARIO:  { label: "Precio aceptado",       color: "#2ecc71" },
  RECHAZADO_POR_USUARIO: { label: "Rechazaste el precio",  color: "#95a5a6" },
  INCLUIDO_EN_SUBASTA:   { label: "En subasta",            color: "#9b59b6" },
};

function ProductCard({ item, onInfo, onDelete }: { item: ProductoResponse; onInfo: () => void; onDelete: () => void }) {
  const status = STATUS_MAP[item.estado] ?? { label: item.estado, color: C.gold };
  const esPendiente = item.estado === "PENDIENTE_INSPECCION";
  const [confirming, setConfirming] = useState(false);

  return (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.descripcionCompleta}
        </Text>
        {item.artista ? (
          <Text style={styles.productDescription} numberOfLines={1}>
            {item.artista}
          </Text>
        ) : null}

        {confirming ? (
          <View style={styles.confirmRow}>
            <Text style={styles.confirmText}>¿Eliminar este producto?</Text>
            <TouchableOpacity style={styles.confirmYes} onPress={() => { setConfirming(false); onDelete(); }}>
              <Text style={styles.confirmYesText}>SÍ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmNo} onPress={() => setConfirming(false)}>
              <Text style={styles.confirmNoText}>NO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productFooter}>
            <View style={styles.statusPill}>
              <View style={[styles.statusDot, { backgroundColor: status.color }]} />
              <Text style={styles.statusText}>{status.label}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {esPendiente && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => setConfirming(true)}>
                  <MaterialIcons name="delete-outline" size={14} color="#fff" />
                  <Text style={styles.deleteButtonText}>ELIMINAR</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.smallButton} activeOpacity={0.82} onPress={onInfo}>
                <Text style={styles.smallButtonText}>+ Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function SubastaCard({ item }: { item: SubastaResponse }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.subastaCard}
      activeOpacity={0.82}
      onPress={() => router.push(`/views/SubastaElegida?id=${item.id}` as any)}
    >
      <View style={styles.subastaInfo}>
        <Text style={styles.subastaTitle}>Subasta #{item.id}</Text>
        <Text style={styles.subastaMeta}>{item.fecha} · {item.categoria}</Text>
        {item.ubicacion ? <Text style={styles.subastaMeta}>{item.ubicacion}</Text> : null}
      </View>
      <View style={[styles.estadoPill, item.estado === "abierta" ? styles.estadoAbierta : styles.estadoCerrada]}>
        <Text style={styles.estadoText}>{item.estado.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ProductosScreen() {
  const router = useRouter();
  const [productos, setProductos] = useState<ProductoResponse[]>([]);
  const [subastas, setSubastas] = useState<SubastaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const usuario = await usuarioService.getUsuarioLocal();
      if (!usuario) return;
      const [prods, subs] = await Promise.all([
        productoService.listarMisProductos(usuario.id),
        subastaService.listarAsistencias(usuario.id),
      ]);
      setProductos(prods);
      setSubastas(subs);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleEliminar = async (id: number) => {
    try {
      await productoService.eliminar(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo eliminar el producto.");
    }
  };

  return (
    <ScreenLayout activeTab="productos">
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MIS PRODUCTOS</Text>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => router.push("/views/ofrecer-articulo" as any)}
        >
          <MaterialIcons name="add" size={22} color="#111111" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={C.gold} style={{ marginVertical: 20 }} />
      ) : productos.length === 0 ? (
        <Text style={styles.emptyText}>No tenés productos cargados aún.</Text>
      ) : (
        <View style={styles.list}>
          {productos.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onInfo={() => router.push(`/views/informacion-producto?id=${item.id}` as any)}
              onDelete={() => handleEliminar(item.id)}
            />
          ))}
        </View>
      )}

      <View style={[styles.sectionHeader, styles.secondSection]}>
        <Text style={styles.sectionTitle}>MIS SUBASTAS</Text>
      </View>

      {!loading && subastas.length === 0 ? (
        <Text style={styles.emptyText}>No estás inscripto en ninguna subasta.</Text>
      ) : (
        <View style={styles.list}>
          {subastas.map((item) => (
            <SubastaCard key={item.id} item={item} />
          ))}
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 10, paddingLeft: 10 },
  secondSection: { marginTop: 18 },
  sectionTitle: { color: C.gold, fontFamily: "serif", fontSize: 20, fontWeight: "900", textAlign: "left" },
  addButton: { alignItems: "center", backgroundColor: C.brightGold, borderRadius: 15, height: 30, justifyContent: "center", width: 30 },
  list: { gap: 10 },
  emptyText: { color: "#4a6a80", fontFamily: "serif", fontSize: 14, textAlign: "center", paddingVertical: 16 },
  productCard: { backgroundColor: C.card, borderColor: C.blueLine, borderRadius: 15, borderWidth: 1, minHeight: 80, padding: 12 },
  productInfo: { flex: 1 },
  cardTitleRow: { alignItems: "center", flexDirection: "row" },
  cardTitle: { color: C.gold, flex: 1, fontFamily: "serif", fontSize: 15, fontWeight: "900" },
  deleteBtn: { padding: 4 },
  productDescription: { color: C.muted, fontFamily: "serif", fontSize: 13, lineHeight: 17, marginTop: 2 },
  productFooter: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  statusPill: { alignItems: "center", borderColor: C.line, borderRadius: 11, borderWidth: 1, flexDirection: "row", height: 22, paddingHorizontal: 8 },
  statusDot: { borderRadius: 4, height: 8, marginRight: 5, width: 8 },
  statusText: { color: C.gold, fontFamily: "serif", fontSize: 12, fontWeight: "800" },
  smallButton: { alignItems: "center", backgroundColor: C.brightGold, borderRadius: 11, height: 24, justifyContent: "center", paddingHorizontal: 10 },
  smallButtonText: { color: "#111111", fontFamily: "serif", fontSize: 13, fontWeight: "900" },
  deleteButton: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#c0392b", borderRadius: 11, height: 24, paddingHorizontal: 8 },
  deleteButtonText: { color: "#fff", fontFamily: "serif", fontSize: 11, fontWeight: "900" },
  confirmRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  confirmText: { color: C.muted, fontFamily: "serif", fontSize: 12, flex: 1 },
  confirmYes: { backgroundColor: "#c0392b", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  confirmYesText: { color: "#fff", fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  confirmNo: { borderColor: C.blueLine, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  confirmNoText: { color: C.gold, fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  subastaCard: { backgroundColor: C.card, borderColor: C.blueLine, borderRadius: 15, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 },
  subastaInfo: { flex: 1 },
  subastaTitle: { color: C.gold, fontFamily: "serif", fontSize: 15, fontWeight: "900" },
  subastaMeta: { color: C.muted, fontFamily: "serif", fontSize: 12, marginTop: 2 },
  estadoPill: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  estadoAbierta: { backgroundColor: "rgba(46,204,113,0.15)", borderColor: "#2ecc71", borderWidth: 1 },
  estadoCerrada: { backgroundColor: "rgba(90,90,90,0.15)", borderColor: "#555", borderWidth: 1 },
  estadoText: { fontFamily: "serif", fontSize: 10, fontWeight: "900", color: C.gold },
});
