import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

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
    "https://images.unsplash.com/photo-1708534317455-0d32d06dad4b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";

  const lifespan = [
    author.birth_year || null,
    author.death_year || (author.birth_year ? "Present" : null),
  ]
    .filter(Boolean)
    .join(" – ");

  const works = author.works || [];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-50 py-10 md:py-16 px-4">
        <article className="max-w-6xl mx-auto">
          {/* Header Section: Vertically Centered Name & Portrait */}
          <div className="w-full max-w-7xl mx-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-8">
              {/* Column 1: Author Name & Lifespan (Aligned to bottom) */}
              <div className="text-left pb-2">
                <h1 className="text-4xl md:text-6xl font-normal text-neutral-900 tracking-tight">
                  {authorName}
                </h1>

                {lifespan && (
                  <p className="mt-3 text-lg md:text-xl text-neutral-500">
                    {lifespan}
                  </p>
                )}
              </div>

              {/* Column 2: Portrait Picture (Larger & Centered) */}
              <div className="flex justify-center">
                <div className="w-72 sm:w-80 md:w-96 shrink-0 overflow-hidden bg-white shadow-sm">
                  <img
                    src={heroImage}
                    alt={photo?.alt_text || authorName}
                    className="w-full aspect-[3/4] object-cover object-center"
                  />
                </div>
              </div>

              {/* Column 3: Empty Spacer (Balances Column 1 on desktop) */}
              <div className="hidden md:block"></div>
            </div>
          </div>
          {/* Main content grid */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Left sidebar */}
            <aside className="lg:col-span-1 space-y-8">
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

            {/* Right main content column */}
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

              {/* Author's Works / Projects Section */}
              {works.length > 0 && (
                <section id="works" className="scroll-mt-24">
                  <div className="flex items-end justify-between gap-4 mb-5 border-b border-neutral-200 pb-3">
                    <h2 className="text-2xl font-semibold text-neutral-900">
                      Author Works & Projects
                    </h2>
                    <span className="text-sm text-neutral-500">
                      {works.length} {works.length === 1 ? "work" : "works"}
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-200">
                    {works.map((work) => (
                      <div
                        key={work.id}
                        className="py-5 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              work.photo_url ||
                              work.image ||
                              "/default-work.png"
                            }
                            alt={work.title}
                            className="w-20 h-20 rounded-lg object-cover shrink-0 bg-neutral-200"
                          />
                          <div>
                            <Link
                              to={`/works/${work.id}`}
                              className="font-semibold text-neutral-900 hover:underline text-lg"
                            >
                              {work.title}
                            </Link>
                            <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
                              {work.role || "Contributor"}
                              {work.city && ` • ${work.city}`}
                              {work.year_start &&
                                ` (${work.year_start}${work.year_end ? `–${work.year_end}` : ""})`}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/works/${work.id}`}
                          className="text-sm underline underline-offset-4 hover:text-neutral-500 shrink-0"
                        >
                          View Work ↗
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Awards & Honors */}
              {Array.isArray(author.awards) && author.awards.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-5">
                    Awards & Honors
                  </h2>

                  <ul className="space-y-3">
                    {author.awards.map((award, index) => (
                      <li key={award.id || index} className="text-neutral-800">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-base text-neutral-800">
                            {award.title} {award.year && `(${award.year})`}
                          </span>
                        </div>
                        {award.description && (
                          <p className="mt-1 text-sm text-neutral-600">
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
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
