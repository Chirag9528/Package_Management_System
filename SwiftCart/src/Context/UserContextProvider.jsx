import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import userContext from './userContext';

export default function UserContextProvider({children}) {

    const[currUser, setcurrUser] = useState(null);
    const[role,setrole] = useState("");
  return (
    <userContext.Provider value={{currUser,setcurrUser, role, setrole}}>
        {children}
    </userContext.Provider>
  )
}

