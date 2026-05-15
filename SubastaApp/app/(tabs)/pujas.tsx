import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
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
  line: "#706b55",
  muted: "#b6ae9c",
  green: "#17c885",
  blueLine: "#3f6389",
};

const bids = [
  {
    id: "1",
    title: "Ferrari 250 GTO (h. 1962)",
    currentBid: "$150,000 USD",
    timeLeft: "1d 3h",
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=120&h=120&fit=crop",
  },
  {
    id: "2",
    title: "Rolex Daytona (v. 1970)",
    currentBid: "$10,000 USD",
    timeLeft: "2d 1h",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=120&h=120&fit=crop",
  },
  {
    id: "3",
    title: "Apple iPhone 2G",
    currentBid: "$2,000 USD",
    timeLeft: "2d 2h",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&h=120&fit=crop",
  },
  {
    id: "4",
    title: "Sable Star Wars",
    currentBid: "$5,000 USD",
    timeLeft: "2d 6h",
    image:
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=120&h=120&fit=crop",
  },
];

function BidCard({ item }: { item: (typeof bids)[number] }) {
  return (
    <View style={styles.bidCard}>
      <View style={styles.imageColumn}>
        <Image source={{ uri: item.image }} style={styles.bidImage} />
        <TouchableOpacity style={styles.infoButton} activeOpacity={0.82}>
          <Text style={styles.infoText}>+ Info</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bidInfo}>
        <Text style={styles.bidTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.bidLabel}>Puja mayor actual:</Text>
        <Text style={styles.bidAmount}>{item.currentBid}</Text>
        <Text style={styles.timeLeft}>Tiempo restante: {item.timeLeft}</Text>
      </View>

      <TouchableOpacity style={styles.bidAction} activeOpacity={0.75}>
        <MaterialIcons name="gavel" size={30} color={C.gold} />
      </TouchableOpacity>
    </View>
  );
}

export default function PujasScreen() {
  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="light-content" backgroundColor={C.screen} />

      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader />

          <Text style={styles.sectionTitle}>MIS PUJAS</Text>

          <View style={styles.bids}>
            {bids.map((item) => (
              <BidCard key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>

        <BottomNav activeTab="pujas" />
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
  sectionTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
    marginLeft: 10,
    textAlign: "left",
  },
  bids: {
    gap: 10,
  },
  bidCard: {
    alignItems: "center",
    backgroundColor: "#0f2a46",
    borderColor: C.blueLine,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 86,
    paddingBottom: 6,
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  imageColumn: {
    alignItems: "center",
    marginRight: 8,
    width: 58,
  },
  bidImage: {
    backgroundColor: "#f7f7f7",
    borderColor: "#d7d7d7",
    borderRadius: 8,
    borderWidth: 1,
    height: 54,
    width: 54,
  },
  infoButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderColor: "#8d7435",
    borderRadius: 12,
    borderWidth: 1,
    height: 22,
    justifyContent: "center",
    marginTop: 3,
    width: 58,
  },
  infoText: {
    color: "#111111",
    fontFamily: "serif",
    fontSize: 14,
    fontWeight: "900",
  },
  bidInfo: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  bidTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 19,
  },
  bidLabel: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 12,
    lineHeight: 16,
  },
  bidAmount: {
    color: C.brightGold,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18,
  },
  timeLeft: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18,
  },
  bidAction: {
    alignItems: "center",
    borderColor: C.green,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    marginLeft: 8,
    width: 48,
  },
});
