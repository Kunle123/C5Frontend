import React from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard', protected: true },
  { label: 'Pricing', path: '/pricing', hideWhenLoggedIn: true },
  { label: 'Account', path: '/account', account: true },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  // Only show protected links if logged in
  const filteredLinks = navLinks.filter(link => {
    if (link.protected && !token) return false;
    if (link.account && !token) return false;
    if (link.hideWhenLoggedIn && token) return false;
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg="lilac">
      {/* App Bar */}
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" w="100%" px={6} py={3} bg="brand.500" color="white" boxShadow="md" position="sticky" top={0} zIndex={100}>
        <Box
          as="button"
          onClick={() => navigate('/')}
          fontWeight={800}
          fontSize="xl"
          letterSpacing={1}
          color="white"
          bg="transparent"
          border="none"
          cursor="pointer"
          _hover={{ color: 'white' }}
        >
          CandidateV
        </Box>
        <Box display={{ base: 'block', md: 'none' }}>
          <IconButton
            aria-label="Open menu"
            variant="ghost"
            color="white"
            fontSize="2xl"
            onClick={isOpen ? onClose : onOpen}
            _hover={{ bg: 'brand.400' }}
          >
            {isOpen ? <CloseIcon /> : <HamburgerIcon />}
          </IconButton>
        </Box>
        <Flex align="center" gap={2} display={{ base: 'none', md: 'flex' }}>
          {filteredLinks.map((link) => (
            <Button
              key={link.path}
              variant={location.pathname === link.path ? 'solid' : 'ghost'}
              colorScheme="brand"
              fontWeight={location.pathname === link.path ? 700 : 400}
              borderRadius="md"
              bg={location.pathname === link.path ? 'white' : 'transparent'}
              color={location.pathname === link.path ? 'brand.500' : 'white'}
              _hover={{ bg: location.pathname === link.path ? 'brand.50' : 'brand.400', color: 'brand.900' }}
              px={4}
              py={2}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </Button>
          ))}
          {!token && (
            <Button
              onClick={() => navigate('/login')}
              variant={location.pathname === '/login' ? 'solid' : 'ghost'}
              colorScheme="brand"
              fontWeight={location.pathname === '/login' ? 700 : 400}
              borderRadius="md"
              bg={location.pathname === '/login' ? 'white' : 'transparent'}
              color={location.pathname === '/login' ? 'brand.500' : 'white'}
              _hover={{ bg: location.pathname === '/login' ? 'brand.50' : 'brand.400', color: 'brand.900' }}
              px={4}
              py={2}
            >
              Login
            </Button>
          )}
          {token && (
            <Button onClick={handleLogout} variant="ghost" colorScheme="brand" borderRadius="md" px={4} py={2}>
              Log Out
            </Button>
          )}
        </Flex>
      </Flex>
      {/* Mobile Drawer (custom) */}
      {isOpen && (
        <Box position="fixed" top={0} right={0} w={220} h="100vh" bg="white" zIndex={200} p={4} boxShadow="lg">
          <Stack gap={3}>
            <IconButton
              aria-label="Close menu"
              variant="ghost"
              color="brand.500"
              fontSize="2xl"
              alignSelf="flex-end"
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
            {filteredLinks.map((link) => (
              <Button
                key={link.path}
                variant={location.pathname === link.path ? 'solid' : 'ghost'}
                colorScheme="brand"
                fontWeight={location.pathname === link.path ? 700 : 400}
                borderRadius="md"
                bg={location.pathname === link.path ? 'brand.50' : 'transparent'}
                color={location.pathname === link.path ? 'brand.700' : 'brand.500'}
                _hover={{ bg: 'brand.100', color: 'brand.900' }}
                w="100%"
                onClick={() => { navigate(link.path); onClose(); }}
              >
                {link.label}
              </Button>
            ))}
            {!token && (
              <Button
                onClick={() => { navigate('/login'); onClose(); }}
                variant={location.pathname === '/login' ? 'solid' : 'ghost'}
                colorScheme="brand"
                fontWeight={location.pathname === '/login' ? 700 : 400}
                borderRadius="md"
                bg={location.pathname === '/login' ? 'brand.50' : 'transparent'}
                color={location.pathname === '/login' ? 'brand.700' : 'brand.500'}
                _hover={{ bg: 'brand.100', color: 'brand.900' }}
                w="100%"
              >
                Login
              </Button>
            )}
            {token && (
              <Button onClick={() => { handleLogout(); onClose(); }} variant="ghost" colorScheme="brand" borderRadius="md" w="100%">
                Log Out
              </Button>
            )}
          </Stack>
        </Box>
      )}
      {/* Main Content */}
      <Box as="main" minH="80vh" py={4} px={{ base: 2, md: 0 }}>
        {children}
      </Box>
      {/* Footer */}
      <Box as="footer" bg="brand.50" py={3} textAlign="center">
        <Text color="text.secondary" fontSize="sm">
          © {new Date().getFullYear()} CandidateV. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Layout; 