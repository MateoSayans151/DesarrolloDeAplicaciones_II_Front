import { LogoHeader } from "@/components/LogoHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useRegistro } from "@/context/RegistroContext";
import usuarioService from "@/models/services/usuarioService";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Estado = "esperando" | "verificando" | "no_verificado";

// ─── Línea decorativa dorada ─────────────────────────────────────────────────
function GoldDivider() {
  return (
    <View style={dividerStyles.row}>
      <View style={dividerStyles.line} />
      <View style={dividerStyles.diamond} />
      <View style={dividerStyles.line} />
    </View>
  );
}

const dividerStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#c9b37e",
    opacity: 0.4,
  },
  diamond: {
    width: 6,
    height: 6,
    backgroundColor: "#c9b37e",
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 8,
    opacity: 0.7,
  },
});

// ─── Tarjeta de estado ───────────────────────────────────────────────────────
function StatusCard({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: string;
}) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        cardStyles.card,
        { borderColor: color, transform: [{ scale: pulse }] },
      ]}
    >
      <Text style={cardStyles.icon}>{icon}</Text>
      <Text style={[cardStyles.label, { color }]}>{label}</Text>
    </Animated.View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(201,179,126,0.06)",
    marginVertical: 28,
    gap: 6,
  },
  icon: {
    fontSize: 42,
    textAlign: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
});

// ─── Paso informativo ────────────────────────────────────────────────────────
function InfoStep({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <View style={stepStyles.row}>
      <View style={stepStyles.badge}>
        <Text style={stepStyles.badgeText}>{number}</Text>
      </View>
      <Text style={stepStyles.text}>{text}</Text>
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c9b37e",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  badgeText: {
    color: "#c9b37e",
    fontSize: 11,
    fontWeight: "700",
  },
  text: {
    color: "#bfc8d6",
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
});

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function RegistroVerificacionScreen() {
  const router = useRouter();
  const { data } = useRegistro();
  const [estado, setEstado] = useState<Estado>("esperando");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [estado]);

  const verificar = async () => {
    if (!data.documento) return;
    setEstado("verificando");
    try {
      await usuarioService.obtenerTokenRegistroDev(data.documento);
      router.replace("/views/registro-paso2");
    } catch {
      fadeAnim.setValue(0);
      setEstado("no_verificado");
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleVolver = () => {
    router.replace("/views");
  };

  const isPendiente = estado === "no_verificado";
  const isVerificando = estado === "verificando";

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <LogoHeader />

      {/* Eyebrow */}
      <Text style={styles.eyebrow}>PROCESO DE ADMISIÓN</Text>
      <Text style={styles.title}>VERIFICACIÓN{"\n"}DE CUENTA</Text>

      <GoldDivider />

      {/* Tarjeta de estado animada */}
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center", width: "100%" }}>
        {isPendiente ? (
          <StatusCard icon="⏳" label="PENDIENTE" color="#c9b37e" />
        ) : isVerificando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#c9b37e" size="large" />
            <Text style={styles.loadingText}>Consultando estado…</Text>
          </View>
        ) : (
          <StatusCard icon="📬" label="EN REVISIÓN" color="#6ea8d6" />
        )}

        {/* Contenido según estado */}
        {isPendiente ? (
          <>
            <Text style={styles.heading}>Aún no hemos aprobado tu cuenta</Text>
            <Text style={styles.body}>
              Nuestro equipo revisa cada solicitud de forma manual para garantizar
              la seguridad de todas las subastas. Podés volver a verificar en
              cualquier momento.
            </Text>

            <GoldDivider />

            <PrimaryButton
              label="VERIFICAR AHORA"
              onPress={verificar}
              style={styles.button}
            />
            <TouchableOpacity onPress={handleVolver} style={styles.linkButton}>
              <Text style={styles.linkText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </>
        ) : !isVerificando ? (
          <>
            <Text style={styles.heading}>Solicitud recibida con éxito</Text>
            <Text style={styles.body}>
              Tus datos y documentos fueron enviados correctamente. Recibirás una
              notificación cuando tu acceso sea habilitado.
            </Text>

            <GoldDivider />

            {/* Pasos del proceso */}
            <View style={styles.stepsContainer}>
              <Text style={styles.stepsTitle}>¿QUÉ SIGUE?</Text>
              <InfoStep
                number="1"
                text="Nuestro equipo verifica tu identidad y documentación."
              />
              <InfoStep
                number="2"
                text="Recibirás un correo de aprobación en 24–48 hs hábiles."
              />
              <InfoStep
                number="3"
                text="Completás tu perfil y comenzás a participar en subastas."
              />
            </View>

            <PrimaryButton
              label="VERIFICAR AHORA"
              onPress={verificar}
              style={styles.button}
            />
            <TouchableOpacity onPress={handleVolver} style={styles.linkButton}>
              <Text style={styles.linkText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#07162b",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 48,
    flexGrow: 1,
  },
  eyebrow: {
    color: "#c9b37e",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 6,
    opacity: 0.8,
  },
  title: {
    color: "#e5e2c6",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "serif",
    letterSpacing: 2,
    lineHeight: 36,
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 36,
    gap: 14,
  },
  loadingText: {
    color: "#bfc8d6",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  heading: {
    color: "#e5e2c6",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.3,
    fontFamily: "serif",
  },
  body: {
    color: "#8fa3ba",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 4,
  },
  stepsContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(201,179,126,0.15)",
    padding: 20,
    marginBottom: 8,
  },
  stepsTitle: {
    color: "#c9b37e",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
  linkButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  linkText: {
    color: "#6ea8d6",
    fontSize: 13,
    textAlign: "center",
    letterSpacing: 0.3,
    textDecorationLine: "underline",
  },
});
