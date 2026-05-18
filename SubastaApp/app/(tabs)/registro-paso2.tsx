import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { LogoHeader } from "@/components/LogoHeader";
import { PasswordInput } from "@/components/PasswordInput";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function RegistroPaso2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
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
        />
        <PasswordInput
          placeholder="Confirmar Clave Personal"
          accessibilityLabel="Confirmar clave personal"
        />
      </View>

      <Text style={styles.section}>MEDIO DE PAGO OBLIGATORIO</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/tarjeta")}
        >
          <Text style={styles.optionText}>AÑADIR TARJETA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/cuenta-bancaria")}
        >
          <Text style={styles.optionText}>AÑADIR CUENTA BANCARIA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/cheque")}
        >
          <Text style={styles.optionText}>REGISTRAR CHEQUE</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.infoText}>
        IMPORTANTE: DEBERÁS TENER UN MEDIO DE PAGO REGISTRADO PARA PODER
        PARTICIPAR EN LAS SUBASTAS.
      </Text>
      <PrimaryButton
        label="FINALIZAR REGISTRO"
        style={{ width: "100%", marginBottom: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07162b",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 40,
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
    marginTop: 2,
    marginBottom: 26,
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 16,
    gap: 12,
  },
  option: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "#bfc8d6",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 1,
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
});
