import { View, ScrollView, Text, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import TopBar from "@/components/TopBar";
import MaterialCard from "@/components/MaterialCard";
import { Mountain, Grid3x3, Sparkles, Home } from "lucide-react-native";

const materialCategories = [
  {
    id: "1",
    title: "Walls",
    route: "/category/walls",
    icon: Mountain,
    imageUrl:
      "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=80",
  },
  {
    id: "2",
    title: "Floors",
    route: "/category/floors",
    icon: Grid3x3,
    imageUrl:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
  },
  {
    id: "3",
    title: "Ceilings",
    route: "/category/ceilings",
    icon: Mountain,
    imageUrl:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80",
  },
  {
    id: "4",
    title: "Home Furniture",
    route: "/category/furniture",
    icon: Sparkles,
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
];

export default function ProductsScreen() {
  const router = useRouter();

  const handleCategoryPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-beige">
      <TopBar />
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Hero / summary */}
        <View
          className="bg-white rounded-3xl p-6 mb-6 border border-primary/10"
          style={{
            shadowColor: "#022d37",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            className="text-primary text-2xl font-bold"
            style={{ fontFamily: "SpaceGrotesk-Bold" }}
          >
            Curated materials
          </Text>
          <Text
            className="text-primary/60 text-sm mt-2"
            style={{ fontFamily: "Manrope-Regular" }}
          >
            Explore finishes and structural options chosen for Buildex4Syria
            projects.
          </Text>
          <View className="flex-row mt-4 gap-3">
            <View className="flex-1 bg-beige/60 rounded-xl p-3 border border-primary/10">
              <Text
                className="text-primary/60 text-xs"
                style={{ fontFamily: "Manrope-Medium" }}
              >
                Available
              </Text>
              <Text
                className="text-primary text-xl font-bold"
                style={{ fontFamily: "JetBrainsMono-Medium" }}
              >
                48+
              </Text>
            </View>
            <View className="flex-1 bg-accent/10 rounded-xl p-3 border border-accent/20">
              <Text
                className="text-primary/60 text-xs"
                style={{ fontFamily: "Manrope-Medium" }}
              >
                Premium picks
              </Text>
              <Text
                className="text-accent text-xl font-bold"
                style={{ fontFamily: "JetBrainsMono-Medium" }}
              >
                12
              </Text>
            </View>
          </View>
        </View>

        <Text
          className="text-primary text-xl font-bold mb-4"
          style={{ fontFamily: "SpaceGrotesk-Bold" }}
        >
          Material Categories
        </Text>

        <View className="gap-4 pb-10">
          {materialCategories.map((category) => (
            <MaterialCard
              key={category.id}
              title={category.title}
              icon={category.icon}
              imageUrl={category.imageUrl}
              onPress={() => handleCategoryPress(category.route)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
