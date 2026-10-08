import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { Range } from "react-range";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchList = async (endpoint) => {
  const response = await api.get(`${BASE_URL}${endpoint}`);
  return response.data;
};

const selectClass =
  "w-full h-12 bg-white border border-gray-300 rounded-md px-4 " +
  "text-[16px] text-gray-900 outline-none cursor-pointer " +
  "transition-colors focus:border-black";

export default function Filter({
  filters,
  updateFilter,
  selectedPage,
  setSelectedPage,
}) {
  const { data: titles = [] } = useQuery({
    queryKey: ["workTitles"],
    queryFn: () => fetchList("/works/titles"),
  });

  const { data: typologies = [] } = useQuery({
    queryKey: ["workTypology"],
    queryFn: () => fetchList("/works/typology"),
  });

  const { data: regions = [] } = useQuery({
    queryKey: ["workRegions"],
    queryFn: () => fetchList("/works/regions"),
  });

  const { data: awards = [] } = useQuery({
    queryKey: ["authorAwards"],
    queryFn: () => fetchList("/authors/awards"),
  });

  const { data: authors = [] } = useQuery({
    queryKey: ["authorNames"],
    queryFn: () => fetchList("/authors/names"),
  });

  // Get year range from database
  const { data: yearRange } = useQuery({
    queryKey: ["workYearRange"],
    queryFn: () => fetchList("/works/year-range"),
  });

  const minYear = yearRange?.min_year ?? 1000;
  const maxYear = yearRange?.max_year ?? 2026;

  const currentYearStart = filters.yearStart ?? minYear;
  const currentYearEnd = filters.yearEnd ?? maxYear;

  return (
    <div className="w-full px-6 py-6">
      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* PAGE */}
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className={selectClass}
        >
          <option value="works">Works</option>
          <option value="authors">Authors</option>
        </select>

        {/* TITLE */}
        <select
          value={filters.title}
          onChange={(e) => updateFilter("title", e.target.value)}
          className={selectClass}
        >
          <option value="">All titles</option>

          {titles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>

        {/* TYPOLOGY */}
        <select
          value={filters.typology}
          onChange={(e) => updateFilter("typology", e.target.value)}
          className={selectClass}
        >
          <option value="">All typologies</option>

          {typologies.map((typology) => (
            <option key={typology} value={typology}>
              {typology}
            </option>
          ))}
        </select>

        {/* AWARDS */}
        <select
          value={filters.awards}
          onChange={(e) => updateFilter("awards", e.target.value)}
          className={selectClass}
        >
          <option value="">All awards</option>

          {awards.map((award) => (
            <option key={award} value={award}>
              {award}
            </option>
          ))}
        </select>

        {/* AUTHOR */}
        <select
          value={filters.author}
          onChange={(e) => updateFilter("author", e.target.value)}
          className={selectClass}
        >
          <option value="">All authors</option>

          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>

        {/* REGION */}
        <select
          value={filters.region}
          onChange={(e) => updateFilter("region", e.target.value)}
          className={selectClass}
        >
          <option value="">All regions</option>

          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* YEAR RANGE */}
      <div className="mt-10">
        <div className="flex items-center gap-4 mb-5 text-sm">
          <span className="font-semibold">Period</span>

          <span className="text-gray-600">
            {currentYearStart} – {currentYearEnd}
          </span>
        </div>

        <Range
          step={1}
          min={minYear}
          max={maxYear}
          values={[currentYearStart, currentYearEnd]}
          onChange={(values) => {
            updateFilter("yearStart", values[0]);
            updateFilter("yearEnd", values[1]);
          }}
          renderTrack={({ props, children }) => (
            <div {...props} className="h-[2px] w-full bg-black relative">
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="
                h-5 w-5
                rounded-full
                border-[3px] border-black
                bg-white
                focus:outline-none
              "
            />
          )}
        />
      </div>
    </div>
  );
}
