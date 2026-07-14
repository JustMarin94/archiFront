import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const fetchAuthor = async (id) => {
  const response = await axios.get(`http://localhost:3000/authors/${id}`);
  return response.data;
};

export default function AuthorDetails() {
  const { id } = useParams();

  const {
    data: author,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["author", id],
    queryFn: () => fetchAuthor(id),
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl">Loading author...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Failed to load author.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Author Image */}
        <img
          src={
            author.photo_url ||
            "https://images.unsplash.com/photo-1520587393050-c5298e1a8486?q=80&w=1200&auto=format&fit=crop"
          }
          alt={author.alt_text || author.full_name}
          className="w-full h-[500px] object-cover"
        />

        <div className="p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold">{author.full_name}</h1>

            <p className="text-lg text-gray-600 mt-2">
              {author.birth_year} –{" "}
              {author.death_year ? author.death_year : "Present"}
            </p>

            {author.caption && (
              <p className="text-gray-600 mt-4">{author.caption}</p>
            )}
          </div>

          {/* Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className=" rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4">Author Information</h2>

              <div className="space-y-3">
                <p>
                  <span className="font-medium">Full Name:</span>{" "}
                  {author.full_name}
                </p>

                <p>
                  <span className="font-medium">Birth Year:</span>{" "}
                  {author.birth_year}
                </p>

                <p>
                  <span className="font-medium">Death Year:</span>{" "}
                  {author.death_year || "Still living"}
                </p>

                <p>
                  <span className="font-medium">Image Caption:</span>{" "}
                  {author.caption || "-"}
                </p>

                <p>
                  <span className="font-medium">Alt Text:</span>{" "}
                  {author.alt_text || "-"}
                </p>
              </div>
            </div>

            <div className=" rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4">Metadata</h2>

              <div className="space-y-3">
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(author.created_at).toLocaleString()}
                </p>

                <p>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(author.updated_at).toLocaleString()}
                </p>

                <p>
                  <span className="font-medium">Author ID:</span>
                  <br />
                  <span className="text-sm break-all">{author.id}</span>
                </p>

                <p>
                  <span className="font-medium">Image ID:</span>
                  <br />
                  <span className="text-sm break-all">{author.image_id}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Image Information */}
          <div className=" rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-4">Image Information</h2>

            <div className="space-y-3">
              <p>
                <span className="font-medium">Caption:</span> {author.caption}
              </p>

              <p>
                <span className="font-medium">Alt Text:</span> {author.alt_text}
              </p>

              <p>
                <span className="font-medium">Position:</span> {author.position}
              </p>

              <p>
                <span className="font-medium">Image Created:</span>{" "}
                {new Date(author.image_created_at).toLocaleString()}
              </p>

              {author.photographer_id && (
                <p>
                  <span className="font-medium">Photographer ID:</span>{" "}
                  {author.photographer_id}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
