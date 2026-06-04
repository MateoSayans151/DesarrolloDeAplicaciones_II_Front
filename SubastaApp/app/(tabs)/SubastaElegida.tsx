import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Puja {
  id: number;
  nombrePostor: string;
  apellidoPostor: string;
  monto: number;
  foto?: string;
}

interface Subasta {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  imagenes?: string[];
  lote: string | number;
  ultimaPuja: number;
  segundosRestantes: number;
  pujas: Puja[];
}

const API_BASE = "http://TU_IP:8080/api/v1";

const HARD_CODED_SUBASTA: Subasta = {
  id: 1,
  titulo: "Vintage Electronics Collection",
  descripcion:
    "Una colección exclusiva de electrónica vintage de los años 70 y 80. Piezas únicas en perfecto estado de conservación.",
  imagenUrl:
    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=400&fit=crop",
  imagenes: [
    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=400&fit=crop",
  ],
  lote: "04",
  ultimaPuja: 3400000,
  segundosRestantes: 72,
  pujas: [
    { id: 1, nombrePostor: "Mateo", apellidoPostor: "Sayans", monto: 3400000 },
    { id: 2, nombrePostor: "Facundo", apellidoPostor: "Conde", monto: 3345000 },
    { id: 3, nombrePostor: "Tomás", apellidoPostor: "Lecuenis", monto: 3320000 },
    { id: 4, nombrePostor: "Lucía", apellidoPostor: "Martínez", monto: 3290000 },
  ],
};

const fmt = (n: number) =>
  "$" + n.toLocaleString("es-AR", { minimumFractionDigits: 0 });

const fmtTime = (s: number) => {
  const h = Math.floor(s / 3600).toString().padStart(2, "0");
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${h}:${m}:${ss} hs`;
};

const initials = (nombre: string, apellido: string) =>
  `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();

export default function SubastaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets(); // ← toma el safe area real del dispositivo

  const [subasta, setSubasta] = useState<Subasta | null>(null);
  const [loading, setLoading] = useState(true);
  const [segundos, setSegundos] = useState(0);
  const [customBid, setCustomBid] = useState("");
  const [pujaLoading, setPujaLoading] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const didAnimate = useRef(false);

  useEffect(() => {
    fetchSubasta();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [id]);

  const fetchSubasta = async (isRefresh = false) => {
    try {
      const data = HARD_CODED_SUBASTA;
      setSubasta(data);
      if (!isRefresh) {
        setSegundos(data.segundosRestantes);
        startTimer(data.segundosRestantes);
      }
      if (!didAnimate.current) {
        didAnimate.current = true;
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        ]).start();
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Error al cargar subasta");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (initial: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    let s = initial;
    timerRef.current = setInterval(() => {
      s -= 1;
      if (s <= 0) { clearInterval(timerRef.current!); s = 0; }
      setSegundos(s);
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 100, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }, 1000);
  };

  const handlePuja = async (monto: number) => {
    if (!subasta) return;
    setPujaLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_BASE}/pujas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subastaId: subasta.id, monto }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "No se pudo realizar la puja");
      }
      await fetchSubasta(true);
      setCustomBid("");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setPujaLoading(false);
    }
  };

  const handleCustomBid = () => {
    const monto = parseInt(customBid.replace(/\D/g, ""), 10);
    if (isNaN(monto) || monto <= (subasta?.ultimaPuja ?? 0)) {
      Alert.alert("Monto inválido", "La puja debe ser mayor a la última puja.");
      return;
    }
    handlePuja(monto);
  };

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={styles.loadingText}>Cargando subasta...</Text>
      </View>
    );
  }

  if (!subasta) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <MaterialIcons name="gavel" size={48} color="#d4af37" />
        <Text style={{ color: "#e5e2c6", marginTop: 12 }}>No se encontró la subasta.</Text>
      </View>
    );
  }

  const imagenes = subasta.imagenes?.length
    ? subasta.imagenes
    : subasta.imagenUrl ? [subasta.imagenUrl] : [];
  const ultimaPuja = subasta.ultimaPuja ?? 0;
  const topPujas = [...(subasta.pujas ?? [])].sort((a, b) => b.monto - a.monto).slice(0, 5);
  const isUrgent = segundos < 60;

  // altura del header = safe area top + contenido del header
  const HEADER_HEIGHT = insets.top + 52;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#050f1e" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Hero — altura dinámica según safe area */}
        <View style={[styles.heroContainer, { height: 260 + insets.top }]}>
          {imagenes.length > 0 ? (
            <Image source={{ uri: imagenes[imgIndex] }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={[styles.heroImage, styles.noImage]}>
              <MaterialIcons name="image-not-supported" size={48} color="#2a3f5a" />
            </View>
          )}

          {/* overlay degradado manual */}
          <View style={styles.heroOverlayTop} />
          <View style={styles.heroOverlayBottom} />

          {/* header flotante con paddingTop dinámico */}
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back-ios" size={20} color="#e5e2c6" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>SUBASTA APP</Text>
            <TouchableOpacity style={styles.favBtn}>
              <MaterialIcons name="star-border" size={22} color="#d4af37" />
            </TouchableOpacity>
          </View>

          {/* lote badge */}
          <View style={styles.loteBadge}>
            <Text style={styles.loteText}>LOTE {subasta.lote}</Text>
          </View>

          {/* miniaturas */}
          {imagenes.length > 1 && (
            <View style={styles.thumbRow}>
              {imagenes.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setImgIndex(i)}
                  style={[styles.thumbWrap, i === imgIndex && styles.thumbWrapActive]}
                >
                  <Image source={{ uri: img }} style={styles.thumb} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Título */}
          <View style={styles.titleSection}>
            <Text style={styles.titulo}>{subasta.titulo.toUpperCase()}</Text>
            <TouchableOpacity style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>+ INFO</Text>
            </TouchableOpacity>
          </View>

          {/* Live Bid Feed */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.liveDot} />
              <Text style={styles.cardTitle}>LIVE BID FEED</Text>
            </View>
            {topPujas.length === 0 ? (
              <Text style={styles.sinPujas}>Aún no hay pujas.</Text>
            ) : (
              topPujas.map((p, i) => (
                <View key={p.id} style={[styles.pujaRow, i === 0 && styles.pujaRowTop]}>
                  <Text style={[styles.pujaPos, i === 0 && styles.pujaPosTop]}>#{i + 1}</Text>
                  <View style={[styles.pujaAvatar, i === 0 && styles.pujaAvatarTop]}>
                    {p.foto ? (
                      <Image source={{ uri: p.foto }} style={styles.avatarImg} />
                    ) : (
                      <Text style={[styles.avatarInitials, i === 0 && styles.avatarInitialsTop]}>
                        {initials(p.nombrePostor, p.apellidoPostor)}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pujaName, i === 0 && styles.pujaNameTop]} numberOfLines={1}>
                      {p.nombrePostor} {p.apellidoPostor}
                    </Text>
                    <Text style={styles.pujaSub}>{i === 0 ? "Puja más alta" : `Puja #${i + 1}`}</Text>
                  </View>
                  <Text style={[styles.pujaMonto, i === 0 && styles.pujaMontoTop]}>{fmt(p.monto)}</Text>
                </View>
              ))
            )}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>ÚLTIMA PUJA</Text>
              <Text style={styles.statValue}>{fmt(ultimaPuja)}</Text>
            </View>
            <View style={styles.timerWrap}>
              <Animated.View style={[styles.timerCircle, isUrgent && styles.timerCircleUrgent, { transform: [{ scale: pulseAnim }] }]}>
                <MaterialIcons name="timer" size={14} color={isUrgent ? "#ff6b6b" : "#d4af37"} />
              </Animated.View>
            </View>
            <View style={[styles.statBox, { alignItems: "flex-end" }]}>
              <Text style={styles.statLabel}>TIEMPO RESTANTE</Text>
              <Text style={[styles.statValue, isUrgent && styles.statValueUrgent]}>{fmtTime(segundos)}</Text>
            </View>
          </View>

          {/* Bid Now */}
          <View style={styles.bidCard}>
            <Text style={styles.bidTitle}>BID NOW</Text>
            <View style={styles.bidButtons}>
              <TouchableOpacity style={styles.bidBtn} onPress={() => handlePuja(ultimaPuja + 50000)} disabled={pujaLoading}>
                <Text style={styles.bidBtnText}>+$50.000</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bidBtn} onPress={() => handlePuja(ultimaPuja + 100000)} disabled={pujaLoading}>
                <Text style={styles.bidBtnText}>+$100.000</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.customBidWrapper}>
              <View style={styles.customBidRow}>
                <TextInput
                  style={styles.customInput}
                  placeholder="Monto personalizado..."
                  placeholderTextColor="#3a5070"
                  keyboardType="numeric"
                  value={customBid}
                  onChangeText={setCustomBid}
                />
              </View>
              <TouchableOpacity
                style={[styles.enviarBtn, (!customBid || pujaLoading) && styles.enviarBtnDisabled]}
                onPress={handleCustomBid}
                disabled={!customBid || pujaLoading}
              >
                {pujaLoading ? (
                  <ActivityIndicator color="#050f1e" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="gavel" size={16} color="#050f1e" />
                    <Text style={styles.enviarBtnText}>PUJAR</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.descCard}>
            <Text style={styles.descTitle}>DESCRIPCIÓN</Text>
            <Text style={styles.descripcion}>{subasta.descripcion}</Text>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#050f1e" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#050f1e", gap: 12 },
  loadingText: { color: "#3a5070", fontSize: 13, letterSpacing: 1 },

  heroContainer: { position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  // overlays manuales top y bottom para simular gradiente
  heroOverlayTop: {
    position: "absolute", top: 0, left: 0, right: 0, height: 100,
    backgroundColor: "rgba(5,15,30,0.6)",
  },
  heroOverlayBottom: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
    backgroundColor: "rgba(5,15,30,0.55)",
  },
  noImage: { backgroundColor: "#0d1e33", justifyContent: "center", alignItems: "center" },

  header: {
    position: "absolute", top: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    // paddingTop se aplica inline con insets.top + 12
  },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  headerTitle: { color: "#e5e2c6", fontWeight: "900", fontSize: 15, letterSpacing: 3 },
  favBtn: {
    width: 36, height: 36, justifyContent: "center", alignItems: "center",
    borderRadius: 18, backgroundColor: "rgba(212,175,55,0.12)",
    borderWidth: 1, borderColor: "rgba(212,175,55,0.3)",
  },

  loteBadge: {
    position: "absolute", bottom: 48, left: 16,
    backgroundColor: "rgba(5,15,30,0.85)",
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 8, borderWidth: 1, borderColor: "rgba(212,175,55,0.4)",
  },
  loteText: { color: "#d4af37", fontWeight: "900", fontSize: 12, letterSpacing: 2 },

  thumbRow: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", paddingHorizontal: 16, paddingBottom: 10, gap: 8,
    backgroundColor: "rgba(5,15,30,0.6)",
  },
  thumbWrap: { width: 52, height: 36, borderRadius: 6, overflow: "hidden", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.15)" },
  thumbWrapActive: { borderColor: "#d4af37" },
  thumb: { width: "100%", height: "100%" },

  titleSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 },
  titulo: { color: "#e5e2c6", fontSize: 22, fontWeight: "900", letterSpacing: 1, lineHeight: 28, marginBottom: 10 },
  infoBadge: {
    alignSelf: "flex-start", backgroundColor: "rgba(212,175,55,0.1)",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
    borderWidth: 1, borderColor: "rgba(212,175,55,0.25)",
  },
  infoBadgeText: { color: "#d4af37", fontSize: 12, fontWeight: "700", letterSpacing: 1 },

  card: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: "#0a1929", borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: "#0f2540",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4cdf8a" },
  cardTitle: { color: "#e5e2c6", fontWeight: "900", fontSize: 13, letterSpacing: 2 },

  pujaRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 10, paddingHorizontal: 10,
    borderRadius: 12, marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  pujaRowTop: { backgroundColor: "rgba(212,175,55,0.08)", borderWidth: 1, borderColor: "rgba(212,175,55,0.2)" },
  pujaPos: { color: "#3a5070", fontSize: 12, fontWeight: "700", width: 22, textAlign: "center" },
  pujaPosTop: { color: "#d4af37" },
  pujaAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#0f2540", justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: "#1e4060",
  },
  pujaAvatarTop: { borderColor: "#d4af37", backgroundColor: "rgba(212,175,55,0.15)" },
  avatarImg: { width: 40, height: 40, borderRadius: 20 },
  avatarInitials: { color: "#3a5070", fontSize: 14, fontWeight: "900" },
  avatarInitialsTop: { color: "#d4af37" },
  pujaName: { color: "#8aa3be", fontSize: 13, fontWeight: "600" },
  pujaNameTop: { color: "#e5e2c6", fontWeight: "900" },
  pujaSub: { color: "#3a5070", fontSize: 11, marginTop: 1 },
  pujaMonto: { color: "#3a5070", fontSize: 13, fontWeight: "700" },
  pujaMontoTop: { color: "#d4af37", fontSize: 14, fontWeight: "900" },
  sinPujas: { color: "#3a5070", fontStyle: "italic", textAlign: "center", paddingVertical: 12 },

  statsRow: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 16, marginTop: 12,
    backgroundColor: "#0a1929", borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: "#0f2540",
  },
  statBox: { flex: 1 },
  statLabel: { color: "#3a5070", fontSize: 10, letterSpacing: 1.5, marginBottom: 4, fontWeight: "700" },
  statValue: { color: "#e5e2c6", fontWeight: "900", fontSize: 15 },
  statValueUrgent: { color: "#ff6b6b" },
  timerWrap: { alignItems: "center", paddingHorizontal: 12 },
  timerCircle: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: "#d4af37",
    justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(212,175,55,0.08)",
  },
  timerCircleUrgent: { borderColor: "#ff6b6b", backgroundColor: "rgba(255,107,107,0.08)" },

  bidCard: {
    marginHorizontal: 16, marginTop: 12,
    backgroundColor: "#0a1929", borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: "#0f2540",
  },
  bidTitle: { color: "#e5e2c6", fontWeight: "900", fontSize: 13, letterSpacing: 2, marginBottom: 14 },
  bidButtons: { flexDirection: "row", gap: 8, marginBottom: 12 },
  bidBtn: {
    flex: 1, backgroundColor: "#d4af37",
    borderRadius: 25, paddingVertical: 12,
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 4,
  },
  bidBtnText: { color: "#050f1e", fontWeight: "900", fontSize: 12, letterSpacing: 0.5 },

  customBidWrapper: { gap: 10 },
  customBidRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#050f1e",
    borderRadius: 14, paddingHorizontal: 16,
    borderWidth: 1, borderColor: "#0f2540",
  },
  customInput: { flex: 1, color: "#e5e2c6", fontSize: 14, paddingVertical: 14 },
  enviarBtn: {
    backgroundColor: "#d4af37",
    borderRadius: 14, paddingVertical: 14,
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 8,
  },
  enviarBtnDisabled: { opacity: 0.4 },
  enviarBtnText: { color: "#050f1e", fontWeight: "900", fontSize: 13, letterSpacing: 1.5 },

  descCard: {
    marginHorizontal: 16, marginTop: 12,
    backgroundColor: "#0a1929", borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: "#0f2540",
  },
  descTitle: { color: "#3a5070", fontWeight: "900", fontSize: 11, letterSpacing: 2, marginBottom: 8 },
  descripcion: { color: "#8aa3be", fontSize: 14, lineHeight: 22 },
});
