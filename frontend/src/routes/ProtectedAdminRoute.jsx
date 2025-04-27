import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedAdminRoute = ({ children }) => {
  const user = useSelector(state => state.user.user);
  
  if (!user || user.role !== "admin") {
    return <Navigate to="/not-found" />
  }

  return children;
}

export default ProtectedAdminRoute
