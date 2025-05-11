import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';

// Mock API calls (replace with real endpoints as needed)
const fetchUser = async () => ({
  name: 'John Smith',
  address: '123 Elm Street, Springfield, SP1 2AB',
  phone: '+44 7000 000000',
  dob: '6 Mar 1984',
  email: 'john.smith@email.com',
});
const fetchCareer = async () => ([
  {
    type: 'job',
    title: 'Project Manager',
    org: 'Royal Bank of Scotland',
    date: 'Jun 2020 – Sept 2022',
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
    date: 'Jan 2017–May 2020',
    details: [],
  },
  {
    type: 'job',
    title: 'Finance Assistant',
    org: 'BW Finance',
    date: 'Jul 2012 –Dec 2016',
    details: [],
  },
  {
    type: 'education',
    title: 'Manchester University',
    org: 'BEng – Mechanical Engineering',
    date: '2002–2005',
    details: [],
  },
  {
    type: 'training',
    title: 'Leadership Course',
    org: '',
    date: 'April 2021',
    details: [],
  },
]);

const sectionTitles = {
  job: 'Career History',
  education: 'Education',
  training: 'Training',
};

const CareerArkDemo: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [career, setCareer] = useState<any[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUser(), fetchCareer()])
      .then(([userData, careerData]) => {
        setUser(userData);
        setCareer(careerData);
        setError('');
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  // Group items by type for left pane
  const grouped = career.reduce((acc, item, idx) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push({ ...item, idx });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Box minH="100vh" bg="gray.50">
      {/* User Info Header */}
      <Box w="100%" bg="white" py={3} boxShadow="sm" borderBottom="1px solid #e2e8f0">
        <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
          <Box>
            <Heading size="md">{user?.name || ''}</Heading>
            <Text fontSize="sm">{user?.address || ''}</Text>
            <Text fontSize="sm">{user?.phone || ''}</Text>
          </Box>
          <Box textAlign="right">
            <Text fontWeight="bold" as="span">DOB: </Text>
            <Text as="span" fontSize="sm">{user?.dob || ''}</Text>
            <br />
            <Text fontWeight="bold" as="span">Email: </Text>
            <Text as="span" fontSize="sm">{user?.email || ''}</Text>
          </Box>
        </Flex>
      </Box>
      {/* Main Two-Column Layout */}
      <Flex maxW="1200px" mx="auto" flex={1} minH="calc(100vh - 120px)" gap={6}>
        {/* Left Sidebar */}
        <Box w={{ base: '100%', md: '320px' }} bg="white" borderRadius="lg" boxShadow="md" p={4} h="100%" minH={0} overflowY="auto">
          {Object.entries(sectionTitles).map(([key, label]) => (
            <Box key={key} mb={6}>
              <HStack justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold" fontSize="lg" color="brand.500">{label}</Text>
                <IconButton aria-label={`Add ${label}`} icon={<AddIcon />} size="sm" variant="ghost" onClick={() => setSelectedIdx(null)} />
              </HStack>
              <VStack spacing={1} align="stretch">
                {grouped[key]?.length > 0 ? grouped[key].map((item: any) => (
                  <Box
                    key={item.idx}
                    p={2}
                    borderRadius="md"
                    bg={selectedIdx === item.idx ? 'brand.100' : 'gray.50'}
                    _hover={{ bg: 'brand.50', cursor: 'pointer' }}
                    onClick={() => setSelectedIdx(item.idx)}
                  >
                    <Text fontWeight="semibold">{item.title}</Text>
                    <Text fontSize="sm" color="gray.600">{item.org}</Text>
                    <Text fontSize="xs" color="gray.500">{item.date}</Text>
                  </Box>
                )) : (
                  <Text fontSize="sm" color="gray.400">No entries</Text>
                )}
              </VStack>
            </Box>
          ))}
        </Box>
        {/* Right Detail Pane */}
        <Box flex={1} bg="white" borderRadius="lg" boxShadow="md" p={8} minH={0} h="100%" overflowY="auto">
          {loading ? (
            <Spinner />
          ) : error ? (
            <Alert status="error"><AlertIcon />{error}</Alert>
          ) : selectedIdx !== null && career[selectedIdx] ? (
            <Box>
              <HStack justify="space-between" align="center" mb={2}>
                <Heading size="lg" mb={1}>{career[selectedIdx].title}</Heading>
                <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" variant="ghost" />
              </HStack>
              {career[selectedIdx].org && (
                <Text fontWeight="semibold" color="gray.700" mb={1}>{career[selectedIdx].org}</Text>
              )}
              <Text fontSize="sm" color="gray.500" mb={4}>{career[selectedIdx].date}</Text>
              <Divider mb={4} />
              <VStack align="start" spacing={3}>
                {career[selectedIdx].details && career[selectedIdx].details.length > 0 ? (
                  career[selectedIdx].details.map((d: string, i: number) => (
                    <Text as="li" key={i} ml={4} fontSize="md">{d}</Text>
                  ))
                ) : (
                  <Text fontSize="sm" color="gray.400">No details available.</Text>
                )}
              </VStack>
            </Box>
          ) : (
            <Box as="form" w="100%" maxW="500px" mx="auto">
              <Heading size="md" mb={4}>New Entry</Heading>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text mb={1} fontWeight={600}>Title</Text>
                  <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Title" />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>Organization</Text>
                  <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Organization/Institution" />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>Date</Text>
                  <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Date" />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>Details</Text>
                  <textarea style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 80 }} placeholder="Details (one per line)" />
                </Box>
                <Button colorScheme="blue" isDisabled>Save (Demo Only)</Button>
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CareerArkDemo; 