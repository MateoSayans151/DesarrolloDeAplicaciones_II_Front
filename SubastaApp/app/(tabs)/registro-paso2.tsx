import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BackButton } from "@/components/BackButton";
import { LogoHeader } from "@/components/LogoHeader";
import { PasswordInput } from "@/components/PasswordInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TipoMedioPago, useRegistro } from "@/context/RegistroContext";
import usuarioService from "@/models/services/usuarioService";

const paymentLabels: Record<TipoMedioPago, string> = {
  TARJETA: "Tarjeta cargada",
  CUENTA: "Cuenta bancaria cargada",
  CHEQUE: "Cheque cargado",
};

export default function RegistroPaso2() {
  const router = useRouter();
  const { data, setPaso2, submitRegistro, loading } = useRegistro();

  const [password, setPassword] = useState(data.password);
  const [confirmar, setConfirmar] = useState(data.password);

  const medioPago = data.medioPagos[0];

  const handleFinalizar = async () => {
    if (!password || password.length < 4) {
      Alert.alert("Clave invalida", "La clave debe tener al menos 4 caracteres.");
      return;
    }
    if (password !== confirmar) {
      Alert.alert("Claves distintas", "Las claves no coinciden.");
      return;
    }
    if (!medioPago) {
      Alert.alert("Medio de pago requerido", "Debes seleccionar y completar un medio de pago.");
      return;
    }

    const registroCompleto = {
      ...data,
      password,
      medioPagos: [medioPago],
    };

    setPaso2(password, [medioPago]);

    try {
      await submitRegistro(registroCompleto);
      try {
        await usuarioService.login({ documento: registroCompleto.documento, password });
        router.replace("/home");
      } catch {
        Alert.alert(
          "Registro enviado",
          "Tus datos fueron enviados. Recibiras un correo cuando sean verificados.",
          [{ text: "OK", onPress: () => router.replace("/") }]
        );
      }
    } catch (e: any) {
      Alert.alert("Error al registrar", e.message ?? "Intenta de nuevo mas tarde.");
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
      <Text style={styles.subtitle}>PASO 2 DE 2</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressDotActive} />
        <View style={styles.progressDotActive} />
      </View>

      <Text style={styles.section}>CLAVE PERSONAL</Text>
      <View style={styles.inputContainer}>
        <PasswordInput
          placeholder="Nueva Clave Personal"
          accessibilityLabel="Nueva clave personal"
          value={password}
          onChangeText={setPassword}
        />
        <PasswordInput
          placeholder="Confirmar Clave Personal"
          accessibilityLabel="Confirmar clave personal"
          value={confirmar}
          onChangeText={setConfirmar}
        />
      </View>

      <Text style={styles.section}>MEDIO DE PAGO OBLIGATORIO</Text>

      {medioPago && (
        <Text style={styles.selectedText}>{paymentLabels[medioPago.tipo]}</Text>
      )}

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, medioPago?.tipo === "TARJETA" && styles.optionSelected]}
          onPress={() => router.push("/tarjeta")}
        >
          <Text style={styles.optionText}>ANADIR TARJETA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, medioPago?.tipo === "CUENTA" && styles.optionSelected]}
          onPress={() => router.push("/cuenta-bancaria")}
        >
          <Text style={styles.optionText}>ANADIR CUENTA BANCARIA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, medioPago?.tipo === "CHEQUE" && styles.optionSelected]}
          onPress={() => router.push("/cheque")}
        >
          <Text style={styles.optionText}>REGISTRAR CHEQUE</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        IMPORTANTE: DEBERAS TENER UN MEDIO DE PAGO REGISTRADO PARA PODER
        PARTICIPAR EN LAS SUBASTAS.
      </Text>

      <PrimaryButton
        label={loading ? "ENVIANDO..." : "FINALIZAR REGISTRO"}
        onPress={handleFinalizar}
        style={{ width: "100%", marginBottom: 8, opacity: loading ? 0.6 : 1 }}
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
  infoText: {
    color: "#bfc8d6",
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 26,
  },
  optionsContainer: {
    width: "100%",
    gap: 12,
  },
  option: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "#bfc8d6",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
  },
  optionSelected: {
    borderColor: "#c9b37e",
    backgroundColor: "rgba(201, 179, 126, 0.12)",
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
  selectedText: {
    color: "#d4af37",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
