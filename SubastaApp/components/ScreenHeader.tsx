import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { C } from "@/styles/colors";
import { XPLevelRing } from "./XPLevelRing";
import { NotificationsPanel } from "../app/(tabs)/Notificaciones";

type Props = {
  notificationCount?: number;
};

export function ScreenHeader({ notificationCount = 3 }: Props) {
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <>
      <Text style={styles.title}>SUBASTA APP</Text>

      <View style={styles.topRow}>
        {/* Foto de perfil → navega a Mi Perfil */}
        <TouchableOpacity
          style={styles.sideInfo}
          onPress={() => router.push("/perfil")}
          activeOpacity={0.75}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
            }}
            style={styles.avatar}
          />
          <Text style={styles.sideLabel} numberOfLines={1} adjustsFontSizeToFit>
            CATEGORIA: ORO
          </Text>
        </TouchableOpacity>

        <View>
          <XPLevelRing size={90} strokeWidth={3} tier="gold" />
        </View>

        {/* Campana → abre panel de notificaciones */}
        <TouchableOpacity
          style={styles.sideInfo}
          onPress={() => setShowNotifs(true)}
          activeOpacity={0.75}
        >
          <View style={styles.bellBox}>
            <MaterialIcons name="notifications-none" size={46} color={C.gold} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          </View>
          <Text style={styles.sideLabel} numberOfLines={1} adjustsFontSizeToFit>
            NOTIFICACIONES
          </Text>
        </TouchableOpacity>
      </View>

      <NotificationsPanel
        visible={showNotifs}
        onClose={() => setShowNotifs(false)}
      />
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
    fontSize: 24,
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
