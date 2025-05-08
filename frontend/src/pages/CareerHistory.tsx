import React, { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  Text,
  Heading,
  useBreakpointValue,
  VStack,
  HStack,
  Avatar,
  Divider,
} from '@chakra-ui/react';

// Mock data
const user = {
  name: 'John Smith',
  address: '123 Elm Street, Springfield, SP1 2AB',
  phone: '+44 7000 000000',
  dob: '6 Mar 1984',
  email: 'john.smith@email.com',
};

const career = [
  {
    type: 'job',
    title: 'Project Manager',
    org: 'Royal Bank of Scotland',
    date: 'June 2020 – Sept 2022',
    details: [
      'Managed multiple projects simultaneously through the entire lifecycle',
      'Led cross-functional teams to deliver projects on time and within budget',
      'Developed project plans, schedules, and budgets',
      'Collaborated with stakeholders to define project requirements',
    ],
  },
  {
    type: 'job',
    title: 'Business Analyst',
    org: 'Lloyds Bank',
    date: 'Jan 2017 – May 2020',
    details: [
      'Analyzed business processes and identified improvement opportunities',
      'Facilitated requirements gathering and documentation',
    ],
  },
  {
    type: 'job',
    title: 'Finance Assistant',
    org: 'BW Finance',
    date: 'Jul 2012 – Dec 2016',
    details: [
      'Processed invoices and managed accounts payable',
      'Assisted with monthly financial reporting',
    ],
  },
  {
    type: 'education',
    title: 'Manchester University',
    org: 'BEng – Mechanical Engineering',
    date: '2002 – 2005',
    details: ['Graduated with honors'],
  },
  {
    type: 'training',
    title: 'Leadership Course',
    org: '',
    date: 'April 2021',
    details: ['Completed leadership development program'],
  },
];

const sectionTitles = {
  job: 'Career History',
  education: 'Education',
  training: 'Training',
};

const CareerHistory: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const bg = '#f5f5f5';
  const leftPaneWidth = useBreakpointValue({ base: '100%', md: '30%' });
  const rightPaneWidth = useBreakpointValue({ base: '100%', md: '70%' });
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Group items by type for left pane
  const grouped = career.reduce((acc, item, idx) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push({ ...item, idx });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Box minH="100vh" bg={bg}>
      {/* Header */}
      <Box
        as="header"
        w="100%"
        bg={bg}
        px={{ base: 4, md: 8 }}
        py={4}
        boxShadow="sm"
        position="fixed"
        top={0}
        zIndex={10}
      >
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} alignItems="center">
          <Box>
            <Heading size="md">{user.name}</Heading>
            <Text fontSize="sm">{user.address}</Text>
            <Text fontSize="sm">{user.phone}</Text>
          </Box>
          <Box textAlign={{ base: 'left', md: 'right' }}>
            <Text fontWeight="bold" as="span">DOB: </Text>
            <Text as="span" fontSize="sm">{user.dob}</Text>
            <br />
            <Text fontWeight="bold" as="span">Email: </Text>
            <Text as="span" fontSize="sm">{user.email}</Text>
          </Box>
        </Grid>
      </Box>

      {/* Main Content */}
      <Flex
        pt={{ base: 32, md: 28 }}
        direction={{ base: 'column', md: 'row' }}
        h="calc(100vh - 80px)"
        maxW="1200px"
        mx="auto"
      >
        {/* Left Pane */}
        <Box
          w={leftPaneWidth}
          minW={{ md: '250px' }}
          maxW={{ md: '350px' }}
          borderRight={{ md: '2px solid', base: 'none' }}
          borderColor={{ md: 'gray.200', base: 'transparent' }}
          bg={{ base: bg, md: 'white' }}
          overflowY="auto"
          h={{ base: 'auto', md: '100%' }}
          mb={{ base: 4, md: 0 }}
        >
          {(['job', 'education', 'training'] as const).map((section) =>
            grouped[section] ? (
              <Box key={section} mb={6}>
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  mb={2}
                  mt={section !== 'job' ? 4 : 0}
                  color="brand.400"
                  pl={4}
                  style={{ minHeight: 32, display: 'flex', alignItems: 'center' }}
                >
                  {sectionTitles[section]}
                </Text>
                <VStack spacing={1} align="stretch">
                  {grouped[section].map((item) => (
                    <Box
                      key={item.idx}
                      p={2}
                      pl={8}
                      borderRadius="md"
                      bg={selectedIdx === item.idx ? 'gray.100' : 'transparent'}
                      _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                      onClick={() => setSelectedIdx(item.idx)}
                      tabIndex={0}
                      aria-selected={selectedIdx === item.idx}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setSelectedIdx(item.idx);
                      }}
                      textAlign="left"
                    >
                      <Text fontWeight="semibold">{item.title}</Text>
                      <Text fontSize="sm" color="gray.600">{item.org}</Text>
                      <Text fontSize="xs" color="gray.500">{item.date}</Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            ) : null
          )}
        </Box>

        {/* Right Pane */}
        <Box
          w={rightPaneWidth}
          flex={1}
          p={{ base: 4, md: 8 }}
          overflowY="auto"
          h={{ base: 'auto', md: '100%' }}
          bg="white"
          borderRadius={{ base: 'md', md: 'none' }}
          boxShadow={{ base: 'md', md: 'none' }}
        >
          {career[selectedIdx] && (
            <Box>
              <Heading size="lg" mb={1}>{career[selectedIdx].title}</Heading>
              {career[selectedIdx].org && (
                <Text fontWeight="semibold" color="gray.700" mb={1}>
                  {career[selectedIdx].org}
                </Text>
              )}
              <Text fontSize="sm" color="gray.500" mb={4}>{career[selectedIdx].date}</Text>
              <Divider mb={4} />
              <VStack align="start" spacing={3}>
                {career[selectedIdx].details.map((d: string, i: number) => (
                  <Text as="li" key={i} ml={4} fontSize="md">
                    {d}
                  </Text>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CareerHistory; 