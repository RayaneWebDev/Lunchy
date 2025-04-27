import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/index';
import { toast } from 'sonner';

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // 🔍 Barre de recherche

  const fetchAllUsers = async () => {
    try {
      const fetchData = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: 'include',
      });

      const dataResponse = await fetchData.json();

      if (dataResponse.success) {
        setAllUsers(dataResponse.data);
        console.log(dataResponse.data);
      }

      if (dataResponse.error) {
        toast.error(dataResponse.message);
        console.log(dataResponse.message);
      }
    } catch (error) {
      console.log('Erreur dans get users');
    }
  };

  const blockUser = async (userId) => {
    const isConfirmed = window.confirm("Veuillez confirmer");
        
    if (!isConfirmed) return;
    try {
      const response = await fetch(SummaryApi.blockUser(userId).url, {
        method: SummaryApi.blockUser(userId).method,
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchAllUsers();
      } else {
        toast.error(result.message);
        console.log(result.message);
      }
    } catch (error) {
      toast.error("Erreur lors du blocage de l'utilisateur");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // 🧠 Filtrage des utilisateurs selon la recherche
  const filteredUsers = allUser.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='bg-white pb-4 font-Lato'>
      <h1 className='text-[27px] font-bold px-4 py-4'>Utilisateurs</h1>

      <div className="relative w-full max-w-xs mb-7 mx-5">
            <input
              type="text"
              id="table-search"
              className="block w-full p-2 ps-10 text-sm text-black border border-black rounded-xl"
              placeholder="Rechercher par nom prénom"
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

      <div className="overflow-x-auto">
        <table className="table">
          <thead className='bg-gray-200'>
            <tr>
              <th>Nom</th>
              <th>Email et adresse</th>
              <th>Personne</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm opacity-50">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.email}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {user.address + ' ' + user.zip_code}
                    </span>
                  </td>
                  <td className="font-semibold">{user.role}</td>
                  <td>
                    <button
                      className={`${
                        user.isBlocked ? 'bg-blue-600' : 'bg-red-600'
                      } text-white p-2 font-semibold text-xs rounded-md`}
                      onClick={() => blockUser(user._id)}
                    >
                      {user.isBlocked ? 'Débloquer' : 'Bloquer'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
