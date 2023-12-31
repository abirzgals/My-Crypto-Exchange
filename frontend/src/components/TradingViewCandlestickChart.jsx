import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

function TradingViewCandlestickChart() {
    const chartContainerRef = useRef();
    const chart = useRef(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch candlestick data from the server using the Fetch API
        const fetchCandlestickData = async () => {
            try {
                const response = await fetch('http://localhost:3001/candlestickData1');
                const rawData = await response.json();

                // Filter out any entries with null time or other critical fields
                const validData = rawData.filter(item => item && item.time != null);

                // Ensure time is in the right format (if necessary, convert it here)
                const formattedData = validData.map(item => ({
                    time: item.time / 1000, // Convert time to seconds for lightweight charts
                    open: parseFloat(item.open),
                    high: parseFloat(item.high),
                    low: parseFloat(item.low),
                    close: parseFloat(item.close),
                }));
                setData(formattedData);
            } catch (error) {
                console.error('Error fetching candlestick data:', error);
            }
        };

        fetchCandlestickData();
    }, []);

    useEffect(() => {
        if (chartContainerRef.current && data.length) {
            // Create the chart
            const newChart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 500, // Adjusted for additional volume area
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: 'black',
                },
                grid: {
                    vertLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                    },
                    horzLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                    },
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            // Add a candlestick series
            const candleSeries = newChart.addCandlestickSeries();
            candleSeries.setData(data);

            // Add a volume series (Histogram)
            const volumeSeries = newChart.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '',
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            });

            // Format volume data and set it to the series
            const volumeData = data.map(item => ({
                time: item.time,
                value: item.volume,
                color: item.close > item.open ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 82, 82, 0.5)',
            }));
            volumeSeries.setData(volumeData);

            chart.current = newChart;
        }

        return () => {
            // Cleanup chart on component unmount
            if (chart.current) {
                chart.current.remove();
                chart.current = null;
            }
        };
    }, [data]); // Redraw the chart when data changes

    return <div ref={chartContainerRef} style={{ height: '500px', width: '100%' }} />;
}

export default TradingViewCandlestickChart;
