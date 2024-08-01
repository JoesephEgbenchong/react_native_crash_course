import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-pblack">Aora !</Text>
      <StatusBar style="auto"/>
      <Link href="/profile" style={{ color: 'blue'}} className="font-plight">Go to profile</Link>
    </View>
  );
}
