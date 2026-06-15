import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import usuarioService, { UsuarioResponse } from "@/models/services/usuarioService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const GOLD = "#d4af37";
const BG   = "#07162b";
const CARD = "#0a1929";
const GREEN = "#4cdf8a";
const RED   = "#e74c3c";

// ─── Modal de token ───────────────────────────────────────────────────────────

function TokenModal({ token, onClose }: { token: string; onClose: () => void }) {
  const handleCopiar = () => {
    Clipboard.setString(token);
    Alert.alert("Copiado", "Token copiado al portapapeles.");
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalCard}>
          <View style={s.modalIconRow}>
            <MaterialIcons name="check-circle" size={36} color={GREEN} />
          </View>
          <Text style={s.modalTitle}>USUARIO APROBADO</Text>
          <Text style={s.modalSubtitle}>
            Compartí este token con el usuario para que complete su registro:
          </Text>
          <View style={s.tokenBox}>
            <Text style={s.tokenText} selectable numberOfLines={3}>{token}</Text>
          </View>
          <View style={s.modalActions}>
            <TouchableOpacity style={s.copyBtn} onPress={handleCopiar}>
              <MaterialIcons name="content-copy" size={16} color={BG} />
              <Text style={s.copyBtnText}>COPIAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <Text style={s.closeBtnText}>CERRAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Card de usuario pendiente ────────────────────────────────────────────────

function UsuarioCard({
  usuario,
  onAprobado,
  onRechazado,
}: {
  usuario: UsuarioResponse;
  onAprobado: (token: string) => void;
  onRechazado: () => void;
}) {
  const [loading, setLoading] = useState<"aprobar" | "rechazar" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAprobar = async () => {
    setLoading("aprobar");
    setError(null);
    try {
      const res = await usuarioService.verificarUsuario(usuario.id, true);
      onAprobado(res.token ?? "");
    } catch (e: any) {
      setError(e.message ?? "No se pudo aprobar.");
    } finally {
      setLoading(null);
    }
  };

  const handleRechazar = () => {
    Alert.alert(
      "Rechazar usuario",
      `¿Seguro que querés rechazar a ${usuario.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rechazar",
          style: "destructive",
          onPress: async () => {
            setLoading("rechazar");
            setError(null);
            try {
              await usuarioService.verificarUsuario(usuario.id, false);
              onRechazado();
            } catch (e: any) {
              setError(e.message ?? "No se pudo rechazar.");
            } finally {
              setLoading(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>
            {(usuario.nombre ?? "?").charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.cardNombre}>{usuario.nombre}</Text>
          <Text style={s.cardDoc}>DNI {usuario.documento}</Text>
          {usuario.direccion ? (
            <Text style={s.cardDireccion} numberOfLines={1}>{usuario.direccion}</Text>
          ) : null}
        </View>
      </View>

      {error ? (
        <View style={s.errorRow}>
          <MaterialIcons name="error-outline" size={13} color={RED} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={s.cardActions}>
        <TouchableOpacity
          style={[s.rechazarBtn, loading === "rechazar" && { opacity: 0.5 }]}
          onPress={handleRechazar}
          disabled={loading !== null}
        >
          {loading === "rechazar" ? (
            <ActivityIndicator size="small" color={RED} />
          ) : (
            <>
              <MaterialIcons name="close" size={16} color={RED} />
              <Text style={s.rechazarBtnText}>RECHAZAR</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.aprobarBtn, loading === "aprobar" && { opacity: 0.5 }]}
          onPress={handleAprobar}
          disabled={loading !== null}
        >
          {loading === "aprobar" ? (
            <ActivityIndicator size="small" color={BG} />
          ) : (
            <>
              <MaterialIcons name="check" size={16} color={BG} />
              <Text style={s.aprobarBtnText}>APROBAR</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AdminUsuariosScreen() {
  const [pendientes, setPendientes] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenModal, setTokenModal] = useState<string | null>(null);

  const cargar = useCallback(() => {
    setLoading(true);
    usuarioService
      .listarPendientes()
      .then(setPendientes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(cargar);

  const handleAprobado = (token: string) => {
    setTokenModal(token);
    cargar();
  };

  const handleRechazado = () => {
    cargar();
  };

  return (
    <ScreenLayout activeTab="admin-usuarios">
      {tokenModal !== null && (
        <TokenModal token={tokenModal} onClose={() => setTokenModal(null)} />
      )}

      <Text style={s.titulo}>USUARIOS PENDIENTES</Text>

      {loading ? (
        <ActivityIndicator color={GOLD} style={{ marginTop: 32 }} />
      ) : pendientes.length === 0 ? (
        <View style={s.emptyBox}>
          <MaterialIcons name="check-circle-outline" size={40} color="#1e3a55" />
          <Text style={s.emptyText}>No hay usuarios pendientes de verificación.</Text>
        </View>
      ) : (
        <>
          <Text style={s.contador}>{pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""}</Text>
          {pendientes.map((u) => (
            <UsuarioCard
              key={u.id}
              usuario={u}
              onAprobado={handleAprobado}
              onRechazado={handleRechazado}
            />
          ))}
        </>
      )}
    </ScreenLayout>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  titulo:    { color: GOLD, fontFamily: "serif", fontSize: 22, fontWeight: "900", marginBottom: 4 },
  contador:  { color: "#3a5070", fontFamily: "serif", fontSize: 12, marginBottom: 16 },

  card:       { backgroundColor: CARD, borderRadius: 14, borderWidth: 1, borderColor: "#0f2540", padding: 14, marginBottom: 12 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(212,175,55,0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(212,175,55,0.3)" },
  avatarText:   { color: GOLD, fontFamily: "serif", fontSize: 20, fontWeight: "900" },
  cardNombre:   { color: "#e5e2c6", fontFamily: "serif", fontSize: 15, fontWeight: "900" },
  cardDoc:      { color: "#3a5070", fontFamily: "serif", fontSize: 12, marginTop: 2 },
  cardDireccion:{ color: "#3a5070", fontFamily: "serif", fontSize: 11, marginTop: 2 },

  cardActions: { flexDirection: "row", gap: 10 },
  aprobarBtn:  { flex: 1, height: 38, backgroundColor: GOLD, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  aprobarBtnText: { color: BG, fontFamily: "serif", fontSize: 13, fontWeight: "900" },
  rechazarBtn: { flex: 1, height: 38, borderRadius: 10, borderWidth: 1, borderColor: RED, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  rechazarBtnText: { color: RED, fontFamily: "serif", fontSize: 13, fontWeight: "900" },

  errorRow:  { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  errorText: { color: RED, fontFamily: "serif", fontSize: 12, flex: 1 },

  emptyBox:  { alignItems: "center", marginTop: 60, gap: 14 },
  emptyText: { color: "#1e3a55", fontFamily: "serif", fontSize: 14, textAlign: "center" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", paddingHorizontal: 24 },
  modalCard:    { backgroundColor: "#080f1c", borderRadius: 16, borderWidth: 1, borderColor: "rgba(76,223,138,0.3)", padding: 24 },
  modalIconRow: { alignItems: "center", marginBottom: 12 },
  modalTitle:   { color: GREEN, fontFamily: "serif", fontSize: 16, fontWeight: "900", letterSpacing: 2, textAlign: "center", marginBottom: 8 },
  modalSubtitle:{ color: "#8aa3be", fontFamily: "serif", fontSize: 13, textAlign: "center", lineHeight: 18, marginBottom: 16 },
  tokenBox:     { backgroundColor: "#050f1e", borderRadius: 10, borderWidth: 1, borderColor: "#0f2540", padding: 12, marginBottom: 16 },
  tokenText:    { color: "#e5e2c6", fontFamily: "serif", fontSize: 11, lineHeight: 16 },
  modalActions: { flexDirection: "row", gap: 10 },
  copyBtn:      { flex: 1, height: 40, backgroundColor: GOLD, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  copyBtnText:  { color: BG, fontFamily: "serif", fontSize: 13, fontWeight: "900" },
  closeBtn:     { flex: 1, height: 40, borderRadius: 10, borderWidth: 1, borderColor: "#1e3a55", alignItems: "center", justifyContent: "center" },
  closeBtnText: { color: "#3a5070", fontFamily: "serif", fontSize: 13, fontWeight: "900" },
});
