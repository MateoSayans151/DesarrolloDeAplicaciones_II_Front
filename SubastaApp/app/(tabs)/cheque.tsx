import { StyleSheet, Text, TextInput, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { LogoHeader } from "@/components/LogoHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { inputStyles } from "@/styles/inputStyles";

export default function ChequeScreen() {
  return (
    <View style={styles.container}>
      <BackButton />
      <LogoHeader />

      <Text style={styles.title}>AÑADIR CHEQUE CERTIFICADO</Text>

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

      <TextInput placeholder="Monto del Cheque" style={inputStyles.input} placeholderTextColor="#99988B" />
      <TextInput placeholder="Banco Emisor" style={inputStyles.input} placeholderTextColor="#99988B" />
      <TextInput placeholder="Titular" style={inputStyles.input} placeholderTextColor="#99988B" />
      <TextInput placeholder="Número de Cheque" style={inputStyles.input} placeholderTextColor="#99988B" />

      <Text style={styles.infoText}>
        Monto disponible como fondo de garantía tras verificación.
      </Text>

      <PrimaryButton label="REGISTRAR CHEQUE" style={{ marginTop: 20 }} />
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
  infoText: {
    color: "#bfc8d6",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
