import CodeLogo from '@/components/CodeLogo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <CodeLogo />
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            Access Your Dashboard
          </button>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/create-user" className="text-orange-400 hover:text-orange-300">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
