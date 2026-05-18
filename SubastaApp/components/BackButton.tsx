import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={{ alignSelf: "flex-start", marginBottom: 8 }}
      onPress={() => router.back()}
    >
      <Text style={{ color: "#bfc8d6", fontSize: 20 }}>{"< Back"}</Text>
    </TouchableOpacity>
  );
}
