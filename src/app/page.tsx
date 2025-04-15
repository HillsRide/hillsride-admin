import CodeLogo from '@/components/CodeLogo';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Admin Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <CodeLogo />
          <div className="mt-2 text-gray-400 text-sm">Admin Dashboard</div>
        </div>

        {/* Admin Login Form */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-white mb-8">Admin Access</h1>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Admin Email</label>
              <input
                type="email"
                placeholder="admin@hillsride.com"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            Access Admin Panel
          </button>

          <div className="text-center text-sm text-gray-400">
            Secure Admin Access Only
          </div>
        </div>
      </div>
    </div>
  );
}
