import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { LogoHeader } from "@/components/LogoHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { inputStyles } from "@/styles/inputStyles";

export default function TarjetaScreen() {
  return (
    <View style={styles.container}>
      <BackButton />
      <LogoHeader />
      <Text style={styles.title}>AÑADIR TARJETA DE CRÉDITO</Text>

      <View style={styles.cardIconContainer}>
        <View style={styles.cardIcon}>
          <View style={styles.cardChip} />
          <View style={styles.cardLine} />
        </View>
      </View>

      <TextInput placeholder="Número de Tarjeta" style={inputStyles.input} placeholderTextColor="#99988B" />
      <TextInput placeholder="Nombre del Titular" style={inputStyles.input} placeholderTextColor="#99988B" />
      <TextInput placeholder="MM/AA" style={inputStyles.input} placeholderTextColor="#99988B" />
      <TextInput placeholder="CVV" style={inputStyles.input} placeholderTextColor="#99988B" />

      <Text style={styles.infoText}>
        Al guardar, autoriza a Subasta App a verificar la validez mediante una
        retención temporal.
      </Text>

      <PrimaryButton label="GUARDAR TARJETA" style={{ marginTop: 20 }} />
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
  cardIconContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  cardIcon: {
    width: 150,
    height: 100,
    borderColor: "#99988B",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "space-between",
  },
  cardChip: {
    width: 30,
    height: 22,
    borderColor: "#99988B",
    borderWidth: 1,
    borderRadius: 5,
  },
  cardLine: {
    width: 58,
    height: 1,
    backgroundColor: "#99988B",
    alignSelf: "flex-end",
  },
  infoText: {
    color: "#bfc8d6",
    fontSize: 13,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 26,
  },
});
