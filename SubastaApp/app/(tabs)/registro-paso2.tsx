import { Image } from "expo-image";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function RegistroPaso2() {
  const router = useRouter();
  const { usuarioId } = useLocalSearchParams<{ usuarioId: string }>();
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinalizar = async () => {
    if (!clave.trim() || !confirmarClave.trim()) {
      Alert.alert("Error", "Completá ambos campos de clave.");
      return;
    }
    if (clave !== confirmarClave) {
      Alert.alert("Error", "Las claves no coinciden.");
      return;
    }
    if (clave.length < 6) {
      Alert.alert("Error", "La clave debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      Alert.alert(
        "Registro enviado",
        "Tus datos fueron enviados para verificación. Una vez aprobado podrás iniciar sesión.",
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <View style={styles.progressDot} />
        <View style={styles.progressDotActive} />
      </View>

      <Text style={styles.section}>CLAVE PERSONAL</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nueva Clave Personal"
          placeholderTextColor="#bfc8d6"
          style={styles.input}
          secureTextEntry
          value={clave}
          onChangeText={setClave}
        />
        <TextInput
          placeholder="Confirmar Clave Personal"
          placeholderTextColor="#bfc8d6"
          style={styles.input}
          secureTextEntry
          value={confirmarClave}
          onChangeText={setConfirmarClave}
        />
      </View>

      <Text style={styles.section}>MEDIO DE PAGO OBLIGATORIO</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/tarjeta")}>
          <Text style={styles.optionText}>AÑADIR TARJETA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/cuenta-bancaria")}>
          <Text style={styles.optionText}>AÑADIR CUENTA BANCARIA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => router.push("/cheque")}>
          <Text style={styles.optionText}>REGISTRAR CHEQUE</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        IMPORTANTE: DEBERÁS TENER UN MEDIO DE PAGO REGISTRADO PARA PODER PARTICIPAR EN LAS SUBASTAS.
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleFinalizar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#1a1a1a" />
        ) : (
          <Text style={styles.buttonText}>FINALIZAR REGISTRO</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#07162b",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
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
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3a4250",
    marginHorizontal: 4,
  },
  progressDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#bfc8d6",
    marginHorizontal: 4,
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
  inputContainer: {
    width: "100%",
    marginBottom: 8,
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
  optionsContainer: {
    width: "100%",
    marginBottom: 16,
    gap: 12,
  },
  option: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#d4af37",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 4,
  },
  optionText: {
    color: "#d4af37",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
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
});
