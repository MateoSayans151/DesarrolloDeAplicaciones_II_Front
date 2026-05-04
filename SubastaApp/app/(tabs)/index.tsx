import { Image } from "expo-image";
import { Link } from "expo-router";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/appicon.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>BIENVENIDO A{"\n"}SUBASTA APP</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Usuario"
            placeholderTextColor="#bfc8d6"
            style={styles.input}
          />
          <TextInput
            placeholder="Clave"
            placeholderTextColor="#bfc8d6"
            secureTextEntry
            style={styles.input}
          />
        </View>
        <Text style={styles.registerText}>
          No tienes una cuenta, registrate{" "}
          <Link href="/registro-postor" asChild>
            <Text style={styles.registerLink}>ACÁ</Text>
          </Link>
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Alert.alert("Iniciar sesión")}
        >
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07162b",
    width: "100%",
    height: "100%",
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 24,
    marginBottom: 16,
  },
  title: {
    color: "#e5e2c6",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    fontFamily: "serif",
    letterSpacing: 1,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#bfc8d6",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#e5e2c6",
    fontSize: 16,
    marginBottom: 12,
  },
  registerText: {
    color: "#bfc8d6",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  registerLink: {
    color: "#ffe082",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    //backgroundColor: 'linear-gradient(90deg, #ffe082 0%, #bfa14a 100%)', // fallback for gold effect
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
    // For gold gradient, you may need to use a gradient component
    backgroundColor: "#ffe082",
  },
  buttonText: {
    color: "#2d2d2d",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
