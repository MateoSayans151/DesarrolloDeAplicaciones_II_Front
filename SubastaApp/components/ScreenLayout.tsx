import { ReactNode } from "react";
import { SafeAreaView, ScrollView, StatusBar, View } from "react-native";
import { BottomNav, TabId } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";
import { C } from "@/styles/colors";

type Props = {
  children: ReactNode;
  activeTab: TabId;
  paddingBottom?: number;
};

export function ScreenLayout({ children, activeTab, paddingBottom = 92 }: Props) {
  return (
    <SafeAreaView style={{ backgroundColor: C.screen, flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={C.screen} />
      <View style={{ backgroundColor: C.screen, flex: 1, marginTop: 50, overflow: "hidden" }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader />
          {children}
        </ScrollView>
        <BottomNav activeTab={activeTab} />
      </View>
    </SafeAreaView>
  );
}
