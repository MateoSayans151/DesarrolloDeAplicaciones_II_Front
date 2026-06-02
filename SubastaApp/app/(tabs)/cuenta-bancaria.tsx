import { BackButton } from "@/components/BackButton";
import { LogoHeader } from "@/components/LogoHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useRegistro } from "@/context/RegistroContext";
import { inputStyles } from "@/styles/inputStyles";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CuentaBancariaScreen() {
  const router = useRouter();
  const { data, setMedioPago } = useRegistro();
  const cuenta =
    data.medioPagos[0]?.tipo === "CUENTA" ? data.medioPagos[0] : null;

  const [cbuAlias, setCbuAlias] = useState(cuenta?.cbuAlias ?? "");
  const [titularCuenta, setTitularCuenta] = useState(
    cuenta?.titularCuenta ?? "",
  );
  const [tipoCuenta, setTipoCuenta] = useState(cuenta?.tipoCuenta ?? "");
  const [moneda, setMoneda] = useState(cuenta?.moneda ?? "");

  const handleGuardar = () => {
    if (!cbuAlias || !titularCuenta || !tipoCuenta || !moneda) {
      Alert.alert(
        "Campos requeridos",
        "Completa todos los datos de la cuenta bancaria.",
      );
      return;
    }

    setMedioPago({
      tipo: "CUENTA",
      cbuAlias,
      titularCuenta,
      tipoCuenta,
      moneda,
    });
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <BackButton />
      <LogoHeader />
      <Text style={styles.title}>ANADIR CUENTA BANCARIA</Text>

      <View style={styles.bankIconContainer}>
        <View style={styles.bankIcon}>
          <View style={styles.bankRoof}>
            <View style={styles.bankRoofLeft} />
            <View style={styles.bankRoofRight} />
          </View>
          <View style={styles.bankTopBase} />
          <View style={styles.bankColumns}>
            <View style={styles.bankColumnGroup}>
              <View style={styles.bankColumnCap} />
              <View style={styles.bankColumnLine} />
              <View style={styles.bankColumnCap} />
            </View>
            <View style={styles.bankColumnGroup}>
              <View style={styles.bankColumnCap} />
              <View style={styles.bankColumnLine} />
              <View style={styles.bankColumnCap} />
            </View>
            <View style={styles.bankColumnGroup}>
              <View style={styles.bankColumnCap} />
              <View style={styles.bankColumnLine} />
              <View style={styles.bankColumnCap} />
            </View>
          </View>
          <View style={styles.bankBaseTop} />
          <View style={styles.bankBaseBottom} />
        </View>
      </View>

      <TextInput
        placeholder="CBU / Alias"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={cbuAlias}
        onChangeText={setCbuAlias}
      />
      <TextInput
        placeholder="Titular de la Cuenta"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={titularCuenta}
        onChangeText={setTitularCuenta}
      />
      <TextInput
        placeholder="Tipo de Cuenta (ej: Caja de Ahorro)"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={tipoCuenta}
        onChangeText={setTipoCuenta}
      />
      <TextInput
        placeholder="Moneda (ej: ARS)"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={moneda}
        onChangeText={setMoneda}
      />

      <Text style={styles.infoText}>
        Se requiere acreditar el origen licito de los fondos. Verificacion hasta
        48 dias habiles.
      </Text>

      <PrimaryButton
        label="REGISTRAR CUENTA"
        style={{ marginTop: 20 }}
        onPress={handleGuardar}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07162b", padding: 24 },
  title: {
    color: "#e5e2c6",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "serif",
    letterSpacing: 1,
    marginBottom: 12,
  },
  bankIconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  bankIcon: {
    width: 150,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  bankRoof: {
    width: 118,
    height: 34,
    position: "relative",
  },
  bankRoofLeft: {
    position: "absolute",
    left: 10,
    top: 17,
    width: 62,
    height: 1,
    backgroundColor: "#99988B",
    transform: [{ rotate: "-28deg" }],
  },
  bankRoofRight: {
    position: "absolute",
    right: 10,
    top: 17,
    width: 62,
    height: 1,
    backgroundColor: "#99988B",
    transform: [{ rotate: "28deg" }],
  },
  bankTopBase: {
    width: 118,
    height: 1,
    backgroundColor: "#99988B",
    marginBottom: 10,
  },
  bankColumns: {
    width: 104,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bankColumnGroup: {
    alignItems: "center",
  },
  bankColumnCap: {
    width: 20,
    height: 1,
    backgroundColor: "#99988B",
  },
  bankColumnLine: {
    width: 1,
    height: 34,
    backgroundColor: "#99988B",
    marginVertical: 3,
  },
  bankBaseTop: {
    width: 126,
    height: 1,
    backgroundColor: "#99988B",
    marginBottom: 6,
  },
  bankBaseBottom: {
    width: 142,
    height: 1,
    backgroundColor: "#99988B",
  },
  infoText: {
    color: "#bfc8d6",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
