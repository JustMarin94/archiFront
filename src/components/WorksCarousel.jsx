import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchWorks = async () => {
  const response = await axios.get(`${BASE_URL}/works`);
  return response.data;
};

export default function WorksCarousel() {
  const { data: works = [], isLoading } = useQuery({
    queryKey: ["works"],
    queryFn: fetchWorks,
  });

  if (isLoading) {
    return <div className="py-20 text-center">Loading works...</div>;
  }

  return (
    <section className="bg-white py-20">
      {/* Title */}
      <div className="text-center max-w-5xl mx-auto mb-16 px-6">
        <h2 className="text-7xl font-black">{works.length} WORKS</h2>

        <p className="mt-6 text-xl">
          Explore the richness of architecture executed throughout the territory
          by using multiple search filters. You can combine searches by period,
          typology or by author.
        </p>
      </div>

      {/* Carousel */}
      <div className="px-12">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={30}
          slidesPerView={4}
          loop
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 4,
            },
          }}
        >
          {works.map((work) => (
            <SwiperSlide key={work.id}>
              <div className="h-[400px] overflow-hidden">
                <img
                  src={work.photos?.[0]?.url}
                  alt={work.title}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Button */}
      <div className="flex justify-center mt-12">
        <Link
          to="/filter"
          className="
            bg-black
            text-white
            px-10
            py-5
            font-bold
            text-xl
            hover:bg-gray-800
          "
        >
          + WORKS
        </Link>
      </div>
    </section>
  );
}
