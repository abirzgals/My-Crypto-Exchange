import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';

function TradePairSelector() {
    const [tradePairs, setTradePairs] = useState([]); // Trade pairs from server
    const [selectedPair, setSelectedPair] = useState(''); // Selected trade pair

    useEffect(() => {
        // Fetch trade pairs from server
        const fetchTradePairs = async () => {
            try {
                const response = await fetch('http://localhost:3001/tradePairs'); // Adjust URL as needed
                const data = await response.json();
                setTradePairs(data);
                if (data.length > 0) {
                    setSelectedPair(data[0]); // Set the first pair as selected by default
                }
                if (response.data.length > 0) {
                    setSelectedPair(response.data[0]); // Default to the first pair
                }
            } catch (error) {
                console.error('Error fetching trade pairs:', error);
            }
        };

        fetchTradePairs();
    }, []);

    const handlePairChange = (event) => {
        setSelectedPair(event.target.value);
    };

    return (
        <Select
            fullWidth
            value={selectedPair}
            onChange={handlePairChange}
            displayEmpty
            renderValue={
                selectedPair !== '' ? undefined : () => <div style={{ color: "#999" }}>Select Pair</div>
            }
        >
            {tradePairs.map((pair) => (
                <MenuItem key={pair} value={pair}>{pair}</MenuItem>
            ))}
        </Select>
    );
}

export default TradePairSelector;
