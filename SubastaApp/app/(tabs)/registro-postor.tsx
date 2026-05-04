import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image as RNImage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import React, { useState } from "react";
import { useRouter } from "expo-router";

export default function RegistroPostorScreen() {
  const router = useRouter();
  const [frenteUri, setFrenteUri] = useState<string | null>(null);
  const [dorsoUri, setDorsoUri] = useState<string | null>(null);

  const pickImage = async (setter: (uri: string | null) => void) => {
    // SOLO pedir permiso de cámara primero (más estable en dispositivos reales)
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Debes habilitar la cámara para continuar.",
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setter(result.assets[0].uri);
      }
    } catch (error) {
      console.log("ERROR CAMARA:", error);
      Alert.alert("Error", "No se pudo abrir la cámara.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/appicon.png")}
          style={styles.logo}
        />
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
          placeholder="Nombre"
          placeholderTextColor="#bfc8d6"
          style={styles.input}
        />
        <TextInput
          placeholder="Apellido"
          placeholderTextColor="#bfc8d6"
          style={styles.input}
        />
        <TextInput
          placeholder="Domicilio Legal"
          placeholderTextColor="#bfc8d6"
          style={styles.input}
        />
        <TextInput
          placeholder="País de Origen"
          placeholderTextColor="#bfc8d6"
          style={styles.input}
        />
      </View>
      <Text style={styles.sectionTitle}>DOCUMENTO DE IDENTIDAD</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={async () => {
          try {
            await pickImage(setFrenteUri);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <Text style={styles.uploadIcon}>📷</Text>
        <Text style={styles.uploadText}>SUBIR FOTO DEL DOCUMENTO (FRENTE)</Text>
      </TouchableOpacity>
      {frenteUri && (
        <RNImage
          source={{ uri: frenteUri }}
          style={{
            width: 120,
            height: 90,
            alignSelf: "center",
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
      )}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={async () => {
          try {
            await pickImage(setDorsoUri);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <Text style={styles.uploadIcon}>📷</Text>
        <Text style={styles.uploadText}>SUBIR FOTO DEL DOCUMENTO (DORSO)</Text>
      </TouchableOpacity>
      {dorsoUri && (
        <RNImage
          source={{ uri: dorsoUri }}
          style={{
            width: 120,
            height: 90,
            alignSelf: "center",
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
      )}
      <Text style={styles.infoText}>
        Tus datos serán verificados. Una vez aprobado, recibirás un correo para
        finalizar tu registro.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/registro-paso2")}
      >
        <Text style={styles.buttonText}>SIGUIENTE</Text>
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
  sectionTitle: {
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
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "#c9b37e",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 14,
    width: "100%",
    justifyContent: "center",
    gap: 10,
  },
  uploadIcon: {
    fontSize: 20,
    color: "#e5e2c6",
  },
  uploadText: {
    color: "#e5e2c6",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  infoText: {
    color: "#bfc8d6",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 18,
    marginTop: 2,
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
