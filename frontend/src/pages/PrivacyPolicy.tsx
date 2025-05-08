import { Box, Heading, Text } from '@chakra-ui/react';

const PrivacyPolicy = () => (
  <Box maxW="3xl" mx="auto" py={8} px={4}>
    <Heading as="h1" size="lg" mb={4}>Privacy Policy</Heading>
    <Text mb={2}>This is the Privacy Policy page. Here you can describe how user data is collected, used, and protected.</Text>
    <Text color="gray.500">(Replace this text with your actual privacy policy.)</Text>
  </Box>
);

export default PrivacyPolicy; 