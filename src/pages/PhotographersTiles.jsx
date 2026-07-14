import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const fetchPhotographers = async (filters) => {
  const response = await axios.get("http://localhost:3000/photographers", {
    params: {
      full_name: filters.author || null,
      title: filters.work || null,
      photographer: filters.photographer || null,
    },
  });

  return response.data;
};

export default function PhotographersTiles({ filters }) {
  const {
    data: photographers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["photographers", filters],
    queryFn: () => fetchPhotographers(filters),
  });

  console.log("Photographers data:", filters);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl">Loading photographers...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Failed to load photographers</h1>
      </div>
    );
  }

  return (
    <section className=" min-h-screen w-full p-8">
      {/* PHOTOGRAPHER COUNT */}
      <div className=" w-full p-6 rounded-lg mb-8">
        <h1 className="text-4xl font-semibold">
          {photographers.length} Photographers
        </h1>
      </div>

      {/* PHOTOGRAPHER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photographers.map((photographer) => (
          <Link
            key={photographer.id}
            to={`/photographers/${photographer.id}`}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition block"
          >
            <img
              src={
                photographer.photo_url ||
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
              }
              alt={photographer.alt_text || photographer.full_name}
              className="w-full h-64 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold mb-3">
                {photographer.full_name}
              </h2>

              <div className="text-sm text-gray-500">
                <p>{photographer.birth_year}</p>

                {photographer.birth_place && (
                  <p className="mt-1">{photographer.birth_place}</p>
                )}

                {photographer.caption && (
                  <p className="mt-2 text-gray-600">{photographer.caption}</p>
                )}

                {photographer.biography && (
                  <p className="mt-2 text-gray-600 line-clamp-3">
                    {photographer.biography}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
