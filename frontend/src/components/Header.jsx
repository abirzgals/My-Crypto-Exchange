import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../App'; // Adjust the import path as necessary

function Header() {
    const { isAuthenticated, userEmail, setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        // Implement logout functionality here
        setIsAuthenticated(false);
    };

    return (
        <AppBar position="static" color="default">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    My Crypto Exchange
                </Typography>

                {/* Displaying Username */}
                <Typography variant="subtitle1" component="span" sx={{ margin: '0 10px' }}>
                    {userEmail}
                </Typography>

                {/* Profile Icon */}
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>

                {/* Logout Button */}
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
