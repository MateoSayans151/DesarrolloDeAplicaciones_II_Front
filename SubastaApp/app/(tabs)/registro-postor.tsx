import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Alert,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import usuarioService from "@/models/services/usuarioService";

export default function RegistroPostorScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [frenteUri, setFrenteUri] = useState<string | null>(null);
  const [dorsoUri, setDorsoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (setter: (uri: string | null) => void) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Debés habilitar la cámara para continuar.");
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setter(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la cámara.");
    }
  };

  const handleSiguiente = async () => {
    if (!nombre.trim() || !documento.trim()) {
      Alert.alert("Error", "Nombre y documento son obligatorios.");
      return;
    }
    setLoading(true);
    try {
      // Registramos el usuario con password temporal; el paso 2 lo actualiza
      const usuario = await usuarioService.registrar({
        documento,
        nombre,
        direccion: direccion.trim() || undefined,
        password: "temporal123", // se cambia en paso 2
      });
      // Pasamos el id al paso 2 para que pueda actualizar la clave
      router.push({ pathname: "/registro-paso2", params: { usuarioId: usuario.id } });
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo registrar el usuario.");
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
        <Image source={require("@/assets/images/appicon.png")} style={styles.logo} />
      </View>
      <Text style={styles.title}>REGISTRO DE POSTOR</Text>
      <Text style={styles.subtitle}>PASO 1 DE 2</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressDotActive} />
        <View style={styles.progressDot} />
      </View>
      <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor="#bfc8d6"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          placeholder="Número de documento"
          placeholderTextColor="#bfc8d6"
          style={styles.input}
          value={documento}
          onChangeText={setDocumento}
          keyboardType="default"
        />
        <TextInput
          placeholder="Domicilio Legal"
          placeholderTextColor="#bfc8d6"
          style={styles.input}
          value={direccion}
          onChangeText={setDireccion}
        />
      </View>
      <Text style={styles.sectionTitle}>DOCUMENTO DE IDENTIDAD</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setFrenteUri)}>
        <Text style={styles.uploadIcon}>📷</Text>
        <Text style={styles.uploadText}>FOTO DEL DOCUMENTO (FRENTE)</Text>
      </TouchableOpacity>
      {frenteUri && (
        <RNImage source={{ uri: frenteUri }} style={styles.preview} />
      )}
      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setDorsoUri)}>
        <Text style={styles.uploadIcon}>📷</Text>
        <Text style={styles.uploadText}>FOTO DEL DOCUMENTO (DORSO)</Text>
      </TouchableOpacity>
      {dorsoUri && (
        <RNImage source={{ uri: dorsoUri }} style={styles.preview} />
      )}
      <Text style={styles.infoText}>
        Tus datos serán verificados. Una vez aprobado, recibirás un correo para finalizar tu registro.
      </Text>
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSiguiente}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#1a1a1a" /> : <Text style={styles.buttonText}>SIGUIENTE</Text>}
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
  backButton: { alignSelf: "flex-start", marginBottom: 8 },
  backText: { color: "#bfc8d6", fontSize: 20 },
  logoContainer: { marginBottom: 16, alignItems: "center" },
  logo: { width: 110, height: 110, borderRadius: 24, marginBottom: 8 },
  title: { color: "#e5e2c6", fontSize: 26, fontWeight: "bold", textAlign: "center", fontFamily: "serif", letterSpacing: 1 },
  subtitle: { color: "#e5e2c6", fontSize: 16, textAlign: "center", marginBottom: 8, marginTop: 2, letterSpacing: 1 },
  progressContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 16, gap: 8 },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#3a4250", marginHorizontal: 4 },
  progressDotActive: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#bfc8d6", marginHorizontal: 4 },
  sectionTitle: { color: "#e5e2c6", fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 12, marginBottom: 8, letterSpacing: 1 },
  inputContainer: { width: "100%", marginBottom: 8 },
  input: { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "#bfc8d6", borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "#e5e2c6", fontSize: 16, marginBottom: 12 },
  uploadButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderColor: "#c9b37e", borderWidth: 1, borderRadius: 16, paddingVertical: 14, marginBottom: 14, width: "100%", justifyContent: "center", gap: 10 },
  uploadIcon: { fontSize: 20, color: "#e5e2c6" },
  uploadText: { color: "#e5e2c6", fontSize: 15, letterSpacing: 0.5 },
  preview: { width: 120, height: 90, alignSelf: "center", borderRadius: 8, marginBottom: 8 },
  infoText: { color: "#bfc8d6", fontSize: 13, textAlign: "center", marginBottom: 18, marginTop: 2 },
  button: { width: "100%", borderRadius: 20, paddingVertical: 16, alignItems: "center", justifyContent: "center", marginBottom: 8, backgroundColor: "#d4af37" },
  buttonText: { color: "#1a1a1a", fontWeight: "bold", fontSize: 18, letterSpacing: 1.2 },
});
