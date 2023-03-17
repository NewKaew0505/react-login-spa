import React, { useRef, useState, useContext } from 'react';
import {Card, Form, Button, Alert} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../api/user'

export default function Signin() {
  
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(false);
  const {signin} = useAuth();
  const navigate = useNavigate();
  const verbose = true;

  
  async function submitHandler(e) {
    e.preventDefault()
    setWaiting(true)
  
    try {
      const formData = {
        username : usernameRef.current.value,
        password : passwordRef.current.value
      }
      const result = await login(formData)
      if(result?.response?.status === 500) {
        throw new Error(result.response.data.message)
      }
      signin(result.data.data)
      navigate('/')
    } catch (err){
      setError(verbose ? err.message : 'Failed created the account')
      
    } 
    setWaiting(false)
  }

  return (
    <>
<Card>
<Card.Body>
  <h3 className='text-center mb-2'>Sign In</h3>
  {error && <Alert variant='danger'>{error}</Alert>}
  <Form onSubmit={submitHandler}>
    <Form.Group id='username'>
      <Form.Label>Username</Form.Label>
      <Form.Control type='username' ref={usernameRef} required></Form.Control>
    </Form.Group>
    <Form.Group id='password'>
      <Form.Label>Password</Form.Label>
      <Form.Control type='password' ref={passwordRef} required></Form.Control>
    </Form.Group>
    <Button type='submit' className='w-100 mt-2' disabled={waiting}>Sign In</Button>
  </Form>
</Card.Body>
</Card>
<div className='w-100 text-center mt-2'>
  Don't have an account yet ? <Link to='/signup'>Sign Up</Link> instead.
  </div>
  </>);
}