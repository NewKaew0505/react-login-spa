import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import {Card, Button, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  
  const getUser = localStorage.getItem('user')
  const user = JSON.parse(getUser)
  const { logout} = useAuth()
  console.log(user)
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate()
  const verbose = true;
  
  function handleLogout(){
      setWaiting(true)
      try {
        logout()
        navigate('/signin')
      } catch (err){
        setError(verbose ? err.message : 'Failed created the account')
    }
      setWaiting(false)
  }

  return (
  <>
    <h2 className='text-center mb-2'>Dashboard</h2>
    {error && <Alert variant='danger'>{error}</Alert>}

  <Card>

      <Card.Body>
      <div className='text-center mb-2'>
        <img  src={`${process.env.REACT_APP_API}/${user?.user?.img}`} width="150px"/>
      </div>
      <h3 className='text-center mb-2'>Username : {user?.user?.username}</h3>
      <h3 className='text-center mb-2'>First name : {user?.user?.firstName}</h3>
      <h3 className='text-center mb-2'>Last name : {user?.user?.lastName}</h3>
      </Card.Body>
  </Card>
  <div className='w-100 text-center mt-2'>
    <Link to='/edit'>Edit Profile</Link>
  </div>
  <div className='w-100 text-center mt-2'>
  <Button variant='link' disabled={waiting} onClick={handleLogout}>Log out</Button>
  </div>
  </>)
}
