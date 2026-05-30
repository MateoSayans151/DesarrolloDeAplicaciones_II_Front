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

const notifications = [
  {
    id: "1",
    title: "Productos Sony",
    body: "Marco Sayan acaba de pujar $3.400.000.",
    time: "10:12",
  },
  {
    id: "2",
    title: "Productos Sony",
    body: "Facundo Conde acaba de pujar $3.345.000.",
    time: "20:05",
  },
  {
    id: "3",
    title: "Productos Sony",
    body: "Tomás Lacamis acaba de pujar $3.211.000.",
    time: "19:47",
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ visible, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(-300)).current;
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
          toValue: -300,
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
            <Animated.View
              style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}
            >
              <Text style={styles.title}>NOTIFICACIONES</Text>

              {notifications.map((n) => (
                <View key={n.id} style={styles.row}>
                  <View style={styles.rowContent}>
                    <Text style={styles.rowTitle}>{n.title}</Text>
                    <Text style={styles.rowBody}>{n.body}</Text>
                    <Text style={styles.rowTime}>{n.time}</Text>
                  </View>
                  <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
                    {/* Bell / action icon */}
                    <Text style={styles.iconText}>🔔</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.55)",
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 80, // below the header
    paddingHorizontal: 16,
  },
  panel: {
    backgroundColor: "#0b1e30",
    borderColor: C.blueLine,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  title: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 8,
  },
  row: {
    alignItems: "center",
    backgroundColor: "#0d2235",
    borderColor: "#1e3a54",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: "#e8d9bb",
    fontFamily: "serif",
    fontSize: 13,
    fontWeight: "900",
  },
  rowBody: {
    color: "#8aaec8",
    fontFamily: "serif",
    fontSize: 11,
    lineHeight: 15,
  },
  rowTime: {
    color: "#5a7a90",
    fontFamily: "serif",
    fontSize: 10,
    marginTop: 2,
  },
  iconBtn: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  iconText: {
    fontSize: 16,
  },
});
