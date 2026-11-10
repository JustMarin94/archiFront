import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";
import FilterPage from "./pages/FilterPage";
import Map from "./shared/Map";
import { useTranslation } from "react-i18next"; // <--- Import hook

export default function App() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="min-h-125 flex flex-col justify-center items-center text-center px-6 mb-60 mt-30">
        <h1 className="text-3xl md:text-8xl font-black uppercase tracking-tight max-w-5xl">
          {t("home.title")}
        </h1>

        <p className="mt-8 text-xl md:text-7xl max-w-3xl leading-relaxed text-gray-700">
          {t("home.subtitle")}
        </p>
      </section>
      <FilterPage />
      <Map />
      <Footer />
    </>
  );
}
