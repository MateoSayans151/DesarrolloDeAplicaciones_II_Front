import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import subastaService, { AsistenteResponse, SubastaResponse } from "@/models/services/subastaService";
import catalogoService, { ItemCatalogoDetalleResponse } from "@/models/services/catalogoService";
import pujaService, { PujaResponse } from "@/models/services/pujaService";
import usuarioService from "@/models/services/usuarioService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GOLD = "#d4af37";
const BG   = "#050f1e";
const CARD = "#0a1929";

const CATEGORIA_IMAGE: Record<SubastaResponse["categoria"], string> = {
  comun:    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=400&fit=crop",
  especial: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&h=400&fit=crop",
  plata:    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=400&fit=crop",
  oro:      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=400&fit=crop",
  platino:  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=400&fit=crop",
};

// ─── Item card con puja ───────────────────────────────────────────────────────

function ItemCard({
  item,
  pujas,
  asistenteId,
  onPujaOk,
}: {
  item: ItemCatalogoDetalleResponse;
  pujas: PujaResponse[];
  asistenteId: number;
  onPujaOk: (itemId: number, nuevasPujas: PujaResponse[]) => void;
}) {
  const [importe, setImporte] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mejorPuja = pujas.length > 0 ? Math.max(...pujas.map((p) => p.importe)) : null;

  const handlePujar = async () => {
    const monto = parseFloat(importe.replace(",", "."));
    if (isNaN(monto) || monto <= 0) { setError("Ingresá un monto válido."); return; }
    setError(null);
    setLoading(true);
    try {
      await pujaService.pujar(item.id, { asistente: asistenteId, importe: monto });
      const nuevasPujas = await pujaService.historial(item.id);
      onPujaOk(item.id, nuevasPujas);
      setImporte("");
    } catch (e: any) {
      setError(e.message ?? "No se pudo realizar la puja.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.itemCard}>
      <Text style={s.itemTitle} numberOfLines={2}>{item.producto.descripcionCompleta}</Text>
      {item.producto.artista ? <Text style={s.itemSub}>{item.producto.artista}</Text> : null}

      <View style={s.itemPriceRow}>
        <View>
          <Text style={s.itemPriceLabel}>PRECIO BASE</Text>
          <Text style={s.itemPrice}>${item.precioBase.toLocaleString("es-AR")}</Text>
        </View>
        {mejorPuja !== null && (
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.itemPriceLabel}>MEJOR PUJA</Text>
            <Text style={[s.itemPrice, { color: "#4cdf8a" }]}>${mejorPuja.toLocaleString("es-AR")}</Text>
          </View>
        )}
      </View>

      <View style={s.pujaRow}>
        <TextInput
          style={s.pujaInput}
          placeholder="Tu oferta..."
          placeholderTextColor="#3a5070"
          keyboardType="numeric"
          value={importe}
          onChangeText={setImporte}
        />
        <TouchableOpacity style={[s.pujaBtn, loading && { opacity: 0.5 }]} onPress={handlePujar} disabled={loading}>
          {loading ? <ActivityIndicator color={BG} size="small" /> : (
            <>
              <MaterialIcons name="gavel" size={14} color={BG} />
              <Text style={s.pujaBtnText}>PUJAR</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={s.errorRow}>
          <MaterialIcons name="error-outline" size={14} color="#e74c3c" />
          <Text style={s.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SubastaElegidaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const [subasta, setSubasta]     = useState<SubastaResponse | null>(null);
  const [asistente, setAsistente] = useState<AsistenteResponse | null>(null);
  const [items, setItems]         = useState<ItemCatalogoDetalleResponse[]>([]);
  const [pujasPorItem, setPujasPorItem] = useState<Record<number, PujaResponse[]>>({});
  const [loading, setLoading]     = useState(true);
  const [joining, setJoining]     = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => { if (id) cargar(); }, [id]);

  const cargar = async () => {
    setLoading(true);
    try {
      const [sub, usuario] = await Promise.all([
        subastaService.obtener(Number(id)),
        usuarioService.getUsuarioLocal(),
      ]);
      setSubasta(sub);

      const asistentes = await subastaService.listarAsistentes(Number(id));
      const miAsistente = asistentes.find((a) => a.usuarioId === usuario?.id) ?? null;
      setAsistente(miAsistente);

      // Cargar catálogo
      try {
        const catalogo = await catalogoService.obtenerDetallePorSubasta(Number(id));
        setItems(catalogo.items ?? []);

        // Cargar pujas de cada ítem en paralelo
        const pujasMap: Record<number, PujaResponse[]> = {};
        await Promise.all(
          (catalogo.items ?? []).map(async (item) => {
            try {
              pujasMap[item.id] = await pujaService.historial(item.id);
            } catch {
              pujasMap[item.id] = [];
            }
          })
        );
        setPujasPorItem(pujasMap);
      } catch {
        // No hay catálogo aún
        setItems([]);
      }

      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      ]).start();
    } catch (e: any) {
      // error silencioso — el usuario verá pantalla vacía
    } finally {
      setLoading(false);
    }
  };

  const handleUnirse = async () => {
    if (!subasta) return;
    const usuario = await usuarioService.getUsuarioLocal();
    if (!usuario) return;
    setJoining(true);
    setJoinError(null);
    try {
      const asistentes = await subastaService.listarAsistentes(subasta.id);
      const nuevo = await subastaService.registrarAsistente(subasta.id, {
        numeroPostor: asistentes.length + 1,
        usuarioId: usuario.id,
      });
      setAsistente(nuevo);
    } catch (e: any) {
      setJoinError(e.message ?? "No se pudo unirse a la subasta.");
    } finally {
      setJoining(false);
    }
  };

  const handlePujaOk = (itemId: number, nuevasPujas: PujaResponse[]) => {
    setPujasPorItem((prev) => ({ ...prev, [itemId]: nuevasPujas }));
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={[s.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={GOLD} />
      </View>
    );
  }

  if (!subasta) {
    return (
      <View style={[s.center, { paddingTop: insets.top }]}>
        <Text style={{ color: "#8aa3be" }}>No se encontró la subasta.</Text>
      </View>
    );
  }

  const estaAbierta = subasta.estado === "abierta";
  const imagen = CATEGORIA_IMAGE[subasta.categoria];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: BG }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <View style={[s.hero, { height: 240 + insets.top }]}>
          <Image source={{ uri: imagen }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          <View style={s.heroOverlay} />
          <View style={[s.heroHeader, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <MaterialIcons name="arrow-back-ios" size={20} color="#e5e2c6" />
            </TouchableOpacity>
            <View style={[s.estadoBadge, { backgroundColor: estaAbierta ? "rgba(76,223,138,0.2)" : "rgba(180,60,60,0.2)" }]}>
              <View style={[s.estadoDot, { backgroundColor: estaAbierta ? "#4cdf8a" : "#e74c3c" }]} />
              <Text style={[s.estadoText, { color: estaAbierta ? "#4cdf8a" : "#e74c3c" }]}>
                {estaAbierta ? "ABIERTA" : "CERRADA"}
              </Text>
            </View>
          </View>
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Info ─────────────────────────────────────────────────── */}
          <View style={s.section}>
            <Text style={s.titulo}>SUBASTA #{subasta.id}</Text>
            <View style={s.metaRow}>
              <View style={s.metaBadge}><MaterialIcons name="event" size={12} color={GOLD} /><Text style={s.metaText}>{subasta.fecha} · {subasta.hora}hs</Text></View>
              <View style={s.metaBadge}><MaterialIcons name="label" size={12} color={GOLD} /><Text style={s.metaText}>{subasta.categoria.toUpperCase()}</Text></View>
              {subasta.ubicacion ? <View style={s.metaBadge}><MaterialIcons name="place" size={12} color={GOLD} /><Text style={s.metaText}>{subasta.ubicacion}</Text></View> : null}
              {subasta.capacidadAsistentes != null ? <View style={s.metaBadge}><MaterialIcons name="people" size={12} color={GOLD} /><Text style={s.metaText}>{subasta.capacidadAsistentes} asistentes máx.</Text></View> : null}
            </View>
          </View>

          {/* ── CERRADA ──────────────────────────────────────────────── */}
          {!estaAbierta && (
            <View style={[s.card, { alignItems: "center", gap: 12 }]}>
              <MaterialIcons name="lock" size={32} color="#3a5070" />
              <Text style={{ color: "#8aa3be", fontFamily: "serif", fontSize: 15, textAlign: "center" }}>
                Esta subasta ha finalizado.
              </Text>
              <TouchableOpacity style={s.joinBtn} onPress={() => router.push(`/(tabs)/subastas?registro=${subasta.id}` as any)}>
                <Text style={s.joinBtnText}>VER RESULTADOS</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── UNIRSE ───────────────────────────────────────────────── */}
          {estaAbierta && !asistente && (
            <View style={s.card}>
              <Text style={s.cardTitle}>PARTICIPAR EN LA SUBASTA</Text>
              <Text style={s.cardSubtitle}>Uníte como postor para poder realizar pujas sobre los artículos del catálogo.</Text>
              {joinError ? (
                <View style={[s.errorRow, { marginBottom: 10 }]}>
                  <MaterialIcons name="error-outline" size={14} color="#e74c3c" />
                  <Text style={s.errorText}>{joinError}</Text>
                </View>
              ) : null}
              <TouchableOpacity style={[s.joinBtn, joining && { opacity: 0.5 }]} onPress={handleUnirse} disabled={joining}>
                {joining ? <ActivityIndicator color={BG} size="small" /> : (
                  <>
                    <MaterialIcons name="how-to-reg" size={16} color={BG} />
                    <Text style={s.joinBtnText}>UNIRSE A LA SUBASTA</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ── ÍTEMS DEL CATÁLOGO ───────────────────────────────────── */}
          {estaAbierta && asistente && (
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.liveDot} />
                <Text style={s.cardTitle}>ARTÍCULOS EN SUBASTA</Text>
              </View>
              <Text style={s.cardSubtitle}>Postor #{asistente.numeroPostor} — ingresá tu oferta en cada artículo.</Text>

              {items.length === 0 ? (
                <View style={[s.card, { alignItems: "center" }]}>
                  <Text style={{ color: "#3a5070", fontFamily: "serif", fontSize: 14 }}>
                    El catálogo aún no tiene artículos cargados.
                  </Text>
                </View>
              ) : (
                items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    pujas={pujasPorItem[item.id] ?? []}
                    asistenteId={asistente.identificador}
                    onPujaOk={handlePujaOk}
                  />
                ))
              )}
            </View>
          )}

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: BG },
  hero: { position: "relative", overflow: "hidden" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,15,30,0.5)" },
  heroHeader: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  estadoBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  estadoDot: { width: 7, height: 7, borderRadius: 4 },
  estadoText: { fontFamily: "serif", fontSize: 11, fontWeight: "900", letterSpacing: 1 },

  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4cdf8a" },
  titulo: { color: "#e5e2c6", fontFamily: "serif", fontSize: 22, fontWeight: "900", letterSpacing: 1, marginBottom: 10 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  metaBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(212,175,55,0.08)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(212,175,55,0.2)" },
  metaText: { color: GOLD, fontFamily: "serif", fontSize: 11, fontWeight: "700" },

  card: { backgroundColor: CARD, borderRadius: 16, borderWidth: 1, borderColor: "#0f2540", padding: 16, marginHorizontal: 16, marginTop: 12 },
  cardTitle: { color: "#e5e2c6", fontFamily: "serif", fontSize: 13, fontWeight: "900", letterSpacing: 2, marginBottom: 6 },
  cardSubtitle: { color: "#3a5070", fontFamily: "serif", fontSize: 12, lineHeight: 18, marginBottom: 14 },

  joinBtn: { backgroundColor: GOLD, borderRadius: 12, height: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  joinBtnText: { color: BG, fontFamily: "serif", fontSize: 14, fontWeight: "900", letterSpacing: 1 },

  itemCard: { backgroundColor: CARD, borderRadius: 14, borderWidth: 1, borderColor: "#0f2540", padding: 14, marginTop: 10 },
  itemTitle: { color: "#e5e2c6", fontFamily: "serif", fontSize: 14, fontWeight: "900", lineHeight: 20, marginBottom: 2 },
  itemSub: { color: "#3a5070", fontFamily: "serif", fontSize: 12, marginBottom: 10 },
  itemPriceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  itemPriceLabel: { color: "#3a5070", fontFamily: "serif", fontSize: 10, letterSpacing: 1.5, marginBottom: 2 },
  itemPrice: { color: GOLD, fontFamily: "serif", fontSize: 16, fontWeight: "900" },

  pujaRow: { flexDirection: "row", gap: 8 },
  pujaInput: { flex: 1, backgroundColor: "#050f1e", borderRadius: 10, borderWidth: 1, borderColor: "#0f2540", color: "#e5e2c6", fontFamily: "serif", fontSize: 14, paddingHorizontal: 12, height: 42 },
  pujaBtn: { backgroundColor: GOLD, borderRadius: 10, height: 42, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14 },
  pujaBtnText: { color: BG, fontFamily: "serif", fontSize: 13, fontWeight: "900" },

  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  errorText: { color: "#e74c3c", fontFamily: "serif", fontSize: 12, flex: 1 },
});
