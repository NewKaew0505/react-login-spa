import React, { useState, useContext } from 'react';
const authContext = React.createContext();

export function useAuth() {
  return useContext(authContext)
}


export default function AuthProvider({children}) {

  const [user,setUser] = useState()

  function signin (data){
    console.log('sign in')
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
  }

  function editProfile (data) {
    console.log('edit')
    localStorage.removeItem('user')
    setUser(false)
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
  }

  function logout(){
    
    console.log('logout')
    localStorage.removeItem('user')
    setUser(false)
    
  }

  const value = {user, signin, editProfile, logout};

  return <authContext.Provider value={value} >
            {children}
         </authContext.Provider>
}
