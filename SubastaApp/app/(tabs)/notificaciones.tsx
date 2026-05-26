import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";

const NOTIFICACIONES = [
  {
    id: "1",
    titulo: "Productos Sony",
    mensaje: "Mateo Sayans acaba de pujar $3.400.000.",
    hora: "20:12",
  },
  {
    id: "2",
    titulo: "Productos Sony",
    mensaje: "Facundo Conde acaba de pujar $3.345.000.",
    hora: "20:03",
  },
  {
    id: "3",
    titulo: "Productos Sony",
    mensaje: "Tomás Lecuenis acaba de pujar $3.211.000.",
    hora: "19:47",
  },
];

type Notificacion = (typeof NOTIFICACIONES)[number];

function NotificacionItem({ item }: { item: Notificacion }) {
  const router = useRouter();

  return (
    <View style={styles.notifItem}>
      <View style={styles.notifContent}>
        <Text style={styles.notifTitulo}>{item.titulo}</Text>
        <Text style={styles.notifMensaje}>{item.mensaje}</Text>
        <Text style={styles.notifHora}>{item.hora}</Text>
      </View>
      <TouchableOpacity
        style={styles.irButton}
        activeOpacity={0.8}
        onPress={() => router.push("/subastas")}
      >
        <Text style={styles.irButtonText}>Ir</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function NotificacionesScreen() {
  return (
    <ScreenLayout activeTab="home">
      <View style={styles.modal}>
        <Text style={styles.titulo}>NOTIFICACIONES</Text>
        <View style={styles.lista}>
          {NOTIFICACIONES.map((item) => (
            <NotificacionItem key={item.id} item={item} />
          ))}
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#0d2039",
    borderColor: "#99988b",
    borderRadius: 24,
    borderWidth: 1,
    paddingBottom: 60,
    paddingHorizontal: 24,
    paddingTop: 38,
  },
  titulo: {
    color: "#99988b",
    fontFamily: "serif",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  lista: {
    gap: 16,
  },
  notifItem: {
    alignItems: "center",
    borderColor: "#99988b",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  notifContent: {
    flex: 1,
    gap: 4,
    paddingRight: 8,
  },
  notifTitulo: {
    color: "#bab9b4",
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "700",
  },
  notifMensaje: {
    color: "#99988b",
    fontFamily: "serif",
    fontSize: 14,
  },
  notifHora: {
    color: "#99988b",
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "500",
  },
  irButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 10,
    height: 27,
    justifyContent: "center",
    width: 49,
  },
  irButtonText: {
    color: "#091525",
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "700",
  },
});
