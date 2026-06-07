import { ScreenLayout } from "@/components/ScreenLayout";
import usuarioService, {
  EstadisticasUsuarioResponse,
  PaymentMethod,
  UsuarioResponse,
} from "@/models/services/usuarioService";
import subastaService from "@/models/services/subastaService";
import { C } from "@/styles/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TipoMedioPago = "TARJETA" | "CUENTA" | "CHEQUE";

function PaymentMethodCard({ item }: { item: PaymentMethod }) {
  return (
    <View style={styles.paymentCard}>
      <Text style={styles.paymentText}>
        {item.tipo} **** {item.ultimosNumeros}
      </Text>
      <View style={styles.paymentStatus}>
        <Text style={item.verificado === "si" ? styles.verifiedText : styles.notVerifiedText}>
          {item.verificado}
        </Text>
        <MaterialIcons
          name={item.verificado === "si" ? "check-circle" : "cancel"}
          size={19}
          color={item.verificado === "si" ? C.green : C.red}
        />
      </View>
    </View>
  );
}

function StatCard({ label, sublabel, value }: { label: string; sublabel?: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      {sublabel ? <Text style={styles.statLabel}>{sublabel}</Text> : null}
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad";
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#4a6a80"
        keyboardType={keyboardType ?? "default"}
      />
    </View>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasUsuarioResponse | null>(null);
  const [subastasParticipadas, setSubastasParticipadas] = useState<number>(0);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [tipoMedioPago, setTipoMedioPago] = useState<TipoMedioPago>("CUENTA");
  const [saving, setSaving] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaVencimiento: "",
    cvv: "",
    titularCuenta: "",
    tipoCuenta: "",
    moneda: "ARS",
    cbuAlias: "",
    monto: "",
    bancoEmisor: "",
    titularCheque: "",
    numeroCheque: "",
    fechaEmision: "",
  });

  const [profileForm, setProfileForm] = useState({ nombre: "", domicilio: "" });

  const cargarDatos = async () => {
    try {
      const data = await usuarioService.obtenerPerfil();
      setUsuario(data);
      setProfileForm({ nombre: data.nombre ?? "", domicilio: data.direccion ?? "" });
      const [stats, asistencias] = await Promise.all([
        usuarioService.obtenerEstadisticas(data.id),
        subastaService.listarAsistencias(data.id),
      ]);
      setEstadisticas(stats);
      setSubastasParticipadas(asistencias.length);
    } catch {
      Alert.alert("Error", "No se pudo cargar el perfil.");
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleLogout = async () => {
    await usuarioService.logout();
    router.replace("/");
  };

  const handleAddPayment = async () => {
    setSaving(true);
    try {
      let req: Record<string, unknown> = { tipo: tipoMedioPago };
      if (tipoMedioPago === "TARJETA") {
        req = { ...req, numeroTarjeta: paymentForm.numeroTarjeta, nombreTitular: paymentForm.nombreTitular, fechaVencimiento: paymentForm.fechaVencimiento, cvv: paymentForm.cvv };
      } else if (tipoMedioPago === "CUENTA") {
        req = { ...req, titularCuenta: paymentForm.titularCuenta, tipoCuenta: paymentForm.tipoCuenta, moneda: paymentForm.moneda, cbuAlias: paymentForm.cbuAlias };
      } else {
        req = { ...req, monto: parseFloat(paymentForm.monto), bancoEmisor: paymentForm.bancoEmisor, titularCheque: paymentForm.titularCheque, numeroCheque: paymentForm.numeroCheque, fechaEmision: paymentForm.fechaEmision };
      }
      await usuarioService.agregarMedioPago(req);
      setShowAddPayment(false);
      await cargarDatos();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo agregar el medio de pago.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await usuarioService.actualizarPerfil({ nombre: profileForm.nombre, domicilio: profileForm.domicilio });
      setShowUpdateProfile(false);
      await cargarDatos();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenLayout activeTab="perfil">

      {/* ── Modal: Agregar medio de pago ─────────────────────────────── */}
      <Modal visible={showAddPayment} transparent animationType="slide" onRequestClose={() => setShowAddPayment(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>AÑADIR MEDIO DE PAGO</Text>

            <View style={styles.tipoRow}>
              {(["CUENTA", "TARJETA", "CHEQUE"] as TipoMedioPago[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tipoBtn, tipoMedioPago === t && styles.tipoBtnActive]}
                  onPress={() => setTipoMedioPago(t)}
                >
                  <Text style={[styles.tipoBtnText, tipoMedioPago === t && styles.tipoBtnTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {tipoMedioPago === "TARJETA" && (
              <>
                <InputField label="Número de tarjeta" value={paymentForm.numeroTarjeta} onChangeText={(v) => setPaymentForm((f) => ({ ...f, numeroTarjeta: v }))} placeholder="1111-2222-3333-4444" />
                <InputField label="Titular" value={paymentForm.nombreTitular} onChangeText={(v) => setPaymentForm((f) => ({ ...f, nombreTitular: v }))} />
                <InputField label="Vencimiento" value={paymentForm.fechaVencimiento} onChangeText={(v) => setPaymentForm((f) => ({ ...f, fechaVencimiento: v }))} placeholder="MM/AA" />
                <InputField label="CVV" value={paymentForm.cvv} onChangeText={(v) => setPaymentForm((f) => ({ ...f, cvv: v }))} />
              </>
            )}
            {tipoMedioPago === "CUENTA" && (
              <>
                <InputField label="Titular" value={paymentForm.titularCuenta} onChangeText={(v) => setPaymentForm((f) => ({ ...f, titularCuenta: v }))} />
                <InputField label="Tipo de cuenta" value={paymentForm.tipoCuenta} onChangeText={(v) => setPaymentForm((f) => ({ ...f, tipoCuenta: v }))} placeholder="caja_ahorro / corriente" />
                <InputField label="Moneda" value={paymentForm.moneda} onChangeText={(v) => setPaymentForm((f) => ({ ...f, moneda: v }))} placeholder="ARS / USD" />
                <InputField label="CBU / Alias" value={paymentForm.cbuAlias} onChangeText={(v) => setPaymentForm((f) => ({ ...f, cbuAlias: v }))} />
              </>
            )}
            {tipoMedioPago === "CHEQUE" && (
              <>
                <InputField label="Monto" value={paymentForm.monto} onChangeText={(v) => setPaymentForm((f) => ({ ...f, monto: v }))} keyboardType="decimal-pad" />
                <InputField label="Banco emisor" value={paymentForm.bancoEmisor} onChangeText={(v) => setPaymentForm((f) => ({ ...f, bancoEmisor: v }))} />
                <InputField label="Titular del cheque" value={paymentForm.titularCheque} onChangeText={(v) => setPaymentForm((f) => ({ ...f, titularCheque: v }))} />
                <InputField label="Número de cheque" value={paymentForm.numeroCheque} onChangeText={(v) => setPaymentForm((f) => ({ ...f, numeroCheque: v }))} />
                <InputField label="Fecha de emisión" value={paymentForm.fechaEmision} onChangeText={(v) => setPaymentForm((f) => ({ ...f, fechaEmision: v }))} placeholder="DD/MM/AAAA" />
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddPayment(false)}>
                <Text style={styles.cancelBtnText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleAddPayment} disabled={saving}>
                {saving ? <ActivityIndicator color="#111" /> : <Text style={styles.confirmBtnText}>CONFIRMAR</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Actualizar datos ──────────────────────────────────── */}
      <Modal visible={showUpdateProfile} transparent animationType="slide" onRequestClose={() => setShowUpdateProfile(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>ACTUALIZAR DATOS</Text>
            <InputField label="Nombre" value={profileForm.nombre} onChangeText={(v) => setProfileForm((f) => ({ ...f, nombre: v }))} />
            <InputField label="Domicilio" value={profileForm.domicilio} onChangeText={(v) => setProfileForm((f) => ({ ...f, domicilio: v }))} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowUpdateProfile(false)}>
                <Text style={styles.cancelBtnText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleUpdateProfile} disabled={saving}>
                {saving ? <ActivityIndicator color="#111" /> : <Text style={styles.confirmBtnText}>GUARDAR</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Datos del usuario ────────────────────────────────────────── */}
      <View style={styles.userData}>
        <View style={styles.userRow}>
          <Text style={styles.userLabel}>Nombre</Text>
          <Text style={styles.userValue}>{usuario?.nombre}</Text>
        </View>
        <View style={styles.userRow}>
          <Text style={styles.userLabel}>Categoría</Text>
          <Text style={styles.userValue}>{usuario?.categoria}</Text>
        </View>
        <View style={styles.userRow}>
          <Text style={styles.userLabel}>Documento</Text>
          <Text style={styles.userValue}>{usuario?.documento}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>MIS MEDIOS DE PAGO</Text>
      <View style={styles.paymentList}>
        {usuario?.mediosPago?.map((item) => (
          <PaymentMethodCard key={item.id} item={item} />
        ))}
      </View>

      <TouchableOpacity style={[styles.primaryButton, { marginTop: 14 }]} activeOpacity={0.82} onPress={() => setShowAddPayment(true)}>
        <Text style={styles.primaryButtonText}>AÑADIR NUEVO</Text>
      </TouchableOpacity>

      <View style={styles.securityCopy}>
        <Text style={styles.securityText}>Tu clave personal protege tu participacion en las subastas.</Text>
        <Text style={styles.securityText}>Esta informacion es privada y esencial para tu participacion.</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.82} onPress={() => setShowUpdateProfile(true)}>
        <Text style={styles.primaryButtonText}>ACTUALIZAR DATOS</Text>
      </TouchableOpacity>

      {/* ── Estadísticas ─────────────────────────────────────────────── */}
      <View style={styles.statsSection}>
        <View style={styles.statsDivider} />
        <Text style={styles.statsTitle}>ESTADISTICAS</Text>
        <View style={styles.statsGrid}>
          <StatCard label="SUBASTAS" sublabel="PARTICIPADAS" value={String(subastasParticipadas)} />
          <StatCard label="PRODUCTOS" sublabel="SUBIDOS" value={String(estadisticas?.productosSubidos ?? "-")} />
          <StatCard label="PRODUCTOS" sublabel="VENDIDOS" value={String(estadisticas?.productosVendidos ?? "-")} />
          <StatCard label="PUJAS" sublabel="GANADAS" value={String(estadisticas?.pujasGanadas ?? "-")} />
          <StatCard label="TOTAL" sublabel="PAGADO (USD)" value={estadisticas ? String(estadisticas.montoTotalGastado) : "-"} />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} activeOpacity={0.82} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>CERRAR SESIÓN</Text>
      </TouchableOpacity>

    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  userData: { alignSelf: "center", marginBottom: 24, width: "68%" },
  userRow: { alignItems: "center", flexDirection: "row", marginBottom: 13 },
  userLabel: { color: C.gold, fontFamily: "serif", fontSize: 18, fontWeight: "900", flexShrink: 0, marginRight: 10, minWidth: 100 },
  userValue: { color: C.gold, flex: 1, fontFamily: "serif", fontSize: 15, fontWeight: "800" },
  sectionTitle: { color: C.gold, fontFamily: "serif", fontSize: 20, fontWeight: "900", marginBottom: 18, textAlign: "center" },
  paymentList: { gap: 7, marginBottom: 10 },
  paymentCard: { alignItems: "center", borderColor: C.blueLine, borderRadius: 15, borderWidth: 1, flexDirection: "row", height: 49, justifyContent: "space-between", paddingHorizontal: 17 },
  paymentText: { color: C.gold, fontFamily: "serif", fontSize: 15, fontWeight: "900" },
  paymentStatus: { alignItems: "center", flexDirection: "row", gap: 10 },
  verifiedText: { color: C.green, fontFamily: "serif", fontSize: 15, fontWeight: "900" },
  notVerifiedText: { color: C.red, fontFamily: "serif", fontSize: 15, fontWeight: "900" },
  primaryButton: { alignItems: "center", backgroundColor: C.brightGold, borderRadius: 8, height: 36, justifyContent: "center" },
  primaryButtonText: { color: "#111111", fontFamily: "serif", fontSize: 17, fontWeight: "900" },
  securityCopy: { alignItems: "center", marginBottom: 10, marginTop: 9, paddingHorizontal: 4 },
  securityText: { color: C.gold, fontFamily: "serif", fontSize: 15, fontWeight: "900", lineHeight: 22, marginBottom: 5, textAlign: "center" },
  statsSection: { marginTop: 26 },
  statsDivider: { backgroundColor: C.line, height: 1, width: "100%" },
  statsTitle: { color: C.gold, fontFamily: "serif", fontSize: 26, fontWeight: "900", marginBottom: 18, marginTop: 18, textAlign: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 18, justifyContent: "center", marginBottom: 26 },
  statCard: { alignItems: "center", backgroundColor: "#202f3a", borderColor: C.line, borderRadius: 15, borderWidth: 1, height: 92, justifyContent: "center", width: "42%" },
  statLabel: { color: C.gold, fontFamily: "serif", fontSize: 13, fontWeight: "900", lineHeight: 16, textAlign: "center" },
  statValue: { color: C.gold, fontFamily: "serif", fontSize: 31, fontWeight: "900", lineHeight: 35, textAlign: "center", marginTop: 4 },
  logoutButton: { alignItems: "center", borderColor: C.red, borderRadius: 8, borderWidth: 1.5, height: 36, justifyContent: "center", marginTop: 24, marginBottom: 16 },
  logoutButtonText: { color: C.red, fontFamily: "serif", fontSize: 16, fontWeight: "900" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", paddingHorizontal: 20 },
  modalCard: { backgroundColor: "#080f1c", borderColor: "rgba(212,175,55,0.3)", borderRadius: 16, borderWidth: 1, padding: 20 },
  modalTitle: { color: "#d4af37", fontFamily: "serif", fontSize: 16, fontWeight: "900", letterSpacing: 2, marginBottom: 16, textAlign: "center" },
  tipoRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tipoBtn: { flex: 1, alignItems: "center", borderColor: "#2a4a60", borderRadius: 8, borderWidth: 1, paddingVertical: 8 },
  tipoBtnActive: { backgroundColor: "#d4af37", borderColor: "#d4af37" },
  tipoBtnText: { color: "#4a6a80", fontFamily: "serif", fontSize: 12, fontWeight: "900" },
  tipoBtnTextActive: { color: "#111111" },
  inputGroup: { marginBottom: 12 },
  inputLabel: { color: "#d4af37", fontFamily: "serif", fontSize: 12, fontWeight: "900", marginBottom: 4 },
  input: { backgroundColor: "#0d1f2d", borderColor: "#2a4a60", borderRadius: 8, borderWidth: 1, color: "#e0d0a0", fontFamily: "serif", fontSize: 14, height: 40, paddingHorizontal: 12 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, alignItems: "center", borderColor: "#4a6a80", borderRadius: 8, borderWidth: 1, height: 38, justifyContent: "center" },
  cancelBtnText: { color: "#4a6a80", fontFamily: "serif", fontSize: 13, fontWeight: "900" },
  confirmBtn: { flex: 1, alignItems: "center", backgroundColor: "#d4af37", borderRadius: 8, height: 38, justifyContent: "center" },
  confirmBtnText: { color: "#111111", fontFamily: "serif", fontSize: 13, fontWeight: "900" },
});
