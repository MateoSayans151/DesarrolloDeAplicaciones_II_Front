import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
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
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fecha,      setFecha]      = useState("");
  const [hora,       setHora]       = useState("");
  const [ubicacion,  setUbicacion]  = useState("");
  const [capacidad,  setCapacidad]  = useState("");
  const [categoria,  setCategoria]  = useState<SubastaRequest["categoria"]>("comun");
  const [loading,    setLoading]    = useState(false);

  // Fade in al montar
  useRef(
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start()
  );

  const handleCrear = async () => {
    // Validación básica
    if (!fecha.trim() || !hora.trim()) {
      Alert.alert("Campos requeridos", "La fecha y la hora son obligatorias.");
      return;
    }

    // Formato fecha YYYY-MM-DD
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha.trim())) {
      Alert.alert("Formato inválido", "La fecha debe tener el formato YYYY-MM-DD.");
      return;
    }

    // Formato hora HH:MM:SS
    const horaRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!horaRegex.test(hora.trim())) {
      Alert.alert("Formato inválido", "La hora debe tener el formato HH:MM o HH:MM:SS.");
      return;
    }

    setLoading(true);
    try {
      const payload: SubastaRequest = {
        fecha:    fecha.trim(),
        hora:     hora.trim().length === 5 ? `${hora.trim()}:00` : hora.trim(),
        categoria,
        ...(ubicacion.trim()  && { ubicacion: ubicacion.trim() }),
        ...(capacidad.trim()  && { capacidadAsistentes: parseInt(capacidad, 10) }),
      };

      const nuevaSubasta = await subastaService.crear(payload);

      Alert.alert(
        "✓ Subasta creada",
        `Subasta #${nuevaSubasta.id} creada exitosamente.`,
        [{ text: "Ver subastas", onPress: () => router.back() }]
      );
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo crear la subasta.");
    } finally {
      setLoading(false);
    }
  };

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
            <Field label="FECHA" icon="event">
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={MUTED}
                value={fecha}
                onChangeText={setFecha}
                keyboardType="numeric"
              />
            </Field>

            <View style={styles.divider} />

            {/* Hora */}
            <Field label="HORA" icon="schedule">
              <TextInput
                style={styles.input}
                placeholder="HH:MM:SS"
                placeholderTextColor={MUTED}
                value={hora}
                onChangeText={setHora}
                keyboardType="numeric"
              />
            </Field>

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
              <Text style={styles.summaryValue}>{hora || "—"}</Text>
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
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <MaterialIcons name="diamond" size={13} color={MUTED} />
              <Text style={styles.summaryLabel}>Categoría</Text>
              <Text style={[styles.summaryValue, { color: GOLD }]}>
                {CATEGORIA_LABEL[categoria].toUpperCase()}
              </Text>
            </View>
          </View>

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
  crearBtnText: {
    color: BG,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 3,
  },
});
