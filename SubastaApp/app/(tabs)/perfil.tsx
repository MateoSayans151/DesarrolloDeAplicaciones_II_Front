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
  line: "#706b55",
  muted: "#b6ae9c",
  green: "#17c885",
  blueLine: "#3f6389",
};

const paymentMethods = [
  { id: "1", brand: "Visa", last4: "1234", status: "Verificado" },
  { id: "2", brand: "Visa", last4: "1234", status: "Verificado" },
  { id: "3", brand: "Visa", last4: "1234", status: "Verificado" },
];

const stats = [
  { id: "1", label: "PARTICIPACION", value: "12" },
  { id: "2", label: "EXITOSAS", value: "4" },
  { id: "3", label: "TOTAL\nOFERTADO (USD)", value: "2.352" },
  { id: "4", label: "MAYOR\nPUJA", value: "600" },
  { id: "5", label: "TOTAL\nPAGADO (USD)", value: "1.385" },
  { id: "6", label: "SUBASTAS\nPUBLICADAS", value: "0" },
];

const categoryStats = [
  { id: "1", label: "AUTOMOVILES", value: "2" },
  { id: "2", label: "RELOJERIA", value: "6" },
  { id: "3", label: "TECNOLOGIA", value: "4" },
  { id: "4", label: "HOGARENO", value: "8" },
];

const tabs = [
  { id: "home", label: "HOME", icon: "radio-button-unchecked", badge: null },
  { id: "products", label: "PRODUCTOS", icon: "grid-view", badge: 12 },
  { id: "bids", label: "PUJAS", icon: "work-outline", badge: 3 },
  { id: "profile", label: "MI PERFIL", icon: "person-outline", badge: null },
] as const;

function PaymentMethodCard({
  item,
}: {
  item: (typeof paymentMethods)[number];
}) {
  return (
    <View style={styles.paymentCard}>
      <Text style={styles.paymentText}>
        {item.brand} **** {item.last4},
      </Text>

      <View style={styles.paymentStatus}>
        <Text style={styles.verifiedText}>{item.status}</Text>
        <MaterialIcons name="check-circle" size={19} color={C.green} />
      </View>
    </View>
  );
}

function StatCard({ item }: { item: (typeof stats)[number] }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{item.label}</Text>
      <Text style={styles.statValue}>{item.value}</Text>
    </View>
  );
}

function CategoryStatCard({
  item,
}: {
  item: (typeof categoryStats)[number];
}) {
  return (
    <View style={styles.categoryCard}>
      <Text style={styles.categoryLabel}>{item.label}</Text>
      <Text style={styles.categoryValue}>{item.value}</Text>
    </View>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

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

          <View style={styles.userData}>
            <View style={styles.userRow}>
              <Text style={styles.userLabel}>Usuario</Text>
              <Text style={styles.userValue}>Admin</Text>
            </View>
            <View style={styles.userRow}>
              <Text style={styles.userLabel}>Correo</Text>
              <Text style={styles.userValue}>admin@gmail.com</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>MIS MEDIOS DE PAGO</Text>

          <View style={styles.paymentList}>
            {paymentMethods.map((item) => (
              <PaymentMethodCard key={item.id} item={item} />
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.82}>
            <Text style={styles.primaryButtonText}>ANADIR NUEVO</Text>
          </TouchableOpacity>

          <View style={styles.securityCopy}>
            <Text style={styles.securityText}>
              Tu clave personal protege tu participacion en las subastas.
            </Text>
            <Text style={styles.securityText}>
              Esta informacion es privada y esencial para tu participacion.
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.82}>
            <Text style={styles.primaryButtonText}>ACTUALIZAR DATOS</Text>
          </TouchableOpacity>

          <View style={styles.statsSection}>
            <View style={styles.statsDivider} />
            <Text style={styles.statsTitle}>ESTADISTICAS</Text>
            <View style={styles.statsGrid}>
              {stats.map((item) => (
                <StatCard key={item.id} item={item} />
              ))}
            </View>
          </View>

          <View style={styles.categorySection}>
            <View style={styles.statsDivider} />
            <Text style={styles.categoryTitle}>
              PARTICIPACION POR CATEGORIA
            </Text>
            <View style={styles.categoryGrid}>
              {categoryStats.map((item) => (
                <CategoryStatCard key={item.id} item={item} />
              ))}
            </View>
            <TouchableOpacity
              style={styles.historyButton}
              activeOpacity={0.82}
            >
              <Text style={styles.historyButtonText}>
                VER HISTORIAL DE PUJAS
              </Text>
            </TouchableOpacity>
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
                  const route = routes[tab.id] ?? "/perfil";
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
  userData: {
    alignSelf: "center",
    marginBottom: 24,
    width: "68%",
  },
  userRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 13,
  },
  userLabel: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "900",
    width: 86,
  },
  userValue: {
    color: C.gold,
    flex: 1,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "800",
  },
  sectionTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 18,
    textAlign: "center",
  },
  paymentList: {
    gap: 7,
    marginBottom: 10,
  },
  paymentCard: {
    alignItems: "center",
    borderColor: C.blueLine,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    height: 49,
    justifyContent: "space-between",
    paddingHorizontal: 17,
  },
  paymentText: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
  },
  paymentStatus: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  verifiedText: {
    color: C.green,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#111111",
    fontFamily: "serif",
    fontSize: 17,
    fontWeight: "900",
  },
  securityCopy: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 9,
    paddingHorizontal: 4,
  },
  securityText: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 22,
    marginBottom: 5,
    textAlign: "center",
  },
  statsSection: {
    marginTop: 26,
  },
  statsDivider: {
    backgroundColor: C.line,
    height: 1,
    width: "100%",
  },
  statsTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 18,
    marginTop: 18,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    justifyContent: "center",
    marginBottom: 26,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#202f3a",
    borderColor: C.line,
    borderRadius: 15,
    borderWidth: 1,
    height: 92,
    justifyContent: "center",
    width: "42%",
  },
  statLabel: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17,
    marginBottom: 6,
    textAlign: "center",
  },
  statValue: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 35,
    textAlign: "center",
  },
  categorySection: {
    marginTop: 22,
  },
  categoryTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 14,
    marginTop: 18,
    textAlign: "center",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    justifyContent: "center",
    marginBottom: 28,
  },
  categoryCard: {
    alignItems: "center",
    backgroundColor: "#202f3a",
    borderColor: C.line,
    borderRadius: 15,
    borderWidth: 1,
    height: 92,
    justifyContent: "center",
    width: "42%",
  },
  categoryLabel: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  categoryValue: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 35,
    textAlign: "center",
  },
  historyButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    marginBottom: 10,
  },
  historyButtonText: {
    color: "#111111",
    fontFamily: "serif",
    fontSize: 16,
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
