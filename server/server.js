const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());


// Представление для ордеров
let buyOrders = []; // Ордера на покупку, отсортированные по убыванию цены
let sellOrders = []; // Ордера на продажу, отсортированные по возрастанию цены

// Представление для пользователей и их балансов
let users = {
    // Example users with login credentials and balances
    'user1@example.com': { password: 'pass1', balances: { 'BTC': 10, 'ETH': 5 } },
    'user2@example.com': { password: 'pass2', balances: { 'BTC': 2, 'ETH': 20 } }
};

// Баланс биржи
let exchangeBalances = { 'BTC': 0, 'ETH': 0 };
let completedTrades = [];

const availableTradePairs = [
    'BTC/ETH',
    'BTC/USDT',
    'ETH/USDT',
    // ... add more pairs as needed
];

completedTrades = [
    {
        buyUserId: 'user1',
        sellUserId: 'user2',
        amount: 0.5,
        price: 10000, // Example price in whatever currency unit you're using
        pair: 'BTC/ETH',
        time: new Date('2023-01-01T00:00:00Z').getTime() // Timestamp for 5 minutes intervals
    },
    {
        buyUserId: 'user3',
        sellUserId: 'user1',
        amount: 0.75,
        price: 10500,
        pair: 'BTC/ETH',
        time: new Date('2023-01-01T00:00:00Z').getTime() // Next 5 minutes interval
    },
    {
        buyUserId: 'user1',
        sellUserId: 'user4',
        amount: 0.2,
        price: 16200,
        pair: 'BTC/ETH',
        time: new Date('2023-01-01T00:00:00Z').getTime() // Next 5 minutes interval
    },
    {
        buyUserId: 'user2',
        sellUserId: 'user3',
        amount: 0.5,
        price: 11200,
        pair: 'BTC/ETH',
        time: new Date('2023-01-01T00:05:00Z').getTime() // Next 5 minutes interval
    },
    {
        buyUserId: 'user4',
        sellUserId: 'user1',
        amount: 0.3,
        price: 14200,
        pair: 'BTC/ETH',
        time: new Date('2023-01-01T00:05:00Z').getTime() // Next 5 minutes interval
    },
    {
        buyUserId: 'user1',
        sellUserId: 'user2',
        amount: 0.4,
        price: 12000,
        pair: 'BTC/ETH',
        time: new Date('2023-01-01T00:05:00Z').getTime() // Next 5 minutes interval
    },
    // ... add as many trades as you need for a meaningful sample ...
];

// Sample buy orders
buyOrders = [
    {
        userId: 'user1',
        type: 'buy',
        pair: 'BTC/ETH',
        amount: 1,
        price: 9900, // The price they're willing to buy at
        id: Date.now() + 1 // Mock unique identifier
    },
    {
        userId: 'user2',
        type: 'buy',
        pair: 'BTC/ETH',
        amount: 2,
        price: 9800,
        id: Date.now() + 2
    }
    // ... more buy orders ...
];

// Sample sell orders
sellOrders = [
    {
        userId: 'user3',
        type: 'sell',
        pair: 'BTC/ETH',
        amount: 0.5,
        price: 10100, // The price they're willing to sell at
        id: Date.now() + 3
    },
    {
        userId: 'user4',
        type: 'sell',
        pair: 'BTC/ETH',
        amount: 1.5,
        price: 10200,
        id: Date.now() + 4
    }
    // ... more sell orders ...
];


// Функция сортировки ордеров
function sortOrders(a, b) {
    return a.price - b.price;
}


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (users[email] && users[email].password === password) {
        // Credentials are valid
        res.json({ success: true, message: 'Login successful!' });
    } else {
        // Invalid credentials
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
});
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an email and password.' });
    }

    if (users[email]) {
        return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    // In a real application, hash the password before storing
    users[email] = { password: password, balances: { 'BTC': 0, 'ETH': 0 } };
console.log(users);
    res.json({ success: true, message: 'Registration successful!' });
});

app.get('/tradePairs', (req, res) => {
    res.json(availableTradePairs);
});

// API для размещения нового ордера
app.post('/order', (req, res) => {
    const { type, pair, amount, price } = req.body;
    const order = { type, pair, amount: Number(amount), price: Number(price), id: Date.now() };

    // Разделение на ордера покупки и продажи
    if (order.type === 'buy') {
        buyOrders.push(order);
        buyOrders.sort(sortOrders).reverse(); // Сортировка по убыванию цены
    } else if (order.type === 'sell') {
        sellOrders.push(order);
        sellOrders.sort(sortOrders); // Сортировка по возрастанию цены
    }



    // Пример сопоставления и исполнения сделки
    while (buyOrders.length > 0 && sellOrders.length > 0 && buyOrders[0].price >= sellOrders[0].price) {
        const sellOrder = sellOrders.shift();
        const buyOrder = buyOrders.shift();
        const tradeAmount = Math.min(buyOrder.amount, sellOrder.amount);
        const tradePrice = sellOrder.price;

        // Расчет суммы сделки и комиссии
        const tradeValue = tradeAmount * tradePrice; // Общая стоимость сделки
        const commission = tradeValue * 0.0001; // 0.01% комиссии

        // Сохранение совершенной сделки
        completedTrades.push({
            buyUserId: buyOrder.userId,
            sellUserId: sellOrder.userId,
            amount: tradeAmount,
            price: tradePrice,
            pair
        });

        // Обновление балансов покупателя и продавца
        users[buyOrder.userId]['BTC'] -= tradeAmount; // Куплено BTC, списываем
        users[buyOrder.userId]['ETH'] += tradeAmount - commission / tradePrice; // Получено ETH за вычетом комиссии
        users[sellOrder.userId]['BTC'] += tradeAmount * tradePrice - commission; // Получено BTC за вычетом комиссии
        users[sellOrder.userId]['ETH'] -= tradeAmount; // Продано ETH

        // Начисление комиссии бирже
        exchangeBalances['BTC'] += commission / tradePrice; // Комиссия в BTC
        exchangeBalances['ETH'] += commission; // Комиссия в ETH

        console.log(`Сделка: Куплено ${tradeAmount} BTC по цене ${tradePrice}. Комиссия: ${commission} ETH`);
    }

    res.status(201).send(order);
});

// API для получения всех ордеров
app.get('/orders', (req, res) => {
    res.status(200).send({ buyOrders, sellOrders });
});


app.get('/completedTrades', (req, res) => {
    // Assuming completedTrades is already populated with data as per your existing setup
    res.json(completedTrades);
});



app.get('/candlestickData1', async (req, res) => {
    try {
        // Define the symbol, interval, and limit
        const symbol = 'BTCUSDT';
        const interval = '5m';
        const limit = 300; // Number of candlesticks to return

        // Fetching candlestick data from Binance
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        const response = await axios.get(url);
        const data = response.data;

        // Transforming data to a suitable format
        const candles = data.map(candle => ({
            time: candle[0] , // Open time, converted to seconds
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5]
        }));

        res.json(candles);
    } catch (error) {
        console.error('Failed to fetch candlestick data:', error);
        res.status(500).send('Failed to fetch data');
    }
});

app.get('/candlestickData', (req, res) => {
    // Фильтруем и агрегируем сделки для формирования свечей
    // Здесь используется упрощенный метод для демонстрации

    // Группировка сделок по временным интервалам (например, 5 минут)
    let candles = {}; // Словарь для свечей, ключом будет временной интервал
console.log(completedTrades);
    completedTrades.forEach(trade => {
        // Определяем интервал для сделки
        let timeSlot = Math.floor(trade.time / (5 * 60 * 1000)); // пример для 5-минутных интервалов

        if (!candles[timeSlot]) {
            candles[timeSlot] = {
                open: trade.price,
                high: trade.price,
                low: trade.price,
                close: trade.price,
                volume: trade.amount
            };
        } else {
            // Обновление значений свечи
            candles[timeSlot].high = Math.max(candles[timeSlot].high, trade.price);
            candles[timeSlot].low = Math.min(candles[timeSlot].low, trade.price);
            candles[timeSlot].close = trade.price;
            candles[timeSlot].volume += trade.amount;
        }
    });
console.log(candles);
    // Преобразуем свечи в массив для передачи
    let candleArray = Object.keys(candles).map(key => ({
        time: parseInt(key) * 5 * 60 , // Время начала интервала
        ...candles[key]
    }));
console.log(candleArray);
    res.status(200).send(candleArray);
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
