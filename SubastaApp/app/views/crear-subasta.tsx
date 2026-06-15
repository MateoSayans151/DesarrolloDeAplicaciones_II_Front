import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import subastaService, { SubastaRequest } from "@/models/services/subastaService";

// ─── Constants ───────────────────────────────────────────────────────────────

const GOLD      = "#d4af37";
const GOLD_FAINT= "rgba(212,175,55,0.08)";
const GOLD_MID  = "rgba(212,175,55,0.28)";
const MUTED     = "#3a5a78";
const BG        = "#07162b";
const CARD      = "#080f1c";
const BORDER    = "#0f2540";

const CATEGORIAS: SubastaRequest["categoria"][] = [
  "comun", "especial", "plata", "oro", "platino",
];

const CATEGORIA_LABEL: Record<SubastaRequest["categoria"], string> = {
  comun:    "Común",
  especial: "Especial",
  plata:    "Plata",
  oro:      "Oro",
  platino:  "Platino",
};

const CATEGORIA_ICON: Record<SubastaRequest["categoria"], string> = {
  comun:   "radio-button-unchecked",
  especial:"star-border",
  plata:   "workspace-premium",
  oro:     "emoji-events",
  platino: "diamond",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateToString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function timeToString(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

// ─── DatePicker button ───────────────────────────────────────────────────────

function PickerButton({
  icon,
  label,
  value,
  placeholder,
  onPress,
}: {
  icon: string;
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
}) {
  const hasValue = value.length > 0;
  return (
    <View style={fieldStyles.wrap}>
      <View style={fieldStyles.labelRow}>
        <MaterialIcons name={icon as any} size={13} color={GOLD} style={{ opacity: 0.8 }} />
        <Text style={fieldStyles.label}>{label}</Text>
      </View>
      <TouchableOpacity style={pickerStyles.btn} onPress={onPress} activeOpacity={0.8}>
        <Text style={[pickerStyles.value, !hasValue && pickerStyles.placeholder]}>
          {hasValue ? value : placeholder}
        </Text>
        <MaterialIcons name="edit-calendar" size={16} color={GOLD} style={{ opacity: 0.7 }} />
      </TouchableOpacity>
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  value: {
    color: "#e8d9bb",
    fontFamily: "serif",
    fontSize: 14,
  },
  placeholder: {
    color: MUTED,
  },
});

// ─── iOS modal picker wrapper ────────────────────────────────────────────────

function IOSPickerModal({
  visible,
  mode,
  date,
  minimumDate,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  mode: "date" | "time";
  date: Date;
  minimumDate?: Date;
  onConfirm: (d: Date) => void;
  onCancel: () => void;
}) {
  const [tempDate, setTempDate] = useState(date);

  useEffect(() => {
    if (visible) setTempDate(date);
  }, [visible]);

  const handleChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (selected) setTempDate(selected);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          {/* Toolbar */}
          <View style={modalStyles.toolbar}>
            <TouchableOpacity onPress={onCancel} style={modalStyles.toolbarBtn}>
              <Text style={modalStyles.toolbarCancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={modalStyles.toolbarTitle}>
              {mode === "date" ? "Seleccioná la fecha" : "Seleccioná la hora"}
            </Text>
            <TouchableOpacity onPress={() => onConfirm(tempDate)} style={modalStyles.toolbarBtn}>
              <Text style={modalStyles.toolbarConfirm}>Confirmar</Text>
            </TouchableOpacity>
          </View>

          {/* Native picker */}
          <DateTimePicker
            value={tempDate}
            mode={mode}
            display="spinner"
            onChange={handleChange}
            minimumDate={minimumDate}
            locale="es-AR"
            style={modalStyles.picker}
            textColor="#e8d9bb"
            themeVariant="dark"
          />
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#0b1a2e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: BORDER,
    paddingBottom: 32,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  toolbarBtn: {
    minWidth: 80,
  },
  toolbarTitle: {
    color: MUTED,
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  toolbarCancel: {
    color: MUTED,
    fontFamily: "serif",
    fontSize: 14,
  },
  toolbarConfirm: {
    color: GOLD,
    fontFamily: "serif",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },
  picker: {
    backgroundColor: "transparent",
    marginTop: 8,
  },
});

// ─── Field component ─────────────────────────────────────────────────────────

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View style={fieldStyles.wrap}>
      <View style={fieldStyles.labelRow}>
        <MaterialIcons name={icon as any} size={13} color={GOLD} style={{ opacity: 0.8 }} />
        <Text style={fieldStyles.label}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { gap: 6 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  label: {
    color: MUTED,
    fontFamily: "serif",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
});

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function CrearSubastaScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Date / time state ──────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Android inline pickers need a temp state
  const [androidPickerMode, setAndroidPickerMode] = useState<"date" | "time">("date");
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  // Derived strings for API
  const fecha = selectedDate ? dateToString(selectedDate) : "";
  const hora  = selectedTime ? timeToString(selectedTime) : "";

  // ── Other fields ──────────────────────────────────────────────────
  const [ubicacion,  setUbicacion]  = useState("");
  const [capacidad,  setCapacidad]  = useState("");
  const [tiempoItem, setTiempoItem] = useState("60");
  const [categoria,  setCategoria]  = useState<SubastaRequest["categoria"]>("comun");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [exito,      setExito]      = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  // ── Android picker handler ────────────────────────────────────────
  const handleAndroidChange = (_: DateTimePickerEvent, d?: Date) => {
    setShowAndroidPicker(false);
    if (!d) return;
    if (androidPickerMode === "date") setSelectedDate(d);
    else setSelectedTime(d);
  };

  const openAndroid = (mode: "date" | "time") => {
    setAndroidPickerMode(mode);
    setShowAndroidPicker(true);
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleCrear = async () => {
    setError(null);
    setExito(null);

    if (!fecha || !hora) {
      setError("La fecha y la hora son obligatorias.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fecha,
        hora,
        categoria,
        ...(ubicacion.trim()  && { ubicacion: ubicacion.trim() }),
        ...(capacidad.trim()  && { capacidadAsistentes: parseInt(capacidad, 10) }),
        tiempoItemSegundos: parseInt(tiempoItem, 10) || 60,
      };

      console.log("[CrearSubasta] enviando payload:", JSON.stringify(payload));
      const nuevaSubasta = await subastaService.crear(payload as SubastaRequest);
      console.log("[CrearSubasta] subasta creada:", nuevaSubasta.id);

      setExito(`Subasta #${nuevaSubasta.id} creada. Volvé a la lista para verla.`);
    } catch (e: any) {
      const msg = e?.message || "No se pudo crear la subasta.";
      console.error("[CrearSubasta] error:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* ── Header ──────────────────────────────────────────────── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back-ios" size={18} color="#8aaec8" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={styles.ornamentRow}>
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
                <View style={styles.ornamentLine} />
              </View>
              <Text style={styles.headerTitle}>NUEVA SUBASTA</Text>
              <View style={styles.ornamentRow}>
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
                <View style={styles.ornamentLine} />
              </View>
            </View>
            <View style={{ width: 36 }} />
          </View>

          <Text style={styles.subtitle}> Agregar nueva subasta </Text>

          {/* ── Card principal ──────────────────────────────────────── */}
          <View style={styles.card}>

            {/* Fecha */}
            <PickerButton
              icon="event"
              label="FECHA"
              value={fecha}
              placeholder="Seleccioná una fecha"
              onPress={() =>
                Platform.OS === "ios" ? setShowDatePicker(true) : openAndroid("date")
              }
            />

            <View style={styles.divider} />

            {/* Hora */}
            <PickerButton
              icon="schedule"
              label="HORA"
              value={hora ? hora.slice(0, 5) : ""}
              placeholder="Seleccioná una hora"
              onPress={() =>
                Platform.OS === "ios" ? setShowTimePicker(true) : openAndroid("time")
              }
            />

            <View style={styles.divider} />

            {/* Ubicación */}
            <Field label="UBICACIÓN" icon="place">
              <TextInput
                style={styles.input}
                placeholder="Opcional — ej: Sede Central UADE"
                placeholderTextColor={MUTED}
                value={ubicacion}
                onChangeText={setUbicacion}
              />
            </Field>

            <View style={styles.divider} />

            {/* Capacidad */}
            <Field label="CAPACIDAD DE ASISTENTES" icon="people">
              <TextInput
                style={styles.input}
                placeholder="Opcional — ej: 50"
                placeholderTextColor={MUTED}
                value={capacidad}
                onChangeText={(v) => setCapacidad(v.replace(/\D/g, ""))}
                keyboardType="numeric"
              />
            </Field>

            <View style={styles.divider} />

            {/* Tiempo por ítem */}
            <Field label="SEGUNDOS POR ÍTEM" icon="timer">
              <TextInput
                style={styles.input}
                placeholder="ej: 60"
                placeholderTextColor={MUTED}
                value={tiempoItem}
                onChangeText={(v) => setTiempoItem(v.replace(/\D/g, ""))}
                keyboardType="numeric"
              />
            </Field>

          </View>

          {/* ── Categoría ───────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>CATEGORÍA</Text>

          <View style={styles.categoriasGrid}>
            {CATEGORIAS.map((cat) => {
              const active = categoria === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catCard, active && styles.catCardActive]}
                  onPress={() => setCategoria(cat)}
                  activeOpacity={0.75}
                >
                  <MaterialIcons
                    name={CATEGORIA_ICON[cat] as any}
                    size={22}
                    color={active ? GOLD : MUTED}
                  />
                  <Text style={[styles.catLabel, active && styles.catLabelActive]}>
                    {CATEGORIA_LABEL[cat].toUpperCase()}
                  </Text>
                  {active && <View style={styles.catActiveDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Resumen ─────────────────────────────────────────────── */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <MaterialIcons name="event" size={13} color={MUTED} />
              <Text style={styles.summaryLabel}>Fecha</Text>
              <Text style={styles.summaryValue}>{fecha || "—"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialIcons name="schedule" size={13} color={MUTED} />
              <Text style={styles.summaryLabel}>Hora</Text>
              <Text style={styles.summaryValue}>{hora ? hora.slice(0, 5) : "—"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialIcons name="place" size={13} color={MUTED} />
              <Text style={styles.summaryLabel}>Ubicación</Text>
              <Text style={styles.summaryValue}>{ubicacion || "—"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialIcons name="people" size={13} color={MUTED} />
              <Text style={styles.summaryLabel}>Capacidad</Text>
              <Text style={styles.summaryValue}>{capacidad || "—"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialIcons name="diamond" size={13} color={MUTED} />
              <Text style={styles.summaryLabel}>Categoría</Text>
              <Text style={[styles.summaryValue, { color: GOLD }]}>
                {CATEGORIA_LABEL[categoria].toUpperCase()}
              </Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <MaterialIcons name="timer" size={13} color={MUTED} />
              <Text style={styles.summaryLabel}>Seg. por ítem</Text>
              <Text style={styles.summaryValue}>{tiempoItem || "60"}</Text>
            </View>
          </View>

          {/* ── Feedback ────────────────────────────────────────────── */}
          {error ? (
            <View style={styles.feedbackRow}>
              <MaterialIcons name="error-outline" size={16} color="#e74c3c" />
              <Text style={styles.feedbackError}>{error}</Text>
            </View>
          ) : null}
          {exito ? (
            <View style={[styles.feedbackRow, { backgroundColor: "rgba(46,204,113,0.12)", borderColor: "#2ecc71" }]}>
              <MaterialIcons name="check-circle" size={16} color="#2ecc71" />
              <Text style={[styles.feedbackError, { color: "#2ecc71" }]}>{exito}</Text>
            </View>
          ) : null}

          {/* ── Botón crear ─────────────────────────────────────────── */}
          <TouchableOpacity
            style={[styles.crearBtn, loading && styles.crearBtnDisabled]}
            onPress={handleCrear}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={BG} size="small" />
            ) : (
              <>
                <MaterialIcons name="gavel" size={18} color={BG} />
                <Text style={styles.crearBtnText}>CREAR SUBASTA</Text>
              </>
            )}
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>

      {/* ── iOS modals ────────────────────────────────────────────────── */}
      {Platform.OS === "ios" && (
        <>
          <IOSPickerModal
            visible={showDatePicker}
            mode="date"
            date={selectedDate ?? today}
            minimumDate={today}
            onConfirm={(d) => { setSelectedDate(d); setShowDatePicker(false); }}
            onCancel={() => setShowDatePicker(false)}
          />
          <IOSPickerModal
            visible={showTimePicker}
            mode="time"
            date={selectedTime ?? new Date()}
            onConfirm={(d) => { setSelectedTime(d); setShowTimePicker(false); }}
            onCancel={() => setShowTimePicker(false)}
          />
        </>
      )}

      {/* ── Android native picker ─────────────────────────────────────── */}
      {Platform.OS === "android" && showAndroidPicker && (
        <DateTimePicker
          value={
            androidPickerMode === "date"
              ? (selectedDate ?? today)
              : (selectedTime ?? new Date())
          }
          mode={androidPickerMode}
          display="default"
          onChange={handleAndroidChange}
          minimumDate={androidPickerMode === "date" ? today : undefined}
        />
      )}

    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
  },

  // ── Header ──────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    color: GOLD,
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 5,
  },
  ornamentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "80%",
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: GOLD_MID,
  },
  ornamentDiamond: {
    width: 4,
    height: 4,
    backgroundColor: GOLD,
    opacity: 0.6,
    transform: [{ rotate: "45deg" }],
  },
  subtitle: {
    color: MUTED,
    fontFamily: "serif",
    fontSize: 11,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 24,
  },

  // ── Card ────────────────────────────────────────────────────────────
  card: {
    backgroundColor: CARD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    gap: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    color: "#e8d9bb",
    fontFamily: "serif",
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginHorizontal: -20,
  },

  // ── Categorías ──────────────────────────────────────────────────────
  sectionLabel: {
    color: MUTED,
    fontFamily: "serif",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 12,
  },
  categoriasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  catCard: {
    alignItems: "center",
    backgroundColor: CARD,
    borderColor: BORDER,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    paddingVertical: 14,
    width: "30%",
    flexGrow: 1,
    position: "relative",
  },
  catCardActive: {
    backgroundColor: GOLD_FAINT,
    borderColor: GOLD_MID,
  },
  catLabel: {
    color: MUTED,
    fontFamily: "serif",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  catLabelActive: {
    color: GOLD,
  },
  catActiveDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
  },

  // ── Resumen ─────────────────────────────────────────────────────────
  summaryCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 24,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  summaryLabel: {
    color: MUTED,
    fontFamily: "serif",
    fontSize: 11,
    flex: 1,
  },
  summaryValue: {
    color: "#e8d9bb",
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "700",
  },

  // ── Botón ───────────────────────────────────────────────────────────
  crearBtn: {
    backgroundColor: GOLD,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  crearBtnDisabled: {
    opacity: 0.5,
  },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(231,76,60,0.10)",
    borderColor: "#e74c3c",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  feedbackError: {
    color: "#e74c3c",
    fontFamily: "serif",
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  crearBtnText: {
    color: BG,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 3,
  },
});
