import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6EEFF',
      100: '#B3CCFF',
      200: '#80AAFF',
      300: '#4D88FF',
      400: '#1A66FF',
      500: '#2563eb', // Lovable brand blue
      600: '#2952A3',
      700: '#1F3D7A',
      800: '#142952',
      900: '#0A1429',
    },
    navy: '#1e293b', // Lovable dark blue
    sky: '#38bdf8',
    slate: '#64748b',
    lilac: '#f1f5f9',
    white: '#ffffff',
    success: '#22C55E',
    warning: '#FACC15',
    error: '#EF4444',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      placeholder: '#94a3b8',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  radii: {
    none: '0',
    sm: '0',
    md: '0',
    lg: '0',
    xl: '0',
    '2xl': '0',
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
      fontSize: ['40px', '48px'],
      fontWeight: 700,
      lineHeight: '110%',
      letterSpacing: '-0.02em',
      color: 'navy',
    },
    h2: {
      fontSize: ['28px', '32px'],
      fontWeight: 600,
      lineHeight: '110%',
      letterSpacing: '-0.01em',
      color: 'navy',
    },
    caption: {
      fontSize: '12px',
      color: 'text.placeholder',
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '0',
      },
      variants: {
        solid: {
          _hover: {
            bg: 'sky',
          },
          borderRadius: '0',
        },
        outline: {
          borderColor: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
          borderRadius: '0',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          _placeholder: { color: 'text.placeholder' },
          borderRadius: '0',
        },
      },
      variants: {
        outline: {
          field: {
            borderColor: 'slate',
            _focus: {
              borderColor: 'brand.500',
            },
            borderRadius: '0',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        padding: 4,
        borderRadius: '0',
        background: 'white',
        boxShadow: 'md',
      },
    },
    List: {
      baseStyle: {
        spacing: 3,
        color: 'text.secondary',
        borderRadius: '0',
      },
    },
    ListItem: {
      baseStyle: {
        paddingY: 2,
        borderBottom: '1px solid',
        borderColor: 'gray.200',
        borderRadius: '0',
      },
    },
  },
});

export default theme; 