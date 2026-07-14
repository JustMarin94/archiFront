import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchWorks = async (filters) => {
  const response = await axios.get(`${BASE_URL}/works`, {
    params: {
      title: filters.work || null,
      author: filters.author || null,
      photographer: filters.photographer || null,
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
                "https://images.unsplash.com/photo-1520587393050-c5298e1a8486?q=80&w=687&auto=format&fit=crop"
              }
              alt={
                work.photos?.find((photo) => photo.position === 0)?.alt_text ||
                work.title
              }
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{work.title}</h2>

              <p className="text-gray-600 text-sm mb-4">{work.description}</p>

              <div className="text-sm text-gray-500">
                <p>
                  {work.city}, {work.country}
                </p>

                <p>{work.category}</p>

                <p>{work.typology}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
