import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => (
  <Box as="footer" bg="gray.50" py={4} mt={8} borderTop="1px" borderColor="gray.200">
    <Flex justify="center" align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
      <Text fontSize="sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</Text>
      <Flex gap={4}>
        <Link as={RouterLink} to="/privacy-policy" fontSize="sm">Privacy Policy</Link>
        <Link as={RouterLink} to="/terms" fontSize="sm">Terms & Conditions</Link>
        <Link as={RouterLink} to="/faq" fontSize="sm">FAQ</Link>
      </Flex>
    </Flex>
  </Box>
);

export default Footer; 