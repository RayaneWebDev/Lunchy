import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'sonner';
import { CgClose } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import {loadStripe} from '@stripe/stripe-js'


const HistoriqueCmd = () => {
  const user = useSelector(state => state.user.user)
  const [orders, setOrders] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  

  const now = new Date();
  const minDate = new Date();
  if (now.getHours() >= 17) {
    minDate.setDate(now.getDate() + 1);
  }
  minDate.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 15);
  maxDate.setHours(23, 59, 59, 999);

  const formatDateLocal = (date) => {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10);
  };

  const fetchUserOrders = async () => {
    try {
      const response = await fetch(SummaryApi.getUserOrders.url, {
        method: SummaryApi.getUserOrders.method,
        credentials: "include"
      });
      const dataApi = await response.json();
      if (dataApi.success) {
        setOrders(dataApi.data);
      } else {
        console.log(dataApi.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateSoldeImpaye = () => (
     orders.filter(order => (order.status === "confirmé" && order.paymentStatus === "impayé")).reduce((total,order) => {
       return total += order.totalPrice;
     },0)
    )


  const handleCancelOrder = async (orderId) => {
    const isConfirmed = window.confirm("Voulez-vous vraiment annuler cette commande ?");
    if (!isConfirmed) return;

    try {
      const response = await fetch(SummaryApi.updateOrderStatus(orderId).url, {
        method: SummaryApi.updateOrderStatus(orderId).method,
        credentials: "include",
      });

      const dataApi = await response.json();
      if (dataApi.success) {
        toast.success(dataApi.message);
        fetchUserOrders();
      } else {
          toast.error(dataApi.message)
          console.log(dataApi.message)
        }
    } catch (error) {
        toast.error("Erreur serveur");
      console.log(error);
    }
  };

  const handleUpdateDate = async () => {
    if (!newDate) return toast.error("Veuillez sélectionner une date.");

    try {
      const response = await fetch(SummaryApi.updateDeliveryDate(selectedOrder._id).url, {
        method: SummaryApi.updateDeliveryDate(selectedOrder._id).method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ dateLivraison: newDate })
      });

      const dataApi = await response.json();
      if (dataApi.success) {
        toast.success("Date mise à jour avec succès !");
        setOpenEdit(false);
        fetchUserOrders();
      } else {
        toast.error("Erreur serveur");
        console.log(dataApi.message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserOrders();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const makeCompanyPayment = async () => {
    const stripe = await stripePromise;
    const unpaidOrders = orders.filter(order =>
        order.status === "confirmé" && order.paymentStatus === "impayé"
      );
    
      if (unpaidOrders.length === 0) {
        return toast.error("Aucune commande impayée à régler.");
      }
    
    const totalAmount = unpaidOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    const unpaidOrderIds = unpaidOrders.map(order => order._id);
    const body = { totalAmount , unpaidOrderIds };

    try {
      const response = await fetch(SummaryApi.createCompanyPayment.url, {
        method: SummaryApi.createCompanyPayment.method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
        credentials: 'include',
      });
  
      const session = await response.json();
  
      if (!session || !session.id) {
        toast.error('Erreur lors de la création de la session de paiement.');
        return;
      }
  
      console.log("Stripe session:", session);
  
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      if (result.error) {
        console.error("Stripe error:", result.error);
        toast.error('Le paiement a échoué, veuillez réessayer.');
      } 
  
      // Pas de toast success ici car la commande sera confirmée côté Stripe → webhook → base de données
  
    } catch (error) {
      console.error("Erreur pendant le paiement:", error);
      toast.error('Une erreur est survenue lors du traitement du paiement.');
    }
  };

  return (
    <div className="p-4 md:py-11 md:px-20">
    <h2 className='text-primary font-bold text-[20px] mb-12 px-3 pt-6'>Vos commandes</h2>

      <div className="mt-12 font-Lato">
        {orders.length > 0 ? (
          isMobile ? (
            orders.map((order, index) => (
              <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow flex flex-col gap-2">
                <p><strong>Commande :</strong> #{order.orderNumber}</p>
                <p><strong>Date livraison :</strong> {formatDateLocal(order.dateLivraison)}</p>
                <p><strong>Statut :</strong> {order.status}</p>
                <p><strong>Paiement :</strong> {order.paymentStatus}</p>
                <p><strong>Total :</strong> {order.totalPrice}€</p>
                <div className="flex justify-between mt-2">
                  <button
                    className="btn btn-sm btn-neutral"
                    onClick={() => {
                      setSelectedOrder(order);
                      setNewDate(formatDateLocal(order.dateLivraison));
                      setOpenEdit(true);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-sm bg-red-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={new Date(order.dateLivraison) <= new Date()}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="table w-full text-center">
                <thead className='bg-gray-200'>
                  <tr>
                    <th>Num Cmd</th>
                    <th>Date de livraison</th>
                    <th>Statut</th>
                    <th>Paiement</th>
                    <th>Montant Total</th>
                    <th>Modifier la date de livraison</th>
                    <th>Annuler</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td>#{order.orderNumber}</td>
                      <td>{formatDateLocal(order.dateLivraison)}</td>
                      <td>{order.status}</td>
                      <td>{order.paymentStatus}</td>
                      <td>{order.totalPrice}€</td>
                      <td>
                        <button
                          className="btn btn-sm btn-neutral hover:opacity-65"
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewDate(formatDateLocal(order.dateLivraison));
                            setOpenEdit(true);
                          }}
                        >
                          Modifier
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm bg-red-500 text-white hover:opacity-65 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={new Date(order.dateLivraison) <= new Date()}
                        >
                          Annuler
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <p>Aucune commande pour le moment.</p>
        )}
      </div>

      {openEdit && selectedOrder && (
        <div className="fixed w-full h-full bg-black bg-opacity-40 top-0 left-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-[400px] shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Modifier la date</h2>
              <CgClose className="text-2xl cursor-pointer" onClick={() => setOpenEdit(false)} />
            </div>
            <label className="block text-sm md:text-base mb-4">Nouvelle date de livraison *</label>
            <input
              type="date"
              className="border p-2 rounded w-full mb-4"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={formatDateLocal(minDate)}
              max={formatDateLocal(maxDate)}
            />
            <button
              onClick={handleUpdateDate}
              className="btn w-full bg-black text-white hover:opacity-75"
            >
              Confirmer la modification
            </button>
          </div>
        </div>
      )}

      {user?.role === "entreprise" && user?.societe != null && (
        <div className='flex flex-col gap-8 mt-10 md:w-[400px]'>
        <div className='flex justify-between text-lg'>
            <h2 className='font-semibold'>Solde total impayé</h2>
            <h2 className='font-extrabold'>{calculateSoldeImpaye()}€</h2>
        </div>
        <button className="btn btn-neutral w-full" onClick={()=>makeCompanyPayment()}>Payer maintenant</button>

      </div>
      )}
    </div>
  );
};

export default HistoriqueCmd;
