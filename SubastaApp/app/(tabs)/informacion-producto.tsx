import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenLayout } from "@/components/ScreenLayout";
import { C } from "@/styles/colors";

const products = [
  {
    id: "1",
    title: 'Juego "Tazas de te" - Abuela Nona',
    shortDescription: "Juego historico de porcelana con caja original.",
    fullDescription:
      "Juego de tazas de té de porcelana fina de principios del siglo XX, perteneciente a la colección de la Abuela Nona. Incluye 6 tazas, 6 platos y tetera, en perfecto estado de conservación. Viene con caja original.",
    status: "Publicado",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Consola de videojuegos PS4 Pro",
    shortDescription: "Consola en perfecto estado de Sony, acompañada de 4 juegos.",
    fullDescription:
      "Sony PlayStation 4 de 500GB HDD en excelente estado. Cuenta con 10 juegos instalados, viene con 2 DualShock Controllers",
    status: "En revision",
    image:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&h=400&fit=crop",
  },
];

export default function InformacionProductoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const product = products.find((p) => p.id === id) ?? products[0];
  const currentIndex = products.findIndex((p) => p.id === product.id);

  function goToPrev() {
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    router.replace(`/informacion-producto?id=${products[prevIndex].id}`);
  }

  function goToNext() {
    const nextIndex = (currentIndex + 1) % products.length;
    router.replace(`/informacion-producto?id=${products[nextIndex].id}`);
  }

  return (
    <ScreenLayout activeTab="productos" paddingBottom={100}>
      {/* Back / Next nav */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={goToPrev}
          activeOpacity={0.75}
        >
          <MaterialIcons name="chevron-left" size={22} color={C.gold} />
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={goToNext}
          activeOpacity={0.75}
        >
          <Text style={styles.navText}>Next</Text>
          <MaterialIcons name="chevron-right" size={22} color={C.gold} />
        </TouchableOpacity>
      </View>

      {/* Product card */}
      <View style={styles.productCard}>
        <Text style={styles.cardTag}>PRODUCTO EN SUBASTA</Text>
        <Text style={styles.cardTitle}>{product.title}</Text>
        <Text style={styles.cardShortDesc}>{product.shortDescription}</Text>
        <Image source={{ uri: product.image }} style={styles.productImage} />
      </View>

      {/* Description section */}
      <Text style={styles.descLabel}>Descripción</Text>
      <Text style={styles.descText}>{product.fullDescription}</Text>

      <View style={styles.divider} />

      <Text style={styles.privateNote}>
        Esta información es privada y escencial para tu participación
      </Text>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  navRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  navButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  navText: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "700",
  },
  productCard: {
    backgroundColor: C.card,
    borderColor: C.blueLine,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
    overflow: "hidden",
    paddingBottom: 0,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  cardTag: {
    color: C.brightGold,
    fontFamily: "serif",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: "center",
  },
  cardTitle: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
    textAlign: "center",
  },
  cardShortDesc: {
    color: C.muted,
    fontFamily: "serif",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  productImage: {
    borderRadius: 10,
    height: 200,
    marginHorizontal: -14,
    width: "auto",
  },
  descLabel: {
    color: C.brightGold,
    fontFamily: "serif",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  descText: {
    color: C.muted,
    fontFamily: "serif",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  divider: {
    borderBottomColor: C.blueLine,
    borderBottomWidth: 1,
    marginVertical: 14,
  },
  privateNote: {
    color: C.gold,
    fontFamily: "serif",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
});
