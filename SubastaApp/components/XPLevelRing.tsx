import { View } from "react-native";
import { Svg, Circle, Text as SvgText } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { C } from "@/styles/colors";

type UserTier = "bronze" | "silver" | "gold" | "diamond";

interface XPLevelRingProps {
  size?: number;
  strokeWidth?: number;
  tier?: UserTier;
}

const TIER_COLORS: Record<UserTier, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: C.brightGold,
  diamond: "#00D9FF",
};

export function XPLevelRing({ size = 50, strokeWidth = 3, tier = "bronze" }: XPLevelRingProps) {
  // TODO: Reemplazar con datos del backend
  const currentXP = 450;
  const maxXPPerLevel = 1000;

  const tierColor = TIER_COLORS[tier];
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = currentXP / maxXPPerLevel;
  const strokeDashoffset = circumference * (1 - progress);

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
        style={{
          position: "absolute",
        }}
      />
    </View>
  );
}
