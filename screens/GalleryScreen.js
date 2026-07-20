import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { List, UserCircle, MagnifyingGlass, Camera } from 'phosphor-react-native';
import { tw } from '../components/Theme';
import StampWrapper from '../components/StampWrapper';

// Mock memories data based on Google Stitch screen content
const MOCK_MEMORIES = [
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
  {
    id: '4',
    title: 'Plush toy bib',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQbg5wqiHYeQ5QW6a7cOAiXbhX6YCgcXO6UukCxru1BlyKBwKpYNst_JdhYjPAMJLM9MqlE0xubZhQX7Mqxb3SX4WvoqJlfgf_QqpGJFf2f88NfHyBgSNOtjMiUs52V-IJLj07qSZBjIDWrN75U2vDCoHxWK7lt2RESrwyZUEAcKRQFynUmZMMwEzgPMD9CeUZ1GGYL3pW8WIZns9lCe-pMcIhwKh3bSfobYD3d6-ncNBkKzm99HVe',
    category: 'Vintage',
    date: 'Aug 19, 2023',
    location: 'Flea Market',
    story: 'Found this cute retro plush toy sitting on a shelf at the vintage bazaar. Its small grey bib was hand-stitched and added so much character.',
    camera: 'Canon EOS R6',
    collection: 'Vintage Finds',
  },
  {
    id: '5',
    title: 'Portrait at dusk',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUtkb7SPLhKSHNvncDWs219L_afta5UA85FyTcxlHPysJOjMAE5iIZJqzET39SbgS5Uie6B8h15eVKGT03Y4-DEKL99BFrMyqV10XcpWcHhdgvRYTfroAqEwQGwKJp2MptGUtJ0g0wHo8Stdia_wiEyF0BUqhnQ8MkVq13srqTji6O6ZB5iLfA3YIt4kTViW_9_PRsfCkhLLEV71j19aK1tMvt75gxmwej44nxRtmFnOFPgo25dS5W',
    category: 'Portraits',
    date: 'Jul 04, 2023',
    location: 'Riverbank',
    story: 'Candid photo of three friends chatting and laughing as the daylight fades. The natural warmth of the dusk sky illuminated their expressions beautifully.',
    camera: 'Leica Q3',
    collection: 'Friendship',
  },
  {
    id: '6',
    title: 'The House Label',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvHEl0SUZAv35p4-x3Emo5eTcV2y7HulYd0kKqdeON5vWAL-QA78-q-obQIJXLRSvc37yfVoNeGnKhUA3MJ-r18ZZYx-7SVdjXp30Bepm-yVsJDVBOOgz-mw3_W0Ri7Y4bLtk_Kfnu2trMzf2tf4F0a4XPod0eWxnz5ihn93jZsiFS1VDloSLbv3gNeIkSZWrfLv1X2N5YjqocZWUBbfxr4_sn460C2-YTj0_wElllTIgfiS7-Ogwr',
    category: 'Vintage',
    date: 'May 12, 2023',
    location: 'Antique Shop',
    story: 'A highly detailed label on an old apothecary jar. The typography and printing plate quality showed the meticulous nature of early 20th-century branding.',
    camera: 'Fujifilm X-T5',
    collection: 'Typography',
  },
];

const CATEGORIES = ['All Prints', 'Travel', 'Portraits', 'Events', 'Vintage'];

export default function GalleryScreen({ onNavigate, memories = MOCK_MEMORIES }) {
  const [selectedCategory, setSelectedCategory] = useState('All Prints');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredMemories = memories.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Prints' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const screenWidth = Dimensions.get('window').width;
  // Calculate stamp width based on a 3-column grid with margins/padding
  const marginSize = 20;
  const gapSize = 12;
  const stampWidth = (screenWidth - marginSize * 2 - gapSize * 2) / 3;
  const stampHeight = stampWidth * 1.33; // 3:4 aspect ratio

  return (
    <View style={tw`flex-1 bg-background`}>
      {/* TopAppBar */}
      <View style={[tw`flex-row justify-between items-center px-5 pt-12 pb-4 border-b border-cream-dark`, { height: 96 }]}>
        <TouchableOpacity style={tw`active:scale-95`}>
          <List size={24} color="#1F1F1F" />
        </TouchableOpacity>
        <Text style={[tw`text-xl text-primary tracking-tight font-poppins`, { fontFamily: 'Poppins-Bold' }]}>
          Framory
        </Text>
        <TouchableOpacity style={tw`active:scale-95`}>
          <UserCircle size={24} color="#1F1F1F" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={tw`pb-28`} showsVerticalScrollIndicator={false}>
        {/* Search & Filter Area */}
        <View style={tw`px-5 pt-6`}>
          {/* Search bar */}
          <View style={tw`flex-row items-center bg-cream-dark px-4 py-3 rounded-xl mb-4`}>
            <MagnifyingGlass size={20} color="#747878" style={tw`mr-3`} />
            <TextInput
              style={[tw`flex-1 text-primary p-0`, { fontFamily: 'Inter-Regular' }]}
              placeholder="Search your memories..."
              placeholderTextColor="rgba(31,31,31,0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Horizontal Filter Tags */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row mb-6`}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={tw`mr-3 px-5 py-2.5 rounded-full ${
                    isSelected ? 'bg-primary' : 'bg-cream-dark'
                  }`}
                >
                  <Text
                    style={[
                      tw`${isSelected ? 'text-background' : 'text-on-surface-variant'}`,
                      { fontFamily: 'Inter-Medium', fontSize: 13 },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Postage Stamp Grid */}
        <View style={tw`px-5 flex-row flex-wrap justify-start`}>
          {filteredMemories.map((item, index) => {
            // Calculate column adjustments to create simple 3-column rows
            const isRowStart = index % 3 === 0;
            const isRowEnd = index % 3 === 2;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => onNavigate('DETAIL', { memory: item })}
                style={[
                  tw`mb-4 active:scale-98`,
                  {
                    width: stampWidth,
                    height: stampHeight,
                    marginLeft: isRowStart ? 0 : gapSize,
                  },
                ]}
              >
                <StampWrapper source={item.image} width={stampWidth} height={stampHeight} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Empty State / Bottom Indicator */}
        <View style={tw`mt-8 items-center`}>
          <Text style={[tw`text-on-surface-variant italic opacity-40`, { fontFamily: 'Inter-Medium', fontSize: 13 }]}>
            {filteredMemories.length} memories collected
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => onNavigate('CREATE')}
        style={[
          tw`absolute right-6 bottom-24 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-95`,
          {
            shadowColor: '#1F1F1F',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
      >
        <Camera size={28} color="#F7F4EF" weight="bold" />
      </TouchableOpacity>
    </View>
  );
}
