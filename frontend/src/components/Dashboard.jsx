import React from 'react';
import { useState , useEffect} from 'react';
import { FaDollarSign, FaUsers } from "react-icons/fa";
import { TbUsersPlus } from "react-icons/tb";
import { HiShoppingCart } from "react-icons/hi";
import { GrNotes } from "react-icons/gr";
import SummaryApi from '../common';
import OrdersChart from './OrdersChart';
import OrdersStatusStats from './OrdersStatusStats';
// import OrdersChart from './OrdersChart';
// import SalesByCategoryChart from './CategorySales';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0 ,
        newUsers: 0,
        totalProducts : 0 ,
        recentOrders: [],
      });
    
      const fetchStats = async () => {
        try {
          const response = await fetch(SummaryApi.dashboardStats.url,{
            method : SummaryApi.dashboardStats.method,
            credentials : "include"
          });
          const responseJson = await response.json()
          if(responseJson.success){
            console.log("data dashboard : ",responseJson.data)
            setStats(responseJson.data);
          }
          
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        }
      };
    
      useEffect(() => {
        fetchStats();
      }, []);

  return (
    <div className='flex flex-col gap-5'>
    
    <h1 className="text-[27px] font-bold px-4 py-4">Tableau de bords</h1>
    <div className='flex gap-14'>
             {/* Stats Section */}
      <div className="stats shadow ml-6">
         <div className="stat">
           <div className="stat-figure text-secondary">
             <FaDollarSign className="h-11" />
           </div>
           <div className="stat-title">Revenues</div>
           <div className="stat-value">{stats.totalRevenue}</div>
         </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaUsers className="w-8 h-8" />
            </div>
            <div className="stat-title">Utilisateurs</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <TbUsersPlus className="w-8 h-8" />
            </div>
            <div className="stat-title">Nouvels utilisateurs</div>
            <div className="stat-value">{stats.newUsers}</div>
          </div>
       </div>

    {/* Another Stats Section */}
    <div className="stats shadow ml-6">
      <div className="stat">
        <div className="stat-figure text-secondary">
          <HiShoppingCart className="w-8 h-8" />
        </div>
        <div className="stat-title">Commandes</div>
        <div className="stat-value">{stats.totalOrders}</div>
      </div>
      <div className="stat">
        <div className="stat-figure text-secondary">
          <GrNotes className="w-8 h-8" />
        </div>
        <div className="stat-title">Quantité de menus et produits total</div>
        <div className="stat-value">{stats.totalItems}</div>
      </div>
    </div>

        </div>

     
      {/* Chart Section */} 
      <div className='flex items-center gap-6'>
        <OrdersChart />
        <OrdersStatusStats />
      </div>
    </div>
  );
};

export default Dashboard;
