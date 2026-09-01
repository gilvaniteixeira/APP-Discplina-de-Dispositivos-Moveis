import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { auth } from '@/lib/firebase';

type ToastType = 'success' | 'error';

type ToastState = {
  visible: boolean;
  type: ToastType;
  message: string;
};

export default function FrmCadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: 'success',
    message: '',
  });
  const toastOpacity = useRef(new Animated.Value(0)).current;

  function showToast(type: ToastType, message: string) {
    setToast({ visible: true, type, message });
  }

  useEffect(() => {
    if (!toast.visible) return;

    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast.visible, toast.message, toastOpacity]);

  async function handleCadastro() {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      showToast('success', 'Conta criada com sucesso!');
      setTimeout(() => router.replace('/(tabs)'), 800);
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          showToast('error', 'Este e-mail já está cadastrado');
          break;
        case 'auth/invalid-email':
          showToast('error', 'E-mail inválido');
          break;
        case 'auth/weak-password':
          showToast('error', 'Senha muito fraca (mínimo 6 caracteres)');
          break;
        default:
          showToast('error', 'Não foi possível criar a conta. Tente novamente');
      }
    }
  }

  return (
    <View style={styles.container}>
      {toast.visible && (
        <Animated.View
          style={[
            styles.toast,
            toast.type === 'success' ? styles.toastSuccess : styles.toastError,
            { opacity: toastOpacity },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Criar conta</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          autoCapitalize="none"
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastro} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <Link href="/(auth)" style={styles.link}>
          Já tem conta? Entrar
        </Link>
      </View>
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
  },
  card: {
    width: '100%',
    maxWidth: 360,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 8,
    textAlign: 'center',
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    top: 50,
    left: 24,
    right: 24,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastSuccess: {
    backgroundColor: '#16A34A',
  },
  toastError: {
    backgroundColor: '#DC2626',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
