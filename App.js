import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, SafeAreaView, TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold_Italic } from '@expo-google-fonts/playfair-display';
import { SquaresFour, Camera, Gear } from 'phosphor-react-native';

import { tw } from './components/Theme';
import GalleryScreen from './screens/GalleryScreen';
import DetailScreen from './screens/DetailScreen';
import CreateScreen from './screens/CreateScreen';

const MEMORY_STORAGE_KEY = '@framory/memories';

const INITIAL_MEMORIES = [
  {
    id: '1',
    title: 'Vintage Rock posters',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAImCjPp5Xe1KglS8rbZTtWiAvZ39wiX2DytSHGAqxgi2s8Lk1NMzoEzNNh_2jRZMQBgVHYy6dIO7Nuo6NJ-sNVvREK70tIlG59oHUQGhn2lhZMEQEYjqxvTBebefOzoTAYzwp0S9CVejN2Z3D-l20zn8HeVY74qmdIFCly2JTMthz86OoCHj1xvKtnMs_uAMsHooiDT5XMk19OZetFM9W8svTggZAg-o6PbkR2sKPy2BsgxsQgnvs1',
    category: 'Vintage',
    date: 'Oct 14, 2023',
    location: 'Gion, Kyoto',
    story: 'This moment was captured during a quiet walk through the Gion district. The way the sunset reflected off the traditional wooden architecture created a warmth that felt like a bridge between the past and the present.',
    camera: 'Leica M11',
    collection: 'Wanderlust',
  },
  {
    id: '2',
    title: 'San Junipero dusk',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe15TZ8s5uFdy7uk_TlY7lamPA0NHaW__fiwE4rCz3ZmNPXeaud2BTnCD-ifSML9T99EmVI-UrWgQjjTqJgt2cklReyBN5NUvi4w8PKL_AoWzRBxjd4Fto6ltcgyUzWS7PZM6jwhXvfw27O0Z5rEfswlJP40brmUhAxQghgyul8ZwG4FZauU7XGvWZu4BoCgjs7_OG52znjmrLXDgRj_5apyrM_f9BDnXm324ngig-czzRfuJjj5x7',
    category: 'Travel',
    date: 'Sep 28, 2023',
    location: 'California Coast',
    story: 'Felt like stepping directly into a retro-futuristic dream. The neon lights began to buzz just as the pink and purple hues of sunset kissed the shoreline.',
    camera: 'Fujifilm X-T5',
    collection: 'Wanderlust',
  },
  {
    id: '3',
    title: 'Designer toy portrait',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0G5aNMBrbEV7HPxL0ZOaRlL6axJ_71hlH2e2DlJF6PoS4au4KLRHcom4dMzBrv6dD88T7YTRtOmGhwuyuUuDVvAbIO_BX5KD5h6g-yiGoRlKoZk90NtoJtzB5z_L2n4ORdNMsoU2feafeJ0bOf4jiLAaay3CDGRSZ1JEM7g-q3fYIhGL3mN5VHhwJoqT_Tbjp00WRXzIvXr6bTJm8ZhPlUZUob9BNofLooo9UzTahCkiCbGAm7I8q',
    category: 'Portraits',
    date: 'Nov 02, 2023',
    location: 'Design Studio',
    story: 'Macro shot focusing on the oversized eyes of a custom designer vinyl figure. The depth of field highlighted the craftsmanship and glossy finish.',
    camera: 'Sony A7R V',
    collection: 'Creatives',
  },
];

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': Poppins_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'PlayfairDisplay-Italic': PlayfairDisplay_700Bold_Italic,
  });

  const [currentScreen, setCurrentScreen] = useState('GALLERY');
  const [screenParams, setScreenParams] = useState({});
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(MEMORY_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMemories(parsed);
          }
        }
      } catch {}
      setIsHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (isHydrated) {
      AsyncStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories)).catch(() => {});
    }
  }, [memories, isHydrated]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={tw`flex-1 bg-background justify-center items-center`}>
        <ActivityIndicator size="large" color="#1F1F1F" />
      </View>
    );
  }

  const navigate = (screenName, params = {}) => {
    setCurrentScreen(screenName);
    setScreenParams(params);
  };

  const handleAddMemory = (newMemory) => {
    setMemories((prev) => [newMemory, ...prev]);
  };

  const handleDeleteMemory = (memoryId) => {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));
    setCurrentScreen('GALLERY');
    setScreenParams({});
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'GALLERY':
        return <GalleryScreen onNavigate={navigate} memories={memories} />;
      case 'DETAIL':
        return <DetailScreen onNavigate={navigate} params={screenParams} onDeleteMemory={handleDeleteMemory} />;
      case 'CREATE':
        return <CreateScreen onNavigate={navigate} onAddMemory={handleAddMemory} />;
      default:
        return <GalleryScreen onNavigate={navigate} memories={memories} />;
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      <StatusBar style="dark" />

      <View style={tw`flex-1`}>
        {renderScreen()}
      </View>

      <View style={[
        tw`absolute bottom-0 left-0 w-full flex-row justify-around items-center bg-glass-white/90 border-t border-cream-dark pb-6 pt-3 px-4`,
        {
          shadowColor: '#1F1F1F',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 2,
        }
      ]}>
        <TouchableOpacity
          onPress={() => navigate('GALLERY')}
          style={tw`items-center justify-center py-1 flex-1`}
        >
          <SquaresFour
            size={24}
            color={currentScreen === 'GALLERY' || currentScreen === 'DETAIL' ? '#1F1F1F' : '#444748'}
            weight={currentScreen === 'GALLERY' || currentScreen === 'DETAIL' ? 'bold' : 'regular'}
          />
          <View style={tw`h-1`} />
          <Text style={[
            tw`text-[11px]`,
            {
              fontFamily: 'Inter-Medium',
              color: currentScreen === 'GALLERY' || currentScreen === 'DETAIL' ? '#1F1F1F' : '#444748',
              fontWeight: currentScreen === 'GALLERY' || currentScreen === 'DETAIL' ? '700' : '500',
            }
          ]}>
            Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate('CREATE')}
          style={tw`items-center justify-center py-1 flex-1`}
        >
          <Camera
            size={24}
            color={currentScreen === 'CREATE' ? '#1F1F1F' : '#444748'}
            weight={currentScreen === 'CREATE' ? 'bold' : 'regular'}
          />
          <View style={tw`h-1`} />
          <Text style={[
            tw`text-[11px]`,
            {
              fontFamily: 'Inter-Medium',
              color: currentScreen === 'CREATE' ? '#1F1F1F' : '#444748',
              fontWeight: currentScreen === 'CREATE' ? '700' : '500',
            }
          ]}>
            Collect
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Coming Soon', 'Settings features are coming soon!')}
          style={tw`items-center justify-center py-1 flex-1`}
        >
          <Gear
            size={24}
            color="#444748"
            weight="regular"
          />
          <View style={tw`h-1`} />
          <Text style={[
            tw`text-[11px]`,
            {
              fontFamily: 'Inter-Medium',
              color: '#444748',
              fontWeight: '500',
            }
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
