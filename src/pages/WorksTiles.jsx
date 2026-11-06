import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../api/client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

export default function WorksTiles({ filters }) {
  const {
    data: works = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["works", filters],
    queryFn: () => fetchWorks(filters),
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl">Loading works...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Failed to load works</h1>
      </div>
    );
  }

  return (
    <section className=" min-h-screen w-full p-8">
      {/* PROJECT COUNT */}
      <div className=" w-full p-6 rounded-lg mb-8">
        <h1 className="text-4xl font-semibold">{works.length} Projekta</h1>
      </div>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {works.map((work) => (
          <Link
            key={work.id}
            to={`/works/${work.id}`}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition block"
          >
            <img
              src={
                work.photos?.find((photo) => photo.position === 0)?.url ||
                work.photos?.[0]?.url ||
                "https://plus.unsplash.com/premium_photo-1730910017220-886f29baf378?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              }
              alt={
                work.photos?.find((photo) => photo.position === 0)?.alt_text ||
                work.title
              }
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{work.title}</h2>

              <div className="text-sm text-gray-500">
                <p>{work.city}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
