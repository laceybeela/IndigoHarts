import type { Config } from 'tailwindcss';
import nativewindPreset from 'nativewind/preset';
import preset from '@indigo-harts/config/tailwind-preset';

const config: Config = {
  presets: [nativewindPreset, preset],
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins_400Regular'],
        'poppins-light': ['Poppins_300Light'],
        'poppins-regular': ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
      },
    },
  },
};

export default config;
