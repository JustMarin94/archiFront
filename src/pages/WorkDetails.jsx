import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { api } from "../api/client";
import AuthorGraph from "../components/AuthorGraph";
import Navbar from "../shared/Navbar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchWork = async (id) => {
  const response = await api.get(`${BASE_URL}/works/${id}`);
  return response.data;
};

const formatYearRange = (start, end) => {
  if (start && end) {
    return start === end ? String(start) : `${start} — ${end}`;
  }

  return start || end || "Year unknown";
};

const getImageUrl = (photo, width = 1600) => {
  if (!photo?.url) return "";

  const separator = photo.url.includes("?") ? "&" : "?";

  return `${photo.url}${separator}q=85&w=${width}&auto=format&fit=crop`;
};

function SectionHeading({ children, id }) {
  return (
    <div
      id={id}
      className="mb-8 flex items-center gap-4 border-b border-neutral-300 pb-4"
    >
      <h2 className="text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

function MetadataItem({ label, value }) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className="border-b border-neutral-200 py-4 last:border-b-0">
      <dt className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </dt>

      <dd className="break-words text-sm font-medium leading-relaxed text-neutral-900">
        {value}
      </dd>
    </div>
  );
}

function WorkHero({ work, photos }) {
  const featuredPhoto = photos[0];

  return (
    <header className="bg-neutral-100">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 pb-10 pt-12 sm:px-10 lg:min-h-[440px] lg:grid-cols-12 lg:items-end lg:gap-12 lg:px-16 lg:pb-12 lg:pt-16">
        {/* Project title */}

        <div className="flex flex-col justify-end lg:col-span-5">
          <h1 className="max-w-2xl text-5xl font-bold leading-[0.95] tracking-[-0.06em] text-black sm:text-6xl lg:text-7xl xl:text-8xl">
            {work.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xl text-neutral-600">
            {work.authors?.map((author) => (
              <span key={author.id}>{author.name}</span>
            ))}
          </div>
        </div>

        {/* Featured image */}

        <div className="lg:col-span-7">
          {featuredPhoto ? (
            <figure>
              <img
                src={getImageUrl(featuredPhoto, 1800)}
                alt={
                  featuredPhoto.alt_text ||
                  `Featured photograph of ${work.title}`
                }
                fetchPriority="high"
                className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[420px]"
              />

              {(featuredPhoto.caption || featuredPhoto.photographer) && (
                <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-neutral-500">
                  <span>{featuredPhoto.caption}</span>

                  {featuredPhoto.photographer && (
                    <span>© {featuredPhoto.photographer}</span>
                  )}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="flex h-[280px] items-center justify-center bg-neutral-200 text-sm text-neutral-500 sm:h-[400px] lg:h-[420px]">
              No project image available
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function WorkNavigation() {
  const links = [
    { label: "Overview", href: "#overview" },
    { label: "Gallery", href: "#gallery" },
    { label: "Location", href: "#location" },
    { label: "Authors", href: "#authors" },
  ];

  return (
    <nav
      aria-label="Project sections"
      className="sticky top-0 z-30 border-b border-neutral-300 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-[1600px] gap-6 overflow-x-auto px-6 sm:px-10 lg:px-16">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 py-5 text-xs font-medium uppercase tracking-wide transition-colors hover:text-neutral-500 sm:text-sm"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function WorkSidebar({ work }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="border-t border-black pt-5">
        <p className="mb-5 text-xs uppercase tracking-[0.15em] text-neutral-500">
          Project details
        </p>

        <dl>
          <MetadataItem label="Address" value={work.address} />

          <MetadataItem
            label="City"
            value={[work.postal_code, work.city].filter(Boolean).join(" ")}
          />

          <MetadataItem label="Region" value={work.region} />

          <MetadataItem label="Typology" value={work.typology} />

          <MetadataItem label="Category" value={work.legacy_category} />

          <MetadataItem
            label="Construction"
            value={formatYearRange(work.year_start, work.year_end)}
          />

          <MetadataItem label="Investor" value={work.investor} />

          <MetadataItem label="Intervention" value={work.intervention_type} />

          <MetadataItem label="Protection" value={work.protection_status} />

          <MetadataItem label="Status" value={work.status} />
        </dl>
      </div>
    </aside>
  );
}

function WorkOverview({ work }) {
  return (
    <section id="overview" className="scroll-mt-24">
      <SectionHeading>Overview</SectionHeading>

      {work.description ? (
        <div className="max-w-4xl">
          <p className="whitespace-pre-line text-lg leading-[1.8] text-neutral-800 sm:text-xl">
            {work.description}
          </p>
        </div>
      ) : (
        <p className="text-neutral-500">No project description available.</p>
      )}
    </section>
  );
}

function WorkGallery({ photos, title }) {
  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="scroll-mt-24">
      <SectionHeading>Gallery</SectionHeading>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
        {photos.map((photo, index) => {
          const isFeatured = index === 0 || index % 4 === 0;

          return (
            <figure
              key={photo.id ?? `${photo.url}-${index}`}
              className={isFeatured ? "sm:col-span-2" : ""}
            >
              <img
                src={getImageUrl(photo, isFeatured ? 1800 : 1000)}
                alt={photo.alt_text || `${title} — photograph ${index + 1}`}
                loading="lazy"
                className={`w-full object-cover ${
                  isFeatured ? "max-h-[760px] aspect-[16/9]" : "aspect-[4/3]"
                }`}
              />

              {(photo.caption || photo.alt_text) && (
                <figcaption className="mt-3 flex flex-col gap-1 text-sm">
                  {photo.caption && (
                    <span className="font-medium text-neutral-900">
                      {photo.caption}
                    </span>
                  )}

                  {photo.alt_text && (
                    <span className="text-neutral-500">{photo.alt_text}</span>
                  )}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function WorkLocation({ work, lat, lng }) {
  const hasCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

  const address = [work.address, work.postal_code, work.city, work.region]
    .filter(Boolean)
    .join(", ");

  return (
    <section id="location" className="scroll-mt-24">
      <SectionHeading>Location</SectionHeading>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-lg font-medium">
            {work.city || work.region || "Project location"}
          </p>

          {address && (
            <p className="mt-1 text-sm text-neutral-500">{address}</p>
          )}
        </div>

        {hasCoordinates && (
          <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline underline-offset-4 hover:text-neutral-500"
          >
            View on OpenStreetMap ↗
          </a>
        )}
      </div>

      {hasCoordinates ? (
        <div className="relative z-0 h-[350px] overflow-hidden sm:h-[500px]">
          <MapContainer
            key={`${lat}-${lng}`}
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[lat, lng]}>
              <Popup>
                <div>
                  <h3 className="font-bold">{work.title}</h3>

                  <p>{[work.city, work.region].filter(Boolean).join(", ")}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <p className="border-y border-neutral-200 py-8 text-sm text-neutral-500">
          Location coordinates are not available for this project.
        </p>
      )}

      {hasCoordinates && (
        <p className="mt-3 text-xs text-neutral-500">
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      )}
    </section>
  );
}

function WorkAuthors({ work }) {
  return (
    <section id="authors" className="scroll-mt-24">
      <SectionHeading>Authors & Connections</SectionHeading>

      <p className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-600">
        Explore the relationships between this project, its authors, and other
        works in the archive.
      </p>

      <div className="min-w-0">
        <AuthorGraph work={work} />
      </div>
    </section>
  );
}

export default function WorkDetails() {
  const { id } = useParams();

  const {
    data: work,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["work", id],
    queryFn: () => fetchWork(id),
    enabled: Boolean(id),
  });

  const photos = useMemo(
    () =>
      [...(work?.photos ?? [])].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0),
      ),
    [work?.photos],
  );

  if (isLoading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div
              className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black"
              aria-hidden="true"
            />

            <p className="text-sm text-neutral-500">Loading project...</p>
          </div>
        </main>
      </>
    );
  }

  if (isError || !work) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="max-w-md text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
              Project unavailable
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Unable to load project
            </h1>

            <p className="mt-4 text-neutral-500">
              Something went wrong while retrieving this project. Please try
              again later.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 border border-black px-5 py-3 text-sm transition-colors hover:bg-black hover:text-white"
            >
              Try again
            </button>
          </div>
        </main>
      </>
    );
  }

  const lat =
    work.latitude !== null &&
    work.latitude !== undefined &&
    work.latitude !== ""
      ? Number(work.latitude)
      : NaN;

  const lng =
    work.longitude !== null &&
    work.longitude !== undefined &&
    work.longitude !== ""
      ? Number(work.longitude)
      : NaN;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-black">
        <WorkHero work={work} photos={photos} />

        <WorkNavigation />

        <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Left sidebar */}

            <div className="lg:col-span-3">
              <WorkSidebar work={work} />
            </div>

            {/* Main editorial content */}

            <div className="min-w-0 space-y-20 lg:col-span-9 lg:space-y-28">
              <WorkOverview work={work} />

              <WorkGallery photos={photos} title={work.title} />

              <WorkLocation work={work} lat={lat} lng={lng} />

              <WorkAuthors work={work} />
            </div>
          </div>
        </div>

        <footer className="border-t border-neutral-200">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-6 py-8 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
            <span>{work.title}</span>

            <span>{formatYearRange(work.year_start, work.year_end)}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
