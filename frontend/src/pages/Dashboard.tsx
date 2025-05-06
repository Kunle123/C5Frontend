import React from 'react';
import { Box, Grid, GridItem, Card, CardBody, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaMagic } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

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
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card bg={cardBg} boxShadow={cardShadow} minH={240} h={320} maxW={{ base: '100%', md: 400 }} w="100%" mx="auto" cursor="pointer" onClick={() => navigate('/career-ark')} _hover={{ boxShadow: 'xl', transform: 'scale(1.03)' }} transition="all 0.2s">
            <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" h="100%">
              <FaBriefcase color="#43a047" size={48} style={{ marginBottom: 8 }} />
              <Heading size="lg" fontWeight={700} mb={2} textAlign="center">Career Ark</Heading>
              <Text fontSize="md" color="gray.600" textAlign="center">
                Add CVs, skills, and experiences to build a comprehensive career profile for future applications.
              </Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard; 