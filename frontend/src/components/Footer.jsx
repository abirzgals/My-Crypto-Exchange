import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
            <Container maxWidth="lg">
                <Typography variant="h6" align="center" gutterBottom>
                    My Crypto Exchange
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
                    All rights reserved © My Crypto Exchange {new Date().getFullYear()}
                </Typography>
                {/* Add more content here as needed, such as links or additional text */}
            </Container>
        </Box>
    );
}

export default Footer;
