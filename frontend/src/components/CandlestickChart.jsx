import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

function CandlestickChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Загрузка данных о сделках
        fetch('http://localhost:3001/candlestickData1')
            .then(response => response.json())
            .then(data => {
                setData(data);
            });
    }, []);

    // Настройки для Highstock
    const options = {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'BTC/ETH Trading'
        },
        series: [{
            type: 'candlestick',
            name: 'BTC/ETH',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    };

    return (
        <HighchartsReact
    highcharts={Highcharts}
    constructorType={'stockChart'}
    options={options}
    />
);
}

export default CandlestickChart;
