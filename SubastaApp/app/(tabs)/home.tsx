import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";

// ─── Data ────────────────────────────────────────────────────────────────────

const heroAuction = {
  title: "Ferrari 355 F1",
  image:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=300&fit=crop",
  initialSeconds: 118 * 60 + 22, // 01:58:22
};

const auctions = [
  {
    id: "1",
    title: "Subasta cuadros de arte",
    highestBid: "$550",
    currency: "Live $USD",
    timeLeft: "10:00",
    image:
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Subasta productos Sony",
    highestBid: "$3.400.000",
    currency: "Live $ARG",
    timeLeft: "01:12",
    image:
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    title: "Subasta coleccion Lego",
    highestBid: "$1.200",
    currency: "Live $USD",
    timeLeft: "25:00",
    image:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&h=300&fit=crop",
  },
  {
    id: "4",
    title: "Subasta relojes Rolex",
    highestBid: "$2.100.000",
    currency: "Live $ARG",
    timeLeft: "00:45",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Components ──────────────────────────────────────────────────────────────

function HeroBanner() {
  const [seconds, setSeconds] = useState(heroAuction.initialSeconds);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.04,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [seconds]);

  return (
    <View style={styles.heroBanner}>
      <Image source={{ uri: heroAuction.image }} style={styles.heroImage} />

      {/* Dark gradient overlay */}
      <View style={styles.heroOverlay} />

      {/* Countdown */}
      <View style={styles.heroContent}>
        <Animated.Text
          style={[styles.countdown, { transform: [{ scale: pulseAnim }] }]}
        >
          {formatTime(seconds)}
        </Animated.Text>

        <TouchableOpacity style={styles.bidButton} activeOpacity={0.82}>
          <Text style={styles.bidButtonText}>PUJA AHORA</Text>
        </TouchableOpacity>
      </View>

      {/* Pagination dots */}
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

function AuctionGridCard({ item }: { item: (typeof auctions)[number] }) {
  const isArgCurrency = item.currency.includes("ARG");

  return (
    <TouchableOpacity style={styles.gridCard} activeOpacity={0.85}>
      {/* Currency badge */}
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>{item.currency}</Text>
        </View>
      </View>

      {/* Product image */}
      <Image source={{ uri: item.image }} style={styles.gridImage} />

      {/* Bid info */}
      <View style={styles.gridBidRow}>
        <Text style={styles.gridBid}>{item.highestBid}</Text>
        <Text style={styles.gridTime}>{item.timeLeft}</Text>
      </View>

      {/* Title */}
      <Text style={styles.gridTitle} numberOfLines={2}>
        {item.title.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  return (
    <ScreenLayout activeTab="home">
      <HeroBanner />

      <Text style={styles.sectionTitle}>SUBASTAS ABIERTAS</Text>

      <View style={styles.grid}>
        {auctions.map((item) => (
          <AuctionGridCard key={item.id} item={item} />
        ))}
      </View>
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
  gridBid: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "900",
  },
  gridTime: {
    color: "#9ab0c4",
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "700",
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
});
