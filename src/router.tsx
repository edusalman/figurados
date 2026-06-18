import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Dashboard } from '@/pages/Dashboard'
import { Catalog } from '@/pages/Catalog'
import  PackOpener from '@/pages/PackOpener';
import Stats from '@/pages/Stats';

const Placeholder = ({ title }: { title: string }) => (
  <div className="p-6 text-center text-gray-500 font-medium">{title}</div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,      element: <Dashboard />                        },
      { path: 'catalogo', element: <Catalog />                          },
      { path: 'stats',    element: <Stats />                            },
      { path: 'pacote',   element: <PackOpener />,                      },
    ],
  },
])