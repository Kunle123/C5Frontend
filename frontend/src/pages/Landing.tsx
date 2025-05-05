import React from 'react';
import { Box, Button, Typography, Paper, Divider } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WorkIcon from '@mui/icons-material/Work';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { Grid, GridItem } from '@chakra-ui/react';

const accentGradient = 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const startTrial = () => navigate('/signup');

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 8,
      px: 2,
      background: 'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Paper elevation={8} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, maxWidth: 800, mx: 'auto', width: '100%', boxShadow: 6 }}>
        <Typography variant="h3" align="center" fontWeight={800} color="primary.main" gutterBottom>
          Candidate 5 – Your Edge in a Competitive Job Market
        </Typography>
        <Divider sx={{ my: 3, borderColor: 'primary.main', borderWidth: 2, width: 80, mx: 'auto' }} />
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Apply in minutes, not hours. Never miss an opportunity again.
        </Typography>
        <Typography align="center" sx={{ mb: 4, color: 'text.secondary' }}>
          Tired of spending hours rewriting your CV for every role? With Candidate 5, you can generate tailored applications in just minutes—so you can act fast, apply smarter, and stay ready for what's next.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={startTrial}
            sx={{
              px: 6,
              py: 2,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: 22,
              boxShadow: 3,
              background: accentGradient,
              color: '#fff',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 6, background: accentGradient },
            }}
            startIcon={<RocketLaunchIcon />}
          >
            Start Your Free Trial
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <RocketLaunchIcon color="primary" /> What is Candidate 5?
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Candidate 5 is your intelligent application assistant, built to transform how you apply for jobs. It combines customisation, optimisation, and long-term career management into one seamless platform.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={startTrial}
            sx={{
              px: 5,
              fontWeight: 600,
              background: accentGradient,
              color: '#fff',
              '&:hover': { background: accentGradient, opacity: 0.9 },
            }}
            startIcon={<RocketLaunchIcon />}
          >
            Start Your Free Trial
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 4, md: 6 }} mb={3}>
          <GridItem>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%', background: 'rgba(106,130,251,0.07)', maxWidth: { xs: '100%', md: 400 }, width: '100%', boxSizing: 'border-box', mx: 'auto' }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon color="primary" /> Career Ark – Build Once, Apply Forever
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Career Ark is your personal career hub. Add your CVs, skills, experiences, and achievements to create a living profile that grows with you.
              </Typography>
              <ul style={{ marginBottom: 16 }}>
                <li>Every new skill or update feeds future applications</li>
                <li>Keep your career story consistent and compelling</li>
                <li>No more digging through files or rewriting the same content</li>
                <li>Always ready, always up to date</li>
              </ul>
              <Typography sx={{ mb: 1 }}>
                With Career Ark, every application makes your next one even stronger.
              </Typography>
            </Paper>
          </GridItem>
          <GridItem>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%', background: 'rgba(252,92,125,0.07)', maxWidth: { xs: '100%', md: 400 }, width: '100%', boxSizing: 'border-box', mx: 'auto' }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesomeIcon color="secondary" /> Application Wizard – Custom Applications in Seconds
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Paste a job advert—and let Application Wizard do the rest. It instantly generates a CV and cover letter tailored to that exact role by:
              </Typography>
              <ul style={{ marginBottom: 16 }}>
                <li>Integrating the right keywords</li>
                <li>Highlighting your most relevant experience first</li>
                <li>Adapting tone and language to match the job description</li>
                <li>Ensuring a clean, professional format every time</li>
              </ul>
              <Typography sx={{ mb: 1 }}>
                Apply confidently from anywhere—whether you're at your desk or on the move.
              </Typography>
            </Paper>
          </GridItem>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={startTrial}
            sx={{
              px: 5,
              fontWeight: 600,
              background: accentGradient,
              color: '#fff',
              '&:hover': { background: accentGradient, opacity: 0.9 },
            }}
            startIcon={<RocketLaunchIcon />}
          >
            Start Your Free Trial
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          Why Candidates Choose Candidate 5
        </Typography>
        <ul style={{ marginBottom: 16 }}>
          <li>Cut application time from hours to minutes</li>
          <li>Stay ready for any opportunity</li>
          <li>Make your experience work harder for you</li>
          <li>Apply more often with less effort</li>
        </ul>
        <Divider sx={{ my: 3 }} />
        <Typography align="center" sx={{ mb: 4, fontWeight: 500 }}>
          Candidate 5 isn't just a tool—it's your career advantage.<br />
          <b>Start applying smarter today.</b>
        </Typography>
        {token && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 2, md: 4 }} mb={4}>
            <GridItem>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ py: 3, fontSize: 22, fontWeight: 600, background: accentGradient, color: '#fff', '&:hover': { background: accentGradient, opacity: 0.9 } }}
                onClick={() => navigate('/cvs')}
                startIcon={<AutoAwesomeIcon />}
              >
                Application Wizard
              </Button>
            </GridItem>
            <GridItem>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                fullWidth
                sx={{ py: 3, fontSize: 22, fontWeight: 600, borderWidth: 2, borderColor: '#fc5c7d' }}
                onClick={() => navigate('/career-ark')}
                startIcon={<WorkIcon />}
              >
                Career Ark
              </Button>
            </GridItem>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Landing; 