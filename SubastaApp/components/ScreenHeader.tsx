import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { C } from "@/styles/colors";
import { XPLevelRing } from "./XPLevelRing";

type Props = {
  notificationCount?: number;
};

export function ScreenHeader({ notificationCount = 3 }: Props) {
  const router = useRouter();
  return (
    <>
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

        <View>
          <XPLevelRing size={90} strokeWidth={3} tier="gold" />
        </View>

        <TouchableOpacity
          style={styles.sideInfo}
          activeOpacity={0.75}
          onPress={() => router.push("/notificaciones")}
        >
          <View style={styles.bellBox}>
            <MaterialIcons name="notifications-none" size={46} color={C.gold} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          </View>
          <Text style={styles.sideLabel}>NOTIFICACIONES</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
});
