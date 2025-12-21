import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    console.log("Login Screen Mounted");
    console.log("Auth App:", auth.app ? "Defined" : "Undefined");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const router = useRouter();

    const handleAuth = async () => {
        try {
            if (isRegistering) {
                await auth.createUserWithEmailAndPassword(email, password);
                Alert.alert('Success', 'Account created!');
                setIsRegistering(false);
            } else {
                await auth.signInWithEmailAndPassword(email, password);
                // Navigate to tabs
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            console.error("Auth Error:", error);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop' }}
            style={styles.background}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.card}>
                    <ThemedText type="title" style={styles.title}>
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </ThemedText>
                    <ThemedText style={styles.subtitle}>
                        {isRegistering ? 'Sign up to start tracking' : 'Login to your budget'}
                    </ThemedText>

                    <View style={styles.inputContainer}>
                        <IconSymbol name="envelope.fill" size={20} color="#666" style={styles.icon} />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <IconSymbol name="lock.fill" size={20} color="#666" style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleAuth}>
                        <ThemedText style={styles.buttonText}>
                            {isRegistering ? 'Sign Up' : 'Login'}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                        <ThemedText style={styles.switchText}>
                            {isRegistering ? 'Already have an account? Login' : 'New here? Create account'}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 5,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: '#eee',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 16,
        borderRadius: 14,
        marginTop: 10,
        shadowColor: '#0a7ea4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#0a7ea4',
        fontSize: 14,
    },
});
