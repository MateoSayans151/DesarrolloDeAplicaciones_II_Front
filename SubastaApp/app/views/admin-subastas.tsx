import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";
import subastaService, { SubastaResponse } from "@/models/services/subastaService";

function SubastaCard({ item, onRefresh }: { item: SubastaResponse; onRefresh: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abierta   = item.estado === "abierta";
  const programada = item.estado === "programada";

  const toggleEstado = async () => {
    setLoading(true);
    setError(null);
    try {
      if (abierta) {
        await subastaService.cerrar(item.id);
      } else {
        await subastaService.cambiarEstado(item.id, "abierta");
      }
      onRefresh();
    } catch (e: any) {
      setError(e.message ?? "Error al cambiar estado");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    setDeleting(true);
    setError(null);
    try {
      await subastaService.eliminar(item.id);
      onRefresh();
    } catch (e: any) {
      setError(e.message ?? "Error al eliminar");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View>
          <Text style={s.cardTitle}>Subasta #{item.id}</Text>
          <Text style={s.cardMeta}>{item.fecha} · {item.hora}hs · {item.categoria.toUpperCase()}</Text>
          {item.ubicacion ? <Text style={s.cardMeta}>{item.ubicacion}</Text> : null}
        </View>
        <View style={[s.estadoBadge, {
          backgroundColor: abierta ? "rgba(76,223,138,0.15)" : programada ? "rgba(212,175,55,0.12)" : "rgba(90,90,90,0.15)",
        }]}>
          <View style={[s.estadoDot, { backgroundColor: abierta ? "#4cdf8a" : programada ? "#d4af37" : "#666" }]} />
          <Text style={[s.estadoText, { color: abierta ? "#4cdf8a" : programada ? "#d4af37" : "#666" }]}>
            {abierta ? "ABIERTA" : programada ? "PROGRAMADA" : "CERRADA"}
          </Text>
        </View>
      </View>

      {error ? (
        <View style={s.errorRow}>
          <MaterialIcons name="error-outline" size={13} color="#e74c3c" />
          <Text style={s.errorText}>{error}</Text>
        </View>
      ) : null}

      {confirmDelete ? (
        <View style={s.confirmRow}>
          <Text style={s.confirmText}>¿Eliminar esta subasta?</Text>
          <TouchableOpacity
            style={[s.confirmYes, deleting && { opacity: 0.5 }]}
            onPress={handleEliminar}
            disabled={deleting}
          >
            {deleting
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.confirmYesText}>SÍ</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={s.confirmNo} onPress={() => setConfirmDelete(false)}>
            <Text style={s.confirmNoText}>NO</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={s.actionRow}>
          <TouchableOpacity style={s.catBtn} onPress={() => router.push(`/views/admin-catalogos?subastaId=${item.id}` as any)} activeOpacity={0.8}>
            <MaterialIcons name="list-alt" size={14} color={C.gold} />
            <Text style={s.catBtnText}>CATÁLOGO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.toggleBtn, { backgroundColor: abierta ? "#27ae60" : "#1a5276" }, loading && { opacity: 0.5 }]}
            onPress={toggleEstado}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? <ActivityIndicator color="#fff" size="small" /> : (
              <>
                <MaterialIcons name={abierta ? "lock" : "lock-open"} size={14} color="#fff" />
                <Text style={s.toggleBtnText}>{abierta ? "CERRAR" : "ABRIR"}</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={s.deleteBtn} onPress={() => setConfirmDelete(true)} activeOpacity={0.8}>
            <MaterialIcons name="delete-outline" size={18} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function AdminSubastasScreen() {
  const router = useRouter();
  const [subastas, setSubastas] = useState<SubastaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subastaService.listarTodas();
      setSubastas(data.sort((a, b) => b.id - a.id));
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga cada vez que la pantalla vuelve al foco (ej: al volver de crear-subasta)
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  return (
    <ScreenLayout activeTab="admin-subastas">
      <View style={s.header}>
        <Text style={s.title}>SUBASTAS</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => router.push("/views/crear-subasta" as any)} activeOpacity={0.8}>
          <MaterialIcons name="add" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={C.gold} style={{ marginTop: 20 }} />
      ) : subastas.length === 0 ? (
        <Text style={s.empty}>No hay subastas creadas.</Text>
      ) : (
        <View style={s.list}>
          {subastas.map((item) => (
            <SubastaCard key={item.id} item={item} onRefresh={cargar} />
          ))}
        </View>
      )}
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  title: { color: C.gold, fontFamily: "serif", fontSize: 22, fontWeight: "900" },
  addBtn: { backgroundColor: C.brightGold, borderRadius: 15, width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  list: { gap: 10 },
  empty: { color: "#3a5070", fontFamily: "serif", fontSize: 14, textAlign: "center", marginTop: 20 },
  card: { backgroundColor: C.card, borderColor: C.blueLine, borderRadius: 14, borderWidth: 1, padding: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  cardTitle: { color: C.gold, fontFamily: "serif", fontSize: 15, fontWeight: "900" },
  cardMeta: { color: C.muted, fontFamily: "serif", fontSize: 12, marginTop: 2 },
  estadoBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  estadoDot: { width: 6, height: 6, borderRadius: 3 },
  estadoText: { fontFamily: "serif", fontSize: 10, fontWeight: "900" },
  actionRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  catBtn: { flexDirection: "row", alignItems: "center", gap: 5, borderColor: C.gold, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  catBtnText: { color: C.gold, fontFamily: "serif", fontSize: 11, fontWeight: "900" },
  toggleBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 8, paddingVertical: 8 },
  toggleBtnText: { color: "#fff", fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  deleteBtn: { borderColor: "#c0392b", borderWidth: 1, borderRadius: 8, width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  confirmRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  confirmText: { color: C.muted, fontFamily: "serif", fontSize: 12, flex: 1 },
  confirmYes: { backgroundColor: "#c0392b", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  confirmYesText: { color: "#fff", fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  confirmNo: { borderColor: C.blueLine, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  confirmNoText: { color: C.gold, fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  errorText: { color: "#e74c3c", fontFamily: "serif", fontSize: 11, flex: 1 },
});
