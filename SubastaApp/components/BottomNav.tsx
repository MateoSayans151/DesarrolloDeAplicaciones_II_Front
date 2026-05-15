import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const C = {
  screen: "#00182b",
  gold: "#aaa18e",
  muted: "#b6ae9c",
};

const TABS = [
  { id: "home", label: "HOME", icon: "radio-button-unchecked", badge: null, route: "/home" },
  { id: "productos", label: "PRODUCTOS", icon: "grid-view", badge: 12, route: "/productos" },
  { id: "pujas", label: "PUJAS", icon: "work-outline", badge: 3, route: "/pujas" },
  { id: "perfil", label: "MI PERFIL", icon: "person-outline", badge: null, route: "/perfil" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

type Props = {
  activeTab: TabId;
};

export function BottomNav({ activeTab }: Props) {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.75}
            onPress={() => router.push(tab.route as any)}
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
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
