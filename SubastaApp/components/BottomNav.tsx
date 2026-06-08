import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { C } from "@/styles/colors";

const USER_TABS = [
  { id: "home",      label: "HOME",      icon: "radio-button-unchecked", badge: null, route: "/home"      },
  { id: "productos", label: "PRODUCTOS", icon: "grid-view",              badge: null, route: "/productos"  },
  { id: "pujas",     label: "PUJAS",     icon: "work-outline",           badge: null, route: "/pujas"      },
  { id: "perfil",    label: "PERFIL",    icon: "person-outline",         badge: null, route: "/perfil"     },
] as const;

const ADMIN_TABS = [
  { id: "admin-subastas",  label: "SUBASTAS",  icon: "gavel",          badge: null, route: "/admin-subastas"  },
  { id: "admin-productos", label: "PRODUCTOS", icon: "inventory",      badge: null, route: "/admin-productos" },
  { id: "admin-catalogos", label: "CATÁLOGOS", icon: "list-alt",       badge: null, route: "/admin-catalogos" },
  { id: "admin-usuarios",  label: "USUARIOS",  icon: "how-to-reg",     badge: null, route: "/admin-usuarios"  },
  { id: "perfil",          label: "PERFIL",    icon: "person-outline", badge: null, route: "/perfil"          },
] as const;

export type TabId =
  | (typeof USER_TABS)[number]["id"]
  | (typeof ADMIN_TABS)[number]["id"];

type AnyTab = { id: string; label: string; icon: string; badge: null | number; route: string };

const GOLD     = "#d4af37";
const GOLD_MID = "rgba(212,175,55,0.30)";
const MUTED    = "#3a5a78";

// ─── Tab item ────────────────────────────────────────────────────────────────

function TabItem({ tab, isActive, onPress }: { tab: AnyTab; isActive: boolean; onPress: () => void }) {
  const pillWidth = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(pillWidth, { toValue: isActive ? 1 : 0, useNativeDriver: false, tension: 80, friction: 10 }).start();
  }, [isActive]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(iconScale, { toValue: 0.8, duration: 70, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1, tension: 200, friction: 6, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const animatedPillWidth = pillWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 28] });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={styles.tabItem}>
      <Animated.View style={[styles.pill, { width: animatedPillWidth }]} />
      <Animated.View style={[styles.iconWrap, { transform: [{ scale: iconScale }] }]}>
        <MaterialIcons name={tab.icon as any} size={28} color={isActive ? GOLD : MUTED} />
        {tab.badge != null && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{tab.badge > 9 ? "9+" : tab.badge}</Text>
          </View>
        )}
      </Animated.View>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
    </TouchableOpacity>
  );
}

// ─── BottomNav ───────────────────────────────────────────────────────────────

export function BottomNav({ activeTab, isAdmin }: { activeTab: TabId; isAdmin?: boolean }) {
  const router = useRouter();
  const tabs: AnyTab[] = isAdmin ? [...ADMIN_TABS] : [...USER_TABS];

  return (
    <View style={styles.container}>
      <View style={styles.ornamentRow}>
        <View style={styles.ornamentLine} />
        <View style={styles.ornamentDiamond} />
        <View style={[styles.ornamentLine, { maxWidth: 28 }]} />
        <View style={[styles.ornamentDiamond, { width: 6, height: 6, opacity: 0.9 }]} />
        <View style={[styles.ornamentLine, { maxWidth: 28 }]} />
        <View style={styles.ornamentDiamond} />
        <View style={styles.ornamentLine} />
      </View>
      <View style={styles.row}>
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onPress={() => router.push(tab.route as any)}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#07162b", paddingBottom: 6, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 20 },
  ornamentRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 8, paddingHorizontal: 24 },
  ornamentLine: { flex: 1, height: 1, backgroundColor: GOLD_MID, maxWidth: 52 },
  ornamentDiamond: { width: 4, height: 4, backgroundColor: GOLD, opacity: 0.5, transform: [{ rotate: "45deg" }] },
  row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-around", paddingHorizontal: 8 },
  tabItem: { flex: 1, alignItems: "center", gap: 3 },
  pill: { height: 2, borderRadius: 1, backgroundColor: GOLD, marginBottom: 4, shadowColor: GOLD, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 5, elevation: 4 },
  iconWrap: { alignItems: "center", justifyContent: "center", width: 40, height: 34 },
  badge: { position: "absolute", top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: "#c0392b", borderWidth: 1.5, borderColor: "#07162b", alignItems: "center", justifyContent: "center", paddingHorizontal: 2 },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "900" },
  tabText: { color: MUTED, fontFamily: "serif", fontSize: 11, fontWeight: "700", letterSpacing: 1.2 },
  activeTabText: { color: GOLD, fontWeight: "900" },
});
