import { Image } from "expo-image";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useRouter } from "expo-router";

export default function CuentaBancariaScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/appicon.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>AÑADIR CUENTA BANCARIA</Text>

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

      <TextInput placeholder="Titular de Cuenta" style={styles.input} placeholderTextColor= "#99988B" />
      <TextInput placeholder="Tipo de Cuenta" style={styles.input} placeholderTextColor= "#99988B" />
      <TextInput placeholder="Moneda" style={styles.input} placeholderTextColor= "#99988B" />
      <TextInput placeholder="CBU / Alias" style={styles.input} placeholderTextColor= "#99988B" />

      <Text style={styles.infoText}>
        Se requiere acreditar el origen lícito de los fondos. Verificación hasta
        48 días hábiles
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>REGISTRAR CUENTA</Text>
      </TouchableOpacity>
    </View>
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
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#bfc8d6",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#e5e2c6",
    fontSize: 16,
    marginBottom: 12,
  },
    backButton: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  backText: {
    color: "#bfc8d6",
    fontSize: 20,
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#d4af37",
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
  },
    infoText: {
    color: "#bfc8d6",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: { textAlign: "center", fontWeight: "bold", fontSize: 20 },
});
