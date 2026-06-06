import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ label, onPress, style }: Props) {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: "#d4af37",
          borderRadius: 20,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={{ color: "#2d2d2d", fontWeight: "bold", fontSize: 20, letterSpacing: 1 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
