import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function RegistroPaso2() {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Nueva Clave Personal"
            style={styles.passwordInput}
            placeholderTextColor="#99988B"
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity
            accessibilityLabel={
              showNewPassword ? "Ocultar nueva clave" : "Mostrar nueva clave"
            }
            accessibilityRole="button"
            onPress={() => setShowNewPassword((current) => !current)}
            style={styles.passwordIcon}
          >
            <MaterialIcons
              name={showNewPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#bfc8d6"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirmar Clave Personal"
            style={styles.passwordInput}
            placeholderTextColor="#99988B"
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            accessibilityLabel={
              showConfirmPassword
                ? "Ocultar confirmacion de clave"
                : "Mostrar confirmacion de clave"
            }
            accessibilityRole="button"
            onPress={() => setShowConfirmPassword((current) => !current)}
            style={styles.passwordIcon}
          >
            <MaterialIcons
              name={showConfirmPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#bfc8d6"
            />
          </TouchableOpacity>
        </View>
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
  passwordContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#bfc8d6",
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#e5e2c6",
    fontSize: 16,
  },
  passwordIcon: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
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
    fontSize: 20,
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
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 1,
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
