import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { ArrowLeft, UserCircle, MapPin, ShareNetwork, Heart, Trash } from 'phosphor-react-native';
import { tw } from '../components/Theme';
import StampWrapper from '../components/StampWrapper';
import { deleteImage } from '../utils/storage';

export default function DetailScreen({ onNavigate, params = {}, onDeleteMemory }) {
  const { memory } = params;
  const [isSaved, setIsSaved] = useState(true);

  if (!memory) {
    return (
      <View style={tw`flex-1 bg-background justify-center items-center`}>
        <Text style={{ fontFamily: 'Inter-Regular' }}>No memory details found.</Text>
        <TouchableOpacity onPress={() => onNavigate('GALLERY')} style={tw`mt-4 bg-primary px-4 py-2 rounded-xl`}>
          <Text style={tw`text-background`}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this memory from ${memory.location}: "${memory.title}"`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Memory', 'Are you sure you want to delete this postage stamp memory?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (onDeleteMemory) {
            onDeleteMemory(memory.id);
          }
          deleteImage(memory.image);
        },
      },
    ]);
  };

  return (
    <View style={tw`flex-1 bg-background`}>
      <View style={[tw`flex-row justify-between items-center px-5 pt-12 pb-4 border-b border-cream-dark`, { height: 96 }]}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => onNavigate('GALLERY')} style={tw`active:scale-95 mr-4`}>
            <ArrowLeft size={24} color="#1F1F1F" />
          </TouchableOpacity>
          <Text style={[tw`text-xl text-primary tracking-tight font-poppins`, { fontFamily: 'Poppins-Bold' }]}>
            Framory
          </Text>
        </View>
        <TouchableOpacity style={tw`active:scale-95`}>
          <UserCircle size={24} color="#1F1F1F" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={tw`pb-28`} showsVerticalScrollIndicator={false}>
        <View style={tw`items-center mt-8 mb-6`}>
          <StampWrapper source={memory.image} width={260} height={325} />
        </View>

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

        <View style={tw`flex-row justify-around px-8 mb-8`}>
          <TouchableOpacity onPress={handleShare} style={tw`items-center`}>
            <View style={tw`w-12 h-12 rounded-full border border-primary justify-center items-center active:scale-90 mb-1.5`}>
              <ShareNetwork size={20} color="#1F1F1F" />
            </View>
            <Text style={[tw`text-xs text-on-surface-variant`, { fontFamily: 'Inter-Medium' }]}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSaved(!isSaved)} style={tw`items-center`}>
            <View style={[
              tw`w-12 h-12 rounded-full justify-center items-center active:scale-90 mb-1.5`,
              isSaved ? tw`bg-primary` : tw`border border-primary`
            ]}>
              <Heart size={20} color={isSaved ? '#F7F4EF' : '#1F1F1F'} weight={isSaved ? 'fill' : 'regular'} />
            </View>
            <Text style={[tw`text-xs text-primary`, { fontFamily: isSaved ? 'Inter-Medium' : 'Inter-Regular' }]}>
              {isSaved ? 'Saved' : 'Favorite'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete} style={tw`items-center`}>
            <View style={tw`w-12 h-12 rounded-full border border-danger/40 justify-center items-center active:scale-90 mb-1.5`}>
              <Trash size={20} color="#E76F51" />
            </View>
            <Text style={[tw`text-xs text-on-surface-variant`, { fontFamily: 'Inter-Medium' }]}>Delete</Text>
          </TouchableOpacity>
        </View>

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
      </ScrollView>
    </View>
  );
}
