import usuarioService, { NivelCategoria, NivelProgressResponse, UsuarioResponse } from "@/models/services/usuarioService";
import { C } from "@/styles/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NotificationsPanel } from "../app/views/notificaciones";
import { XPLevelRing } from "./XPLevelRing";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function ScreenHeader() {
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [nivelProgress, setNivelProgress] = useState<NivelProgressResponse | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0.4)).current;

  const refreshNotificationCount = useCallback(async () => {
    try {
      const notificaciones = await usuarioService.obtenerNotificaciones();
      setNotificationCount(notificaciones.length);
    } catch {
      setNotificationCount(0);
    }
  }, []);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const storageUsuario = await AsyncStorage.getItem("usuario");
        const usuarioParsed: UsuarioResponse | null = storageUsuario
          ? JSON.parse(storageUsuario)
          : null;
        setUsuario(usuarioParsed);
        console.log("[HEADER] cargando usuario desde storage:", usuarioParsed);

        if (usuarioParsed?.id != null) {
          console.log("[HEADER] cargando nivel progress para usuario:", usuarioParsed.id);
          setNivelProgress(await usuarioService.obtenerNivelProgress(usuarioParsed.id));
        }

      } catch (error: any) {
        console.error("[HEADER] error cargando usuario/nivel:", error);
        Alert.alert("Error", error.message || "No se pudo cargar el usuario.");
      }
    };
    cargarUsuario();
    refreshNotificationCount();
  }, [refreshNotificationCount]);

  // Pulso sutil en la campana si hay notificaciones
  useEffect(() => {
    if (!notificationCount) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.18, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    );
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1,   duration: 1200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    glow.start();
    return () => { loop.stop(); glow.stop(); };
  }, [notificationCount, pulseAnim, glowAnim]);

  const categoria = nivelProgress?.tier || usuario?.nivelCategoria?.nombre || "Sin categoría";

  return (
    <>
      {/* ── Título con ornamentos ─────────────────────────────────────── */}
      <View style={styles.titleWrap}>
        <View style={styles.ornamentRow}>
          <View style={styles.ornamentLine} />
          <View style={styles.ornamentDiamond} />
          <View style={styles.ornamentLine} />
        </View>
        <Text style={styles.title}>SUBASTA APP</Text>
        <View style={styles.ornamentRow}>
          <View style={styles.ornamentLine} />
          <View style={styles.ornamentDiamond} />
          <View style={styles.ornamentLine} />
        </View>
      </View>

      {/* ── Fila principal ────────────────────────────────────────────── */}
      <View style={styles.topRow}>

        {/* ── Avatar / Perfil ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push("/views/perfil")}
          activeOpacity={0.8}
        >
          <View style={styles.avatarWrap}>
            {/* Glow ring exterior */}
            <Animated.View style={[styles.avatarGlow, { opacity: glowAnim }]} />
            <Image
              source={usuario?.fotoBase64 ? { uri: usuario.fotoBase64 } : undefined}
              style={styles.avatar}
              contentFit="cover"
            />
            {/* Indicador de estado online */}
            <View style={styles.onlineDot} />
          </View>

          {/* Etiqueta de categoría tipo joyería */}
          <View style={styles.categoriaBadge}>
            <View style={styles.categoriaBadgeDot} />
            <Text style={styles.categoriaText}>{categoria}</Text>
          </View>
        </TouchableOpacity>

        {/* ── XP Ring centrado ─────────────────────────────────────────── */}
        <View style={styles.ringWrap}>
          <XPLevelRing
            size={90}
            strokeWidth={3}
            tier={nivelProgress?.tier?.toLowerCase() as any || "comun"}
            progreso={nivelProgress?.progreso ?? 0}
          />
        </View>

        {/* ── Notificaciones ───────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => setShowNotifs(true)}
          activeOpacity={0.8}
        >
          <View style={styles.bellWrap}>
            {/* Glow de fondo */}
            <Animated.View style={[styles.bellGlow, { opacity: glowAnim }]} />
            <Animated.View style={{ transform: [{ scale: notificationCount ? pulseAnim : new Animated.Value(1) }] }}>
              <MaterialIcons name="notifications-none" size={30} color={C.gold} />
            </Animated.View>

            {/* Badge de conteo */}
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.notifLabel}>AVISOS</Text>
        </TouchableOpacity>

      </View>

      {/* ── Separador art-deco inferior ──────────────────────────────── */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <View style={styles.dividerDot} />
        <View style={[styles.dividerLine, { width: 32 }]} />
        <View style={[styles.dividerDot, styles.dividerDotLarge]} />
        <View style={[styles.dividerLine, { width: 32 }]} />
        <View style={styles.dividerDot} />
        <View style={styles.dividerLine} />
      </View>

      <NotificationsPanel
        visible={showNotifs}
        onClose={() => {
          setShowNotifs(false);
          refreshNotificationCount();
        }}
      />
    </>
  );
}

const GOLD       = "#d4af37";
const GOLD_FAINT = "rgba(212,175,55,0.12)";
const GOLD_MID   = "rgba(212,175,55,0.35)";

const styles = StyleSheet.create({
  // ── Título ──────────────────────────────────────────────────────────
  titleWrap: {
    alignItems: "center",
    marginBottom: 18,
    gap: 6,
  },
  title: {
    color: GOLD,
    fontFamily: "serif",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 8,
    textAlign: "center",
  },
  ornamentRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    width: "60%",
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: GOLD_MID,
  },
  ornamentDiamond: {
    width: 5,
    height: 5,
    backgroundColor: GOLD,
    transform: [{ rotate: "45deg" }],
    opacity: 0.7,
  },

  // ── Fila principal ──────────────────────────────────────────────────
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingHorizontal: 4,
  },

  // ── Perfil ──────────────────────────────────────────────────────────
  profileBtn: {
    alignItems: "center",
    gap: 8,
    width: 88,
  },
  avatarWrap: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 56,
    height: 56,
  },
  avatarGlow: {
    position: "absolute",
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: GOLD_MID,
    backgroundColor: "#0d1e33",
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#4cdf8a",
    borderWidth: 2,
    borderColor: "#07162b",
  },
  categoriaBadge: {
    alignItems: "center",
    backgroundColor: GOLD_FAINT,
    borderColor: GOLD_MID,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  categoriaBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: GOLD,
    opacity: 0.8,
  },
  categoriaText: {
    color: GOLD,
    fontFamily: "serif",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  // ── XP Ring ─────────────────────────────────────────────────────────
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Notificaciones ──────────────────────────────────────────────────
  notifBtn: {
    alignItems: "center",
    gap: 8,
    width: 88,
  },
  bellWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_MID,
    position: "relative",
  },
  bellGlow: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#c0392b",
    borderWidth: 1.5,
    borderColor: "#07162b",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
  },
  notifLabel: {
    color: GOLD,
    fontFamily: "serif",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
  },

  // ── Separador inferior ──────────────────────────────────────────────
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: GOLD_MID,
    maxWidth: 60,
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: GOLD,
    opacity: 0.5,
  },
  dividerDotLarge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.9,
  },
});
