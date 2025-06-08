import React, { useState } from 'react';
import { Box, Heading, Input, Button, FormControl, FormLabel, VStack, HStack, Text, Progress, Link, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { authFetch } from '../api/authFetch';

const JOB_AGENT_API = import.meta.env.VITE_JOB_AGENT_API || 'https://api-gw-production.up.railway.app';

const formatDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString();
};

const SearchJobs: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    setSearched(false);
    try {
      const res = await authFetch(`${JOB_AGENT_API}/search_jobs`, {
        method: 'POST',
        body: JSON.stringify({
          search_params: {
            ...(keywords ? { keywords } : {}),
            ...(location ? { location } : {}),
          },
        }),
      });
      if (!res) return; // handled by authFetch
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err?.error || err?.detail || 'Failed to search jobs');
        setLoading(false);
        setSearched(true);
        return;
      }
      const data = await res.json();
      setResults(data.matches || []);
      setSearched(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to search jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={8}>
      <Heading mb={6} size="lg">Job Search</Heading>
      <form onSubmit={handleSearch}>
        <VStack align="stretch" spacing={4} maxW="md" mb={8}>
          <FormControl>
            <FormLabel>Keywords</FormLabel>
            <Input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g. python developer" />
          </FormControl>
          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. London" />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={loading}>Search</Button>
        </VStack>
      </form>
      {error && (
        <Alert status="error" mb={6}><AlertIcon />{error}</Alert>
      )}
      {loading && <Spinner size="lg" />}
      {searched && !loading && results.length === 0 && !error && (
        <Text>No jobs found. Try different keywords or location.</Text>
      )}
      <VStack align="stretch" spacing={6}>
        {results.map((item, idx) => (
          <Box key={idx} p={5} borderWidth={1} borderRadius="md" boxShadow="sm">
            <HStack justify="space-between" align="start">
              <Box>
                <Link href={item.job.url} isExternal fontWeight="bold" fontSize="lg">{item.job.title}</Link>
                <Text>{item.job.company}, {item.job.location}</Text>
                <Text color="gray.600" fontSize="sm">Posted: {formatDate(item.job.created)}</Text>
              </Box>
              <Box minW="120px" textAlign="right">
                <Text fontSize="sm">Score: {Math.round((item.score || 0) * 100)}%</Text>
                <Progress value={Math.round((item.score || 0) * 100)} size="sm" colorScheme="green" borderRadius="md" mt={1} />
              </Box>
            </HStack>
            <Text mt={2} fontStyle="italic" color="gray.700">Why: {item.explanation}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default SearchJobs; 