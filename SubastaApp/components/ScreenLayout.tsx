import { ReactNode, useEffect, useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav, TabId } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";
import { C } from "@/styles/colors";
import usuarioService from "@/models/services/usuarioService";

type Props = {
  children: ReactNode;
  activeTab: TabId;
  paddingBottom?: number;
};

export function ScreenLayout({ children, activeTab, paddingBottom = 92 }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    usuarioService.getUsuarioLocal().then((u) => {
      setIsAdmin(u?.role === "ADMIN");
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: C.screen, flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={C.screen} />
      <View style={{ backgroundColor: C.screen, flex: 1, overflow: "hidden" }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader />
          {children}
        </ScrollView>
        <BottomNav activeTab={activeTab} isAdmin={isAdmin} />
      </View>
    </SafeAreaView>
  );
}
