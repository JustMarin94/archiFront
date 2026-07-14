import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import WorksCarousel from "./components/WorksCarousel";
import AuthorsCarousel from "./components/AuthorsCarousel";
import PhotographersCarousel from "./components/PhotographersCarousel";
import Footer from "./components/Footer";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchLocations = async () => {
  const response = await axios.get(`${BASE_URL}/works/locations`);
  return response.data;
};

export default function App() {
  const [openMenu, setOpenMenu] = useState(false);

  const {
    data: locations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  if (isLoading) {
    return <div>Loading map...</div>;
  }

  if (isError) {
    return <div>Failed to load locations</div>;
  }

  return (
    <>
      {/* Navbar */}
      <nav className="relative h-24 flex justify-center items-center">
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="flex flex-col gap-2"
        >
          <span className="w-10 h-1 bg-black"></span>
          <span className="w-10 h-1 bg-black"></span>
          <span className="w-10 h-1 bg-black"></span>
        </button>

        {openMenu && (
          <div className="absolute top-24 bg-white shadow-xl p-8 flex flex-col gap-5 z-50">
            <Link to="/" className="text-xl font-bold uppercase">
              Početna
            </Link>

            <Link to="/filter" className="text-xl font-bold uppercase">
              Pretraga
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className=" min-h-[500px] flex flex-col justify-center items-center text-center px-6">
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
          Arheološka evidencija
        </h1>

        <p
          className="
      mt-8
      text-lg
      md:text-xl
      max-w-3xl
      leading-relaxed
      text-gray-700
    "
        >
          Digitalna mapa arheoloških nalaza koja povezuje projekte, autore i
          fotografe na jednom mjestu.
        </p>

        <button
          className="
      mt-10
      bg-black
      text-white
      px-10
      py-5
      font-bold
      uppercase
      tracking-wide
      text-lg
    "
        >
          Istraži mapu
        </button>
      </section>

      {/* Categories */}
      <section
        className="
    w-full
    py-20
    grid
    grid-cols-1
    md:grid-cols-3
    text-center
    gap-10
  "
      >
        <div>
          <h2 className="text-6xl font-black">1565</h2>
          <p className="mt-2 text-lg uppercase font-bold tracking-wide">
            Projekata
          </p>
        </div>

        <div>
          <h2 className="text-6xl font-black">154</h2>
          <p className="mt-2 text-lg uppercase font-bold tracking-wide">
            Autora
          </p>
        </div>

        <div>
          <h2 className="text-6xl font-black">352</h2>
          <p className="mt-2 text-lg uppercase font-bold tracking-wide">
            Fotografa
          </p>
        </div>
      </section>

      {/* Map title */}
      <section
        className="
   
    py-24
    flex
    justify-center
    items-center
    text-center
    px-6
  "
      >
        <h2
          className="
      text-6xl
      md:text-8xl
      font-black
      uppercase
      tracking-tight
    "
        >
          Mapa Arheoloških Nalaza
        </h2>
      </section>

      {/* Map */}
      <MapContainer
        center={[45.815, 15.9819]}
        zoom={5}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png"
        />

        {locations.map((location, index) => (
          <CircleMarker
            key={index}
            center={[location.latitude, location.longitude]}
            radius={8}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 1,
            }}
          />
        ))}
      </MapContainer>
      <WorksCarousel />
      <AuthorsCarousel />
      <PhotographersCarousel />
      <Footer />
    </>
  );
}
