import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Stack,
  Button,
  Badge,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

const statusColor = (status: string) => {
  switch (status) {
    case 'Sent': return 'blue';
    case 'Interview': return 'teal';
    case 'Offer': return 'green';
    case 'Rejected': return 'red';
    default: return 'gray';
  }
};

const Applications: React.FC = () => {
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    setLoading(true);
    fetch('https://api-gw-production.up.railway.app/applications', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : res.json().then(e => Promise.reject(e)))
      .then(data => setApplications(data))
      .catch(err => setError(err.message || 'Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(app =>
    app.job.toLowerCase().includes(search.toLowerCase()) ||
    app.company.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Box py={6} textAlign="center"><Spinner /></Box>;
  if (error) return <Box py={6} textAlign="center"><Alert status="error"><AlertIcon />{error}</Alert></Box>;

  return (
    <Box py={6} maxW="900px" mx="auto">
      <Heading as="h2" size="lg" mb={4}>My Applications</Heading>
      <Input
        placeholder="Search Applications"
        value={search}
        onChange={e => setSearch(e.target.value)}
        mb={4}
        size="md"
      />
      <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="sm" borderRadius="lg" p={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Job Title</Th>
              <Th>Company</Th>
              <Th>Date Applied</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map(app => (
              <Tr key={app.id}>
                <Td>{app.job}</Td>
                <Td>{app.company}</Td>
                <Td>{app.date}</Td>
                <Td>
                  <Badge colorScheme={statusColor(app.status)}>{app.status}</Badge>
                </Td>
                <Td>
                  <Stack direction="row" spacing={2}>
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" colorScheme="red" variant="outline">Withdraw</Button>
                    <Button size="sm" colorScheme="blue">Track</Button>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Applications; 