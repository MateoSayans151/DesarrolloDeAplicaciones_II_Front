import { Image } from "expo-image";
import { View } from "react-native";

type Props = {
  size?: number;
  marginBottom?: number;
};

export function LogoHeader({ size = 110, marginBottom = 16 }: Props) {
  return (
    <View style={{ marginBottom, alignItems: "center" }}>
      <Image
        source={require("@/assets/images/appicon.png")}
        style={{ width: size, height: size, marginBottom: 8 }}
      />
    </View>
  );
}
