import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Card, CardBody, Heading, Text, useColorModeValue, Button, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaMagic } from 'react-icons/fa';
import { getArcData } from '../api/careerArkApi';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  // Career Ark logic
  const [arcLoading, setArcLoading] = useState(false);
  const [arcError, setArcError] = useState('');
  const [arcHasData, setArcHasData] = useState(false);

  useEffect(() => {
    setArcLoading(true);
    getArcData()
      .then(data => {
        const hasData = !!(
          (data.work_experience && data.work_experience.length > 0) ||
          (data.education && data.education.length > 0) ||
          (data.skills && data.skills.length > 0) ||
          (data.projects && data.projects.length > 0) ||
          (data.certifications && data.certifications.length > 0)
        );
        setArcHasData(hasData);
      })
      .catch(() => setArcHasData(false))
      .finally(() => setArcLoading(false));
  }, []);

  return (
    <Box minH="80vh" display="flex" alignItems="center" justifyContent="center" py={8}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 4, md: 6 }} maxW={900} w="100%">
        <GridItem>
          <Card bg={cardBg} boxShadow={cardShadow} minH={240} h={320} maxW={{ base: '100%', md: 400 }} w="100%" mx="auto" cursor="pointer" onClick={() => navigate('/cvs')} _hover={{ boxShadow: 'xl', transform: 'scale(1.03)' }} transition="all 0.2s">
            <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" h="100%">
              <FaMagic color="#3366CC" size={48} style={{ marginBottom: 8 }} />
              <Heading size="lg" fontWeight={700} mb={2} textAlign="center">Application Wizard</Heading>
              <Text fontSize="md" color="gray.600" textAlign="center">
                Paste a job advert to generate a tailored CV and cover letter.
              </Text>
              <Button
                mt={4}
                colorScheme="blue"
                size="lg"
                isDisabled={arcLoading || !arcHasData}
                onClick={() => navigate('/cvs')}
                w="100%"
              >
                <HStack gap={2}><FaMagic /> <span>Application Wizard</span></HStack>
              </Button>
              {(!arcLoading && !arcHasData) && (
                <Text color="red.500" fontSize="sm" mt={2} textAlign="center">
                  Please add your career data in Career Ark before using the Application Wizard.
                </Text>
              )}
              {arcError && (
                <Text color="red.500" fontSize="sm" mt={2}>{arcError}</Text>
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card bg={cardBg} boxShadow={cardShadow} minH={240} h={320} maxW={{ base: '100%', md: 400 }} w="100%" mx="auto" cursor="pointer" onClick={() => navigate('/career-ark')} _hover={{ boxShadow: 'xl', transform: 'scale(1.03)' }} transition="all 0.2s">
            <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" h="100%">
              <FaBriefcase color="#3366CC" size={48} style={{ marginBottom: 8 }} />
              <Heading size="lg" fontWeight={700} mb={2} textAlign="center">Career Ark</Heading>
              <Text fontSize="md" color="gray.600" textAlign="center">
                Build and manage your career profile.
              </Text>
              <Button
                mt={4}
                colorScheme="gray"
                size="lg"
                onClick={() => navigate('/career-ark')}
                w="100%"
              >
                <HStack gap={2}><FaBriefcase /> <span>Career Ark</span></HStack>
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      <Box textAlign="center" mt={8}>
        <Button colorScheme="blue" size="lg" onClick={() => navigate('/download-cvs')}>
          Download Recent CVs
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard; 