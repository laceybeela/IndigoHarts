import type { Config } from 'tailwindcss';

const preset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7E8',
          100: '#E9EFD1',
          200: '#D8E3AE',
          300: '#C8D97A',
          400: '#B5CC5A',
          500: '#9BB33E',
          600: '#7D9132',
          700: '#6B7F3A',
          800: '#4F5E2B',
          900: '#3A4520',
        },
        floral: {
          50: '#FDF2F6',
          100: '#FBE5ED',
          200: '#F9CCDD',
          300: '#F4A3C3',
          400: '#E86AA6',
          500: '#DC4A8F',
          600: '#C9306F',
          700: '#AC2358',
          800: '#8E2049',
          900: '#771F40',
        },
        'warm-white': '#FAFAF7',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default preset;
