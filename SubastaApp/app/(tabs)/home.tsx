import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuctionCard } from "@/components/AuctionCard";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";

const featuredAuctions = [
  {
    id: "1",
    title: "Autos clasicos",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=220&h=150&fit=crop",
  },
  {
    id: "2",
    title: "Relojes vintage",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=220&h=150&fit=crop",
  },
  {
    id: "3",
    title: "Tecnologia",
    image:
      "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=220&h=150&fit=crop",
  },
];

const auctions = [
  {
    id: "1",
    title: "Subasta cuadros de arte",
    highestBid: "$550",
    currency: "Live USD",
    timeLeft: "10:00 min restantes",
    image:
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=120&h=120&fit=crop",
  },
  {
    id: "2",
    title: "Subasta productos Sony",
    highestBid: "$3.400.000",
    currency: "Live ARG",
    timeLeft: "01:12 min restantes",
    image:
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=120&h=120&fit=crop",
  },
  {
    id: "3",
    title: "Subasta coleccion Lego",
    highestBid: "$1.200.000",
    currency: "Live ARG",
    timeLeft: "25:00 min restantes",
    image:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=120&h=120&fit=crop",
  },
];

function FeaturedCard({ item }: { item: (typeof featuredAuctions)[number] }) {
  return (
    <View style={styles.featuredItem}>
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredItemTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ScreenLayout activeTab="home">
      <View style={styles.featuredCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.featuredTitle}>DESTACADOS</Text>
          <TouchableOpacity style={styles.viewButton} activeOpacity={0.82}>
            <Text style={styles.viewButtonText}>Ver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuredRow}>
          {featuredAuctions.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        </View>
      </View>

      <Text style={styles.sectionTitle}>SUBASTAS ABIERTAS</Text>

      <View style={styles.list}>
        {auctions.map((item) => (
          <AuctionCard key={item.id} item={item} />
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    backgroundColor: C.card,
    borderColor: C.blueLine,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 18,
    padding: 10,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  featuredTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "900",
  },
  featuredRow: {
    flexDirection: "row",
    gap: 8,
  },
  featuredItem: {
    borderColor: C.line,
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    height: 82,
    overflow: "hidden",
  },
  featuredImage: {
    height: "100%",
    width: "100%",
  },
  featuredOverlay: {
    backgroundColor: "rgba(0, 24, 43, 0.72)",
    bottom: 0,
    left: 0,
    paddingHorizontal: 5,
    paddingVertical: 4,
    position: "absolute",
    right: 0,
  },
  featuredItemTitle: {
    color: "#f0dfb9",
    fontFamily: "serif",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  viewButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  viewButtonText: {
    color: "#111111",
    fontFamily: "serif",
    fontSize: 13,
    fontWeight: "900",
  },
  sectionTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
    marginLeft: 10,
    textAlign: "left",
  },
  list: {
    gap: 10,
  },
});
