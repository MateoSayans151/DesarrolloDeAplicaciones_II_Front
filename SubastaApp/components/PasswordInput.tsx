import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { inputStyles } from "@/styles/inputStyles";

type Props = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  accessibilityLabel?: string;
};

export function PasswordInput({ placeholder, value, onChangeText, accessibilityLabel }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={inputStyles.passwordContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#99988B"
        secureTextEntry={!visible}
        value={value}
        onChangeText={onChangeText}
        style={inputStyles.passwordInput}
      />
      <TouchableOpacity
        accessibilityLabel={accessibilityLabel ?? (visible ? "Ocultar clave" : "Mostrar clave")}
        accessibilityRole="button"
        onPress={() => setVisible((v) => !v)}
        style={inputStyles.passwordIcon}
      >
        <MaterialIcons
          name={visible ? "visibility" : "visibility-off"}
          size={24}
          color="#bfc8d6"
        />
      </TouchableOpacity>
    </View>
  );
}
