import { create } from 'twrnc';

// Custom tailwind instance with Framory design tokens
export const tw = create({
  theme: {
    extend: {
      colors: {
        background: '#F7F4EF',
        primary: '#1F1F1F',
        accent: '#D59A61',
        success: '#72B27A',
        danger: '#E76F51',
        'cream-dark': '#EBE7DE',
        'glass-white': 'rgba(255, 255, 255, 0.6)',
        'surface-container-low': '#f6f3ee',
        'surface-container': '#f0ede9',
        'surface-container-high': '#ebe8e3',
        'surface-container-highest': '#e5e2dd',
        'on-surface-variant': '#444748',
      },
      fontFamily: {
        poppins: 'Poppins-Bold',
        inter: 'Inter-Regular',
        'inter-medium': 'Inter-Medium',
        playfair: 'PlayfairDisplay-Italic',
      },
    },
  },
});

export const Theme = {
  colors: {
    background: '#F7F4EF',
    primary: '#1F1F1F',
    accent: '#D59A61',
    success: '#72B27A',
    danger: '#E76F51',
    creamDark: '#EBE7DE',
    glassWhite: 'rgba(255, 255, 255, 0.6)',
    surfaceContainerLow: '#f6f3ee',
    surfaceContainer: '#f0ede9',
    surfaceContainerHigh: '#ebe8e3',
    surfaceContainerHighest: '#e5e2dd',
    onSurfaceVariant: '#444748',
  },
  fonts: {
    heading: 'Poppins-Bold',
    body: 'Inter-Regular',
    caption: 'Inter-Medium',
    serifItalic: 'PlayfairDisplay-Italic',
  },
  shadows: {
    collector: {
      shadowColor: '#1F1F1F',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 3,
    },
    stamp: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 5,
    },
  },
  borderRadius: {
    cards: 20,
    buttons: 18,
    images: 24,
  },
};
