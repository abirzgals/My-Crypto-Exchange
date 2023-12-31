import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, TextField, Button, Paper, Tabs, Tab } from '@mui/material';
import TradePairSelector from "./components/TradePairSelector";
import TradingViewCandlestickChart from "./components/TradingViewCandlestickChart";
import TradeHistory from "./components/TradeHistory";
import OpenOrders from "./components/OpenOrders"; // Adjust the import path as necessary
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from "./components/Footer";
import Login from "./components/Login";
import Header from "./components/Header";
import Register from "./components/Register";
import OrderForm from './components/OrderForm';

export const AuthContext = React.createContext(null);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const handleOrderSubmit = (orderData) => {
    console.log("Order Submitted:", orderData);
    // Further processing, e.g., POST request to server
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [tabValue, setTabValue] = useState(0); // 0 for Buy, 1 for Sell
    const [userEmail, setUserEmail] = useState('');

    const authContextValue = {
        isAuthenticated,
        setIsAuthenticated,
        userEmail,
        setUserEmail,
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
/*
    const Form = () => (
        <>
            <TextField label="Amount" variant="outlined" fullWidth margin="normal" />
            <TextField label="Price" variant="outlined" fullWidth margin="normal" />
            <Button variant="contained" fullWidth style={{ backgroundColor: tabValue === 0 ? 'green' : 'red', color: 'white', marginTop: 16 }}>
                {tabValue === 0 ? 'Buy' : 'Sell'}
            </Button>
        </>
    );*/

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline /> {/* This helps to kickstart an elegant, consistent, and simple baseline to build upon */}

            <AuthContext.Provider value={authContextValue}>
                {!isAuthenticated ? (
                    showRegister ? <Register setShowRegister={setShowRegister} /> : <Login setShowRegister={setShowRegister} />
                ) : (

                <Container maxWidth="lg">
            {/* Header */}
            <Header />

            {/* Responsive Grid */}
            <Grid container spacing={3} style={{ marginTop: '20px' }}>

                {/* Left Block: Trade Pair Selector and Order Form */}
                <Grid item xs={12} md={4}>
                    {/* Trade Pair Selector */}
                    <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                        <TradePairSelector />
                    </Paper>

                    {/* Order Form */}
                    <Paper style={{ padding: '20px' }}>
                        <OrderForm /* pass necessary props if needed */ />
                    </Paper>
                </Grid>
                {/* Right Block: Chart, Orders, and History */}
                <Grid item xs={12} md={8}>
                    {/* Chart */}
                    <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                        <TradingViewCandlestickChart />
                    </Paper>
                </Grid>


                <Grid item xs={12}>
                    {/* Open Orders */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper style={{ padding: '20px' }}>
                                <OpenOrders />
                            </Paper>
                        </Grid>

                        {/* Trade History */}
                        <Grid item xs={12} md={6}>
                            <Paper style={{ padding: '20px' }}>
                                <TradeHistory />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Footer />
                </Grid>
            </Grid>
        </Container>
                )}
                    </AuthContext.Provider>
            }

        </ThemeProvider>
    );
}

export default App;
