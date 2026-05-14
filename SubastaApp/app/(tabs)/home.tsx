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
  card: "#0f2a46",
  line: "#706b55",
  muted: "#b6ae9c",
  green: "#17c885",
  red: "#ff273a",
  blueLine: "#3f6389",
};

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

const tabs = [
  { id: "home", label: "HOME", icon: "radio-button-unchecked", badge: null },
  { id: "products", label: "PRODUCTOS", icon: "grid-view", badge: 12 },
  { id: "bids", label: "PUJAS", icon: "work-outline", badge: 3 },
  { id: "profile", label: "MI PERFIL", icon: "person-outline", badge: null },
] as const;

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

function AuctionCard({ item }: { item: (typeof auctions)[number] }) {
  return (
    <View style={styles.auctionCard}>
      <Image source={{ uri: item.image }} style={styles.auctionImage} />

      <View style={styles.auctionInfo}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <MaterialIcons name="chevron-right" size={22} color={C.gold} />
        </View>

        <Text style={styles.bidLine}>Mayor oferta actual</Text>
        <Text style={styles.bidAmount}>{item.highestBid}</Text>

        <View style={styles.auctionFooter}>
          <Text style={styles.timeLeft}>{item.timeLeft}</Text>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{item.currency}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const routes: Record<string, string> = {
    home: "/home",
    products: "/productos",
    bids: "/pujas",
    profile: "/perfil",
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
                  const route = routes[tab.id] ?? "/home";
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
  auctionCard: {
    alignItems: "center",
    backgroundColor: C.card,
    borderColor: C.blueLine,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 92,
    padding: 8,
  },
  auctionImage: {
    backgroundColor: "#f7f7f7",
    borderColor: "#d7d7d7",
    borderRadius: 9,
    borderWidth: 1,
    height: 68,
    marginRight: 10,
    width: 68,
  },
  auctionInfo: {
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
  bidLine: {
    color: C.muted,
    fontFamily: "serif",
    fontSize: 12,
    marginTop: 2,
  },
  bidAmount: {
    color: C.brightGold,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
  },
  auctionFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeLeft: {
    color: C.red,
    flex: 1,
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "900",
  },
  liveRow: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 8,
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
    fontSize: 12,
    fontWeight: "800",
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
