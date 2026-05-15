import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomNav } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";

const C = {
  screen: "#00182b",
  gold: "#aaa18e",
  brightGold: "#e4bd56",
  card: "#0f2a46",
  line: "#706b55",
  muted: "#b6ae9c",
  green: "#17c885",
  red: "#ff273a",
  blueLine: "#3f6389",
};

const products = [
  {
    id: "1",
    title: 'Juego "Tazas de te" - Abuela Nona',
    description: "Juego historico de porcelana con caja original.",
    status: "Publicado",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=140&h=140&fit=crop",
  },
  {
    id: "2",
    title: "Consola PS4 Pro",
    description: "Consola en perfecto estado, acompanada de 4 juegos.",
    status: "En revision",
    image:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=140&h=140&fit=crop",
  },
];

const auctions = [
  {
    id: "1",
    title: "Subasta cuadros de arte",
    highestBid: "$550",
    currency: "Live USD",
    timeLeft: "10:00 min restantes",
  },
  {
    id: "2",
    title: "Subasta productos Sony",
    highestBid: "$3.400.000",
    currency: "Live ARG",
    timeLeft: "01:12 min restantes",
  },
];

function ProductCard({
  item,
  onInfo,
}: {
  item: (typeof products)[number];
  onInfo: (id: string) => void;
}) {
  return (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />

      <View style={styles.productInfo}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <MaterialIcons name="chevron-right" size={22} color={C.gold} />
        </View>

        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.productFooter}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <TouchableOpacity
            style={styles.smallButton}
            activeOpacity={0.82}
            onPress={() => onInfo(item.id)}
          >
            <Text style={styles.smallButtonText}>+ Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function AuctionCard({ item }: { item: (typeof auctions)[number] }) {
  return (
    <View style={styles.auctionCard}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <MaterialIcons name="chevron-right" size={22} color={C.gold} />
      </View>

      <View style={styles.auctionBottomRow}>
        <View style={styles.bidColumn}>
          <Text style={styles.bidLine}>Mayor oferta actual</Text>
          <Text style={styles.bidAmount}>{item.highestBid}</Text>
          <Text style={styles.timeLeft}>{item.timeLeft}</Text>
        </View>

        <View style={styles.auctionAction}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{item.currency}</Text>
          </View>
          <TouchableOpacity style={styles.enterButton} activeOpacity={0.8}>
            <Text style={styles.enterText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ProductosScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="light-content" backgroundColor={C.screen} />

      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MIS PRODUCTOS</Text>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
              <MaterialIcons name="add" size={22} color="#111111" />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {products.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onInfo={(id) =>
                  router.push(`/(tabs)/informacion-producto?id=${id}` as any)
                }
              />
            ))}
          </View>

          <View style={[styles.sectionHeader, styles.secondSection]}>
            <Text style={styles.sectionTitle}>MIS SUBASTAS</Text>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
              <MaterialIcons name="add" size={22} color="#111111" />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {auctions.map((item) => (
              <AuctionCard key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>

        <BottomNav activeTab="productos" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: C.screen,
    flex: 1,
  },
  screen: {
    backgroundColor: C.screen,
    flex: 1,
    marginTop: 50,
    overflow: "hidden",
  },
  content: {
    paddingBottom: 92,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingLeft: 10,
  },
  secondSection: {
    marginTop: 18,
  },
  sectionTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "left",
  },
  addButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 15,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  list: {
    gap: 10,
  },
  productCard: {
    alignItems: "center",
    backgroundColor: C.card,
    borderColor: C.blueLine,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 96,
    padding: 8,
  },
  productImage: {
    backgroundColor: "#f7f7f7",
    borderColor: "#d7d7d7",
    borderRadius: 9,
    borderWidth: 1,
    height: 70,
    marginRight: 10,
    width: 70,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardTitleRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  cardTitle: {
    color: C.gold,
    flex: 1,
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "900",
  },
  productDescription: {
    color: C.muted,
    fontFamily: "serif",
    fontSize: 13,
    lineHeight: 17,
    marginTop: 2,
  },
  productFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  statusPill: {
    alignItems: "center",
    borderColor: C.line,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: "row",
    height: 22,
    paddingHorizontal: 8,
  },
  statusDot: {
    backgroundColor: C.green,
    borderRadius: 4,
    height: 8,
    marginRight: 5,
    width: 8,
  },
  statusText: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "800",
  },
  smallButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 11,
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  smallButtonText: {
    color: "#111111",
    fontFamily: "serif",
    fontSize: 13,
    fontWeight: "900",
  },
  auctionCard: {
    backgroundColor: C.card,
    borderColor: C.blueLine,
    borderRadius: 15,
    borderWidth: 1,
    minHeight: 82,
    paddingBottom: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  auctionBottomRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  bidColumn: {
    flex: 1,
  },
  bidLine: {
    color: C.muted,
    fontFamily: "serif",
    fontSize: 12,
  },
  bidAmount: {
    color: C.brightGold,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
  },
  timeLeft: {
    color: C.red,
    fontFamily: "serif",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 1,
  },
  auctionAction: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  liveRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
  },
  liveDot: {
    backgroundColor: C.green,
    borderRadius: 4,
    height: 8,
    marginRight: 4,
    width: 8,
  },
  liveText: {
    color: C.green,
    fontFamily: "serif",
    fontSize: 13,
    fontWeight: "800",
  },
  enterButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 11,
    height: 26,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  enterText: {
    color: "#111111",
    fontFamily: "serif",
    fontSize: 14,
    fontWeight: "900",
  },
});
