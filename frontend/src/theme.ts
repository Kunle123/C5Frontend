import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6EEFF',
      100: '#B3CCFF',
      200: '#80AAFF',
      300: '#4D88FF',
      400: '#1A66FF',
      500: '#3366CC',
      600: '#2952A3',
      700: '#1F3D7A',
      800: '#142952',
      900: '#0A1429',
    },
    navy: '#1A1F36',
    sky: '#66B2FF',
    slate: '#6B7280',
    lilac: '#E0E7FF',
    white: '#F9FAFB',
    success: '#22C55E',
    warning: '#FACC15',
    error: '#EF4444',
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      placeholder: '#9CA3AF',
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  radii: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
  },
  space: {
    px: '1px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  textStyles: {
    h1: {
      fontSize: ['32px', '36px'],
      fontWeight: 'bold',
      lineHeight: '110%',
      color: 'navy',
    },
    h2: {
      fontSize: ['24px', '28px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      color: 'navy',
    },
    caption: {
      fontSize: '12px',
      color: 'text.placeholder',
    },
  },
  components: {
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
        spacing: 3,
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
});

export default theme; 