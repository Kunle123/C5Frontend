import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const FAQ = () => (
  <Box maxW="3xl" mx="auto" py={8} px={4}>
    <Heading as="h1" size="lg" mb={4}>Frequently Asked Questions (FAQ)</Heading>
    <VStack align="start" spacing={4}>
      <Box>
        <Text fontWeight="bold">Q: What is this service?</Text>
        <Text>A: This is a placeholder answer. Replace with your actual FAQ content.</Text>
      </Box>
      <Box>
        <Text fontWeight="bold">Q: How do I contact support?</Text>
        <Text>A: This is a placeholder answer. Replace with your actual FAQ content.</Text>
      </Box>
    </VStack>
  </Box>
);

export default FAQ; 