import { useEffect, useState } from 'react'

import api from './api/clients.js'

function App() {
  const [data, setData] = useState(null)
  useEffect(() => {
    api.get('/test')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Connected Springboot successfully</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}


export default App
