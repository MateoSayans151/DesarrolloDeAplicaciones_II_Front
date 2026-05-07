import { Image } from "expo-image";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function RegistroPaso2() {
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
      <Text style={styles.title}>REGISTRO DE POSTOR</Text>
      <Text style={styles.subtitle}>PASO 2 DE 2</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressDotActive} />
        <View style={styles.progressDotActive} />
      </View>
      <Text style={styles.section}>CLAVE PERSONAL</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nueva Clave Personal"
          style={styles.input}
          placeholderTextColor="#bfc8d6"
          secureTextEntry
        />
        <TextInput
          placeholder="Confirmar Clave Personal"
          style={styles.input}
          placeholderTextColor="#bfc8d6"
          secureTextEntry
        />
      </View>

      <Text style={styles.section}>MEDIO DE PAGO OBLIGATORIO</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/tarjeta")}
        >
          <Text style={styles.optionText}>AÑADIR TARJETA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/cuenta-bancaria")}
        >
          <Text style={styles.optionText}>AÑADIR CUENTA BANCARIA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/cheque")}
        >
          <Text style={styles.optionText}>REGISTRAR CHEQUE</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.infoText}>
        IMPORTANTE: DEBERÁS TENER UN MEDIO DE PAGO REGISTRADO PARA PODER
        PARTICIPAR EN LAS SUBASTAS.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>FINALIZAR REGISTRO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#07162b",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 40,
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
    borderRadius: 24,
    marginBottom: 8,
  },
  title: {
    color: "#e5e2c6",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "serif",
    letterSpacing: 1,
    marginBottom: 0,
  },
  subtitle: {
    color: "#e5e2c6",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    marginTop: 2,
    letterSpacing: 1,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  progressDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#bfc8d6",
    marginHorizontal: 4,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "#bfc8d6",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  button: {
    width: "100%",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#d4af37",
  },
  buttonText: {
    color: "#1a1a1a",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1.2,
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 16,
    color: "#e5e2c6",
    gap: 12,
  },
  option: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "#bfc8d6",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  optionText: {
    color: "#e5e2c6",
    fontSize: 16,
    textAlign: "center",
  },
  section: {
    color: "#e5e2c6",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 1,
  },
});
