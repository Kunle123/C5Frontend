import React from 'react';
import {
  Box, Flex, Heading, Text, Button, VStack, HStack, Image, SimpleGrid, Stack, Link, useBreakpointValue, Icon, Grid, GridItem, Badge, Avatar as ChakraAvatar
} from '@chakra-ui/react';
import { ArrowRight, Play, CheckCircle, Zap, Shield, Target, Users, Clock, Star, FileText, Brain, Sparkles } from 'lucide-react';

// Lovable-inspired color palette
const primary = '#6a82fb'; // Lovable blue
const accent = '#fc5c7d'; // Lovable pink
const mutedBg = '#f8fafc'; // Soft neutral background
const mutedFg = '#64748b'; // Muted text
const cardFg = '#1e293b'; // Card foreground
const accentYellow = '#fbbf24';

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Marketing Manager',
    quote: 'Candidate 5 is a game-changer! I landed three interviews in my first week using it. The tailored CVs make a huge difference.',
    initials: 'SK',
  },
  {
    name: 'James T.',
    role: 'Software Engineer',
    quote: 'I used to spend hours on every application. Now it takes minutes and I get more callbacks.',
    initials: 'JT',
  },
  {
    name: 'Priya S.',
    role: 'Recent Grad',
    quote: 'The Career Arc keeps all my experience organized. I feel so much more confident applying!',
    initials: 'PS',
  },
];

const plans = [
  {
    name: 'Career Starter',
    price: 'Free',
    features: [
      'Build your Career Arc™',
      'Basic CV parsing',
      '1 tailored application per month',
      'Email support',
    ],
    cta: 'Get Started with Career Starter',
    variant: 'outline',
    highlight: false,
  },
  {
    name: 'Career Accelerator',
    price: '£14.99/mo',
    features: [
      'Unlimited tailored applications',
      'Advanced AI optimization',
      'Priority support',
      'Access to Application Wizard',
    ],
    cta: 'Get Started with Career Accelerator',
    variant: 'solid',
    highlight: true,
  },
  {
    name: 'Career Dominator',
    price: '£29.99/mo',
    features: [
      'Everything in Accelerator',
      '1:1 expert review',
      'Early access to new features',
      'Personalized job search insights',
    ],
    cta: 'Get Started with Career Dominator',
    variant: 'outline',
    highlight: false,
  },
];

const CandidateLanding: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box bg={mutedBg} minH="100vh">
      {/* Navigation */}
      <Box as="nav" bg="white" borderBottom="1px solid #e5e7eb" px={{ base: 4, md: 12 }} py={0} position="sticky" top={0} zIndex={100} boxShadow="sm">
        <Flex align="center" justify="space-between" h={16} maxW="7xl" mx="auto">
          <HStack gap={2}>
            <Image src="/candidate5-logo.svg" alt="Candidate 5 logo" boxSize={7} />
            <Text fontWeight={700} fontSize="lg" color={primary} letterSpacing="-0.01em">Candidate 5 - CV</Text>
          </HStack>
          <HStack gap={0} align="center" display={{ base: 'none', md: 'flex' }}>
            <Link href="#home" px={4} py={2} fontWeight={600} color={primary} borderBottom={`3px solid ${primary}`} bg="white">Home</Link>
            <Link href="#pricing" px={4} py={2} fontWeight={600} color={cardFg} _hover={{ color: primary }}>Pricing</Link>
            <Link href="/login" px={4} py={2} fontWeight={600} color={primary} borderRadius="md" borderWidth={1} borderColor={primary} ml={4} _hover={{ bg: accent, color: 'white' }}>Login</Link>
          </HStack>
        </Flex>
      </Box>

      {/* Hero Section */}
      <Flex id="home" justify="center" align="center" py={16} px={2} bg={mutedBg}>
        <Box bg="white" borderRadius="2xl" boxShadow="lg" maxW="7xl" w="100%" px={{ base: 4, md: 12 }} py={{ base: 8, md: 16 }} display="flex" flexDir={{ base: 'column', md: 'row' }} alignItems="center" gap={12}>
          <Box flex={1} minW={0}>
            <Badge bg={accent} color="white" mb={4} px={3} py={1} borderRadius="md" fontWeight={600} fontSize="sm">
              <HStack gap={1}><Icon as={Sparkles} w={4} h={4} />AI-Powered Career Growth</HStack>
            </Badge>
            <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} fontWeight={800} color={cardFg} mb={4} lineHeight={1.1} letterSpacing="-0.02em">
              Stop Rewriting, Start <Text as="span" color={primary} display="inline">Applying</Text>
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color={mutedFg} mb={6} maxW="lg">
              Land your dream job faster with Candidate 5 - CV. Our AI uses your unique Career Arc™ to craft perfectly tailored CVs and cover letters in minutes.
            </Text>
            <HStack gap={3} mb={2} flexDir={{ base: 'column', sm: 'row' }} alignItems={{ base: 'stretch', sm: 'center' }}>
              <Button bg={primary} color="white" _hover={{ bg: accent }} size="lg" fontWeight={700} px={8} py={6} borderRadius="md">
                <HStack gap={2}><CheckCircle size={20} /> <span>Create Your Free Account</span></HStack>
              </Button>
              <Button variant="outline" borderColor={primary} color={primary} _hover={{ bg: accent, color: 'white' }} size="lg" fontWeight={700} px={8} py={6} borderRadius="md">
                <HStack gap={2}><Play size={20} /> <span>See How It Works (60s)</span></HStack>
              </Button>
            </HStack>
            <Text fontSize="sm" color={mutedFg} mt={2}>
              Join 10,000+ job seekers already optimizing their applications!
            </Text>
          </Box>
          <Box flex={1} minW={0} display="flex" justifyContent="center" alignItems="center">
            <Box bgGradient={`linear(to-br, ${primary}10, ${accent}10)`} borderRadius="3xl" p={8} borderWidth={1} borderColor={`${primary}10`} boxShadow="lg" position="relative">
              <Box bg="white" borderRadius="2xl" p={6} boxShadow="md">
                <VStack gap={3} align="stretch">
                  <HStack gap={2}>
                    <Box w={3} h={3} bg="green.400" borderRadius="full" />
                    <Box w={3} h={3} bg="yellow.400" borderRadius="full" />
                    <Box w={3} h={3} bg="red.400" borderRadius="full" />
                  </HStack>
                  <VStack gap={2} align="stretch">
                    <Box h={4} bg={mutedBg} borderRadius="md" w="75%" />
                    <Box h={4} bg={mutedBg} borderRadius="md" w="100%" />
                    <Box h={4} bg={mutedBg} borderRadius="md" w="50%" />
                    <Box h={6} bg={primary} opacity={0.2} borderRadius="md" w="66%" />
                  </VStack>
                </VStack>
              </Box>
              <Box position="absolute" top={-4} right={-4} bg={primary} borderRadius="full" p={3} boxShadow="lg">
                <Icon as={Brain} w={6} h={6} color="white" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Flex>

      {/* Social Proof */}
      <Box py={12} borderY="1px" borderColor="#e5e7eb" bg={mutedBg}>
        <Box maxW="7xl" mx="auto" px={4}>
          <Text textAlign="center" color={mutedFg} mb={8}>As seen on</Text>
          <HStack justify="center" align="center" gap={12} opacity={0.6}>
            <Box h={8} w={24} bg={mutedBg} borderRadius="md" />
            <Box h={8} w={24} bg={mutedBg} borderRadius="md" />
            <Box h={8} w={24} bg={mutedBg} borderRadius="md" />
          </HStack>
        </Box>
      </Box>

      {/* Problem Statement */}
      <Box py={20} px={4} bg="white">
        <Box maxW="4xl" mx="auto" textAlign="center">
          <Heading as="h2" fontSize={{ base: '2xl', md: '4xl' }} fontWeight={700} color={cardFg} mb={6}>
            The Job Application Grind is Real. Candidate 5 - CV is Your Way Out.
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color={mutedFg}>
            Spending hours tailoring your CV for each role? Worried your application will get lost in the ATS black hole? Juggling multiple CV versions? It's exhausting and inefficient. Candidate 5 automates the tedious parts, so you can focus on what matters: acing the interview.
          </Text>
        </Box>
      </Box>

      {/* Features */}
      <Box py={20} px={4} bg={mutedBg}>
        <Box maxW="7xl" mx="auto">
          <Text textAlign="center" fontSize="2xl" fontWeight={700} color={cardFg} mb={16}>Meet Your AI-Powered Application Toolkit</Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            <Box bg="white" borderRadius="xl" boxShadow="md" p={8} _hover={{ borderColor: primary, boxShadow: 'lg' }} borderWidth={2} borderColor="transparent" transition="all 0.3s">
              <Icon as={Target} w={8} h={8} color={primary} mb={4} />
              <Heading as="h3" fontSize="2xl" fontWeight={600} color={cardFg} mb={2}>Build Once, Apply Perfectly, Forever</Heading>
              <Text color={mutedFg} mb={4}>Your Career Arc™ is your private, intelligent career repository. Upload your existing CVs or add your experiences. Arc™ extracts, structures, and stores every skill and achievement.</Text>
              <VStack align="start" gap={2} fontSize="sm">
                <HStack><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>Consolidate your entire career history</Text></HStack>
                <HStack><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>Ensure consistency across applications</Text></HStack>
                <HStack><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>Gets more powerful with every update</Text></HStack>
              </VStack>
            </Box>
            <Box bg="white" borderRadius="xl" boxShadow="md" p={8} _hover={{ borderColor: primary, boxShadow: 'lg' }} borderWidth={2} borderColor="transparent" transition="all 0.3s">
              <Icon as={Zap} w={8} h={8} color={primary} mb={4} />
              <Heading as="h3" fontSize="2xl" fontWeight={600} color={cardFg} mb={2}>Tailored CVs & Cover Letters, Instantly</Heading>
              <Text color={mutedFg} mb={4}>Paste any job description, and let the Application Wizard work its magic. Our AI instantly analyzes the role and generates perfectly optimized applications.</Text>
              <VStack align="start" gap={2} fontSize="sm">
                <HStack><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>Beat Applicant Tracking Systems (ATS)</Text></HStack>
                <HStack><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>Highlight relevant experiences</Text></HStack>
                <HStack><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>Save hours per application</Text></HStack>
              </VStack>
            </Box>
            <Box bg="white" borderRadius="xl" boxShadow="md" p={8} _hover={{ borderColor: primary, boxShadow: 'lg' }} borderWidth={2} borderColor="transparent" transition="all 0.3s">
              <Icon as={FileText} w={8} h={8} color={primary} mb={4} />
              <Heading as="h3" fontSize="2xl" fontWeight={600} color={cardFg} mb={2}>Your Master Career Profile, Always Ready</Heading>
              <Text color={mutedFg} mb={4}>The Mega CV draws from your Arc™ to create a comprehensive master version of your resume, perfect for networking and speculative applications.</Text>
              <VStack align="start" gap={2} fontSize="sm">
                <HStack><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>Complete, always-current master document</Text></HStack>
                <HStack><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>Ideal for diverse application needs</Text></HStack>
                <HStack><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>Showcase the full breadth of experience</Text></HStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      {/* How It Works */}
      <Box py={20} px={4} bg="white">
        <Box maxW="6xl" mx="auto">
          <Text textAlign="center" fontSize="2xl" fontWeight={700} color={cardFg} mb={16}>Get Your Perfect Application in 3 Simple Steps</Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            <VStack textAlign="center" gap={4}>
              <Box bg={primary} color="white" w={16} h={16} borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" fontSize="xl">1</Box>
              <Heading as="h3" fontSize="xl" fontWeight={600} color={cardFg}>Feed Your Arc™</Heading>
              <Text color={mutedFg}>Securely upload your existing CVs or manually add your career details. Our AI intelligently populates your personal Career Arc™.</Text>
            </VStack>
            <VStack textAlign="center" gap={4}>
              <Box bg={primary} color="white" w={16} h={16} borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" fontSize="xl">2</Box>
              <Heading as="h3" fontSize="xl" fontWeight={600} color={cardFg}>Target Your Role</Heading>
              <Text color={mutedFg}>Find a job you love? Simply paste the job description into Candidate 5.</Text>
            </VStack>
            <VStack textAlign="center" gap={4}>
              <Box bg={primary} color="white" w={16} h={16} borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold" fontSize="xl">3</Box>
              <Heading as="h3" fontSize="xl" fontWeight={600} color={cardFg}>Apply with Confidence</Heading>
              <Text color={mutedFg}>Instantly generate a tailored CV and cover letter, optimized for the role. Download and apply!</Text>
            </VStack>
          </SimpleGrid>
        </Box>
      </Box>

      {/* Advantages */}
      <Box py={20} px={4} bg={mutedBg}>
        <Box maxW="6xl" mx="auto">
          <Text textAlign="center" fontSize="2xl" fontWeight={700} color={cardFg} mb={16}>The Candidate 5 - CV Advantage: More Than Just a CV Builder</Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            <VStack bg="white" borderRadius="xl" boxShadow="md" p={6} textAlign="center">
              <Icon as={Brain} w={12} h={12} color={primary} mb={2} />
              <Heading as="h3" fontSize="lg" fontWeight={600} color={cardFg}>Intelligent Personalization</Heading>
              <Text color={mutedFg} fontSize="sm">Go beyond templates. Create genuinely bespoke applications that reflect your true value.</Text>
            </VStack>
            <VStack bg="white" borderRadius="xl" boxShadow="md" p={6} textAlign="center">
              <Icon as={Clock} w={12} h={12} color={primary} mb={2} />
              <Heading as="h3" fontSize="lg" fontWeight={600} color={cardFg}>Radical Time Savings</Heading>
              <Text color={mutedFg} fontSize="sm">Cut down application time from hours to mere minutes. Apply to more opportunities.</Text>
            </VStack>
            <VStack bg="white" borderRadius="xl" boxShadow="md" p={6} textAlign="center">
              <Icon as={Users} w={12} h={12} color={primary} mb={2} />
              <Heading as="h3" fontSize="lg" fontWeight={600} color={cardFg}>Career Long Companion</Heading>
              <Text color={mutedFg} fontSize="sm">Your Career Arc™ evolves with you, making each future application stronger and smarter.</Text>
            </VStack>
            <VStack bg="white" borderRadius="xl" boxShadow="md" p={6} textAlign="center">
              <Icon as={Shield} w={12} h={12} color={primary} mb={2} />
              <Heading as="h3" fontSize="lg" fontWeight={600} color={cardFg}>Your Data, Your Control</Heading>
              <Text color={mutedFg} fontSize="sm">We prioritize your privacy. Your Career Arc™ is your secure, personal career database.</Text>
            </VStack>
          </SimpleGrid>
        </Box>
      </Box>

      {/* Testimonials */}
      <Box py={20} px={4} bg="white">
        <Box maxW="6xl" mx="auto">
          <Text textAlign="center" fontSize="2xl" fontWeight={700} color={cardFg} mb={16}>Don't Just Take Our Word For It...</Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {testimonials.map((t, i) => (
              <VStack key={i} bg="white" borderRadius="xl" boxShadow="md" p={6} gap={4} align="stretch">
                <HStack gap={1}>
                  {[...Array(5)].map((_, j) => (
                    <Icon as={Star} key={j} w={4} h={4} color={accentYellow} fill={accentYellow} />
                  ))}
                </HStack>
                <Text color={mutedFg} fontStyle="italic">"{t.quote}"</Text>
                <HStack gap={3} align="center">
                  <Box bg={primary} color="white" borderRadius="full" w={10} h={10} display="flex" alignItems="center" justifyContent="center" fontWeight={700} fontSize="sm">
                    {t.initials}
                  </Box>
                  <Box>
                    <Text fontWeight={600} fontSize="sm">{t.name}</Text>
                    <Text fontSize="xs" color={mutedFg}>{t.role}</Text>
                  </Box>
                </HStack>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Pricing */}
      <Box id="pricing" py={20} px={4} bg={mutedBg}>
        <Box maxW="6xl" mx="auto">
          <Text textAlign="center" fontSize="2xl" fontWeight={700} color={cardFg} mb={16}>Find the Perfect Plan to Launch Your Next Career Move</Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {plans.map((plan, i) => (
              <VStack key={i} bg="white" borderRadius="xl" boxShadow="md" p={8} gap={6} align="stretch" borderWidth={plan.highlight ? 2 : 0} borderColor={plan.highlight ? primary : 'transparent'} position="relative">
                {plan.highlight && (
                  <Badge bg={primary} color="white" position="absolute" top={-4} left="50%" transform="translateX(-50%)">Most Popular</Badge>
                )}
                <Box>
                  <Heading as="h3" fontSize="2xl" fontWeight={700} color={cardFg}>{plan.name}</Heading>
                  <Text fontSize="3xl" fontWeight={700} color={primary} mt={2}>{plan.price}</Text>
                </Box>
                <VStack align="start" gap={3} fontSize="md">
                  {plan.features.map((f, j) => (
                    <HStack key={j}><Icon as={CheckCircle} w={4} h={4} color="green.400" /> <Text>{f}</Text></HStack>
                  ))}
                </VStack>
                <Button w="full" variant={plan.variant === 'solid' ? 'solid' : 'outline'} colorScheme="blue">{plan.cta}</Button>
              </VStack>
            ))}
          </SimpleGrid>
          <Text textAlign="center" color={mutedFg} mt={8}>All plans start with a 7-day free trial. Cancel anytime.</Text>
        </Box>
      </Box>

      {/* CTA */}
      <Box py={20} px={4} bg="white">
        <Box maxW="4xl" mx="auto" textAlign="center">
          <Heading as="h2" fontSize={{ base: '2xl', md: '4xl' }} fontWeight={700} color={cardFg} mb={8}>Ready to Transform Your Job Search?</Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color={mutedFg} mb={8}>Stop letting tedious applications hold you back. Join Candidate 5 today and start applying smarter, faster, and with more confidence.</Text>
          <Button size="lg" bg={primary} color="white" _hover={{ bg: accent }} fontWeight={700} px={8} py={6} borderRadius="md" mb={4}>
            <HStack gap={2}><span>Sign Up for Your Free Trial Now</span> <ArrowRight size={20} /></HStack>
          </Button>
          <Text fontSize="sm" color={mutedFg}>No credit card required for trial. Takes less than 2 minutes to get started.</Text>
        </Box>
      </Box>

      {/* Footer */}
      <Box as="footer" borderTop="1px" borderColor="#e5e7eb" bg={mutedBg} py={8} px={4}>
        <Box maxW="7xl" mx="auto" textAlign="center">
          <Text color={mutedFg}>© 2024 Candidate 5. All rights reserved.</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default CandidateLanding; 