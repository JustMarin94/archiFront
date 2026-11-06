import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { api } from "../api/client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const categoryColors = {
  celebrated: "gold",
  documented: "blue",
  vanished: "red",
};

const fetchWorks = async (filters) => {
  const response = await api.get(`${BASE_URL}/works`, {
    params: {
      title: filters.title || undefined,
      typology: filters.typology || undefined,
      awards: filters.awards || undefined,
      author: filters.author || undefined,
      region: filters.region || undefined,
      yearStart: filters.yearStart || undefined,
      yearEnd: filters.yearEnd || undefined,
    },
  });

  return response.data;
};

export default function Map() {
  const [searchParams] = useSearchParams();
  const [isInteractive, setIsInteractive] = useState(false);

  // Reconstruct filters from the URL so the query key matches WorksTiles
  const filters = {
    title: searchParams.get("title") || "",
    typology: searchParams.get("typology") || "",
    awards: searchParams.get("awards") || "",
    author: searchParams.get("author") || "",
    region: searchParams.get("region") || "",
    yearStart: searchParams.get("yearStart")
      ? Number(searchParams.get("yearStart"))
      : null,
    yearEnd: searchParams.get("yearEnd")
      ? Number(searchParams.get("yearEnd"))
      : null,
  };

  const { data: locations = [] } = useQuery({
    queryKey: ["works", filters],
    queryFn: () => fetchWorks(filters),
  });

  return (
    <div className="w-full">
      {/* Styled Hero Header */}
      <section className="flex flex-col justify-center items-center text-center px-6 mb-16 mt-20">
        <h1
          className="
            text-4xl
            md:text-7xl
            font-black
            uppercase
            tracking-tight
            max-w-5xl
          "
        >
          Lokacije
        </h1>

        <p
          className="
            mt-6
            text-lg
            md:text-2xl
            max-w-2xl
            leading-relaxed
            text-gray-600
          "
        >
          Istražite arhitektonska djela kroz interaktivnu kartu Jadrana
        </p>
      </section>

      {/* Map Section with Container Styling */}
      <div className="px-6 mb-24 max-w-7xl mx-auto">
        <div
          onClick={() => setIsInteractive(true)}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
        >
          {/* Overlay hint when scroll zoom is locked */}
          {!isInteractive && (
            <div className="absolute inset-0 z-[1000] flex justify-center items-center bg-black/10 backdrop-blur-[2px] pointer-events-none transition-opacity">
              <span className="bg-white/90 text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg text-sm uppercase tracking-wider">
                Kliknite za interakciju s kartom
              </span>
            </div>
          )}

          <MapContainer
            center={[43.5081, 16.4402]} // Centered nicely around the Adriatic/Split region
            zoom={7}
            scrollWheelZoom={isInteractive}
            style={{ height: "70vh", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png"
            />

            {locations
              .filter(
                (location) =>
                  typeof location.latitude === "number" &&
                  typeof location.longitude === "number",
              )
              .map((location, index) => {
                const color = categoryColors[location.category] || "red";

                return (
                  <CircleMarker
                    key={location.id || index}
                    center={[location.latitude, location.longitude]}
                    radius={8}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.9,
                    }}
                  >
                    <Popup>
                      <strong>{location.title}</strong>
                      <br />
                      Category: {location.category}
                    </Popup>
                  </CircleMarker>
                );
              })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
