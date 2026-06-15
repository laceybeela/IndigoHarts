import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF7' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#6B7F3A' }}>Indigo Harts</Text>
      <Text style={{ fontSize: 16, color: '#666', marginTop: 8 }}>Mobile App</Text>
    </View>
  );
}
