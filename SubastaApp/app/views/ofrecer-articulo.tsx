import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import productoService from "@/models/services/productoService";

// ─── Tokens ──────────────────────────────────────────────────────────────────

const GOLD      = "#d4af37";
const GOLD_MID  = "rgba(212,175,55,0.28)";
const GOLD_BORD = "rgba(120,91,44,0.6)";
const MUTED     = "#99988b";
const BG        = "#001020";
const CARD      = "rgba(13,32,57,0.5)";
const BORDER    = "#0f2540";

const TOTAL_STEPS = 5;

// ─── FormData ─────────────────────────────────────────────────────────────────

interface FormData {
  titulo: string;
  tipoPieza: string;
  descripcion: string;
  fotos: string[];          // base64
  artista: string;
  disenador: string;
  fechaCreacion: string;
  historia: string;
  montoAsegurado: string;
  moneda: "USD" | "ARS";
  aseguradora: string;
  polizaSeguro: string;
  ubicacionDeposito: string;
  declaraPropiedad: boolean;
  declaraEnvio: boolean;
}

const INITIAL: FormData = {
  titulo: "",
  tipoPieza: "",
  descripcion: "",
  fotos: [],
  artista: "",
  disenador: "",
  fechaCreacion: "",
  historia: "",
  montoAsegurado: "",
  moneda: "USD",
  aseguradora: "",
  polizaSeguro: "",
  ubicacionDeposito: "",
  declaraPropiedad: false,
  declaraEnvio: false,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <View style={hdr.wrap}>
      <Text style={hdr.title}>OFRECER ARTICULO</Text>
      <View style={hdr.ornament}><View style={hdr.line} /><View style={hdr.diamond} /><View style={hdr.line} /></View>
      <View style={hdr.row}>
        <TouchableOpacity onPress={onBack} style={hdr.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="chevron-left" size={22} color={GOLD} />
          <Text style={hdr.backText}>Back</Text>
        </TouchableOpacity>
        <View style={hdr.dots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View key={i} style={[hdr.dot, i < step && hdr.dotActive]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const hdr = StyleSheet.create({
  wrap: { alignItems: "center", marginBottom: 8 },
  title: { color: MUTED, fontFamily: "serif", fontSize: 26, fontWeight: "600", letterSpacing: 2, marginBottom: 4 },
  ornament: { flexDirection: "row", alignItems: "center", width: "90%", marginBottom: 8 },
  line: { flex: 1, height: 1, backgroundColor: GOLD_MID },
  diamond: { width: 5, height: 5, backgroundColor: GOLD, opacity: 0.6, transform: [{ rotate: "45deg" }], marginHorizontal: 6 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { color: MUTED, fontFamily: "serif", fontSize: 18 },
  dots: { flexDirection: "row", gap: 8, marginRight: 4 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#2a3a50", borderWidth: 1, borderColor: GOLD_MID },
  dotActive: { backgroundColor: GOLD },
});

function Input({ placeholder, value, onChangeText, multiline, keyboardType }: {
  placeholder: string; value: string; onChangeText: (v: string) => void;
  multiline?: boolean; keyboardType?: "default" | "numeric" | "decimal-pad";
}) {
  return (
    <TextInput
      style={[inp.input, multiline && inp.multiline]}
      placeholder={placeholder}
      placeholderTextColor={MUTED}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType ?? "default"}
      textAlignVertical={multiline ? "top" : "center"}
    />
  );
}

const inp = StyleSheet.create({
  input: { backgroundColor: CARD, borderColor: GOLD_BORD, borderWidth: 1, borderRadius: 12, color: "#e8d9bb", fontFamily: "serif", fontSize: 16, paddingHorizontal: 12, height: 38 },
  multiline: { height: 160, paddingTop: 10 },
});

function SubTitle({ text }: { text: string }) {
  return <Text style={{ color: MUTED, fontFamily: "serif", fontSize: 22, fontWeight: "600", textAlign: "center", marginBottom: 20 }}>{text}</Text>;
}

function ContinuarBtn({ label, onPress, loading }: { label: string; onPress: () => void; loading?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.85} style={btn.btn}>
      {loading ? <ActivityIndicator color="#091525" /> : <Text style={btn.text}>{label}</Text>}
    </TouchableOpacity>
  );
}

const btn = StyleSheet.create({
  btn: { marginTop: 20, backgroundColor: GOLD, borderRadius: 10, height: 42, alignItems: "center", justifyContent: "center", shadowColor: GOLD, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  text: { color: "#091525", fontFamily: "serif", fontSize: 18, fontWeight: "900" },
});

// ─── PASO 1: Información básica ───────────────────────────────────────────────

function Paso1({ data, set, onNext }: { data: FormData; set: (d: Partial<FormData>) => void; onNext: () => void }) {
  const handleNext = () => {
    if (!data.titulo.trim()) return Alert.alert("Campo requerido", "Ingresá un título.");
    if (!data.descripcion.trim()) return Alert.alert("Campo requerido", "Ingresá una descripción.");
    onNext();
  };

  return (
    <>
      <SubTitle text="INFORMACIÓN BÁSICA" />

      <Text style={s.label}>Título del artículo</Text>
      <Input placeholder="Título del artículo" value={data.titulo} onChangeText={(v) => set({ titulo: v })} />

      <Text style={s.label}>Tipo de pieza</Text>
      <Input placeholder="Tipo de pieza" value={data.tipoPieza} onChangeText={(v) => set({ tipoPieza: v })} />

      <Text style={s.label}>Descripción</Text>
      <Input placeholder="Descripción..." value={data.descripcion} onChangeText={(v) => set({ descripcion: v })} multiline />

      <Text style={[s.hint, { marginTop: 8 }]}>Este campo es opcional. Será útil para ayudar a los analistas a clasificar su artículo.</Text>

      <ContinuarBtn label="CONTINUAR" onPress={handleNext} />
    </>
  );
}

// ─── PASO 2: Multimedia ───────────────────────────────────────────────────────

const MAX_FOTOS = 6;

function Paso2({ data, set, onNext }: { data: FormData; set: (d: Partial<FormData>) => void; onNext: () => void }) {
  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0].base64) {
      const newFotos = [...data.fotos];
      newFotos[index] = result.assets[0].base64;
      set({ fotos: newFotos });
    }
  };

  const slots = Array.from({ length: MAX_FOTOS });

  return (
    <>
      <SubTitle text="MULTIMEDIA" />
      <View style={s.grid}>
        {slots.map((_, i) => {
          const foto = data.fotos[i];
          return (
            <TouchableOpacity key={i} style={s.slot} onPress={() => pickImage(i)} activeOpacity={0.8}>
              {foto ? (
                <Image source={{ uri: `data:image/jpeg;base64,${foto}` }} style={s.slotImg} />
              ) : (
                <>
                  <MaterialIcons name="add-photo-alternate" size={30} color={GOLD_BORD} />
                  <Text style={s.slotText}>Insertar imagen</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[s.hint, { textAlign: "center", marginBottom: 8 }]}>{data.fotos.filter(Boolean).length}/{MAX_FOTOS}</Text>
      <ContinuarBtn label="CONTINUAR" onPress={onNext} />
    </>
  );
}

// ─── PASO 3: Historia y detalles ─────────────────────────────────────────────

function Paso3({ data, set, onNext }: { data: FormData; set: (d: Partial<FormData>) => void; onNext: () => void }) {
  return (
    <>
      <SubTitle text="HISTORIA Y DETALLES" />

      <Text style={s.label}>Nombre del artista / diseñador</Text>
      <Input placeholder="Nombre del artista/diseñador" value={data.artista} onChangeText={(v) => set({ artista: v })} />

      <Text style={s.label}>Fecha de creación / época</Text>
      <Input placeholder="YYYY-MM-DD o YYYY/MM/DD" value={data.fechaCreacion} onChangeText={(v) => set({ fechaCreacion: v })} />

      <Text style={s.label}>Historia y contexto</Text>
      <Input placeholder="Historia y contexto (curiosidades, dueños anteriores, procedencia...)" value={data.historia} onChangeText={(v) => set({ historia: v })} multiline />

      <ContinuarBtn label="CONTINUAR" onPress={onNext} />
    </>
  );
}

// ─── PASO 4: Finanzas y logística ─────────────────────────────────────────────

function Paso4({ data, set, onNext }: { data: FormData; set: (d: Partial<FormData>) => void; onNext: () => void }) {
  return (
    <>
      <SubTitle text="FINANZAS Y LOGÍSTICA" />

      <Text style={s.label}>Valor base pretendido</Text>
      <View style={s.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Input placeholder="$" value={data.montoAsegurado} onChangeText={(v) => set({ montoAsegurado: v })} keyboardType="decimal-pad" />
        </View>
        <TouchableOpacity style={[s.monedaBtn, data.moneda === "USD" && s.monedaBtnActive]} onPress={() => set({ moneda: "USD" })}>
          <Text style={[s.monedaText, data.moneda === "USD" && s.monedaTextActive]}>USD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.monedaBtn, data.moneda === "ARS" && s.monedaBtnActive]} onPress={() => set({ moneda: "ARS" })}>
          <Text style={[s.monedaText, data.moneda === "ARS" && s.monedaTextActive]}>ARS</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.label}>Aseguradora</Text>
      <Input placeholder="Aseguradora" value={data.aseguradora} onChangeText={(v) => set({ aseguradora: v })} />

      <Text style={s.label}>Póliza de seguro</Text>
      <Input placeholder="N° de póliza" value={data.polizaSeguro} onChangeText={(v) => set({ polizaSeguro: v })} />

      <Text style={s.label}>Ubicación de depósito</Text>
      <Input placeholder="CBU / CVU" value={data.ubicacionDeposito} onChangeText={(v) => set({ ubicacionDeposito: v })} />

      <ContinuarBtn label="CONTINUAR" onPress={onNext} />
    </>
  );
}

// ─── PASO 5: Confirmación ─────────────────────────────────────────────────────

function Paso5({ data, set, onSubmit, loading, error }: { data: FormData; set: (d: Partial<FormData>) => void; onSubmit: () => void; loading: boolean; error?: string | null }) {
  return (
    <>
      <SubTitle text="CONFIRMACIÓN" />

      <TouchableOpacity style={s.checkRow} onPress={() => set({ declaraPropiedad: !data.declaraPropiedad })} activeOpacity={0.8}>
        <MaterialIcons name={data.declaraPropiedad ? "check-box" : "check-box-outline-blank"} size={24} color={data.declaraPropiedad ? GOLD : MUTED} />
        <Text style={s.checkText}>Declaro bajo juramento que el bien me pertenece y no posee impedimentos legales para su venta.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.checkRow} onPress={() => set({ declaraEnvio: !data.declaraEnvio })} activeOpacity={0.8}>
        <MaterialIcons name={data.declaraEnvio ? "check-box" : "check-box-outline-blank"} size={24} color={data.declaraEnvio ? GOLD : MUTED} />
        <Text style={s.checkText}>Acepto que, en caso de rechazo del bien, los gastos de envío y devolución correrán por mi cuenta.</Text>
      </TouchableOpacity>

      <View style={s.infoCard}>
        <MaterialIcons name="info-outline" size={18} color={MUTED} />
        <Text style={s.infoText}>Una vez enviada la solicitud, nuestro equipo de expertos evaluará el artículo en un plazo de 48 hs hábiles. Te notificaremos por la app si es aceptado para inspección física.</Text>
      </View>

      {error && (
        <View style={s.errorCard}>
          <MaterialIcons name="error-outline" size={16} color="#e74c3c" />
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      <ContinuarBtn label="ENVIAR" onPress={onSubmit} loading={loading} />
    </>
  );
}

// ─── Screen principal ─────────────────────────────────────────────────────────

export default function OfrecerArticuloScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (partial: Partial<FormData>) => setForm((f) => ({ ...f, ...partial }));

  const goBack = () => {
    if (step === 1) router.back();
    else setStep((s) => s - 1);
  };

  const goNext = () => setStep((s) => s + 1);

  const handleSubmit = async () => {
    if (!form.declaraPropiedad || !form.declaraEnvio) {
      return Alert.alert("Declaraciones requeridas", "Debés aceptar ambas declaraciones para continuar.");
    }

    const fotos = form.fotos.filter(Boolean);
    if (fotos.length < 6) {
      return Alert.alert("Fotos requeridas", "Debés cargar al menos 6 fotos del producto.");
    }

    setSubmitting(true);
    try {
      await productoService.crear({
        descripcionCompleta: form.titulo + (form.descripcion ? "\n" + form.descripcion : ""),
        fecha: form.fechaCreacion ? form.fechaCreacion.replace(/\//g, "-") : undefined,
        artista: form.artista || undefined,
        disenador: form.disenador || undefined,
        historia: form.historia || undefined,
        polizaSeguro: form.polizaSeguro || undefined,
        aseguradora: form.aseguradora || undefined,
        montoAsegurado: form.montoAsegurado ? parseFloat(form.montoAsegurado) : undefined,
        monedaAsegurado: form.montoAsegurado ? form.moneda : undefined,
        ubicacionDeposito: form.ubicacionDeposito || undefined,
        origenLicitoDeclarado: form.declaraPropiedad,
        propietarioDeclarado: form.declaraEnvio,
        fotos: fotos.map((fotoBase64) => ({ fotoBase64 })),
      });

      router.replace("/views/productos" as any);
    } catch (e: any) {
      setSubmitError(e.message ?? "No se pudo enviar el artículo. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: BG }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={[sc.scroll, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepHeader step={step} onBack={goBack} />

        {step === 1 && <Paso1 data={form} set={update} onNext={goNext} />}
        {step === 2 && <Paso2 data={form} set={update} onNext={goNext} />}
        {step === 3 && <Paso3 data={form} set={update} onNext={goNext} />}
        {step === 4 && <Paso4 data={form} set={update} onNext={goNext} />}
        {step === 5 && <Paso5 data={form} set={update} onSubmit={handleSubmit} loading={submitting} error={submitError} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const sc = StyleSheet.create({
  scroll: { paddingHorizontal: 18, gap: 10 },
});

const s = StyleSheet.create({
  label: { color: MUTED, fontFamily: "serif", fontSize: 13, marginBottom: 4, marginTop: 8 },
  hint: { color: MUTED, fontFamily: "serif", fontSize: 12, lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "flex-start" },
  slot: { width: 100, height: 100, backgroundColor: "#212f41", borderRadius: 15, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  slotImg: { width: "100%", height: "100%", borderRadius: 10 },
  slotText: { color: GOLD_BORD, fontFamily: "serif", fontSize: 10, marginTop: 4, textAlign: "center" },

  monedaBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: GOLD_BORD, marginLeft: 6 },
  monedaBtnActive: { backgroundColor: "rgba(212,175,55,0.15)", borderColor: GOLD },
  monedaText: { color: MUTED, fontFamily: "serif", fontSize: 13, fontWeight: "700" },
  monedaTextActive: { color: GOLD },

  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 6 },
  checkText: { color: MUTED, fontFamily: "serif", fontSize: 13, lineHeight: 18, flex: 1 },

  infoCard: { backgroundColor: "rgba(13,32,57,0.6)", borderRadius: 12, borderWidth: 1, borderColor: BORDER, padding: 14, flexDirection: "row", gap: 10, marginTop: 8 },
  infoText: { color: MUTED, fontFamily: "serif", fontSize: 12, lineHeight: 18, flex: 1 },
  errorCard: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(231,76,60,0.12)", borderColor: "rgba(231,76,60,0.4)", borderWidth: 1, borderRadius: 10, padding: 12, marginTop: 8 },
  errorText: { color: "#e74c3c", fontFamily: "serif", fontSize: 13, flex: 1 },
});
