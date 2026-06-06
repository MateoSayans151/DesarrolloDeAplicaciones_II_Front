import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { C } from "@/styles/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const notifications = [
  {
    id: "1",
    title: "Productos Sony",
    body: "Marco Sayan acaba de pujar $3.400.000.",
    time: "10:12",
    unread: true,
  },
  {
    id: "2",
    title: "Productos Sony",
    body: "Facundo Conde acaba de pujar $3.345.000.",
    time: "20:05",
    unread: true,
  },
  {
    id: "3",
    title: "Productos Sony",
    body: "Tomás Lacamis acaba de pujar $3.211.000.",
    time: "19:47",
    unread: false,
  },
];

const GOLD     = "#d4af37";
const GOLD_MID = "rgba(212,175,55,0.25)";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ visible, onClose }: Props) {
  const slideAnim   = useRef(new Animated.Value(-320)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 180,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -320,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>

              {/* ── Header ─────────────────────────────────────────── */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerIcon}>
                    <MaterialIcons name="notifications" size={16} color={GOLD} />
                  </View>
                  <Text style={styles.title}>NOTIFICACIONES</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                  <MaterialIcons name="close" size={18} color="#5a7a90" />
                </TouchableOpacity>
              </View>

              {/* Ornamento */}
              <View style={styles.ornamentRow}>
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
                <View style={styles.ornamentLine} />
              </View>

              {/* ── Lista ──────────────────────────────────────────── */}
              <View style={styles.list}>
                {notifications.map((n, i) => (
                  <View key={n.id} style={[styles.row, !n.unread && styles.rowRead]}>
                    {/* Indicador unread */}
                    <View style={styles.unreadCol}>
                      {n.unread && <View style={styles.unreadDot} />}
                    </View>

                    {/* Contenido */}
                    <View style={styles.rowContent}>
                      <View style={styles.rowTopRow}>
                        <Text style={[styles.rowTitle, !n.unread && styles.rowTitleRead]}>
                          {n.title}
                        </Text>
                        <Text style={styles.rowTime}>{n.time}</Text>
                      </View>
                      <Text style={styles.rowBody}>{n.body}</Text>
                    </View>

                    {/* Acción */}
                    <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
                      <MaterialIcons name="arrow-forward-ios" size={12} color={GOLD} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* ── Footer ─────────────────────────────────────────── */}
              <TouchableOpacity style={styles.clearBtn} activeOpacity={0.75}>
                <Text style={styles.clearText}>MARCAR TODO COMO LEÍDO</Text>
              </TouchableOpacity>

            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default NotificationsPanel;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-start",
    paddingTop: 88,
    paddingHorizontal: 16,
  },

  panel: {
    backgroundColor: "#080f1c",
    borderColor: GOLD_MID,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    // Sombra dorada sutil
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },

  // ── Header ───────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(212,175,55,0.1)",
    borderWidth: 1,
    borderColor: GOLD_MID,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: GOLD,
    fontFamily: "serif",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 3,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  // ── Ornamento ─────────────────────────────────────────────────────────
  ornamentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: GOLD_MID,
  },
  ornamentDiamond: {
    width: 4,
    height: 4,
    backgroundColor: GOLD,
    opacity: 0.6,
    transform: [{ rotate: "45deg" }],
  },

  // ── Lista ─────────────────────────────────────────────────────────────
  list: {
    paddingHorizontal: 12,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.15)",
    paddingVertical: 11,
    paddingHorizontal: 10,
  },
  rowRead: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.04)",
  },

  unreadCol: {
    width: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 3,
  },

  rowContent: {
    flex: 1,
    gap: 3,
  },
  rowTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowTitle: {
    color: "#e8d9bb",
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  rowTitleRead: {
    color: "#4a6a80",
  },
  rowBody: {
    color: "#6a8aa0",
    fontFamily: "serif",
    fontSize: 11,
    lineHeight: 15,
  },
  rowTime: {
    color: "#3a5a70",
    fontFamily: "serif",
    fontSize: 10,
  },

  actionBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(212,175,55,0.08)",
    borderWidth: 1,
    borderColor: GOLD_MID,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Footer ────────────────────────────────────────────────────────────
  clearBtn: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GOLD_MID,
    alignItems: "center",
  },
  clearText: {
    color: GOLD,
    fontFamily: "serif",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    opacity: 0.8,
  },
});
