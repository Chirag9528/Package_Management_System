import React, { useState } from 'react'
import userContext from './userContext';

export default function UserContextProvider({children}) {

    const[currUser, setcurrUser] = useState(null);
  return (
    <userContext.Provider value={{currUser,setcurrUser}}>
        {children}
    </userContext.Provider>
  )
}

