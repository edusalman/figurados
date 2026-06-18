import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Dashboard } from '@/pages/Dashboard'
import { Catalog } from '@/pages/Catalog'
import  PackOpener from '@/pages/PackOpener';
import Stats from '@/pages/Stats';

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