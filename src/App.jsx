import Footer from "./shared/Footer";
import { useWorks } from "./features/works/hooks/useWorks";
import { useAuthors } from "./features/authors/hooks/useAuthors";
import LoadingError from "./shared/LoadingError";
import Navbar from "./shared/Navbar";
import Map from "./shared/Map";
import CarouselSection from "./shared/CarouselSection";

export default function App() {
  const {
    data: works = [],
    isLoading: isLoadingWorks,
    isError: isErrorWorks,
  } = useWorks();
  const {
    data: authors = [],
    isLoading: isLoadingAuthors,
    isError: isErrorAuthors,
  } = useAuthors();

  if (isLoadingWorks || isLoadingAuthors) {
    return <LoadingError resource="data" isLoading={true} />;
  }

  if (isErrorWorks || isErrorAuthors) {
    return <LoadingError resource="data" isError={true} />;
  }

  const worksLocations = works.map((work) => ({
    latitude: Number(work.latitude),
    longitude: Number(work.longitude),
    category: work.legacy_category,
    title: work.title,
  }));

  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className=" min-h-125 flex flex-col justify-center items-center text-center px-6">
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
          <h2 className="text-6xl font-black">{works.length}</h2>
          <p className="mt-2 text-lg uppercase font-bold tracking-wide">
            Projekata
          </p>
        </div>

        <div>
          <h2 className="text-6xl font-black">{authors.length}</h2>
          <p className="mt-2 text-lg uppercase font-bold tracking-wide">
            Autora
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
      <Map locations={worksLocations} />
      <CarouselSection
        title="WORKS"
        description="Explore architectural projects."
        items={works}
        renderImage={(work) => work.photos?.[0]?.url}
        renderTitle={(work) => work.title}
      />
      <CarouselSection
        title="AUTHORS"
        description="Discover the architects behind the projects."
        items={authors}
        renderImage={(author) => author.photo_url}
        renderTitle={(author) => author.full_name}
      />
      <Footer />
    </>
  );
}
