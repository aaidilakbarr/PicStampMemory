import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { ArrowLeft, UserCircle, Calendar, MapPin, BookOpen, Camera, Image as ImageIcon } from 'phosphor-react-native';
import * as ImagePicker from 'expo-image-picker';
import { tw } from '../components/Theme';
import StampWrapper from '../components/StampWrapper';
import PressableScale from '../components/PressableScale';
import { uploadImage } from '../utils/storage';

// Initial placeholder image from Stitch designs
const DEFAULT_PLACEHOLDER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuANHWjWrsj1v1YEsWqqspfK9g_bXcEGsTUcXEeyMZBaMCx6gZidyhxbuA5sH76aufAV6C_nJgFeoweFCl0qYJQLn8TT634GY--eH1mGk_3aXg4Cx_pAF_kQF-JNsfzMpUSNflUqppoCrG9Ucwz38g-t6aE4NLH4V2sj8WLTfhMj5d43ZfN3_fkZPbxAFgbRgD3vRPjuwBIXb_jOAUpkm9Yu_AWbtqLj_r_V3x_ope3i6WxXKAT2Tig1jGZWN9Qk7qLvAg';

export default function CreateScreen({ onNavigate, onAddMemory, params }) {
  const [image, setImage] = useState(DEFAULT_PLACEHOLDER);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Golden Valley');
  const [date, setDate] = useState(() => {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  });
  const [story, setStory] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle image returned from custom CameraScreen
  useEffect(() => {
    if (params && params.capturedImage) {
      setImage(params.capturedImage);
    }
  }, [params]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permission to select photos!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = () => {
    onNavigate('CAMERA');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required Fields', 'Please enter a caption for your memory stamp.');
      return;
    }

    let finalImage = image;

    if (image && !image.startsWith('http')) {
      setIsUploading(true);
      try {
        finalImage = await uploadImage(image);
      } catch (error) {
        setIsUploading(false);
        Alert.alert('Upload Failed', error.message);
        return;
      }
      setIsUploading(false);
    }

    const newMemory = {
      id: Date.now().toString(),
      title: title.trim(),
      story: story.trim() || 'A beautiful memory frozen in time as a vintage postage stamp.',
      image: finalImage,
      location: location.trim() || 'Unknown Place',
      date: date.trim(),
      category: 'Travel',
      camera: 'Mobile Device',
      collection: 'Autumn 2023',
    };

    if (onAddMemory) {
      onAddMemory(newMemory);
    }

    Alert.alert('Memory Collected!', 'Your new postage stamp has been added to the gallery.', [
      { text: 'Okay', onPress: () => onNavigate('GALLERY') }
    ]);
  };

  return (
    <View style={tw`flex-1 bg-background`}>
      {/* TopAppBar */}
      <View style={[tw`flex-row justify-between items-center px-5 pt-12 pb-4 border-b border-cream-dark`, { height: 96 }]}>
        <View style={tw`flex-row items-center`}>
          <PressableScale scaleTo={0.9} onPress={() => onNavigate('GALLERY')} style={tw`mr-4 p-1`}>
            <ArrowLeft size={24} color="#1F1F1F" />
          </PressableScale>
          <Text style={[tw`text-xl text-primary tracking-tight font-poppins`, { fontFamily: 'Poppins-Bold' }]}>
            Framory
          </Text>
        </View>
        <PressableScale scaleTo={0.9} style={tw`p-1`}>
          <UserCircle size={24} color="#1F1F1F" />
        </PressableScale>
      </View>

      <ScrollView contentContainerStyle={tw`pb-28 px-5`} showsVerticalScrollIndicator={false}>
        {/* Stamp Image Section */}
        <View style={tw`items-center mt-8`}>
          <Animated.View key={image} entering={ZoomIn.springify().damping(16).stiffness(180)}>
            <StampWrapper source={image} width={220} height={275} />
          </Animated.View>

          {/* Quick Actions for Image */}
          <View style={tw`flex-row gap-4 mt-6 w-full max-w-[280px]`}>
            <PressableScale
              scaleTo={0.94}
              onPress={takePhoto}
              style={tw`flex-1 flex-row items-center justify-center gap-2 py-3 border border-primary rounded-xl`}
            >
              <Camera size={18} color="#1F1F1F" />
              <Text style={[tw`text-primary text-sm`, { fontFamily: 'Inter-Medium' }]}>Camera</Text>
            </PressableScale>

            <PressableScale
              scaleTo={0.94}
              onPress={pickImage}
              style={tw`flex-1 flex-row items-center justify-center gap-2 py-3 border border-primary rounded-xl`}
            >
              <ImageIcon size={18} color="#1F1F1F" />
              <Text style={[tw`text-primary text-sm`, { fontFamily: 'Inter-Medium' }]}>Gallery</Text>
            </PressableScale>
          </View>
        </View>

        {/* Caption Entry Section */}
        <View style={tw`mt-8`}>
          <View style={tw`flex-row justify-between items-baseline mb-1`}>
            <Text style={[tw`text-lg text-primary`, { fontFamily: 'Poppins-Bold' }]}>Caption</Text>
            <Text style={[tw`text-xs text-on-surface-variant italic opacity-60`, { fontFamily: 'Inter-Medium' }]}>Required</Text>
          </View>
          <Text style={[tw`text-xs text-on-surface-variant opacity-60 mb-2`, { fontFamily: 'Inter-Regular' }]}>
            A few words to keep the moment with the stamp.
          </Text>

          <View style={tw`relative`}>
            <TextInput
              style={[
                tw`w-full bg-cream-dark/30 rounded-t-xl p-4 text-primary text-sm`,
                {
                  fontFamily: 'Inter-Regular',
                  borderBottomWidth: 2,
                  borderBottomColor: isFocused ? '#D59A61' : '#EBE7DE',
                },
              ]}
              placeholder="What do you see?"
              placeholderTextColor="rgba(31,31,31,0.3)"
              multiline
              numberOfLines={4}
              value={title}
              onChangeText={setTitle}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </View>

        {/* Story Text Area */}
        <View style={tw`mt-6`}>
          <Text style={[tw`text-sm text-primary mb-2`, { fontFamily: 'Poppins-Bold' }]}>Story Details</Text>
          <TextInput
            style={[
              tw`w-full bg-cream-dark/30 rounded-xl p-4 text-primary text-sm border border-cream-dark`,
              { fontFamily: 'Inter-Regular' },
            ]}
            placeholder="Write down the details of this moment..."
            placeholderTextColor="rgba(31,31,31,0.3)"
            multiline
            numberOfLines={5}
            value={story}
            onChangeText={setStory}
          />
        </View>

        {/* Meta Details Section */}
        <View style={tw`flex-row gap-4 mt-6`}>
          {/* Date Picker Input */}
          <View style={tw`flex-1 flex-row items-center gap-3 p-3 bg-cream-dark/30 rounded-xl border border-cream-dark`}>
            <Calendar size={20} color="#444748" />
            <View style={tw`flex-1`}>
              <Text style={[tw`text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60`, { fontFamily: 'Inter-Medium' }]}>
                Date
              </Text>
              <TextInput
                style={[tw`text-xs font-semibold text-primary p-0`, { fontFamily: 'Inter-Medium' }]}
                value={date}
                onChangeText={setDate}
              />
            </View>
          </View>

          {/* Place Input */}
          <View style={tw`flex-1 flex-row items-center gap-3 p-3 bg-cream-dark/30 rounded-xl border border-cream-dark`}>
            <MapPin size={20} color="#444748" />
            <View style={tw`flex-1`}>
              <Text style={[tw`text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60`, { fontFamily: 'Inter-Medium' }]}>
                Place
              </Text>
              <TextInput
                style={[tw`text-xs font-semibold text-primary p-0`, { fontFamily: 'Inter-Medium' }]}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>
        </View>

        {/* Save Action */}
        <View style={tw`mt-8`}>
          <PressableScale
            scaleTo={0.96}
            onPress={handleSave}
            disabled={isUploading}
            style={[
              tw`w-full flex-row items-center justify-center gap-3 py-4 bg-primary rounded-xl`,
              isUploading && { opacity: 0.6 },
            ]}
          >
            {isUploading ? (
              <ActivityIndicator color="#F7F4EF" />
            ) : (
              <>
                <BookOpen size={20} color="#F7F4EF" weight="fill" />
                <Text style={[tw`text-background text-base`, { fontFamily: 'Poppins-Bold' }]}>
                  Save to Book
                </Text>
              </>
            )}
          </PressableScale>
          <Text style={[tw`text-center mt-3 text-xs text-on-surface-variant opacity-60`, { fontFamily: 'Inter-Regular' }]}>
            {isUploading ? 'Uploading image to cloud storage...' : 'This will be added to your \'Autumn 2023\' collection'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
