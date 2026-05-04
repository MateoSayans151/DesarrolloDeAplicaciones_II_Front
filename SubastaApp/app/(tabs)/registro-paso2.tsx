import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function RegistroPaso2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTRO DE POSTOR</Text>
      <Text style={styles.subtitle}>PASO 2 DE 2</Text>

      <Text style={styles.section}>CLAVE PERSONAL</Text>

      <TextInput placeholder="Nueva Clave Personal" style={styles.input} secureTextEntry />
      <TextInput placeholder="Confirmar Clave Personal" style={styles.input} secureTextEntry />

      <Text style={styles.section}>MEDIO DE PAGO OBLIGATORIO</Text>

      <TouchableOpacity style={styles.option} onPress={() => router.push("/tarjeta")}>
        <Text style={styles.optionText}>AÑADIR TARJETA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => router.push("/cuenta-bancaria")}>
        <Text style={styles.optionText}>AÑADIR CUENTA BANCARIA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => router.push("/cheque")}>
        <Text style={styles.optionText}>REGISTRAR CHEQUE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>FINALIZAR REGISTRO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07162b", padding: 24 },
  title: { color: "#e5e2c6", fontSize: 24, textAlign: "center" },
  subtitle: { color: "#aaa", textAlign: "center", marginBottom: 20 },
  section: { color: "#e5e2c6", marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#bfc8d6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    color: "white",
  },
  option: {
    borderWidth: 1,
    borderColor: "#d4af37",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  optionText: { color: "#d4af37", textAlign: "center" },
  button: {
    backgroundColor: "#d4af37",
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: { textAlign: "center", fontWeight: "bold" },
});