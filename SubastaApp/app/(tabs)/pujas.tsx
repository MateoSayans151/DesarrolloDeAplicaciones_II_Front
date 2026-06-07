import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";
import usuarioService, { MiPujaResponse } from "@/models/services/usuarioService";

function BidCard({ item }: { item: MiPujaResponse }) {
  const router = useRouter();
  const superada = !item.esMejorPuja;

  return (
    <View style={[styles.bidCard, superada && styles.bidCardSuperada]}>
      {superada && (
        <View style={styles.superadaBadge}>
          <MaterialIcons name="trending-down" size={12} color="#fff" />
          <Text style={styles.superadaText}>SUPERADA</Text>
        </View>
      )}

      <View style={styles.bidInfo}>
        <Text style={styles.bidTitle} numberOfLines={2}>
          {item.productoDescripcion}
        </Text>
        <Text style={styles.bidLabel}>
          Tu puja: <Text style={styles.bidAmount}>${item.importe.toLocaleString("es-AR")}</Text>
        </Text>
        <Text style={styles.bidLabel}>
          Mejor puja: <Text style={[styles.bidAmount, superada && styles.bidAmountSuperada]}>${item.mejorImporte.toLocaleString("es-AR")}</Text>
        </Text>
        <Text style={styles.subastaMeta}>
          Subasta #{item.subastaId} · {item.subastaFecha} · {item.subastaEstado.toUpperCase()}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.bidAction, superada && styles.bidActionSuperada]}
        activeOpacity={0.75}
        onPress={() => router.push(`/(tabs)/SubastaElegida?id=${item.subastaId}` as any)}
      >
        <MaterialIcons name="gavel" size={28} color={superada ? "#e74c3c" : C.gold} />
      </TouchableOpacity>
    </View>
  );
}

export default function PujasScreen() {
  const [pujas, setPujas] = useState<MiPujaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const usuario = await usuarioService.getUsuarioLocal();
        if (!usuario) return;
        const data = await usuarioService.listarMisPujas(usuario.id);
        setPujas(data);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <ScreenLayout activeTab="pujas">
      <Text style={styles.sectionTitle}>MIS PUJAS</Text>

      {loading ? (
        <ActivityIndicator color={C.gold} style={{ marginVertical: 20 }} />
      ) : pujas.length === 0 ? (
        <Text style={styles.emptyText}>No realizaste ninguna puja todavía.</Text>
      ) : (
        <View style={styles.bids}>
          {pujas.map((item) => (
            <BidCard key={item.pujaId} item={item} />
          ))}
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { color: C.gold, fontFamily: "serif", fontSize: 20, fontWeight: "900", marginBottom: 10, marginLeft: 10 },
  emptyText: { color: "#4a6a80", fontFamily: "serif", fontSize: 14, textAlign: "center", paddingVertical: 20 },
  bids: { gap: 10 },
  bidCard: {
    backgroundColor: C.card,
    borderColor: C.blueLine,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    overflow: "hidden",
  },
  bidCardSuperada: { borderColor: "rgba(231,76,60,0.4)" },
  superadaBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#e74c3c",
    borderBottomLeftRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  superadaText: { color: "#fff", fontFamily: "serif", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  bidInfo: { flex: 1, paddingRight: 8 },
  bidTitle: { color: C.gold, fontFamily: "serif", fontSize: 15, fontWeight: "900", lineHeight: 19, marginBottom: 4 },
  bidLabel: { color: C.muted, fontFamily: "serif", fontSize: 12, lineHeight: 17 },
  bidAmount: { color: C.brightGold, fontWeight: "900" },
  bidAmountSuperada: { color: "#e74c3c" },
  subastaMeta: { color: "#4a6a80", fontFamily: "serif", fontSize: 11, marginTop: 4 },
  bidAction: { alignItems: "center", borderColor: C.green, borderRadius: 24, borderWidth: 1, height: 48, justifyContent: "center", width: 48, flexShrink: 0 },
  bidActionSuperada: { borderColor: "#e74c3c" },
});
