// src/layouts/MainLayout.jsx
import Footer from "./pages/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="pb-28">
      {children}
      <Footer />
    </div>
  );
}
