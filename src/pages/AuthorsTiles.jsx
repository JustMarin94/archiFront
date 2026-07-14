import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchAuthors = async (filters) => {
  const response = await axios.get(`${BASE_URL}/authors`, {
    params: {
      title: filters.work || null,
      full_name: filters.author || null,
      photographer: filters.photographer || null,
    },
  });

  return response.data;
};

export default function AuthorsTiles({ filters }) {
  const {
    data: authors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authors", filters],
    queryFn: () => fetchAuthors(filters),
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl">Loading authors...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Failed to load authors</h1>
      </div>
    );
  }

  return (
    <section className=" min-h-screen w-full p-8">
      {/* AUTHOR COUNT */}
      <div className=" w-full p-6 rounded-lg mb-8">
        <h1 className="text-4xl font-semibold">{authors.length} Authors</h1>
      </div>

      {/* AUTHOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {authors.map((author) => (
          <Link
            key={author.id}
            to={`/authors/${author.id}`}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition block"
          >
            <img
              src={
                author.photo_url ||
                "https://images.unsplash.com/photo-1520587393050-c5298e1a8486?q=80&w=687&auto=format&fit=crop"
              }
              alt={author.alt_text || author.full_name}
              className="w-full h-64 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold mb-3">{author.full_name}</h2>

              <div className="text-sm text-gray-500">
                <p>
                  {author.birth_year}
                  {author.death_year ? ` – ${author.death_year}` : " – Present"}
                </p>

                {author.caption && (
                  <p className="mt-2 text-gray-600">{author.caption}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
