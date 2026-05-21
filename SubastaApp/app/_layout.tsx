import { Stack } from "expo-router";
import { RegistroProvider } from "@/context/RegistroContext";

export default function RootLayout() {
  return (
    <RegistroProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RegistroProvider>
  );
}
