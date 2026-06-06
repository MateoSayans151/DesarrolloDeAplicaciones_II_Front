import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image as RNImage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BackButton } from "@/components/BackButton";
import { LogoHeader } from "@/components/LogoHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { inputStyles } from "@/styles/inputStyles";
import { useRegistro } from "@/context/RegistroContext";

async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function ChequeScreen() {
  const router = useRouter();
  const { data, setMedioPago } = useRegistro();
  const cheque = data.medioPagos[0]?.tipo === "CHEQUE" ? data.medioPagos[0] : null;

  const [monto, setMonto] = useState(cheque?.monto ? String(cheque.monto) : "");
  const [banco, setBanco] = useState(cheque?.bancoEmisor ?? "");
  const [titular, setTitular] = useState(cheque?.titularCheque ?? "");
  const [numero, setNumero] = useState(cheque?.numeroCheque ?? "");
  const [fecha, setFecha] = useState(cheque?.fechaEmision ?? "");
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoBase64, setFotoBase64] = useState(cheque?.fotoTitularCheque ?? "");

  const pickFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Debes habilitar la camara para continuar.");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        const base64 = await uriToBase64(uri);

        setFotoUri(uri);
        setFotoBase64(base64);
      }
    } catch {
      Alert.alert("Error", "No se pudo procesar la foto del cheque.");
    }
  };

  const handleGuardar = () => {
    if (!monto || !banco || !titular || !numero || !fecha) {
      Alert.alert("Campos requeridos", "Completa los datos del cheque.");
      return;
    }

    setMedioPago({
      tipo: "CHEQUE",
      monto: Number(monto),
      bancoEmisor: banco,
      titularCheque: titular,
      numeroCheque: numero,
      fechaEmision: fecha,
      fotoTitularCheque: fotoBase64,
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <LogoHeader />

      <Text style={styles.title}>ANADIR CHEQUE CERTIFICADO</Text>

      <View style={styles.chequeIconContainer}>
        <View style={styles.chequeIcon}>
          <View style={styles.chequeTopRow}>
            <View style={styles.chequeShortLine} />
            <View style={styles.chequeAmountBox} />
          </View>
          <View style={styles.chequeLongLine} />
          <View style={styles.chequeBottomRow}>
            <View style={styles.chequeSmallLine} />
            <View style={styles.chequeSignatureLine} />
          </View>
        </View>
      </View>

      <TextInput
        placeholder="Monto del Cheque"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Banco Emisor"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={banco}
        onChangeText={setBanco}
      />
      <TextInput
        placeholder="Titular"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={titular}
        onChangeText={setTitular}
      />
      <TextInput
        placeholder="Numero de Cheque"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Fecha de Emision (YYYY-MM-DD)"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={fecha}
        onChangeText={setFecha}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickFoto}>
        <Text style={styles.uploadText}>FOTO TITULAR DEL CHEQUE</Text>
      </TouchableOpacity>
      {fotoUri && <RNImage source={{ uri: fotoUri }} style={styles.preview} />}

      <Text style={styles.infoText}>
        Monto disponible como fondo de garantia tras verificacion.
      </Text>

      <PrimaryButton label="REGISTRAR CHEQUE" style={{ marginTop: 20 }} onPress={handleGuardar} />
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
  chequeIconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  chequeIcon: {
    width: 150,
    height: 88,
    borderColor: "#99988B",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "space-between",
  },
  chequeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chequeShortLine: {
    width: 48,
    height: 1,
    backgroundColor: "#99988B",
  },
  chequeAmountBox: {
    width: 36,
    height: 18,
    borderColor: "#99988B",
    borderWidth: 1,
    borderRadius: 3,
  },
  chequeLongLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#99988B",
  },
  chequeBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chequeSmallLine: {
    width: 34,
    height: 1,
    backgroundColor: "#99988B",
  },
  chequeSignatureLine: {
    width: 54,
    height: 1,
    backgroundColor: "#99988B",
  },
  uploadButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "#c9b37e",
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    paddingVertical: 10,
    width: "100%",
  },
  uploadText: {
    color: "#e5e2c6",
    fontSize: 15,
  },
  preview: {
    alignSelf: "center",
    borderRadius: 8,
    height: 90,
    marginTop: 8,
    width: 120,
  },
  infoText: {
    color: "#bfc8d6",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
