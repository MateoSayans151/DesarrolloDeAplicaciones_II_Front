import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { LogoHeader } from "@/components/LogoHeader";
import { PasswordInput } from "@/components/PasswordInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { inputStyles } from "@/styles/inputStyles";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LogoHeader size={140} marginBottom={32} />
        <Text style={styles.title}>BIENVENIDO A{"\n"}SUBASTA APP</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Usuario"
            placeholderTextColor="#99988B"
            style={inputStyles.input}
          />
          <PasswordInput placeholder="Clave" />
        </View>
        <Text style={styles.registerText}>
          No tienes una cuenta, registrate{" "}
          <Link href="/registro-postor" asChild>
            <Text style={styles.registerLink}>ACÁ</Text>
          </Link>
        </Text>
        <PrimaryButton
          label="INICIAR SESIÓN"
          onPress={() => router.push("/home")}
          style={{ width: "100%", marginBottom: 8 }}
        />
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
});
