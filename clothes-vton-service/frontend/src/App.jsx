import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VirtualTryOn from './VirtualTryOn'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <VirtualTryOn />
    </>
  )
}

export default App
