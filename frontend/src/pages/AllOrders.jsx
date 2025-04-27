import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';

const AllOrders = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  const formatDateLocal = (date) => {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10);
  };

  const getAllOrders = async () => {
    try {
      const response = await fetch(SummaryApi.getAllOrders.url, {
        method: SummaryApi.getAllOrders.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const responseJson = await response.json();
      if (responseJson.success) {
        setData(responseJson.data);
      } else {
        console.error('Erreur dans getAllOrders:', responseJson.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  };

  

  

  useEffect(() => {
    getAllOrders();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredData(
        data.filter((order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredData(data); 
    }
  }, [searchQuery, data]);
  

  return (
    <div className='font-Lato p-4'>
      <div className="hero flex flex-col gap-3 items-start">
        <h1 className="text-[27px] font-bold">Commandes</h1>
        <p>Voir toutes les commandes passées avec leur statut</p>

        <div className="flex gap-5 items-center justify-between pb-4">

          <div className="relative">
            <input
              type="text"
              id="table-search"
              className="block p-2 ps-10 text-sm text-black border border-black rounded-xl"
              placeholder="Rechercher par ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center w-full h-40">
            <h1 className="text-lg">Aucune commande trouvée</h1>
          </div>
        ) : (
          <table className="table w-full text-center">
            <thead className="bg-gray-200">
              <tr>
                <th>Num Cmd</th>
                <th>Client</th>
                <th>Type</th>
                <th>Date livraison</th>
                <th>Statut</th>
                <th>Paiement</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((order) => (
                <tr key={order._id}>
                  <td className='font-semibold'>#{order.orderNumber}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>{order.user?.role || 'N/A'}</td>
                  <td>{formatDateLocal(order.dateLivraison)}</td>
                  <td><span className={`px-3 py-1 rounded-lg ${order.status == 'annulée' ? 'bg-red-500' : ''}`}>{order.status}</span></td>
                  <td><span className={`px-3 py-1 rounded-lg ${order.paymentStatus == 'payé' ? 'bg-green-500' : ''}`}>{order.paymentStatus}</span></td>
                  <td className='font-semibold'>{Number(order.totalPrice).toFixed(2)}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
