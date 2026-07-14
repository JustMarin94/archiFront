import { useState } from "react";

import AuthorsTiles from "./AuthorsTiles";
import PhotographersTiles from "./PhotographersTiles";
import WorksTiles from "./WorksTiles";

import WorksFilter from "../components/WorksFilter";
import AuthorsFilter from "../components/AuthorsFilter";
import PhotographersFilter from "../components/PhotographersFilter";

export default function FilterPage() {
  const [selectedPage, setSelectedPage] = useState("works");

  const [filters, setFilters] = useState({
    work: "",
    author: "",
    photographer: "",
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div>
      <div className=" p-8 space-y-6">
        {/* PAGE SELECTOR */}
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="works">Works</option>
          <option value="authors">Authors</option>
          <option value="photographers">Photographers</option>
        </select>

        {/* FILTERS */}
        {selectedPage === "works" && (
          <WorksFilter
            selectedWork={filters.work}
            setSelectedWork={(value) => updateFilter("work", value)}
          />
        )}

        {selectedPage === "authors" && (
          <AuthorsFilter
            selectedAuthor={filters.author}
            setSelectedAuthor={(value) => updateFilter("author", value)}
          />
        )}

        {selectedPage === "photographers" && (
          <PhotographersFilter
            selectedPhotographer={filters.photographer}
            setSelectedPhotographer={(value) =>
              updateFilter("photographer", value)
            }
          />
        )}
      </div>

      {/* CONTENT */}

      {selectedPage === "works" && <WorksTiles filters={filters} />}

      {selectedPage === "authors" && <AuthorsTiles filters={filters} />}

      {selectedPage === "photographers" && (
        <PhotographersTiles filters={filters} />
      )}
    </div>
  );
}
