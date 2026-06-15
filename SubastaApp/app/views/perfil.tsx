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
import * as ImagePicker from "expo-image-picker";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TipoMedioPago = "TARJETA" | "CUENTA" | "CHEQUE";

// ── Profile Avatar ────────────────────────────────────────────────────────────
function ProfileAvatar({
  uri,
  onPress,
  uploading,
  nombre,
}: {
  uri?: string | null;
  onPress: () => void;
  uploading: boolean;
  nombre?: string;
}) {
  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity style={styles.avatarWrapper} onPress={onPress} activeOpacity={0.8}>
        {uri ? (
          <Image source={{ uri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="person" size={48} color={C.gold} />
          </View>
        )}
        <View style={styles.avatarBadge}>
          {uploading ? (
            <ActivityIndicator size={12} color="#111" />
          ) : (
            <MaterialIcons name="photo-camera" size={13} color="#111" />
          )}
        </View>
      </TouchableOpacity>
      {nombre ? <Text style={styles.avatarName}>{nombre}</Text> : null}
      <Text style={styles.avatarHint}>Tocá para cambiar foto</Text>
    </View>
  );
}

// ── Payment Method Card ───────────────────────────────────────────────────────
function PaymentMethodCard({ item }: { item: PaymentMethod }) {
  const iconName =
    item.tipo === "TARJETA" ? "credit-card" : item.tipo === "CUENTA" ? "account-balance" : "description";
  const verified = item.verificado === "si";
  return (
    <View style={styles.paymentCard}>
      <View style={styles.paymentLeft}>
        <View style={styles.paymentIconWrap}>
          <MaterialIcons name={iconName as any} size={18} color={C.gold} />
        </View>
        <View>
          <Text style={styles.paymentType}>{item.tipo}</Text>
          <Text style={styles.paymentNumber}>•••• {item.ultimosNumeros}</Text>
        </View>
      </View>
      <View style={[styles.paymentBadge, verified ? styles.paymentBadgeOk : styles.paymentBadgeNo]}>
        <MaterialIcons
          name={verified ? "check-circle" : "cancel"}
          size={13}
          color={verified ? C.green : C.red}
        />
        <Text style={[styles.paymentBadgeText, { color: verified ? C.green : C.red }]}>
          {verified ? "Verificado" : "Pendiente"}
        </Text>
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

// ── InfoRow ───────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <MaterialIcons name={icon as any} size={16} color={C.gold} />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value ?? "—"}</Text>
      </View>
    </View>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      {action && onAction ? (
        <TouchableOpacity onPress={onAction} style={styles.sectionHeaderAction}>
          <MaterialIcons name="add" size={15} color="#111" />
          <Text style={styles.sectionHeaderActionText}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function PerfilScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasUsuarioResponse | null>(null);
  const [subastasParticipadas, setSubastasParticipadas] = useState<number>(0);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [tipoMedioPago, setTipoMedioPago] = useState<TipoMedioPago>("CUENTA");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);

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

  // ── Photo picker ────────────────────────────────────────────────────────────
  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería para cambiar la foto.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      uploadPhoto(result.assets[0].uri, result.assets[0].base64);
    }
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitamos acceso a la cámara para tomar una foto.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      uploadPhoto(result.assets[0].uri, result.assets[0].base64);
    }
  };

  const uploadPhoto = async (uri: string, base64: string) => {
    setUploadingPhoto(true);
    setLocalPhotoUri(uri);
    try {
      await usuarioService.actualizarFotoPerfil(base64);
      await cargarDatos();
    } catch (e: any) {
      setLocalPhotoUri(null);
      Alert.alert("Error", e.message ?? "No se pudo actualizar la foto.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAvatarPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", "Tomar foto", "Elegir de la galería"],
          cancelButtonIndex: 0,
          tintColor: C.gold,
        },
        (idx) => {
          if (idx === 1) pickFromCamera();
          if (idx === 2) pickFromLibrary();
        }
      );
    } else {
      Alert.alert("Cambiar foto", "¿De dónde querés elegir la imagen?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Cámara", onPress: pickFromCamera },
        { text: "Galería", onPress: pickFromLibrary },
      ]);
    }
  };

  const handleLogout = async () => {
    await usuarioService.logout();
    router.replace("/views");
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

  // fotoBase64 del backend ya viene como data URL (data:image/jpeg;base64,...)
  const photoUri = localPhotoUri ?? usuario?.fotoBase64 ?? null;

  return (
    <ScreenLayout activeTab="perfil">

      {/* ── Modal: Agregar medio de pago ─────────────────────────────── */}
      <Modal visible={showAddPayment} transparent animationType="slide" onRequestClose={() => setShowAddPayment(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>AÑADIR MEDIO DE PAGO</Text>
            <View style={styles.tipoRow}>
              {(["CUENTA", "TARJETA", "CHEQUE"] as TipoMedioPago[]).map((t) => (
                <TouchableOpacity key={t} style={[styles.tipoBtn, tipoMedioPago === t && styles.tipoBtnActive]} onPress={() => setTipoMedioPago(t)}>
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

      {/* ── Hero: Avatar + nombre + categoría ───────────────────────── */}
      <ProfileAvatar uri={photoUri} onPress={handleAvatarPress} uploading={uploadingPhoto} nombre={usuario?.nombre} />

      {/* ── Tarjeta de datos personales ──────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <MaterialIcons name="person-outline" size={16} color={C.gold} />
          <Text style={styles.cardTitle}>DATOS PERSONALES</Text>
          <TouchableOpacity style={styles.editPill} onPress={() => setShowUpdateProfile(true)} activeOpacity={0.75}>
            <MaterialIcons name="edit" size={12} color="#111" />
            <Text style={styles.editPillText}>Editar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <InfoRow icon="badge" label="Categoría" value={usuario?.categoria} />
        <InfoRow icon="fingerprint" label="Documento" value={usuario?.documento} />
      </View>

      {/* ── Tarjeta de medios de pago ────────────────────────────────── */}
      <View style={styles.card}>
        <SectionHeader title="MEDIOS DE PAGO" action="Añadir" onAction={() => setShowAddPayment(true)} />
        <View style={styles.divider} />
        {usuario?.mediosPago?.length ? (
          <View style={styles.paymentList}>
            {usuario.mediosPago.map((item) => (
              <PaymentMethodCard key={item.id} item={item} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyPayment}>
            <MaterialIcons name="credit-card-off" size={28} color="#2a4a60" />
            <Text style={styles.emptyPaymentText}>Sin medios de pago registrados</Text>
          </View>
        )}
      </View>

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
        <MaterialIcons name="logout" size={16} color={C.red} style={{ marginRight: 6 }} />
        <Text style={styles.logoutButtonText}>CERRAR SESIÓN</Text>
      </TouchableOpacity>

    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  // ── Avatar hero
  avatarContainer: { alignItems: "center", marginBottom: 24, marginTop: 8 },
  avatarWrapper: { position: "relative", marginBottom: 10 },
  avatarImage: { borderColor: C.gold, borderRadius: 56, borderWidth: 2.5, height: 112, width: 112 },
  avatarPlaceholder: { alignItems: "center", backgroundColor: "#0d1f2d", borderColor: C.gold, borderRadius: 56, borderWidth: 2.5, height: 112, justifyContent: "center", width: 112 },
  avatarBadge: { alignItems: "center", backgroundColor: C.brightGold, borderRadius: 14, bottom: 2, height: 28, justifyContent: "center", position: "absolute", right: 2, width: 28 },
  avatarName: { color: C.gold, fontFamily: "serif", fontSize: 22, fontWeight: "900", letterSpacing: 0.5, textAlign: "center" },
  avatarHint: { color: "#2a4a60", fontFamily: "serif", fontSize: 12, marginTop: 3, textAlign: "center" },

  // ── Card container
  card: { backgroundColor: "#0b1929", borderColor: "rgba(212,175,55,0.18)", borderRadius: 16, borderWidth: 1, marginBottom: 14, paddingHorizontal: 18, paddingVertical: 16 },
  cardTitleRow: { alignItems: "center", flexDirection: "row", gap: 7, marginBottom: 12 },
  cardTitle: { color: C.gold, flex: 1, fontFamily: "serif", fontSize: 13, fontWeight: "900", letterSpacing: 1.5 },
  editPill: { alignItems: "center", backgroundColor: C.brightGold, borderRadius: 20, flexDirection: "row", gap: 3, paddingHorizontal: 10, paddingVertical: 4 },
  editPillText: { color: "#111", fontFamily: "serif", fontSize: 11, fontWeight: "900" },
  divider: { backgroundColor: "rgba(212,175,55,0.12)", height: 1, marginBottom: 14 },

  // ── Info rows
  infoRow: { alignItems: "center", flexDirection: "row", gap: 12, marginBottom: 10 },
  infoIconWrap: { alignItems: "center", backgroundColor: "rgba(212,175,55,0.08)", borderRadius: 8, height: 32, justifyContent: "center", width: 32 },
  infoTextWrap: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { color: "#4a6a80", fontFamily: "serif", fontSize: 13, fontWeight: "700" },
  infoValue: { color: C.gold, fontFamily: "serif", fontSize: 14, fontWeight: "800" },

  // ── Section header (with inline action)
  sectionHeader: { alignItems: "center", flexDirection: "row", marginBottom: 12 },
  sectionHeaderTitle: { color: C.gold, flex: 1, fontFamily: "serif", fontSize: 13, fontWeight: "900", letterSpacing: 1.5 },
  sectionHeaderAction: { alignItems: "center", backgroundColor: C.brightGold, borderRadius: 20, flexDirection: "row", gap: 3, paddingHorizontal: 10, paddingVertical: 4 },
  sectionHeaderActionText: { color: "#111", fontFamily: "serif", fontSize: 11, fontWeight: "900" },

  // ── Payment list
  paymentList: { gap: 8 },
  paymentCard: { alignItems: "center", backgroundColor: "#0d1f2d", borderColor: "#1a3248", borderRadius: 12, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 11 },
  paymentLeft: { alignItems: "center", flexDirection: "row", gap: 12 },
  paymentIconWrap: { alignItems: "center", backgroundColor: "rgba(212,175,55,0.08)", borderRadius: 8, height: 34, justifyContent: "center", width: 34 },
  paymentType: { color: C.gold, fontFamily: "serif", fontSize: 13, fontWeight: "900" },
  paymentNumber: { color: "#4a6a80", fontFamily: "serif", fontSize: 12, marginTop: 1 },
  paymentBadge: { alignItems: "center", borderRadius: 20, flexDirection: "row", gap: 4, paddingHorizontal: 9, paddingVertical: 4 },
  paymentBadgeOk: { backgroundColor: "rgba(52,199,89,0.1)" },
  paymentBadgeNo: { backgroundColor: "rgba(255,69,58,0.1)" },
  paymentBadgeText: { fontFamily: "serif", fontSize: 11, fontWeight: "800" },
  emptyPayment: { alignItems: "center", gap: 8, paddingVertical: 18 },
  emptyPaymentText: { color: "#2a4a60", fontFamily: "serif", fontSize: 13 },

  // ── Stats
  statsSection: { marginTop: 26 },
  statsDivider: { backgroundColor: C.line, height: 1, width: "100%" },
  statsTitle: { color: C.gold, fontFamily: "serif", fontSize: 26, fontWeight: "900", marginBottom: 18, marginTop: 18, textAlign: "center" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 18, justifyContent: "center", marginBottom: 26 },
  statCard: { alignItems: "center", backgroundColor: "#202f3a", borderColor: C.line, borderRadius: 15, borderWidth: 1, height: 92, justifyContent: "center", width: "42%" },
  statLabel: { color: C.gold, fontFamily: "serif", fontSize: 13, fontWeight: "900", lineHeight: 16, textAlign: "center" },
  statValue: { color: C.gold, fontFamily: "serif", fontSize: 31, fontWeight: "900", lineHeight: 35, textAlign: "center", marginTop: 4 },

  // ── Logout
  logoutButton: { alignItems: "center", borderColor: C.red, borderRadius: 8, borderWidth: 1.5, flexDirection: "row", height: 40, justifyContent: "center", marginBottom: 16, marginTop: 8 },
  logoutButtonText: { color: C.red, fontFamily: "serif", fontSize: 15, fontWeight: "900" },

  // ── Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", paddingHorizontal: 20 },
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