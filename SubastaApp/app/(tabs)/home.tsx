import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";
import subastaService, { SubastaResponse } from "@/models/services/subastaService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const MAX_GRID = 5;

function shuffleTake<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

const CATEGORIA_IMAGE: Record<SubastaResponse["categoria"], string> = {
  comun:    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=300&h=300&fit=crop",
  especial: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=300&h=300&fit=crop",
  plata:    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&h=300&fit=crop",
  oro:      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop",
  platino:  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=300&fit=crop",
};

const HERO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=300&fit=crop";

// ─── Components ──────────────────────────────────────────────────────────────

function HeroBanner({ subasta }: { subasta: SubastaResponse }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.04, duration: 120, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start();
  }, [seconds]);

  const image = CATEGORIA_IMAGE[subasta.categoria] ?? HERO_FALLBACK_IMAGE;

  return (
    <View style={styles.heroBanner}>
      <Image source={{ uri: image }} style={styles.heroImage} />
      <View style={styles.heroOverlay} />

      <View style={styles.heroContent}>
        <Text style={styles.heroCategoria}>{subasta.categoria.toUpperCase()}</Text>
        <Animated.Text style={[styles.countdown, { transform: [{ scale: pulseAnim }] }]}>
          {formatTime(seconds)}
        </Animated.Text>
        <TouchableOpacity
          style={styles.bidButton}
          activeOpacity={0.82}
          onPress={() => router.push(`/SubastaElegida?id=${subasta.id}`)}
        >
          <Text style={styles.bidButtonText}>PUJA AHORA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

function AuctionGridCard({ item }: { item: SubastaResponse }) {
  const router = useRouter();
  const image = CATEGORIA_IMAGE[item.categoria] ?? HERO_FALLBACK_IMAGE;

  return (
    <TouchableOpacity
      style={styles.gridCard}
      activeOpacity={0.85}
      onPress={() => router.push(`/SubastaElegida?id=${item.id}`)}
    >
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>
            {item.fecha} {item.hora}hs
          </Text>
        </View>
      </View>

      <Image source={{ uri: image }} style={styles.gridImage} />

      <View style={styles.gridBidRow}>
        <Text style={styles.gridCategoria}>{item.categoria.toUpperCase()}</Text>
        {item.ubicacion ? (
          <Text style={styles.gridTime} numberOfLines={1}>📍 {item.ubicacion}</Text>
        ) : null}
      </View>

      <Text style={styles.gridTitle} numberOfLines={2}>
        SUBASTA #{item.id}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [subastas, setSubastas] = useState<SubastaResponse[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    subastaService
      .listarAbiertas()
      .then(setSubastas)
      .catch((e) => setError(e.message ?? "Error al cargar subastas"))
      .finally(() => setLoading(false));
  }, []);

  const [hero, ...remaining] = subastas;
  const rest = shuffleTake(remaining, MAX_GRID);

  return (
    <ScreenLayout activeTab="home">
      {loading ? (
        <ActivityIndicator size="large" color={C.gold} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          {hero && <HeroBanner subasta={hero} />}

          <Text style={styles.sectionTitle}>SUBASTAS ABIERTAS</Text>

          <View style={styles.grid}>
            {rest.map((item) => (
              <AuctionGridCard key={item.id} item={item} />
            ))}
          </View>
        </>
      )}
    </ScreenLayout>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Hero ──
  heroBanner: {
    borderColor: C.blueLine,
    borderRadius: 16,
    borderWidth: 1,
    height: 210,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    height: "100%",
    position: "absolute",
    width: "100%",
  },
  heroOverlay: {
    backgroundColor: "rgba(0, 10, 30, 0.52)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  heroContent: {
    alignItems: "center",
    bottom: 28,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    justifyContent: "center",
    gap: 14,
  },
  heroCategoria: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 3,
    opacity: 0.85,
  },
  countdown: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bidButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 10,
    paddingHorizontal: 36,
    paddingVertical: 10,
  },
  bidButtonText: {
    color: "#111111",
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
  dots: {
    alignItems: "center",
    bottom: 10,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 4,
    height: 4,
    width: 20,
  },
  dotActive: {
    backgroundColor: "#ffffff",
    width: 28,
  },

  // ── Section title ──
  sectionTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
    marginLeft: 4,
    textAlign: "left",
  },

  // ── Grid ──
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gridCard: {
    backgroundColor: C.card,
    borderColor: C.blueLine,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    padding: 0,
    width: "48.5%",
  },
  badgeRow: {
    left: 8,
    position: "absolute",
    top: 8,
    zIndex: 2,
  },
  badge: {
    alignItems: "center",
    backgroundColor: "#0d2235",
    borderColor: "#1e4060",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeDot: {
    backgroundColor: "#4cdf8a",
    borderRadius: 4,
    height: 6,
    width: 6,
  },
  badgeText: {
    color: "#ffffff",
    fontFamily: "serif",
    fontSize: 10,
    fontWeight: "700",
  },
  gridImage: {
    height: 110,
    width: "100%",
  },
  gridBidRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  gridCategoria: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 14,
    fontWeight: "900",
  },
  gridTime: {
    color: "#9ab0c4",
    fontFamily: "serif",
    fontSize: 11,
    fontWeight: "700",
    maxWidth: "55%",
  },
  gridTitle: {
    color: "#e8d9bb",
    fontFamily: "serif",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17,
    paddingBottom: 10,
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  errorText: {
    color: "#f44336",
    fontFamily: "serif",
    fontSize: 15,
    marginTop: 40,
    textAlign: "center",
  },
});
