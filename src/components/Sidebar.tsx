'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  {
    icon: '👥', 
    label: 'Users', 
    subMenu: [
      { label: 'Employees', href: '/dashboard/users/employees' },
      { label: 'Drivers', href: '/dashboard/users/drivers' },
      { label: 'Partners', href: '/dashboard/users/partners' },
      { label: 'Customers', href: '/dashboard/users/customers' },
    ]
  },
  { icon: '📝', label: 'Reports', href: '/dashboard/reports' },
  { icon: '⚙️', label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState('Users');

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-slate-800/50 backdrop-blur-lg border-r border-white/10">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              {item.subMenu ? (
                <div>
                  <button
                    onClick={() => setExpandedMenu(expandedMenu === item.label ? '' : item.label)}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-gray-300 hover:bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className={`transform transition-transform ${expandedMenu === item.label ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedMenu === item.label && (
                    <ul className="mt-2 ml-11 space-y-2">
                      {item.subMenu.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={`block px-4 py-2 rounded-lg transition ${
                              pathname === subItem.href
                                ? 'bg-orange-500 text-white'
                                : 'text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
                    pathname === item.href
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}