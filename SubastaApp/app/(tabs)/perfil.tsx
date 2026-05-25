import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/config";
import { useEffect, useState } from "react";
import usuarioService, { UsuarioResponse } from "@/models/services/usuarioService";

const paymentMethods = [
  { id: 1, tipo: "Visa", ultimosNumeros: 1234, verificado: "si" },
  { id: 2, tipo: "Visa", ultimosNumeros: 1234, verificado: "si" },
  { id: 3, tipo: "Visa", ultimosNumeros: 1234, verificado: "si" },
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


function PaymentMethodCard({
  item,
}: {
  item: (typeof paymentMethods)[number];
}) {
  return (
    <View style={styles.paymentCard}>
      <Text style={styles.paymentText}>
        {item.tipo} **** {item.ultimosNumeros}
      </Text>

      <View style={styles.paymentStatus}>
        <Text style={item.verificado === "si" ? styles.verifiedText : styles.notVerifiedText}>
          {item.verificado}
        </Text>
        <MaterialIcons name={item.verificado === "si" ? "check-circle" : "cancel"} size={19} color={item.verificado === "si" ? C.green : C.red} />
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
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  useEffect(() => {
  const cargarUsuario = async () => {
    try {
      const data = await usuarioService.obtenerPerfil();
      setUsuario(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el perfil.");
    }
  };

  cargarUsuario();
}, []);


  return (
    <ScreenLayout activeTab="perfil">
      <View style={styles.userData}>
        <View style={styles.userRow}>
          <Text style={styles.userLabel}>{usuario?.nombre}</Text>
          <Text style={styles.userValue}>{usuario?.categoria}</Text>
        </View>
        <View style={styles.userRow}>
          <Text style={styles.userLabel}>Correo</Text>
          <Text style={styles.userValue}>{usuario?.documento}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>MIS MEDIOS DE PAGO</Text>

      <View style={styles.paymentList}>
        {usuario?.mediosPago?.map((item) => (
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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
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
  notVerifiedText: {
    color: C.red,
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
});
