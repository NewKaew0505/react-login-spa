import React, { useEffect, useRef, useState } from 'react';
import {Card, Form, Button, Alert} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { edit } from '../api/user'

export default function Signup() {

  const navigate = useNavigate();
  const { editProfile , logout } = useAuth()
  const getUser = localStorage.getItem('user')
  const user = JSON.parse(getUser)
  
  useEffect(() => {
    if (!user?.user) {
      return navigate('/signin')
    }
  },[])

  // console.log(user)
  console.log(user?.user)
  const usernameRef = useRef();
  const passwordRef = useRef();
  const first_nameRef = useRef();
  const last_nameRef = useRef();
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [img, setImg] = useState(null)
  const verbose = true;

  const changeHandler = (e) => {
    const { files } = e.target
    setImg(files[0])
  }

  const imageMimeType = /image\/(png|jpg|jpeg|bmp)/i;

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
  
  async function submitHandler(e) {
  e.preventDefault()
  
  setWaiting(true)

  try {
    if (usernameRef.current.value.length < 4)
      throw new Error('Username is too short')
    else if (usernameRef.current.value.length > 12)
      throw new Error('Username is too long')
    else if (!Boolean(usernameRef.current.value.match(/^[A-Za-z0-9_]*$/)))
      throw new Error('Username is not [A-Z, a-z, 0-9, _]')
    
    if(passwordRef.current.value.length < 6)
      throw new Error('Password is too short')
    
    const s = passwordRef.current.value
    for(let i in s) {
      if (+s[+i+1] === +s[i]+1 && 
        +s[+i+2] === +s[i]+2) throw new Error('Password invalid');
    }
    for(var i in s) 
        if (String.fromCharCode(s.charCodeAt(i)+1) === s[+i+1] && 
            String.fromCharCode(s.charCodeAt(i)+2) === s[+i+2]) throw new Error('Password invalid');
    
    if(first_nameRef.current.value.length > 60)
      throw new Error('First Name is too long')
    
    if(last_nameRef.current.value) {
      if(last_nameRef.current.value.length > 60)
        throw new Error('Last Name is too long')
    }
    console.log(img)
    if (img && !img.type.match(imageMimeType)) 
      throw new Error('')

    const formData = new FormData()
    formData.append('img', img)
    formData.append('firstName', first_nameRef.current.value)
    formData.append('lastName', last_nameRef.current.value)
    formData.append('username', usernameRef.current.value)
    formData.append('password', passwordRef.current.value)
    console.log(formData)

    const result = await edit(formData)
    if(result?.response?.status === 500) {
      throw new Error(result.response.data.message)
    }
    console.log(result.data.data)
    editProfile(result.data.data)
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
  <h3 className='text-center mb-2'>Edit Profile</h3>
  {error && <Alert variant='danger'>{error}</Alert>}
  <Form onSubmit={submitHandler}>
  <Form.Group id="img1">
      <img src={`${process.env.REACT_APP_API}/${user?.user?.img}`} width="150px"/>
    </Form.Group>
    <Form.Group id='username'>
      <Form.Label>Username</Form.Label>
      <Form.Control type='username' ref={usernameRef} value={user?.user?.username} disabled required></Form.Control>
    </Form.Group>
    <Form.Group id='password'>
      <Form.Label>Password</Form.Label>
      <Form.Control type='password' ref={passwordRef} required></Form.Control>
    </Form.Group>
    <Form.Group id='first_name'>
      <Form.Label>First Name</Form.Label>
      <Form.Control type='text' ref={first_nameRef} defaultValue={user?.user?.firstName} required></Form.Control>
    </Form.Group>
    <Form.Group id='last_name'>
      <Form.Label>Last Name</Form.Label>
      <Form.Control type='text' ref={last_nameRef} defaultValue={user?.user?.lastName}></Form.Control>
    </Form.Group>
    <Form.Group id='img'>
      <Form.Label>Profile Image</Form.Label>
      <Form.Control type="file" onChange={changeHandler}/>
    </Form.Group>
    <Button type='submit' className='w-100 mt-2' disabled={waiting}>Update Profile</Button>
  </Form>
</Card.Body>
</Card>
<div className='w-100 text-center mt-2'>
  <Button variant='link' disabled={waiting} onClick={handleLogout}>Log out</Button>
  </div>
  </>);
}
