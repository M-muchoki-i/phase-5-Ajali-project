export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-red-700 text-white py-4 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <h4 className="font-semibold text-lg">🚓 Police Emergency</h4>
          <p>
            Toll-Free:{" "}
            <a
              href="tel:911"
              className="font-bold underline hover:text-gray-200"
            >
              911
            </a>
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg">🔥 Fire Department</h4>
          <p>
            Call now:{" "}
            <a
              href="tel:0722111178"
              className="font-bold underline hover:text-gray-200"
            >
              0722 111 178
            </a>
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg">🚑 Ambulance Services</h4>
          <p>
            Toll-Free:{" "}
            <a
              href="tel:999"
              className="font-bold underline hover:text-gray-200"
            >
              999
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
