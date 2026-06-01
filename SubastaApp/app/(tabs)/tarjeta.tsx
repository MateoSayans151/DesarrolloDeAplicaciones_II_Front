import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { LogoHeader } from "@/components/LogoHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { inputStyles } from "@/styles/inputStyles";
import { useRegistro } from "@/context/RegistroContext";

export default function TarjetaScreen() {
  const router = useRouter();
  const { data, setMedioPago } = useRegistro();
  const tarjeta = data.medioPagos[0]?.tipo === "TARJETA" ? data.medioPagos[0] : null;

  const [numero, setNumero] = useState(tarjeta?.numeroTarjeta ?? "");
  const [titular, setTitular] = useState(tarjeta?.nombreTitular ?? tarjeta?.titular ?? tarjeta?.nombre ?? "");
  const [vencimiento, setVencimiento] = useState(tarjeta?.fechaVencimiento ?? tarjeta?.vencimiento ?? "");
  const [cvv, setCvv] = useState(tarjeta?.cvv ?? "");

  const formatearVencimiento = (value: string) => {
    const numeros = value.replace(/\D/g, "").slice(0, 4);

    if (numeros.length <= 2) {
      return numeros;
    }

    return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  };

  const handleGuardar = () => {
    if (!numero || !titular || !vencimiento || !cvv) {
      Alert.alert("Campos requeridos", "Completa los datos de la tarjeta.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento)) {
      Alert.alert("Fecha invalida", "Ingresa la fecha de vencimiento con formato MM/AA.");
      return;
    }

    setMedioPago({
      tipo: "TARJETA",
      numeroTarjeta: numero,
      nombre: titular,
      titular,
      nombreTitular: titular,
      vencimiento,
      fechaVencimiento: vencimiento,
      cvv,
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <BackButton />
      <LogoHeader />
      <Text style={styles.title}>ANADIR TARJETA DE CREDITO</Text>

      <View style={styles.cardIconContainer}>
        <View style={styles.cardIcon}>
          <View style={styles.cardChip} />
          <View style={styles.cardLine} />
        </View>
      </View>

      <TextInput
        placeholder="Numero de Tarjeta"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Nombre del Titular"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={titular}
        onChangeText={setTitular}
      />
      <TextInput
        placeholder="MM/AA"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={vencimiento}
        onChangeText={(value) => setVencimiento(formatearVencimiento(value))}
        keyboardType="numeric"
        maxLength={5}
      />
      <TextInput
        placeholder="CVV"
        style={inputStyles.input}
        placeholderTextColor="#99988B"
        value={cvv}
        onChangeText={setCvv}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
      />

      <Text style={styles.infoText}>
        Al guardar, autoriza a Subasta App a verificar la validez mediante una
        retencion temporal.
      </Text>

      <PrimaryButton label="GUARDAR TARJETA" style={{ marginTop: 20 }} onPress={handleGuardar} />
    </ScrollView>
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
