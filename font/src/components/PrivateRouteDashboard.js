import React , { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard';
export default function PrivateRouteDashboard() {
  const navigate = useNavigate();
  const getUser = localStorage.getItem('user')
  const user = JSON.parse(getUser)
  console.log(user)
  useEffect(() => {
    if (!user?.user) {
      return navigate('/signin')
    }
  },[])
  return <Dashboard/>
}