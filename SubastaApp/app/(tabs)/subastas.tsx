import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import subastaService, { SubastaResponse } from "@/models/services/subastaService";
import usuarioService from "@/models/services/usuarioService";

export default function SubastasScreen() {
  const router = useRouter();
  const [subastas, setSubastas] = useState<SubastaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSubastas();
  }, []);

  const cargarSubastas = async () => {
    setLoading(true);
    try {
      const data = await subastaService.listarAbiertas();
      setSubastas(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudieron cargar las subastas.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await usuarioService.logout();
    router.replace("/");
  };

  const renderSubasta = ({ item }: { item: SubastaResponse }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardCategoria}>{item.categoria.toUpperCase()}</Text>
        <View style={styles.estadoBadge}>
          <Text style={styles.estadoText}>ABIERTA</Text>
        </View>
      </View>
      <Text style={styles.cardFecha}>📅 {item.fecha} — {item.hora}hs</Text>
      {item.ubicacion && <Text style={styles.cardUbicacion}>📍 {item.ubicacion}</Text>}
      <Text style={styles.cardId}>Subasta #{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SUBASTAS ABIERTAS</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffe082" style={{ marginTop: 40 }} />
      ) : subastas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay subastas abiertas en este momento.</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={cargarSubastas}>
            <Text style={styles.refreshText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={subastas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSubasta}
          contentContainerStyle={{ paddingBottom: 24 }}
          onRefresh={cargarSubastas}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07162b", paddingHorizontal: 16, paddingTop: 48 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { color: "#e5e2c6", fontSize: 20, fontWeight: "bold", fontFamily: "serif", letterSpacing: 1 },
  logout: { color: "#ffe082", fontSize: 15, fontWeight: "bold" },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#d4af37",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardCategoria: { color: "#ffe082", fontWeight: "bold", fontSize: 16, letterSpacing: 1 },
  estadoBadge: { backgroundColor: "#1a4a2e", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  estadoText: { color: "#4caf50", fontSize: 12, fontWeight: "bold" },
  cardFecha: { color: "#e5e2c6", fontSize: 14, marginBottom: 4 },
  cardUbicacion: { color: "#bfc8d6", fontSize: 13, marginBottom: 4 },
  cardId: { color: "#7a8899", fontSize: 12, marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#bfc8d6", fontSize: 16, textAlign: "center", marginBottom: 16 },
  refreshButton: { borderColor: "#ffe082", borderWidth: 1, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 },
  refreshText: { color: "#ffe082", fontWeight: "bold" },
});
