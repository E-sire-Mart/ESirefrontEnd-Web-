import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

type SidebarItem = { key: string; label: string; count?: number; icon?: React.ReactNode };

type DashboardLayoutProps = {
  title?: string;
  children: React.ReactNode;
  sidebarItems?: SidebarItem[];
  activeItemKey?: string;
  onItemSelect?: (key: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
};

export default function DashboardLayout({ title = 'Dashboard', children, sidebarItems, activeItemKey, onItemSelect, notificationCount = 0, onNotificationClick }: DashboardLayoutProps) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : 'light'}`}>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h1>
            {onNotificationClick && (
              <button
                onClick={onNotificationClick}
                className={`relative p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-600'} transition-colors duration-200`}
                title="Notifications"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 10.5a5.5 5.5 0 1 1 11 0v5.5l5 5H4.5l5-5v-5.5z" />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-12 gap-6 items-stretch">
          <aside className="col-span-12 md:col-span-3 h-full">
            <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-3 space-y-1 h-[900px] overflow-y-auto flex flex-col`}>
              {sidebarItems && sidebarItems.length > 0 ? (
                sidebarItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onItemSelect && onItemSelect(item.key)}
                    className={`w-full px-3 py-2 rounded text-sm flex items-center justify-between transition-colors duration-200 ${
                      activeItemKey === item.key
                        ? isDark 
                          ? 'bg-blue-600 text-white border border-blue-500' 
                          : 'bg-green-50 text-green-700 border border-green-200'
                        : isDark
                          ? 'hover:bg-gray-700 text-gray-200'
                          : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.icon ? <span className="text-base">{item.icon}</span> : null}
                      <span>{item.label}</span>
                    </span>
                    {typeof item.count === 'number' && item.count > 0 ? (
                      <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-green-600 text-white text-xs px-2">
                        {item.count}
                      </span>
                    ) : null}
                  </button>
                ))
              ) : (
                <>
                  <a className={`block px-3 py-2 rounded ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`} href="/profile">My Profile</a>
                  <a className={`block px-3 py-2 rounded ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`} href="/orders">Orders</a>
                  <a className={`block px-3 py-2 rounded ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`} href="/payments">Payments</a>
                  <a className={`block px-3 py-2 rounded ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`} href="/addresses">Addresses</a>
                </>
              )}
            </nav>
          </aside>
          <main className="col-span-12 md:col-span-9 h-full">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4 h-[900px] overflow-y-auto`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


