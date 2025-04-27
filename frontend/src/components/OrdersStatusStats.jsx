import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import SummaryApi from '../common';

ChartJS.register(ArcElement, Tooltip, Legend);

const OrdersStatusStats = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les statistiques depuis le backend
        const response = await fetch(SummaryApi.ordersStatusStats.url, {
          method: SummaryApi.ordersStatusStats.method,
          credentials: 'include',
        });
        const responseJson = await response.json();
        if (responseJson.success) {
          console.log('data stats : ', responseJson.data);
          setData(responseJson.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log("Data received: ", data); // Log des données

  // Convertir les valeurs en nombres
  const confirmedOrders = Number(data.confirmedOrders) || 0;
  const cancelledOrders = Number(data.cancelledOrders) || 0;
  const paidOrders = Number(data.paidOrders) || 0;
  const unpaidOrders = Number(data.unpaidOrders) || 0;

  // Calcul des pourcentages pour le diagramme "Commandes Confirmées vs Annulées"
  const totalConfirmed = confirmedOrders + cancelledOrders;
  const cancelledPercentage = totalConfirmed === 0 ? 0 : (cancelledOrders / totalConfirmed) * 100;
  const confirmedPercentage = totalConfirmed === 0 ? 0 : (confirmedOrders / totalConfirmed) * 100;

  // Calcul des pourcentages pour le diagramme "Commandes Payées vs Impayées"
  const totalPaid = paidOrders + unpaidOrders;
  const unpaidPercentage = totalPaid === 0 ? 0 : (unpaidOrders / totalPaid) * 100;
  const paidPercentage = totalPaid === 0 ? 0 : (paidOrders / totalPaid) * 100;

  // Diagramme des commandes confirmées et annulées
  const cancelledData = {
    labels: [
      `Commandes Confirmées (${confirmedPercentage.toFixed(1)}%)`,
      `Commandes Annulées (${cancelledPercentage.toFixed(1)}%)`,
    ],
    datasets: [
      {
        data: [confirmedOrders, cancelledOrders],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  // Diagramme des commandes payées et impayées
  const unpaidData = {
    labels: [
      `Commandes Payées (${paidPercentage.toFixed(1)}%)`,
      `Commandes Impayées (${unpaidPercentage.toFixed(1)}%)`,
    ],
    datasets: [
      {
        data: [paidOrders, unpaidOrders],
        backgroundColor: ['#4CAF50', '#FF9800'],
      },
    ],
  };

  return (
    <div>
      <h2>Statistiques des Commandes</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h3>Commandes Confirmées vs Annulées</h3>
          <Doughnut data={cancelledData} />
        </div>
        <div>
          <h3>Commandes Payées vs Impayées</h3>
          <Doughnut data={unpaidData} />
        </div>
      </div>
    </div>
  );
};

export default OrdersStatusStats;
