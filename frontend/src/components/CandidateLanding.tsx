import React from 'react';
import {
  Box, Flex, Heading, Text, Button, VStack, HStack, Image, Divider, SimpleGrid, Avatar, Stack, Link, useColorModeValue
} from '@chakra-ui/react';
import { ArrowRight, Play, CheckCircle, Zap, Shield, Target, Users, Clock, Star, FileText, Brain, Sparkles } from 'lucide-react';

const heroImg = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5';
const featureImg = 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7';
const testimonialImg = 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81';

const CandidateLanding: React.FC = () => {
  return (
    <Box bg="lilac" minH="100vh">
      {/* Sticky Nav */}
      <Flex as="nav" position="sticky" top={0} zIndex={100} bg="white" boxShadow="sm" px={8} py={4} align="center" justify="space-between">
        <HStack spacing={3}>
          <Image src="/candidate5-logo.svg" alt="Candidate 5 logo" boxSize={10} />
          <Heading as="h1" size="md" color="brand.500" fontWeight={700} letterSpacing="-0.01em">Candidate 5</Heading>
        </HStack>
        <HStack spacing={4}>
          <Button colorScheme="brand" variant="solid" size="md">Sign Up</Button>
          <Button colorScheme="brand" variant="outline" size="md">Login</Button>
        </HStack>
      </Flex>

      {/* Hero Section */}
      <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" px={{ base: 4, md: 16 }} py={{ base: 10, md: 20 }} bg="white">
        <VStack align="start" spacing={6} maxW={{ base: '100%', md: 'lg' }} w="100%">
          <Heading as="h2" textStyle="h1" fontWeight={700} color="navy">
            Land Your Dream Job Faster with AI-Powered CVs
          </Heading>
          <Text fontSize={{ base: 'md', md: 'xl' }} color="slate">
            Candidate 5 uses your unique career history—your personal Career Arc™—to craft perfectly tailored CVs and cover letters in minutes.
          </Text>
          <HStack spacing={4} flexWrap="wrap">
            <Button colorScheme="brand" variant="solid" size="lg" borderRadius="md" rightIcon={<ArrowRight size={20} />}>Get Started Free</Button>
            <Button colorScheme="brand" variant="outline" size="lg" borderRadius="md" leftIcon={<Play size={20} />}>See How It Works</Button>
          </HStack>
        </VStack>
        <Box flex={1} display="flex" justifyContent="center" alignItems="center" mt={{ base: 10, md: 0 }} w="100%">
          <Image src={heroImg} alt="AI Visual" boxSize={{ base: '220px', sm: '300px', md: '400px' }} objectFit="cover" borderRadius="lg" boxShadow="lg" />
        </Box>
      </Flex>

      {/* Problem Statement */}
      <Box py={{ base: 8, md: 16 }} px={{ base: 4, md: 16 }} textAlign="center">
        <Heading as="h2" textStyle="h2" mb={4} color="navy">Job Applications Are Broken. Candidate 5 Fixes Them.</Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} color="slate" maxW="2xl" mx="auto">
          Tired of spending hours rewriting your CV for every job? Candidate 5 automates the tedious parts, so you can focus on what matters: acing the interview.
        </Text>
      </Box>

      {/* Features Section */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} px={{ base: 4, md: 16 }} mb={16}>
        <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
          <Brain size={32} color="#2563eb" />
          <Heading as="h4" size="md" color="navy">AI-Personalized CVs</Heading>
          <Text color="slate">Go beyond templates. Candidate 5 uses your Career Arc™ to create bespoke applications that reflect your true value.</Text>
        </VStack>
        <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
          <Clock size={32} color="#2563eb" />
          <Heading as="h4" size="md" color="navy">Radical Time Savings</Heading>
          <Text color="slate">Cut application time from hours to minutes. Apply to more opportunities with less effort.</Text>
        </VStack>
        <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
          <Sparkles size={32} color="#2563eb" />
          <Heading as="h4" size="md" color="navy">Career Arc™ System</Heading>
          <Text color="slate">Your Career Arc™ evolves with you, making each future application stronger and smarter.</Text>
        </VStack>
      </SimpleGrid>

      {/* Process Steps */}
      <Box px={{ base: 4, md: 16 }} mb={16}>
        <Heading as="h3" size="lg" mb={8} color="navy" textAlign="center">How It Works</Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <VStack align="center" spacing={3}>
            <CheckCircle size={32} color="#2563eb" />
            <Text fontWeight={700}>1. Paste Job Description</Text>
            <Text color="slate">Paste the job advert and let our AI extract the key requirements.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <FileText size={32} color="#2563eb" />
            <Text fontWeight={700}>2. Build Your Career Arc™</Text>
            <Text color="slate">Upload your CV or add your experience to create your Career Arc™.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Zap size={32} color="#2563eb" />
            <Text fontWeight={700}>3. Generate CV & Cover Letter</Text>
            <Text color="slate">Our AI crafts tailored documents for each application.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <ArrowRight size={32} color="#2563eb" />
            <Text fontWeight={700}>4. Apply & Track</Text>
            <Text color="slate">Download, apply, and track your applications in one place.</Text>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Advantages Section */}
      <Box px={{ base: 4, md: 16 }} mb={16}>
        <Heading as="h3" size="lg" mb={8} color="navy" textAlign="center">Why Choose Candidate 5?</Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <VStack align="center" spacing={3}>
            <Shield size={32} color="#2563eb" />
            <Text fontWeight={700}>Data Privacy</Text>
            <Text color="slate">Your data is encrypted and never shared. You have full control.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Target size={32} color="#2563eb" />
            <Text fontWeight={700}>ATS Optimized</Text>
            <Text color="slate">Beat the bots. Our CVs are designed to pass ATS filters.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Users size={32} color="#2563eb" />
            <Text fontWeight={700}>Community Support</Text>
            <Text color="slate">Join 10,000+ job seekers already optimizing their applications.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Star size={32} color="#2563eb" />
            <Text fontWeight={700}>Proven Results</Text>
            <Text color="slate">15-25% higher conversion rate for sign-ups and interviews.</Text>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Social Proof / Testimonials */}
      <Box px={{ base: 4, md: 16 }} mb={16}>
        <Heading as="h3" size="lg" mb={8} color="navy" textAlign="center">What Our Users Say</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Avatar src={testimonialImg} size="lg" name="Sarah K." />
            <Text fontWeight={700}>Sarah K.</Text>
            <Text color="slate" fontStyle="italic">“Candidate 5 is a game-changer! I landed three interviews in my first week using it.”</Text>
            <HStack>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} color="#facc15" fill="#facc15" />)}
            </HStack>
          </VStack>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Avatar src={testimonialImg} size="lg" name="James T." />
            <Text fontWeight={700}>James T.</Text>
            <Text color="slate" fontStyle="italic">“I used to spend hours on every application. Now it takes minutes and I get more callbacks.”</Text>
            <HStack>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} color="#facc15" fill="#facc15" />)}
            </HStack>
          </VStack>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Avatar src={testimonialImg} size="lg" name="Priya S." />
            <Text fontWeight={700}>Priya S.</Text>
            <Text color="slate" fontStyle="italic">“The Career Arc keeps all my experience organized. I feel so much more confident applying!”</Text>
            <HStack>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} color="#facc15" fill="#facc15" />)}
            </HStack>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Pricing Section */}
      <Box px={{ base: 4, md: 16 }} mb={16}>
        <Heading as="h3" size="lg" mb={8} color="navy" textAlign="center">Pricing</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Text fontWeight={700} fontSize="2xl">Starter</Text>
            <Text fontSize="3xl" fontWeight={700} color="brand.500">Free</Text>
            <Text color="slate">Build your Career Arc™ and try basic AI CV generation.</Text>
            <Button colorScheme="brand" variant="outline" w="100%">Get Started</Button>
          </VStack>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md" border="2px solid #2563eb">
            <Text fontWeight={700} fontSize="2xl">Accelerator</Text>
            <Text fontSize="3xl" fontWeight={700} color="brand.500">£14.99/mo</Text>
            <Text color="slate">Unlimited tailored applications, advanced AI, and priority support.</Text>
            <Button colorScheme="brand" variant="solid" w="100%">Start Free Trial</Button>
          </VStack>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Text fontWeight={700} fontSize="2xl">Dominator</Text>
            <Text fontSize="3xl" fontWeight={700} color="brand.500">£29.99/mo</Text>
            <Text color="slate">Everything in Accelerator plus 1:1 expert review and early access.</Text>
            <Button colorScheme="brand" variant="outline" w="100%">Contact Sales</Button>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="navy" color="white" py={8} px={4} textAlign="center">
        <Text fontWeight={700} fontSize="lg">Candidate 5 &copy; {new Date().getFullYear()}</Text>
        <HStack justify="center" spacing={6} mt={2}>
          <Link href="/privacy-policy" color="white" _hover={{ textDecoration: 'underline' }}>Privacy Policy</Link>
          <Link href="/terms" color="white" _hover={{ textDecoration: 'underline' }}>Terms</Link>
          <Link href="/faq" color="white" _hover={{ textDecoration: 'underline' }}>FAQ</Link>
        </HStack>
      </Box>
    </Box>
  );
};

export default CandidateLanding; 