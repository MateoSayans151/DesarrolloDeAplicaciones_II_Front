import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { LogoHeader } from "@/components/LogoHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useRegistro } from "@/context/RegistroContext";
import usuarioService from "@/models/services/usuarioService";

type Estado = "esperando" | "verificando" | "no_verificado";

export default function RegistroVerificacionScreen() {
  const router = useRouter();
  const { data } = useRegistro();
  const [estado, setEstado] = useState<Estado>("esperando");

  const verificar = async () => {
    if (!data.documento) return;
    setEstado("verificando");
    try {
      await usuarioService.obtenerTokenRegistroDev(data.documento);
      router.replace("/registro-paso2");
    } catch {
      setEstado("no_verificado");
    }
  };


  const handleVolver = () => {
    router.replace("/");
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <LogoHeader />
      <Text style={styles.title}>VERIFICACION DE CUENTA</Text>

      {estado === "no_verificado" ? (
        <>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>⏳</Text>
          </View>
          <Text style={styles.heading}>Cuenta pendiente de verificacion</Text>
          <Text style={styles.body}>
            Tu cuenta aun no ha sido verificada por nuestro equipo. Por favor aguarda la aprobacion
            o vuelve a intentarlo mas tarde.
          </Text>
          <PrimaryButton
            label="VERIFICAR AHORA"
            onPress={verificar}
            style={styles.button}
          />
          <PrimaryButton
            label="VOLVER AL INICIO DE SESION"
            onPress={handleVolver}
            style={[styles.button, styles.buttonSecondary]}
          />
        </>
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📬</Text>
          </View>
          <Text style={styles.heading}>Registro recibido</Text>
          <Text style={styles.body}>
            Tus datos fueron enviados y estan siendo revisados por nuestro equipo. Te avisaremos
            cuando tu cuenta sea aprobada.
          </Text>
          {estado === "verificando" ? (
            <ActivityIndicator color="#c9b37e" size="large" style={{ marginVertical: 24 }} />
          ) : (
            <PrimaryButton
              label="VERIFICAR AHORA"
              onPress={verificar}
              style={styles.button}
            />
          )}
          <PrimaryButton
            label="VOLVER AL INICIO DE SESION"
            onPress={handleVolver}
            style={[styles.button, styles.buttonSecondary]}
          />
        </>
      )}
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
    flexGrow: 1,
  },
  title: {
    color: "#e5e2c6",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "serif",
    letterSpacing: 1,
    marginBottom: 16,
  },
  iconContainer: {
    marginVertical: 24,
  },
  iconText: {
    fontSize: 64,
    textAlign: "center",
  },
  heading: {
    color: "#e5e2c6",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  body: {
    color: "#bfc8d6",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  button: {
    width: "100%",
    marginTop: 16,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderColor: "#bfc8d6",
    borderWidth: 1,
  },
});
