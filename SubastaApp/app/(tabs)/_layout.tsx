import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabsLayout() {
  return <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />;
}
