import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-slate-300">
      <Text className="text-2xl">Aora !</Text>
      <StatusBar style="auto"/>
      <Link href="/profile" style={{ color: 'blue'}}>Go to profile</Link>
    </View>
  );
}
