import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";
import FilterPage from "./pages/FilterPage";

export default function App() {
  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className=" min-h-125 flex flex-col justify-center items-center text-center px-6 mb-60 mt-30">
        <h1
          className="
      text-6xl
      md:text-8xl
      font-black
      uppercase
      tracking-tight
      max-w-5xl
    "
        >
          Arhitektura Jadrana
        </h1>

        <p
          className="
      mt-8
      text-xl
      md:text-7xl
      max-w-3xl
      leading-relaxed
      text-gray-700
    "
        >
          Digitalni arhiv izvrsnosti
        </p>
      </section>
      <FilterPage />
      <Footer />
    </>
  );
}
