import React from 'react';
import { Box, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="center" maxWidth={800}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 6 }}>
            <CardActionArea onClick={() => navigate('/cvs')} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <WorkIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Perfect Match
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Paste a job advert to generate a tailored CV and cover letter.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 6 }}>
            <CardActionArea onClick={() => navigate('/career-ark')} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AutoAwesomeIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  The Ark
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Add CVs, skills, and experiences to build a comprehensive career profile for future applications.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 