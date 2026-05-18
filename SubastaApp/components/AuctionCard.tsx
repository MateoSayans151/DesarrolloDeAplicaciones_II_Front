import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { C } from "@/styles/colors";

export interface AuctionCardItem {
  id: string;
  title: string;
  highestBid: string;
  currency: string;
  timeLeft: string;
  image?: string;
}

export function AuctionCard({ item }: { item: AuctionCardItem }) {
  if (item.image) {
    return (
      <View style={[styles.auctionCard, styles.auctionCardRow]}>
        <Image source={{ uri: item.image }} style={styles.auctionImage} />

        <View style={styles.auctionInfo}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <MaterialIcons name="chevron-right" size={22} color={C.gold} />
          </View>

          <Text style={styles.bidLine}>Mayor oferta actual</Text>
          <Text style={styles.bidAmount}>{item.highestBid}</Text>

          <View style={styles.auctionFooter}>
            <Text style={[styles.timeLeft, styles.timeLeftFlex]}>{item.timeLeft}</Text>
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{item.currency}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.auctionCard}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <MaterialIcons name="chevron-right" size={22} color={C.gold} />
      </View>

      <View style={styles.auctionBottomRow}>
        <View style={styles.bidColumn}>
          <Text style={styles.bidLine}>Mayor oferta actual</Text>
          <Text style={styles.bidAmount}>{item.highestBid}</Text>
          <Text style={styles.timeLeft}>{item.timeLeft}</Text>
        </View>

        <View style={styles.auctionAction}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{item.currency}</Text>
          </View>
          <TouchableOpacity style={styles.enterButton} activeOpacity={0.8}>
            <Text style={styles.enterText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  auctionCard: {
    backgroundColor: C.card,
    borderColor: C.blueLine,
    borderRadius: 15,
    borderWidth: 1,
    minHeight: 82,
    paddingBottom: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  auctionCardRow: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  auctionImage: {
    backgroundColor: "#f7f7f7",
    borderColor: "#d7d7d7",
    borderRadius: 9,
    borderWidth: 1,
    height: 68,
    marginRight: 10,
    width: 68,
  },
  auctionInfo: {
    flex: 1,
    minWidth: 0,
  },
  auctionFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  cardTitleRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  cardTitle: {
    color: C.gold,
    flex: 1,
    fontFamily: "serif",
    fontSize: 16,
    fontWeight: "900",
  },
  auctionBottomRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  bidColumn: {
    flex: 1,
  },
  bidLine: {
    color: C.muted,
    fontFamily: "serif",
    fontSize: 12,
    marginTop: 2,
  },
  bidAmount: {
    color: C.brightGold,
    fontFamily: "serif",
    fontSize: 15,
    fontWeight: "900",
  },
  timeLeft: {
    color: C.red,
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 1,
  },
  timeLeftFlex: {
    flex: 1,
  },
  auctionAction: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  liveRow: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 8,
  },
  liveDot: {
    backgroundColor: C.green,
    borderRadius: 4,
    height: 8,
    marginRight: 4,
    width: 8,
  },
  liveText: {
    color: C.green,
    fontFamily: "serif",
    fontSize: 12,
    fontWeight: "800",
  },
  enterButton: {
    alignItems: "center",
    backgroundColor: C.brightGold,
    borderRadius: 11,
    height: 26,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  enterText: {
    color: "#111111",
    fontFamily: "serif",
    fontSize: 14,
    fontWeight: "900",
  },
});
