export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-lg font-medium text-white">Total Users</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">0</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-lg font-medium text-white">Active Users</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">0</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-lg font-medium text-white">Pending Approvals</h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}