import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Dimensions, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, Lightning, LightningSlash, ArrowsClockwise } from 'phosphor-react-native';
import { tw } from '../components/Theme';
import PressableScale from '../components/PressableScale';

export default function CameraScreen({ onNavigate, params, memories = [] }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef(null);

  const flashOpacity = useSharedValue(0);
  const shutterScale = useSharedValue(1);

  const flashOverlayStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const shutterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shutterScale.value }],
  }));

  // Get dimensions for styling the camera preview aspect ratio
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth * 0.85;
  const viewportWidth = containerWidth - 28; // account for borders/bezels
  const viewportHeight = viewportWidth * 1.25; // 4:5 aspect ratio

  // Get thumbnail from last memory or use placeholder
  const lastMemoryImage = memories.length > 0 ? memories[0].image : null;

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={tw`flex-1 bg-background justify-center items-center`}>
        <ActivityIndicator size="large" color="#1F1F1F" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={tw`flex-1 bg-background justify-center items-center px-6`}>
        <Text style={[tw`text-lg text-primary text-center mb-4`, { fontFamily: 'Poppins-Bold' }]}>
          Akses Kamera Diperlukan
        </Text>
        <Text style={[tw`text-sm text-on-surface-variant text-center mb-6`, { fontFamily: 'Inter-Regular' }]}>
          Aplikasi membutuhkan izin akses kamera Anda untuk mengambil foto dan menjadikannya memory stamp yang indah.
        </Text>
        <PressableScale
          onPress={requestPermission}
          style={tw`px-6 py-3 bg-primary rounded-xl`}
        >
          <Text style={[tw`text-background font-bold`, { fontFamily: 'Poppins-Bold' }]}>
            Berikan Izin Kamera
          </Text>
        </PressableScale>
      </View>
    );
  }

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (cameraRef.current && !capturing) {
      try {
        setCapturing(true);
        flashOpacity.value = withSequence(
          withTiming(1, { duration: 70 }),
          withTiming(0, { duration: 260 })
        );
        shutterScale.value = withSequence(
          withSpring(0.82, { damping: 10, stiffness: 400 }),
          withSpring(1, { damping: 12, stiffness: 200 })
        );
        // Expo SDK 54 CameraView takePictureAsync options
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        });

        // Navigate back to CREATE screen with the captured image URI
        onNavigate('CREATE', { capturedImage: photo.uri });
      } catch (error) {
        Alert.alert('Gagal Mengambil Gambar', error.message);
      } finally {
        setCapturing(false);
      }
    }
  };

  return (
    <View style={tw`flex-1 bg-background`}>
      {/* Header */}
      <View style={[tw`flex-row justify-between items-center px-5 pt-12 pb-4 border-b border-cream-dark`, { height: 96 }]}>
        <PressableScale scaleTo={0.9} onPress={() => onNavigate('CREATE')} style={tw`p-1`}>
          <ArrowLeft size={24} color="#1F1F1F" />
        </PressableScale>
        <Text style={[tw`text-lg text-primary tracking-tight font-poppins`, { fontFamily: 'Poppins-Bold', flex: 1, textAlign: 'center', marginRight: 24 }]}>
          Kamera
        </Text>
      </View>

      {/* Camera Viewport Container (Frame) */}
      <View style={tw`flex-1 justify-center items-center px-5`}>
        {/* Outer Frame (mimicking the physical gray frame/polaroid card) */}
        <View style={[
          tw`bg-cream-dark/60 rounded-[36px] border border-cream-dark/80 items-center justify-center p-6`,
          {
            width: containerWidth,
            shadowColor: '#1F1F1F',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
          }
        ]}>
          {/* Inner bezel wrapper (black tablet/device frame) */}
          <View style={[
            tw`bg-primary rounded-[24px] border-[8px] border-primary overflow-hidden items-center justify-center`,
            {
              width: viewportWidth,
              height: viewportHeight,
            }
          ]}>
            {/* The actual CameraView */}
            <CameraView
              style={tw`w-full h-full`}
              facing={facing}
              flash={flash}
              ref={cameraRef}
              mode="picture"
            >
              {/* Corner Guides Overlay (rendered as absolute siblings inside parent View over camera preview) */}
              <View style={tw`absolute inset-0`} pointerEvents="none">
                {/* Top Left Bracket */}
                <View style={[tw`absolute w-6 h-6 border-t-2 border-l-2 border-white/80`, { top: 16, left: 16 }]} />
                {/* Top Right Bracket */}
                <View style={[tw`absolute w-6 h-6 border-t-2 border-r-2 border-white/80`, { top: 16, right: 16 }]} />
                {/* Bottom Left Bracket */}
                <View style={[tw`absolute w-6 h-6 border-b-2 border-l-2 border-white/80`, { bottom: 16, left: 16 }]} />
                {/* Bottom Right Bracket */}
                <View style={[tw`absolute w-6 h-6 border-b-2 border-r-2 border-white/80`, { bottom: 16, right: 16 }]} />
              </View>

              {/* Capturing Overlay loader */}
              {capturing && (
                <View style={tw`absolute inset-0 bg-primary/30 justify-center items-center`}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
              )}
            </CameraView>

            {/* Shutter flash overlay */}
            <Animated.View
              pointerEvents="none"
              style={[tw`absolute inset-0 bg-white`, flashOverlayStyle]}
            />
          </View>
        </View>
      </View>

      {/* Controls Section */}
      <View style={tw`px-8 pb-10 pt-4 items-center`}>
        {/* Buttons Row */}
        <View style={tw`flex-row justify-between items-center w-full max-w-[280px] mb-8`}>
          {/* Flash Toggle */}
          <PressableScale
            scaleTo={0.85}
            onPress={toggleFlash}
            style={tw`w-12 h-12 bg-cream-dark/40 border border-cream-dark/60 rounded-full justify-center items-center`}
          >
            {flash === 'on' ? (
              <Lightning size={22} color="#D59A61" weight="fill" />
            ) : (
              <LightningSlash size={22} color="#444748" weight="regular" />
            )}
          </PressableScale>

          {/* Shutter Button */}
          <Animated.View style={shutterAnimatedStyle}>
            <TouchableOpacity
              onPress={takePicture}
              disabled={capturing}
              style={[
                tw`w-20 h-20 rounded-full border border-primary/20 justify-center items-center`,
                capturing && { opacity: 0.6 }
              ]}
            >
              {/* Multi-layered circle shutter button like the mockup */}
              <View style={[
                tw`w-[76px] h-[76px] rounded-full border-4 border-primary bg-background justify-center items-center`,
                {
                  shadowColor: '#1F1F1F',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 2,
                }
              ]}>
                <View style={tw`w-[56px] h-[56px] rounded-full bg-primary justify-center items-center`}>
                  <View style={tw`w-[40px] h-[40px] rounded-full bg-[#1F1F1F] border border-white/20`} />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Flip Camera */}
          <PressableScale
            scaleTo={0.85}
            onPress={toggleFacing}
            style={tw`w-12 h-12 bg-cream-dark/40 border border-cream-dark/60 rounded-full justify-center items-center`}
          >
            <ArrowsClockwise size={22} color="#444748" weight="regular" />
          </PressableScale>
        </View>

        {/* Lihat Album Section */}
        <PressableScale
          scaleTo={0.94}
          onPress={() => onNavigate('GALLERY')}
          style={tw`flex-row items-center gap-3`}
        >
          <Text style={[tw`text-[11px] uppercase tracking-widest text-on-surface-variant`, { fontFamily: 'Inter-Medium', letterSpacing: 1.5 }]}>
            LIHAT ALBUM
          </Text>
          {lastMemoryImage ? (
            <Image
              source={{ uri: lastMemoryImage }}
              style={[tw`w-8 h-8 rounded-lg border border-cream-dark bg-cream-dark/20`, { resizeMode: 'cover' }]}
            />
          ) : (
            <View style={tw`w-8 h-8 rounded-lg border border-cream-dark bg-cream-dark/50 justify-center items-center`}>
              <View style={tw`w-4 h-4 rounded bg-primary/20`} />
            </View>
          )}
        </PressableScale>
      </View>
    </View>
  );
}
