import CodeLogo from '@/components/CodeLogo';
import Link from 'next/link';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <CodeLogo />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-center text-white mb-2">Reset Password</h2>
            <p className="text-gray-400 text-center text-sm mb-6">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>
          </div>

          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition">
            Send Reset Instructions
          </button>

          <div className="text-center text-sm text-gray-400">
            Remember your password?{' '}
            <Link href="/" className="text-orange-400 hover:text-orange-300">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}