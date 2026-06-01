import * as ImagePicker from "expo-image-picker";
import {
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
import { BackButton } from "@/components/BackButton";
import { LogoHeader } from "@/components/LogoHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { inputStyles } from "@/styles/inputStyles";
import { useRegistro } from "@/context/RegistroContext";
import usuarioService from "@/models/services/usuarioService";

// ─── Helper: URI → base64 ─────────────────────────────────────────────────────

async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Retorna solo la parte base64 sin el prefijo "data:image/...;base64,"
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function RegistroPostorScreen() {
  const router = useRouter();
  const { data, setPaso1 } = useRegistro();

  const [frenteUri, setFrenteUri] = useState<string | null>(null);
  const [dorsoUri, setDorsoUri] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Campos de texto locales (sincronizados al avanzar)
  const [nombre, setNombre] = useState(data.nombre);
  const [apellido, setApellido] = useState(data.apellido);
  const [domicilio, setDomicilio] = useState(data.domicilio);
  const [pais, setPais] = useState(data.pais);
  const [documento, setDocumento] = useState(data.documento);

  const pickImage = async (setter: (uri: string | null) => void) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Debes habilitar la cámara para continuar.");
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
    } catch {
      Alert.alert("Error", "No se pudo abrir la cámara.");
    }
  };

  const handleSiguiente = async () => {
    if (!nombre || !apellido || !domicilio || !pais || !documento) {
      Alert.alert("Campos requeridos", "Por favor completá todos los datos personales.");
      return;
    }
    if (!frenteUri || !dorsoUri) {
      Alert.alert("Documento requerido", "Debés subir ambas fotos del documento.");
      return;
    }

    setEnviando(true);
    try {
      const [frenteB64, dorsoB64] = await Promise.all([
        uriToBase64(frenteUri),
        uriToBase64(dorsoUri),
      ]);

      setPaso1({
        nombre,
        apellido,
        domicilio,
        pais,
        documento,
        fotoDocumentoFrente: frenteB64,
        fotoDocumentoDorso: dorsoB64,
      });

      await usuarioService.registroInicial({
        documento,
        nombre,
        apellido,
        pais,
        domicilio,
        fotoDocumentoFrente: frenteB64,
        fotoDocumentoDorso: dorsoB64,
      });

      router.push("/(tabs)/registro-verificacion" as any);
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo completar el registro. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <BackButton />
      <LogoHeader />
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
          placeholderTextColor="#99988B"
          style={inputStyles.input}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          placeholder="Apellido"
          placeholderTextColor="#99988B"
          style={inputStyles.input}
          value={apellido}
          onChangeText={setApellido}
        />
        <TextInput
          placeholder="Documento (DNI / Pasaporte)"
          placeholderTextColor="#99988B"
          style={inputStyles.input}
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Domicilio Legal"
          placeholderTextColor="#99988B"
          style={inputStyles.input}
          value={domicilio}
          onChangeText={setDomicilio}
        />
        <TextInput
          placeholder="País de Origen"
          placeholderTextColor="#99988B"
          style={inputStyles.input}
          value={pais}
          onChangeText={setPais}
        />
      </View>

      <Text style={styles.sectionTitle}>DOCUMENTO DE IDENTIDAD</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setFrenteUri)}>
        <Text style={styles.uploadIcon}>📷</Text>
        <Text style={styles.uploadText}>SUBIR FOTO DEL DOCUMENTO (FRENTE)</Text>
      </TouchableOpacity>
      {frenteUri && (
        <RNImage source={{ uri: frenteUri }} style={styles.preview} />
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setDorsoUri)}>
        <Text style={styles.uploadIcon}>📷</Text>
        <Text style={styles.uploadText}>SUBIR FOTO DEL DOCUMENTO (DORSO)</Text>
      </TouchableOpacity>
      {dorsoUri && (
        <RNImage source={{ uri: dorsoUri }} style={styles.preview} />
      )}

      <Text style={styles.infoText}>
        Tus datos serán verificados. Una vez aprobado, recibirás un correo para
        finalizar tu registro.
      </Text>

      <PrimaryButton
        label={enviando ? "ENVIANDO..." : "SIGUIENTE"}
        onPress={handleSiguiente}
        style={{ width: "100%", marginBottom: 8, opacity: enviando ? 0.6 : 1 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#07162b",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
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
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "#c9b37e",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    marginBottom: 8,
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
  preview: {
    width: 120,
    height: 90,
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 8,
  },
  infoText: {
    color: "#bfc8d6",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 18,
    marginTop: 2,
  },
});
