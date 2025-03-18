import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link href="/deck_menu" asChild>
        <Pressable style={{ marginTop: 20, padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Add deck</Text>
        </Pressable>
      </Link>
    </View>
  );
}
