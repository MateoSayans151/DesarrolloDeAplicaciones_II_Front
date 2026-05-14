import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const C = {
  page: "#1f1f1f",
  screen: "#00182b",
  gold: "#aaa18e",
  brightGold: "#e4bd56",
  bidCard: "#0f2a46",
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

const tabs = [
  { id: "home", label: "HOME", icon: "radio-button-unchecked", badge: null },
  { id: "productos", label: "PRODUCTOS", icon: "grid-view", badge: 12 },
  { id: "pujas", label: "PUJAS", icon: "work-outline", badge: 3 },
  { id: "perfil", label: "MI PERFIL", icon: "person-outline", badge: null },
] as const;

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("bids");

  const routes: Record<string, string> = {
    home: "/home",
    productos: "/productos",
    pujas: "/pujas",
    perfil: "/perfil",
  };

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle="light-content" backgroundColor={C.screen} />

      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>SUBASTA APP</Text>

          <View style={styles.topRow}>
            <View style={styles.sideInfo}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
                }}
                style={styles.avatar}
              />
              <Text style={styles.sideLabel}>CATEGORIA: ORO</Text>
            </View>

            <View style={styles.starCircle}>
              <MaterialIcons name="star" size={48} color={C.gold} />
            </View>

            <View style={styles.sideInfo}>
              <View style={styles.bellBox}>
                <MaterialIcons
                  name="notifications-none"
                  size={46}
                  color={C.gold}
                />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>3</Text>
                </View>
              </View>
              <Text style={styles.sideLabel}>NOTIFICACIONES</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>MIS PUJAS</Text>

          <View style={styles.bids}>
            {bids.map((item) => (
              <BidCard key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.75}
                onPress={() => {
                  setActiveTab(tab.id);
                  const route = routes[tab.id] ?? "/pujas";
                  router.push(route);
                }}
                style={styles.tabItem}
              >
                <View>
                  <MaterialIcons
                    name={tab.icon}
                    size={25}
                    color={isActive ? C.gold : C.muted}
                  />
                  {tab.badge != null && (
                    <Text style={styles.tabBadge}>{tab.badge}</Text>
                  )}
                </View>
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
  title: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: "center",
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  sideInfo: {
    alignItems: "center",
    width: 92,
  },
  avatar: {
    borderColor: "#e6dac2",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    marginBottom: 6,
    width: 44,
  },
  sideLabel: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  starCircle: {
    alignItems: "center",
    borderColor: C.line,
    borderRadius: 38,
    borderWidth: 2,
    height: 76,
    justifyContent: "center",
    width: 76,
  },
  bellBox: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    marginBottom: 2,
    width: 58,
  },
  notificationBadge: {
    alignItems: "center",
    backgroundColor: "#aa8b3f",
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: 6,
    top: -4,
    width: 20,
  },
  notificationText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
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
    backgroundColor: C.bidCard,
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
  bottomNav: {
    alignItems: "center",
    backgroundColor: C.screen,
    borderTopColor: "#aac1d8",
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    height: 72,
    justifyContent: "space-around",
    left: 0,
    marginBottom: 10,
    position: "absolute",
    right: 0,
  },
  tabItem: {
    alignItems: "center",
    minWidth: 66,
  },
  tabBadge: {
    color: C.gold,
    fontSize: 11,
    position: "absolute",
    right: -12,
    top: -7,
  },
  tabText: {
    color: C.muted,
    fontFamily: "serif",
    fontSize: 13,
    marginTop: 2,
  },
  activeTabText: {
    color: C.gold,
  },
});
