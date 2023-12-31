import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';

function TradeHistory() {
    const [trades, setTrades] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/completedTrades')
            .then(response => response.json())
            .then(data => setTrades(data))
            .catch(error => console.error("Failed to fetch trade history:", error));
    }, []);

    return (
        <div>
            <Typography variant="h6" component="h2" gutterBottom>
                Trade History
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="trade history table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trades.map((trade, index) => (
                            <TableRow key={index}>
                                <TableCell>{new Date(trade.time).toLocaleString()}</TableCell>
                                <TableCell>{trade.buyUserId === 'user1' ? 'Buy' : 'Sell'}</TableCell>
                                <TableCell>{trade.amount}</TableCell>
                                <TableCell>{trade.price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default TradeHistory;
