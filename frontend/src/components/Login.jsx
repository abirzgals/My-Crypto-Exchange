import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';

// Context for auth status (you'll create this context in your App component)
import { AuthContext } from '../App';

export default function Login({ setShowRegister }) {
    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAuthenticated, setUserEmail } = useContext(AuthContext);

    const handleLogin = async () => {
        // In a real app, you would fetch this from the server:
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
            setIsAuthenticated(true);
            setUserEmail(email);
        } else {
            alert('Invalid credentials'); // In real app, use a more user-friendly way to display errors
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoFocus
                        value={email}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                    <Button
                        color="primary"
                        fullWidth
                        onClick={() => setShowRegister(true)} // Assuming you've passed down this function as a prop
                    >
                        Don't have an account? Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
