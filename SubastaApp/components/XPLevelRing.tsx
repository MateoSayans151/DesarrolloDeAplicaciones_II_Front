import { View } from "react-native";
import { Svg, Circle } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { C } from "@/styles/colors";

type UserTier = "comun" | "plata" | "oro" | "platino" | "especial";

interface XPLevelRingProps {
  size?: number;
  strokeWidth?: number;
  tier?: UserTier;
  progreso?: number; // 0.0 a 1.0
}

const TIER_COLORS: Record<UserTier, string> = {
  comun:   "#CD7F32",
  plata:   "#C0C0C0",
  oro:     C.brightGold,
  platino: "#E5E4E2",
  especial:"#00D9FF",
};

export function XPLevelRing({ size = 50, strokeWidth = 3, tier = "comun", progreso = 0 }: XPLevelRingProps) {
  const tierColor = TIER_COLORS[tier];
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgreso = Math.min(Math.max(progreso, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgreso);

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={C.blueLine}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={tierColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <MaterialIcons
        name="star"
        size={size * 0.7}
        color={tierColor}
        style={{ position: "absolute" }}
      />
    </View>
  );
}
