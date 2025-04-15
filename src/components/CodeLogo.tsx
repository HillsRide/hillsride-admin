export default function CodeLogo() {
  return (
    <div className="relative group">
      <div className="text-5xl font-bold relative z-10">
        <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-white bg-clip-text text-transparent 
          animate-gradient-x">Hills</span>
        <span className="bg-gradient-to-r from-white via-orange-400 to-orange-500 bg-clip-text text-transparent 
          animate-gradient-x">Ride</span>
      </div>
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg blur opacity-30 
        group-hover:opacity-60 transition duration-1000"></div>
      <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-white rounded-lg blur-xl opacity-20 
        group-hover:opacity-40 animate-pulse"></div>
    </div>
  );
}