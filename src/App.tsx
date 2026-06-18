import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toaster } from 'sonner';
<Toaster position="top-center" richColors />


function App() {
  return <RouterProvider router={router} />
}

export default App