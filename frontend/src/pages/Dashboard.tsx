import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Card, CardBody, Heading, Text, useColorModeValue, Button, HStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaMagic } from 'react-icons/fa';
import { getArcData } from '../api/careerArkApi';
import { Dashboard } from '../components/Dashboard';

const accentGradient = 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)';

const DashboardPage = () => {
  return <Dashboard />;
};

export default DashboardPage; 