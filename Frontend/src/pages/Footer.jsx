export default function Footer() {
  return (
    <footer className="w-full bg-white/5 backdrop-blur-lg border-t border-white/10 py-8 z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm text-white/90">
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-xl flex flex-col items-center text-center">

          <h4 className="font-bold text-xl mb-2 text-blue-300 flex items-center gap-2">🚓 Police Emergency</h4>
          <p>
            Toll-Free:{" "}
            <a
              href="tel:999"
              className="font-extrabold text-red-400 underline hover:text-red-300 transition-colors duration-200 text-lg"
            >
              911
            </a>
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-xl flex flex-col items-center text-center">
          <h4 className="font-bold text-xl mb-2 text-blue-300 flex items-center gap-2">🔥 Fire Department</h4>
          <p>
            Call now:{" "}
            <a
              href="tel:0722111178"
              className="font-extrabold text-red-400 underline hover:text-red-300 transition-colors duration-200 text-lg"
            >
              0722 111 178
            </a>
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-xl flex flex-col items-center text-center">
          <h4 className="font-bold text-xl mb-2 text-blue-300 flex items-center gap-2">🚑 Ambulance Services</h4>
          <p>
            Toll-Free:{" "}
            <a
              href="tel:444"
              className="font-extrabold text-red-400 underline hover:text-red-300 transition-colors duration-200 text-lg"
            >
              999
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}


