
import { IconSymbol } from '@/components/ui/icon-symbol';
import { analyzeReceipt } from '@/services/gemini';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<any>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const router = useRouter();

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need camera permission to scan receipts.</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePicture() {
        if (cameraRef.current) {
            const photoData = await cameraRef.current.takePictureAsync({
                quality: 0.5, // Reduced quality for faster upload
                base64: true
            });
            setPhoto(photoData);
        }
    }

    function handleRetake() {
        setPhoto(null);
        setAnalyzing(false);
    }

    async function handleUsePhoto() {
        if (!photo.base64) return;

        setAnalyzing(true);
        const result = await analyzeReceipt(photo.base64);
        setAnalyzing(false);

        if (result) {
            router.push({
                pathname: '/modal',
                params: {
                    amount: result.amount,
                    title: result.title,
                    categoryId: result.categoryId
                }
            });
            setPhoto(null);
        }
    }

    if (photo) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: photo.uri }} style={styles.preview} />
                <View style={styles.previewControls}>
                    {analyzing ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                            <Text style={styles.btnText}>Analyzing...</Text>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity style={[styles.button, styles.retakeBtn]} onPress={handleRetake}>
                                <Text style={styles.btnText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.useBtn]} onPress={handleUsePhoto}>
                                <Text style={styles.btnText}>Use Photo</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.flipBtn} onPress={toggleCameraFacing}>
                        <IconSymbol name="arrow.triangle.2.circlepath" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={styles.capturerContainer}>
                        <TouchableOpacity style={styles.shutter} onPress={takePicture}>
                            <View style={styles.shutterInner} />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    message: { textAlign: 'center', paddingBottom: 10, color: '#fff' },
    camera: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between', padding: 20 },
    flipBtn: { alignSelf: 'flex-end', marginTop: 40, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
    capturerContainer: { alignItems: 'center', marginBottom: 30 },
    shutter: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    shutterInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#fff' },

    // Preview Styles
    preview: { flex: 1, resizeMode: 'contain' },
    previewControls: { flexDirection: 'row', justifyContent: 'space-evenly', padding: 20, backgroundColor: '#000' },
    button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
    retakeBtn: { backgroundColor: '#333' },
    useBtn: { backgroundColor: '#4c669f' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
