import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import usuarioService from "@/models/services/usuarioService";

export default function HomeScreen() {
  const router = useRouter();
  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!documento.trim() || !password.trim()) {
      Alert.alert("Error", "Completá usuario y clave.");
      return;
    }
    setLoading(true);
    try {
      await usuarioService.login({ documento, password });
      await usuarioService.obtenerPerfil();
      router.replace("/subastas");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Credenciales incorrectas.");
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
            placeholder="Documento"
            placeholderTextColor="#bfc8d6"
            style={styles.input}
            value={documento}
            onChangeText={setDocumento}
            autoCapitalize="none"
            keyboardType="default"
          />
          <TextInput
            placeholder="Clave"
            placeholderTextColor="#bfc8d6"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Text style={styles.registerText}>
          No tenés una cuenta, registrate{" "}
          <Link href="/registro-postor" asChild>
            <Text style={styles.registerLink}>ACÁ</Text>
          </Link>
        </Text>
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
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
    backgroundColor: "#ffe082",
  },
  buttonText: {
    color: "#2d2d2d",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
