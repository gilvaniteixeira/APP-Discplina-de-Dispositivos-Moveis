import { Link, router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  function handleLogout() {
    router.replace('/(auth)');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Início</Text>
      <Text style={styles.subtitle}>Bem-vindo de volta!</Text>

      <Link href="/modal" asChild>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Abrir opções</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  button: {
    height: 48,
    minWidth: 160,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
