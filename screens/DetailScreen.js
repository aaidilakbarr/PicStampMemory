import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Share, Alert } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ArrowLeft, UserCircle, MapPin, ShareNetwork, Heart, Trash } from 'phosphor-react-native';
import { tw } from '../components/Theme';
import StampWrapper from '../components/StampWrapper';
import PressableScale from '../components/PressableScale';
import { deleteImage } from '../utils/storage';

export default function DetailScreen({ onNavigate, params = {}, onDeleteMemory }) {
  const { memory, heroRect } = params;
  const [isSaved, setIsSaved] = useState(true);
  const stampRef = useRef(null);
  const heroStarted = useRef(false);

  const heroProgress = useSharedValue(heroRect ? 0 : 1);
  const heroDelta = useSharedValue({ tx: 0, ty: 0, sx: 1, sy: 1 });
  const stampVisible = useSharedValue(heroRect ? 0 : 1);
  const deleteProgress = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const stampAnimatedStyle = useAnimatedStyle(() => {
    const hp = heroProgress.value;
    const dp = deleteProgress.value;
    const sx = heroDelta.value.sx + (1 - heroDelta.value.sx) * hp;
    const sy = heroDelta.value.sy + (1 - heroDelta.value.sy) * hp;
    return {
      opacity: stampVisible.value * dp,
      transform: [
        { translateX: heroDelta.value.tx * (1 - hp) },
        { translateY: heroDelta.value.ty * (1 - hp) + (1 - dp) * 40 },
        { scaleX: sx * (0.6 + 0.4 * dp) },
        { scaleY: sy * (0.6 + 0.4 * dp) },
      ],
    };
  });

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  if (!memory) {
    return (
      <View style={tw`flex-1 bg-background justify-center items-center`}>
        <Text style={{ fontFamily: 'Inter-Regular' }}>No memory details found.</Text>
        <PressableScale onPress={() => onNavigate('GALLERY')} style={tw`mt-4 bg-primary px-4 py-2 rounded-xl`}>
          <Text style={tw`text-background`}>Go Back</Text>
        </PressableScale>
      </View>
    );
  }

  const handleStampLayout = () => {
    if (!heroRect || heroStarted.current || !stampRef.current) return;
    heroStarted.current = true;
    stampRef.current.measureInWindow((x, y, w, h) => {
      if (!w || !h) return;
      heroDelta.value = {
        tx: heroRect.x + heroRect.width / 2 - (x + w / 2),
        ty: heroRect.y + heroRect.height / 2 - (y + h / 2),
        sx: heroRect.width / w,
        sy: heroRect.height / h,
      };
      stampVisible.value = 1;
      heroProgress.value = withTiming(1, { duration: 340, easing: Easing.out(Easing.cubic) });
    });
  };

  const toggleFavorite = () => {
    setIsSaved((v) => !v);
    heartScale.value = withSequence(
      withSpring(1.45, { damping: 8, stiffness: 340 }),
      withSpring(1, { damping: 12, stiffness: 220 })
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this memory from ${memory.location}: "${memory.title}"`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const finishDelete = () => {
    if (onDeleteMemory) {
      onDeleteMemory(memory.id);
    }
    deleteImage(memory.image);
  };

  const handleDelete = () => {
    Alert.alert('Delete Memory', 'Are you sure you want to delete this postage stamp memory?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProgress.value = withTiming(
            0,
            { duration: 240, easing: Easing.in(Easing.cubic) },
            (finished) => {
              if (finished) {
                runOnJS(finishDelete)();
              }
            }
          );
        },
      },
    ]);
  };

  return (
    <View style={tw`flex-1 bg-background`}>
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

      <ScrollView contentContainerStyle={tw`pb-28`} showsVerticalScrollIndicator={false}>
        <View style={tw`items-center mt-8 mb-6`}>
          <Animated.View ref={stampRef} onLayout={handleStampLayout} style={stampAnimatedStyle}>
            <StampWrapper source={memory.image} width={260} height={325} />
          </Animated.View>
        </View>

        <Animated.View entering={heroRect ? FadeInUp.delay(220).duration(300) : FadeInUp.duration(280)}>
          <View style={tw`items-center mb-6`}>
            <Text style={[tw`text-xs text-on-surface-variant tracking-widest uppercase opacity-60 mb-1`, { fontFamily: 'Inter-Medium' }]}>
              {memory.date}
            </Text>
            <View style={tw`flex-row items-center`}>
              <MapPin size={14} color="#D59A61" weight="fill" style={tw`mr-1`} />
              <Text style={[tw`text-sm text-accent`, { fontFamily: 'Inter-Medium' }]}>
                {memory.location}
              </Text>
            </View>
          </View>

          <View style={tw`px-8 items-center mb-8`}>
            <Text style={[tw`text-lg text-center text-primary italic leading-relaxed`, { fontFamily: 'PlayfairDisplay-Italic' }]}>
              "{memory.title}"
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={heroRect ? FadeInUp.delay(300).duration(300) : FadeInUp.delay(80).duration(280)}>
          <View style={tw`flex-row justify-around px-8 mb-8`}>
            <PressableScale scaleTo={0.9} onPress={handleShare} style={tw`items-center`}>
              <View style={tw`w-12 h-12 rounded-full border border-primary justify-center items-center mb-1.5`}>
                <ShareNetwork size={20} color="#1F1F1F" />
              </View>
              <Text style={[tw`text-xs text-on-surface-variant`, { fontFamily: 'Inter-Medium' }]}>Share</Text>
            </PressableScale>

            <PressableScale scaleTo={0.9} onPress={toggleFavorite} style={tw`items-center`}>
              <View style={[
                tw`w-12 h-12 rounded-full justify-center items-center mb-1.5`,
                isSaved ? tw`bg-primary` : tw`border border-primary`
              ]}>
                <Animated.View style={heartAnimatedStyle}>
                  <Heart size={20} color={isSaved ? '#F7F4EF' : '#1F1F1F'} weight={isSaved ? 'fill' : 'regular'} />
                </Animated.View>
              </View>
              <Text style={[tw`text-xs text-primary`, { fontFamily: isSaved ? 'Inter-Medium' : 'Inter-Regular' }]}>
                {isSaved ? 'Saved' : 'Favorite'}
              </Text>
            </PressableScale>

            <PressableScale scaleTo={0.9} onPress={handleDelete} style={tw`items-center`}>
              <View style={tw`w-12 h-12 rounded-full border border-danger/40 justify-center items-center mb-1.5`}>
                <Trash size={20} color="#E76F51" />
              </View>
              <Text style={[tw`text-xs text-on-surface-variant`, { fontFamily: 'Inter-Medium' }]}>Delete</Text>
            </PressableScale>
          </View>
        </Animated.View>

        <Animated.View entering={heroRect ? FadeInUp.delay(380).duration(300) : FadeInUp.delay(160).duration(280)}>
          <View style={tw`px-5 gap-4`}>
            <View style={[tw`bg-cream-dark/40 p-4 rounded-xl border border-cream-dark`, {
              shadowColor: '#1F1F1F',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 10,
              elevation: 1,
            }]}>
              <Text style={[tw`text-sm text-on-surface-variant leading-relaxed`, { fontFamily: 'Inter-Regular' }]}>
                {memory.story}
              </Text>
            </View>

            <View style={tw`flex-row gap-4`}>
              <View style={tw`flex-1 bg-cream-dark/40 p-4 rounded-xl border border-cream-dark`}>
                <Text style={[tw`text-xs text-on-surface-variant opacity-60 mb-1`, { fontFamily: 'Inter-Medium' }]}>Camera</Text>
                <Text style={[tw`text-sm text-primary`, { fontFamily: 'Inter-Regular' }]}>{memory.camera || 'Unknown'}</Text>
              </View>
              <View style={tw`flex-1 bg-cream-dark/40 p-4 rounded-xl border border-cream-dark`}>
                <Text style={[tw`text-xs text-on-surface-variant opacity-60 mb-1`, { fontFamily: 'Inter-Medium' }]}>Collection</Text>
                <Text style={[tw`text-sm text-primary`, { fontFamily: 'Inter-Regular' }]}>{memory.collection || 'Default'}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
