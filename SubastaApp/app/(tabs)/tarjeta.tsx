import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function TarjetaScreen() {
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
      <Text style={styles.title}>AÑADIR TARJETA DE CRÉDITO</Text>

      <View style={styles.cardIconContainer}>
        <View style={styles.cardIcon}>
          <View style={styles.cardChip} />
          <View style={styles.cardLine} />
        </View>
      </View>

      <TextInput
        placeholder="Número de Tarjeta"
        style={styles.input}
        placeholderTextColor="#99988B"
      />
      <TextInput
        placeholder="Nombre del Titular"
        style={styles.input}
        placeholderTextColor="#99988B"
      />
      <TextInput
        placeholder="MM/AA"
        style={styles.input}
        placeholderTextColor="#99988B"
      />
      <TextInput
        placeholder="CVV"
        style={styles.input}
        placeholderTextColor="#99988B"
      />

      <Text style={styles.infoText}>
        Al guardar, autoriza a Subasta App a verificar la validez mediante una
        retención temporal.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>GUARDAR TARJETA</Text>
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
  cardIconContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  cardIcon: {
    width: 150,
    height: 100,
    borderColor: "#99988B",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "space-between",
  },
  cardChip: {
    width: 30,
    height: 22,
    borderColor: "#99988B",
    borderWidth: 1,
    borderRadius: 5,
  },
  cardLine: {
    width: 58,
    height: 1,
    backgroundColor: "#99988B",
    alignSelf: "flex-end",
  },
  button: {
    backgroundColor: "#d4af37",
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
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
  infoText: {
    color: "#bfc8d6",
    fontSize: 13,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 26,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
  buttonText: { textAlign: "center", fontWeight: "bold", fontSize: 20 },
});
