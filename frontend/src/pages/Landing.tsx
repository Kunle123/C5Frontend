import React from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  HStack,
  useBreakpointValue,
  Grid,
  GridItem,
  Divider,
} from '@chakra-ui/react';
import { FaRocket, FaBriefcase, FaMagic, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const accentGradient = 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const startTrial = () => navigate('/signup');

  return (
    <Box minH="100vh" py={8} px={2} bgGradient="linear(120deg, white 0%, lilac 100%)" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" borderRadius="2xl" boxShadow="lg" maxW={800} w="100%" p={{ base: 4, md: 8 }}>
        <Heading as="h1" size="2xl" textAlign="center" fontWeight={800} color="brand.500" mb={2}>
          Candidate 5 – Your Edge in a Competitive Job Market
        </Heading>
        <Divider my={4} borderColor="brand.500" borderWidth={2} w={20} mx="auto" />
        <Heading as="h2" size="lg" textAlign="center" mb={2}>
          Apply in minutes, not hours. Never miss an opportunity again.
        </Heading>
        <Text textAlign="center" mb={4} color="text.secondary">
          Tired of spending hours rewriting your CV for every role? With Candidate 5, you can generate tailored applications in just minutes—so you can act fast, apply smarter, and stay ready for what's next.
        </Text>
        <Box display="flex" justifyContent="center" mb={4}>
          <Button
            size="lg"
            borderRadius="lg"
            fontWeight={700}
            fontSize="xl"
            bgGradient={accentGradient}
            color="white"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'lg', bgGradient: accentGradient }}
            onClick={startTrial}
          >
            <HStack gap={2}><FaRocket /> <span>Start Your Free Trial</span></HStack>
          </Button>
        </Box>
        <Divider my={4} />
        <Heading as="h3" size="md" fontWeight={700} mb={1} display="flex" alignItems="center" gap={2}>
          <FaRocket color="#3366CC" /> What is Candidate 5?
        </Heading>
        <Text mb={3}>
          Candidate 5 is your intelligent application assistant, built to transform how you apply for jobs. It combines customisation, optimisation, and long-term career management into one seamless platform.
        </Text>
        <Box display="flex" justifyContent="center" mb={3}>
          <Button
            size="lg"
            borderRadius="lg"
            fontWeight={600}
            bgGradient={accentGradient}
            color="white"
            _hover={{ bgGradient: accentGradient, opacity: 0.9 }}
            onClick={startTrial}
          >
            <HStack gap={2}><FaRocket /> <span>Start Your Free Trial</span></HStack>
          </Button>
        </Box>
        <Divider my={4} />
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 4, md: 6 }} mb={3}>
          <GridItem>
            <Box bg="brand.50" borderRadius="lg" boxShadow="md" h="100%" p={4}>
              <Heading as="h4" size="md" fontWeight={700} color="brand.500" display="flex" alignItems="center" gap={2} mb={2}>
                <FaBriefcase color="#3366CC" /> Career Ark – Build Once, Apply Forever
              </Heading>
              <Text mb={1} fontSize="md" color="text.secondary">
                Career Ark is your personal career hub. Add your CVs, skills, experiences, and achievements to create a living profile that grows with you.
              </Text>
              <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2} mb={2}>
                <HStack gap={2}><FaCheckCircle color="#22C55E" /><Text>Every new skill or update feeds future applications</Text></HStack>
                <HStack gap={2}><FaCheckCircle color="#22C55E" /><Text>Keep your career story consistent and compelling</Text></HStack>
                <HStack gap={2}><FaCheckCircle color="#22C55E" /><Text>No more digging through files or rewriting the same content</Text></HStack>
                <HStack gap={2}><FaCheckCircle color="#22C55E" /><Text>Always ready, always up to date</Text></HStack>
              </Box>
              <Text fontSize="sm" color="text.secondary" fontStyle="italic">
                With Career Ark, every application makes your next one even stronger.
              </Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box bg="pink.50" borderRadius="lg" boxShadow="md" h="100%" p={4}>
              <Heading as="h4" size="md" fontWeight={700} color="pink.500" display="flex" alignItems="center" gap={2} mb={2}>
                <FaMagic color="#fc5c7d" /> Application Wizard – Custom Applications in Seconds
              </Heading>
              <Text mb={1} fontSize="md" color="text.secondary">
                Paste a job advert—and let Application Wizard do the rest. It instantly generates a CV and cover letter tailored to that exact role by:
              </Text>
              <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2} mb={2}>
                <HStack gap={2}><FaCheckCircle color="#3366CC" /><Text>Integrating the right keywords</Text></HStack>
                <HStack gap={2}><FaCheckCircle color="#3366CC" /><Text>Highlighting your most relevant experience first</Text></HStack>
                <HStack gap={2}><FaCheckCircle color="#3366CC" /><Text>Adapting tone and language to match the job description</Text></HStack>
                <HStack gap={2}><FaCheckCircle color="#3366CC" /><Text>Ensuring a clean, professional format every time</Text></HStack>
              </Box>
              <Text fontSize="sm" color="text.secondary" fontStyle="italic">
                Apply confidently from anywhere—whether you're at your desk or on the move.
              </Text>
            </Box>
          </GridItem>
        </Grid>
        <Box display="flex" justifyContent="center" mb={3}>
          <Button
            size="lg"
            borderRadius="lg"
            fontWeight={600}
            bgGradient={accentGradient}
            color="white"
            _hover={{ bgGradient: accentGradient, opacity: 0.9 }}
            onClick={startTrial}
          >
            <HStack gap={2}><FaRocket /> <span>Start Your Free Trial</span></HStack>
          </Button>
        </Box>
        <Divider my={4} />
        <Heading as="h4" size="md" fontWeight={700} mb={1}>
          Why Candidates Choose Candidate 5
        </Heading>
        <Box display="flex" flexDirection="column" alignItems="flex-start" mb={4} gap={2} pl={2}>
          <Text>• Cut application time from hours to minutes</Text>
          <Text>• Stay ready for any opportunity</Text>
          <Text>• Make your experience work harder for you</Text>
          <Text>• Apply more often with less effort</Text>
        </Box>
        <Divider my={4} />
        <Text textAlign="center" mb={4} fontWeight={500}>
          Candidate 5 isn't just a tool—it's your career advantage.<br />
          <b>Start applying smarter today.</b>
        </Text>
        {token && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 2, md: 4 }} mb={4}>
            <GridItem>
              <Button
                size="lg"
                borderRadius="lg"
                fontWeight={600}
                bgGradient={accentGradient}
                color="white"
                w="100%"
                _hover={{ bgGradient: accentGradient, opacity: 0.9 }}
                onClick={() => navigate('/cvs')}
              >
                <HStack gap={2}><FaMagic /> <span>Application Wizard</span></HStack>
              </Button>
            </GridItem>
            <GridItem>
              <Button
                size="lg"
                borderRadius="lg"
                fontWeight={700}
                variant="outline"
                borderWidth={2}
                w="100%"
                onClick={() => navigate('/career-ark')}
              >
                <HStack gap={2}><FaBriefcase /> <span>Career Ark</span></HStack>
              </Button>
            </GridItem>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Landing; 