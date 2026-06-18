import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Package, BarChart2 } from 'lucide-react'

const navItems = [
  { to: '/',          icon: LayoutDashboard, label: 'Início'    },
  { to: '/catalogo',  icon: BookOpen,        label: 'Catálogo'  },
  { to: '/pacote',    icon: Package,         label: 'Pacote'    },
  { to: '/stats',     icon: BarChart2,       label: 'Stats'     },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors
              ${isActive ? 'text-blue-900' : 'text-gray-400 hover:text-gray-600'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-900' : 'text-gray-400'}`} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}