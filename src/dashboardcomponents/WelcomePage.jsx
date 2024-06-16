import React from 'react';
import Sidebar from './Sidebar';
import { Box, Typography, Container } from '@mui/material';

function WelcomePage() {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Container sx={{ flex: 1, padding: 4, overflowY: 'auto' }}>
                <Typography variant="h1" gutterBottom>
                   <em>Welcome to Wellmeadows Hospital</em> 
                </Typography>
                <Typography variant="h5" gutterBottom>
                    <strong>Where Compassion Meets Care</strong>
                </Typography>
                <Typography paragraph>
                    At Wellmeadows Hospital, we are dedicated to providing the highest quality healthcare services with warmth and compassion. Our commitment to excellence and your well-being is at the heart of everything we do.
                </Typography>
                <Typography paragraph>
                    Whether you're here for a routine check-up, specialized treatment, or emergency care, our team of skilled medical professionals is here to ensure you receive the best possible care in a comfortable and supportive environment.
                </Typography>
                <Typography paragraph>
                    Your health and comfort are our top priorities, and we strive to make your experience with us as stress-free and positive as possible. From our state-of-the-art facilities to our caring staff, we are here to support you on your journey to wellness.
                </Typography>
                <Typography paragraph>
                    <strong>Welcome to Wellmeadows Hospital, where your health is in good hands.</strong>
                </Typography>
            </Container>
        </Box>
    );
}

export default WelcomePage;