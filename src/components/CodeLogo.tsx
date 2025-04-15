export default function CodeLogo() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600">
            Hills
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Ride
          </span>
        </h1>
        <div className="absolute -top-3 -right-3 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute -bottom-3 -left-3 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
      </div>
      <div className="mt-2 text-sm font-light tracking-widest text-gray-400 uppercase">
        Administrative Portal
      </div>
    </div>
  );
}