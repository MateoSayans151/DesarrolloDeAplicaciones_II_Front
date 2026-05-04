import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function TarjetaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AÑADIR TARJETA DE CRÉDITO</Text>

      <TextInput placeholder="Número de Tarjeta" style={styles.input} />
      <TextInput placeholder="Nombre del Titular" style={styles.input} />
      <TextInput placeholder="MM/AA" style={styles.input} />
      <TextInput placeholder="CVV" style={styles.input} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>GUARDAR TARJETA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07162b", padding: 24 },
  title: { color: "#e5e2c6", fontSize: 20, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#bfc8d6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    color: "white",
  },
  button: {
    backgroundColor: "#d4af37",
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: { textAlign: "center", fontWeight: "bold" },
});