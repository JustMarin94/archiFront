import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import Navbar from "../shared/Navbar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchAuthor = async (id) => {
  const response = await api.get(`${BASE_URL}/authors/${id}`);
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
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-neutral-500">Loading author...</p>
        </div>
      </>
    );
  }

  if (isError || !author) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-red-500">Failed to load author.</p>
        </div>
      </>
    );
  }

  const photos = [...(author.photos || [])].sort(
    (a, b) => a.position - b.position,
  );

  const photo = photos[0];

  const authorName = author.full_name || author.name || "Unknown Author";

  const heroImage =
    photo?.url ||
    author.photo_url ||
    author.image ||
    "https://images.unsplash.com/photo-1520587393050-c5298e1a8486?q=80&w=1600&auto=format&fit=crop";

  const lifespan = [
    author.birth_year || null,
    author.death_year || (author.birth_year ? "Present" : null),
  ]
    .filter(Boolean)
    .join(" – ");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-50 py-10 md:py-16 px-4">
        <article className="max-w-6xl mx-auto">
          {/* Hero image */}
          <div className="relative overflow-hidden rounded-2xl bg-neutral-200">
            <img
              src={heroImage}
              alt={photo?.alt_text || authorName}
              className="w-full h-[300px] md:h-[480px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <p className="text-sm uppercase tracking-[0.2em] text-white/75 mb-3">
                Author
              </p>

              <h1 className="text-3xl md:text-5xl font-semibold text-white">
                {authorName}
              </h1>

              {lifespan && (
                <p className="mt-3 text-base md:text-lg text-white/80">
                  {lifespan}
                </p>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Biography */}
              {author.description && (
                <section>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-5">
                    Biography
                  </h2>

                  <p className="text-base leading-8 text-neutral-600 whitespace-pre-line">
                    {author.description}
                  </p>
                </section>
              )}

              {/* Awards & Honors (Mapped from normalized array) */}
              {Array.isArray(author.awards) && author.awards.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-5">
                    Awards & Honors
                  </h2>

                  <ul className="space-y-4">
                    {author.awards.map((award, index) => (
                      <li
                        key={award.id || index}
                        className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-lg font-medium text-neutral-900">
                            {award.title}
                          </h3>
                          {award.year && (
                            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                              {award.year}
                            </span>
                          )}
                        </div>
                        {award.description && (
                          <p className="mt-2 text-sm text-neutral-600">
                            {award.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Gallery */}
              {photos.length > 0 && (
                <section>
                  <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">
                        Visual archive
                      </p>

                      <h2 className="text-2xl font-semibold text-neutral-900">
                        Gallery
                      </h2>
                    </div>

                    <span className="text-sm text-neutral-500">
                      {photos.length} {photos.length === 1 ? "photo" : "photos"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {photos.map((item) => (
                      <figure key={item.id} className="group">
                        <div className="overflow-hidden rounded-xl bg-neutral-200">
                          <img
                            src={item.url}
                            alt={item.alt_text || authorName}
                            loading="lazy"
                            className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {item.caption && (
                          <figcaption className="mt-3 text-sm text-neutral-600">
                            {item.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right sidebar */}
            <aside className="space-y-8">
              {/* Author information */}
              <section className="border-t border-neutral-300 pt-5">
                <h2 className="text-lg font-semibold text-neutral-900 mb-5">
                  Author Information
                </h2>

                <dl className="space-y-5">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                      Full name
                    </dt>
                    <dd className="text-sm text-neutral-800">{authorName}</dd>
                  </div>

                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                      Birth year
                    </dt>
                    <dd className="text-sm text-neutral-800">
                      {author.birth_year || "—"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                      Death year
                    </dt>
                    <dd className="text-sm text-neutral-800">
                      {author.death_year || "Still living / unknown"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                      Education
                    </dt>
                    <dd className="text-sm text-neutral-800">
                      {author.education || "—"}
                    </dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
