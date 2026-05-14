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

const tabs = [
  { id: "home", label: "HOME", icon: "radio-button-unchecked", badge: null },
  { id: "productos", label: "PRODUCTOS", icon: "grid-view", badge: 12 },
  { id: "pujas", label: "PUJAS", icon: "work-outline", badge: 3 },
  { id: "perfil", label: "MI PERFIL", icon: "person-outline", badge: null },
] as const;

function ProductCard({ item }: { item: (typeof products)[number] }) {
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
          <TouchableOpacity style={styles.smallButton} activeOpacity={0.82}>
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
  const [activeTab, setActiveTab] = useState("products");

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

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MIS PRODUCTOS</Text>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
              <MaterialIcons name="add" size={22} color="#111111" />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {products.map((item) => (
              <ProductCard key={item.id} item={item} />
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

        <View style={styles.bottomNav}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.75}
                onPress={() => {
                  setActiveTab(tab.id);
                  const route = routes[tab.id] ?? "/productos";
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
