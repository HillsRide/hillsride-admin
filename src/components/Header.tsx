'use client';
import HeaderLogo from './HeaderLogo';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-slate-800/50 backdrop-blur-lg border-b border-white/10 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-2">
          <HeaderLogo />
         
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white">
            <span className="sr-only">Notifications</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}