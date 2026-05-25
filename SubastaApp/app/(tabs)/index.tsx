import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import usuarioService from "@/models/services/usuarioService";

export default function HomeScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!documento.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completá todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const data = await usuarioService.login({ documento, password });
      await AsyncStorage.setItem("tipo", data.tipo);
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.mensaje || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

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
            placeholderTextColor="#99988B"
            style={styles.input}
            value={documento}
            onChangeText={setDocumento}
            keyboardType="numeric"
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Clave"
              placeholderTextColor="#99988B"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              accessibilityLabel={showPassword ? "Ocultar clave" : "Mostrar clave"}
              accessibilityRole="button"
              onPress={() => setShowPassword((current) => !current)}
              style={styles.passwordIcon}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#bfc8d6"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.registerText}>
          No tienes una cuenta, registrate{" "}
          <Link href="/registro-postor" asChild>
            <Text style={styles.registerLink}>ACÁ</Text>
          </Link>
        </Text>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#2d2d2d" />
          ) : (
            <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
          )}
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
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#d4af37",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#2d2d2d",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 1,
  },
});