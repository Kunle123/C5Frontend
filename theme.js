// theme.js
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#E6EEFF' },
          100: { value: '#B3CCFF' },
          200: { value: '#80AAFF' },
          300: { value: '#4D88FF' },
          400: { value: '#1A66FF' },
          500: { value: '#3366CC' },
          600: { value: '#2952A3' },
          700: { value: '#1F3D7A' },
          800: { value: '#142952' },
          900: { value: '#0A1429' },
        },
        navy: { value: '#1A1F36' },
        sky: { value: '#66B2FF' },
        slate: { value: '#6B7280' },
        lilac: { value: '#E0E7FF' },
        white: { value: '#F9FAFB' },
        success: { value: '#22C55E' },
        warning: { value: '#FACC15' },
        error: { value: '#EF4444' },
        text: {
          primary: { value: '#111827' },
          secondary: { value: '#4B5563' },
          placeholder: { value: '#9CA3AF' },
        },
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
      radii: {
        none: { value: '0' },
        sm: { value: '4px' },
        md: { value: '8px' },
        lg: { value: '12px' },
        xl: { value: '16px' },
        '2xl': { value: '24px' },
      },
      space: {
        px: { value: '1px' },
        1: { value: '4px' },
        2: { value: '8px' },
        3: { value: '12px' },
        4: { value: '16px' },
        5: { value: '20px' },
        6: { value: '24px' },
        8: { value: '32px' },
        10: { value: '40px' },
        12: { value: '48px' },
        16: { value: '64px' },
      },
      shadows: {
        sm: { value: '0 1px 2px rgba(0, 0, 0, 0.05)' },
        md: { value: '0 4px 6px rgba(0, 0, 0, 0.1)' },
        lg: { value: '0 10px 15px rgba(0, 0, 0, 0.1)' },
        xl: { value: '0 20px 25px rgba(0, 0, 0, 0.15)' },
      },
      textStyles: {
        h1: {
          fontSize: { value: ['32px', '36px'] },
          fontWeight: { value: 'bold' },
          lineHeight: { value: '110%' },
          color: { value: 'navy' },
        },
        h2: {
          fontSize: { value: ['24px', '28px'] },
          fontWeight: { value: 'semibold' },
          lineHeight: { value: '110%' },
          color: { value: 'navy' },
        },
        caption: {
          fontSize: { value: '12px' },
          color: { value: 'text.placeholder' },
        },
      },
    },
    recipes: {
      Button: {
        variants: {
          solid: {
            bg: 'brand.500',
            color: 'white',
            _hover: {
              bg: 'sky',
            },
          },
          outline: {
            borderColor: 'brand.500',
            color: 'brand.500',
            _hover: {
              bg: 'brand.50',
            },
          },
        },
      },
      Input: {
        baseStyle: {
          field: {
            _placeholder: { color: 'text.placeholder' },
          },
        },
        variants: {
          outline: {
            field: {
              borderColor: 'slate',
              _focus: {
                borderColor: 'brand.500',
              },
            },
          },
        },
      },
      Card: {
        baseStyle: {
          padding: 4,
          borderRadius: 'lg',
          background: 'white',
          boxShadow: 'md',
        },
      },
      List: {
        baseStyle: {
          gap: 3,
          color: 'text.secondary',
        },
      },
      ListItem: {
        baseStyle: {
          paddingY: 2,
          borderBottom: '1px solid',
          borderColor: 'gray.200',
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
