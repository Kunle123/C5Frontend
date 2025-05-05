import React from 'react';
import Box from '@mui/material/Box';
import { Grid, GridItem } from '@chakra-ui/react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 4, md: 6 }} maxW={900} w="100%">
        <GridItem>
          <Box sx={{ height: '100%', display: 'flex', flex: 1 }}>
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 6, minHeight: 240, height: 320, overflow: 'hidden', maxWidth: { xs: '100%', md: 400 }, width: '100%', backgroundColor: '#fff', boxSizing: 'border-box', mx: 'auto' }}>
              <CardActionArea onClick={() => navigate('/cvs')} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AutoAwesomeIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Application Wizard
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    <Box sx={{ fontSize: 18, mt: 2, maxWidth: '100%', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      Paste a job advert to generate a tailored CV and cover letter.
                    </Box>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </GridItem>
        <GridItem>
          <Box sx={{ height: '100%', display: 'flex', flex: 1 }}>
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 6, minHeight: 240, height: 320, overflow: 'hidden', maxWidth: { xs: '100%', md: 400 }, width: '100%', backgroundColor: '#fff', boxSizing: 'border-box', mx: 'auto' }}>
              <CardActionArea onClick={() => navigate('/career-ark')} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <WorkIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Career Ark
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    <Box sx={{ fontSize: 18, mt: 2, maxWidth: '100%', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      Add CVs, skills, and experiences to build a comprehensive career profile for future applications.
                    </Box>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard; 