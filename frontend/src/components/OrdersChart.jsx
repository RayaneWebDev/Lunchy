import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import SummaryApi from '../common';

const OrdersChart = () => {
  const [chartData, setChartData] = useState({ categories: [], series: [] });

  // Fonction pour obtenir les derniers N jours
  const getLastNDays = (n) => {
    const dates = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().slice(0, 10)); // Format YYYY-MM-DD
    }
    return dates;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const responsedata = await fetch(SummaryApi.ordersPerDay.url, {
          method: SummaryApi.ordersPerDay.method,
          credentials: 'include',
        });

        const responseJson = await responsedata.json();

        if (!responseJson.success || !responseJson.data) {
          throw new Error('Erreur dans les données de la réponse');
        }

        const data = responseJson.data;
        console.log("🚀 Données reçues pour le graphique :", data);

        // Obtenir les 7 derniers jours
        const days = getLastNDays(7);

        // Mapper les revenus par date
        const revenueMap = data.reduce((acc, item) => {
          acc[item._id] = item.totalRevenue;
          return acc;
        }, {});

        // Préparer les catégories et les séries de données
        const categories = days;
        const seriesData = days.map(date => revenueMap[date] || 0);

        setChartData({
          categories,
          series: [
            {
              name: 'Chiffre d\'affaires',
              data: seriesData,
            },
          ],
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
      }
    };

    fetchOrders();
  }, []);

  const chartOptions = {
    chart: {
      type: 'line',
      height: 300,
      fontFamily: 'Inter, sans-serif',
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: '12px',
          colors: ['#9CA3AF'],
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value.toFixed(2)} €`,
        style: {
          fontSize: '12px',
          colors: ['#9CA3AF'],
        },
      },
    },
    stroke: { width: 2 },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${value.toFixed(2)} €`,
      },
    },
    markers: {
      size: 5,
      colors: ['#2563EB'],
      strokeWidth: 0,
    },
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow p-6 ml-8 mt-3">
      <h3 className="text-lg text-black font-bold mb-4">Chiffre d'affaires par jour</h3>
      <Chart options={chartOptions} series={chartData.series} type="line" height={300} />
    </div>
  );
};

export default OrdersChart;
