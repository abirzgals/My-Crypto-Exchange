import React, { useState, useContext } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { AuthContext } from '../App'; // Make sure to import AuthContext

function Register({ setShowRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { setIsAuthenticated } = useContext(AuthContext); // Use the Auth context

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (data.success) {
                // If registration is successful, log in the user
                setIsAuthenticated(true);
                // Here, you might also want to save the user's data or token to the state or local storage
            } else {
                // Handle errors or unsuccessful registration
                alert(data.message); // In a real app, you'd show a more user-friendly message
            }
        } catch (error) {
            console.error('Registration failed:', error);
            // Handle the error state here, perhaps by showing a message to the user
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
                    Register
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    {/* Link back to Login */}
                    <Button
                        color="primary"
                        fullWidth
                        onClick={() => setShowRegister(false)}
                    >
                        Already have an account? Sign in
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Register;
