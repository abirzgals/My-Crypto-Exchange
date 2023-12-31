import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function OpenOrders() {
    const [buyOrders, setBuyOrders] = useState([]);
    const [sellOrders, setSellOrders] = useState([]);

    useEffect(() => {
        // Fetch open orders data from the server
        fetch('http://localhost:3001/orders')
            .then(response => response.json())
            .then(data => {
                setBuyOrders(data.buyOrders || []);
                setSellOrders(data.sellOrders || []);
            })
            .catch(error => console.error("Failed to fetch open orders:", error));
    }, []);

    return (
        <div>
            <Typography variant="h6" component="h2">
                Buy Orders
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="buy orders table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buyOrders.map((order, index) => (
                            <TableRow key={index}>
                                <TableCell>{order.price}</TableCell>
                                <TableCell>{order.amount}</TableCell>
                                <TableCell>{(order.price * order.amount).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h6" component="h2" style={{ marginTop: '20px' }}>
                Sell Orders
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="sell orders table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sellOrders.map((order, index) => (
                            <TableRow key={index}>
                                <TableCell>{order.price}</TableCell>
                                <TableCell>{order.amount}</TableCell>
                                <TableCell>{(order.price * order.amount).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default OpenOrders;
