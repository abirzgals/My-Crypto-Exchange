// src/OrderForm.js
import React, { useState } from 'react';
import { TextField, Button, Tabs, Tab, Box } from '@mui/material';
import TradePairSelector from "./TradePairSelector";

function OrderForm({ onSubmit }) {
    const [tabValue, setTabValue] = useState('buy'); // 'buy' or 'sell' as the tab value
    const [pair, setPair] = useState('BTC/ETH');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ensure amount and price are converted to numbers if needed.
        onSubmit({ type: tabValue, pair, amount: parseFloat(amount), price: parseFloat(price) });
    };

    return (
        <form onSubmit={handleSubmit}>

            {/* Tabs for Order Type */}
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
            >
                <Tab value="buy" label="Buy" style={{ color: 'green' }} />
                <Tab value="sell" label="Sell" style={{ color: 'red' }} />
            </Tabs>

            {/* Amount Input */}
            <TextField
                fullWidth
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                margin="normal"
            />

            {/* Price Input */}
            <TextField
                fullWidth
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                margin="normal"
            />

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit Order
            </Button>
        </form>
    );
}

export default OrderForm;
