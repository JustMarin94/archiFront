import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const fetchPhotographers = async () => {
  const response = await axios.get("http://localhost:3000/photographers");

  return response.data;
};

export default function PhotographersCarousel() {
  const { data: photographers = [], isLoading } = useQuery({
    queryKey: ["photographers"],
    queryFn: fetchPhotographers,
  });

  if (isLoading) {
    return <div>Loading photographers...</div>;
  }

  return (
    <section className=" py-20">
      <div className="text-center max-w-5xl mx-auto mb-16">
        <h2 className="text-7xl font-black">
          {photographers.length} PHOTOGRAPHERS
        </h2>

        <p className="mt-6 text-xl">
          Explore the photographers who documented architectural works and
          cultural heritage.
        </p>
      </div>

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
          {photographers.map((person) => (
            <SwiperSlide key={person.id}>
              <div className="h-[400px] overflow-hidden">
                <img
                  src={person.photo_url}
                  alt={person.alt_text}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              </div>

              <h3 className="text-xl font-bold mt-4">{person.full_name}</h3>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

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
          "
        >
          + PHOTOGRAPHERS
        </Link>
      </div>
    </section>
  );
}
