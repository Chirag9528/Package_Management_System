import './App.css'
import {Outlet} from 'react-router-dom'

function App() {
  return (
    <>
      <div className='text-5xl font-bold underline'>
        Hello World
      </div>
      <main>
        <Outlet/>
      </main>
    </>
  )
}

export default App
