import React from 'react';
import {
  Box, Flex, Heading, Text, Button, VStack, HStack, Image, Divider, SimpleGrid, Avatar, Stack, Link, useColorModeValue
} from '@chakra-ui/react';
import { ArrowRight, Play } from 'lucide-react';

const heroImg = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5';

const CandidateLanding: React.FC = () => {
  return (
    <Box bg="#e8edfa" minH="100vh">
      {/* Header/Nav */}
      <Box as="header" bg="white" borderBottom="1px solid #e5e7eb" px={{ base: 4, md: 12 }} py={0} position="sticky" top={0} zIndex={100}>
        <Flex align="center" justify="space-between" h={16}>
          <HStack spacing={2}>
            <Image src="/candidate5-logo.svg" alt="Candidate 5 logo" boxSize={7} />
            <Text fontWeight={700} fontSize="lg" color="#2563eb" letterSpacing="-0.01em">Candidate 5</Text>
          </HStack>
          <HStack spacing={0} align="center">
            <Link href="/" px={4} py={2} fontWeight={600} color="#2563eb" borderBottom="3px solid #2563eb" bg="white">Home</Link>
            <Link href="/pricing" px={4} py={2} fontWeight={600} color="#1e293b" _hover={{ color: '#2563eb' }}>Pricing</Link>
            <Link href="/login" px={4} py={2} fontWeight={600} color="#1e293b" _hover={{ color: '#2563eb' }}>Login</Link>
          </HStack>
        </Flex>
      </Box>

      {/* Hero Card */}
      <Flex justify="center" align="center" py={12} px={2}>
        <Box bg="white" borderRadius="lg" boxShadow="sm" maxW="900px" w="100%" px={{ base: 4, md: 12 }} py={{ base: 8, md: 12 }} display="flex" flexDir={{ base: 'column', md: 'row' }} alignItems="center" gap={8}>
          <Box flex={1} minW={0}>
            <HStack mb={6} spacing={2} align="center">
              <Image src="/candidate5-logo.svg" alt="Candidate 5 logo" boxSize={6} />
              <Text fontWeight={700} fontSize="md" color="#2563eb">Candidate 5</Text>
            </HStack>
            <Heading as="h1" fontSize={{ base: '2xl', md: '3xl', lg: '3.2rem' }} fontWeight={700} color="#1e293b" mb={4} lineHeight={1.1} letterSpacing="-0.02em" textAlign={{ base: 'left', md: 'left' }}>
              Land Your Dream Job Faster<br />with AI-Powered CVs
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="#64748b" mb={6} maxW="lg">
              Candidate 5 uses your unique career history—your personal Career Arc™—to craft perfectly tailored CVs and cover letters in minutes.
            </Text>
            <HStack spacing={3} mb={2}>
              <Button
                color="#fff"
                bg="#2563eb"
                _hover={{ bg: '#1e40af' }}
                size="lg"
                fontWeight={700}
                px={6}
                borderRadius="md"
                rightIcon={<ArrowRight size={20} />}
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                borderColor="#2563eb"
                color="#2563eb"
                _hover={{ bg: '#f1f5f9' }}
                size="lg"
                fontWeight={700}
                px={6}
                borderRadius="md"
                leftIcon={<Play size={20} />}
              >
                See How It Works
              </Button>
            </HStack>
          </Box>
          <Box flex={1} minW={0} display="flex" justifyContent="center" alignItems="center">
            <Image src={heroImg} alt="AI Visual" borderRadius="md" boxSize={{ base: '220px', sm: '300px', md: '340px' }} objectFit="cover" />
          </Box>
        </Box>
      </Flex>

      {/* Problem Statement Section */}
      <Box py={12} px={2}>
        <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight={700} color="#1e293b" textAlign="center" mb={2}>
          Job Applications Are Broken. Candidate 5 Fixes Them.
        </Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} color="#64748b" textAlign="center" maxW="2xl" mx="auto">
          Tired of spending hours rewriting your CV for every job? Candidate 5 automates the tedious parts, so you can focus on what matters: acing the interview.
        </Text>
      </Box>

      {/* Features Section */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} px={{ base: 4, md: 16 }} mb={16}>
        <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
          <Image src="/brain.svg" alt="AI-Personalized CVs" boxSize={32} />
          <Heading as="h4" size="md" color="#2563eb">AI-Personalized CVs</Heading>
          <Text color="#64748b">Go beyond templates. Candidate 5 uses your Career Arc™ to create bespoke applications that reflect your true value.</Text>
        </VStack>
        <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
          <Image src="/clock.svg" alt="Radical Time Savings" boxSize={32} />
          <Heading as="h4" size="md" color="#2563eb">Radical Time Savings</Heading>
          <Text color="#64748b">Cut application time from hours to minutes. Apply to more opportunities with less effort.</Text>
        </VStack>
        <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
          <Image src="/sparkles.svg" alt="Career Arc™ System" boxSize={32} />
          <Heading as="h4" size="md" color="#2563eb">Career Arc™ System</Heading>
          <Text color="#64748b">Your Career Arc™ evolves with you, making each future application stronger and smarter.</Text>
        </VStack>
      </SimpleGrid>

      {/* Process Steps */}
      <Box px={{ base: 4, md: 16 }} mb={16}>
        <Heading as="h3" size="lg" mb={8} color="#1e293b" textAlign="center">How It Works</Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <VStack align="center" spacing={3}>
            <Image src="/check-circle.svg" alt="1. Paste Job Description" boxSize={32} />
            <Text fontWeight={700} color="#1e293b">1. Paste Job Description</Text>
            <Text color="#64748b">Paste the job advert and let our AI extract the key requirements.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Image src="/file-text.svg" alt="2. Build Your Career Arc™" boxSize={32} />
            <Text fontWeight={700} color="#1e293b">2. Build Your Career Arc™</Text>
            <Text color="#64748b">Upload your CV or add your experience to create your Career Arc™.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Image src="/zap.svg" alt="3. Generate CV & Cover Letter" boxSize={32} />
            <Text fontWeight={700} color="#1e293b">3. Generate CV & Cover Letter</Text>
            <Text color="#64748b">Our AI crafts tailored documents for each application.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Image src="/arrow-right.svg" alt="4. Apply & Track" boxSize={32} />
            <Text fontWeight={700} color="#1e293b">4. Apply & Track</Text>
            <Text color="#64748b">Download, apply, and track your applications in one place.</Text>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Advantages Section */}
      <Box px={{ base: 4, md: 16 }} mb={16}>
        <Heading as="h3" size="lg" mb={8} color="#1e293b" textAlign="center">Why Choose Candidate 5?</Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <VStack align="center" spacing={3}>
            <Image src="/shield.svg" alt="Data Privacy" boxSize={32} />
            <Text fontWeight={700} color="#1e293b">Data Privacy</Text>
            <Text color="#64748b">Your data is encrypted and never shared. You have full control.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Image src="/target.svg" alt="ATS Optimized" boxSize={32} />
            <Text fontWeight={700} color="#1e293b">ATS Optimized</Text>
            <Text color="#64748b">Beat the bots. Our CVs are designed to pass ATS filters.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Image src="/users.svg" alt="Community Support" boxSize={32} />
            <Text fontWeight={700} color="#1e293b">Community Support</Text>
            <Text color="#64748b">Join 10,000+ job seekers already optimizing their applications.</Text>
          </VStack>
          <VStack align="center" spacing={3}>
            <Image src="/star.svg" alt="Proven Results" boxSize={32} />
            <Text fontWeight={700} color="#1e293b">Proven Results</Text>
            <Text color="#64748b">15-25% higher conversion rate for sign-ups and interviews.</Text>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Social Proof / Testimonials */}
      <Box px={{ base: 4, md: 16 }} mb={16}>
        <Heading as="h3" size="lg" mb={8} color="#1e293b" textAlign="center">What Our Users Say</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Avatar src="https://via.placeholder.com/150" size="lg" name="Sarah K." />
            <Text fontWeight={700} color="#1e293b">Sarah K.</Text>
            <Text color="#64748b" fontStyle="italic">“Candidate 5 is a game-changer! I landed three interviews in my first week using it.”</Text>
            <HStack>
              {[...Array(5)].map((_, i) => <Image key={i} src="/star.svg" alt="Star" boxSize={18} color="#facc15" fill="#facc15" />)}
            </HStack>
          </VStack>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Avatar src="https://via.placeholder.com/150" size="lg" name="James T." />
            <Text fontWeight={700} color="#1e293b">James T.</Text>
            <Text color="#64748b" fontStyle="italic">“I used to spend hours on every application. Now it takes minutes and I get more callbacks.”</Text>
            <HStack>
              {[...Array(5)].map((_, i) => <Image key={i} src="/star.svg" alt="Star" boxSize={18} color="#facc15" fill="#facc15" />)}
            </HStack>
          </VStack>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Avatar src="https://via.placeholder.com/150" size="lg" name="Priya S." />
            <Text fontWeight={700} color="#1e293b">Priya S.</Text>
            <Text color="#64748b" fontStyle="italic">“The Career Arc keeps all my experience organized. I feel so much more confident applying!”</Text>
            <HStack>
              {[...Array(5)].map((_, i) => <Image key={i} src="/star.svg" alt="Star" boxSize={18} color="#facc15" fill="#facc15" />)}
            </HStack>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Pricing Section */}
      <Box px={{ base: 4, md: 16 }} mb={16}>
        <Heading as="h3" size="lg" mb={8} color="#1e293b" textAlign="center">Pricing</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Text fontWeight={700} fontSize="2xl" color="#1e293b">Starter</Text>
            <Text fontSize="3xl" fontWeight={700} color="#2563eb">Free</Text>
            <Text color="#64748b">Build your Career Arc™ and try basic AI CV generation.</Text>
            <Button colorScheme="brand" variant="outline" w="100%" color="#2563eb" borderColor="#2563eb" _hover={{ bg: '#f1f5f9' }}>Get Started</Button>
          </VStack>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md" border="2px solid #2563eb">
            <Text fontWeight={700} fontSize="2xl" color="#1e293b">Accelerator</Text>
            <Text fontSize="3xl" fontWeight={700} color="#2563eb">£14.99/mo</Text>
            <Text color="#64748b">Unlimited tailored applications, advanced AI, and priority support.</Text>
            <Button colorScheme="brand" variant="solid" w="100%" color="#2563eb" bg="#2563eb" _hover={{ bg: '#1e40af' }}>Start Free Trial</Button>
          </VStack>
          <VStack align="center" spacing={4} bg="white" p={6} borderRadius="md" boxShadow="md">
            <Text fontWeight={700} fontSize="2xl" color="#1e293b">Dominator</Text>
            <Text fontSize="3xl" fontWeight={700} color="#2563eb">£29.99/mo</Text>
            <Text color="#64748b">Everything in Accelerator plus 1:1 expert review and early access.</Text>
            <Button colorScheme="brand" variant="outline" w="100%" color="#2563eb" borderColor="#2563eb" _hover={{ bg: '#f1f5f9' }}>Contact Sales</Button>
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