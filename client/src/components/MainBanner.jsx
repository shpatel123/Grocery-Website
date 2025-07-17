import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const MainBanner = () => {
  const bannerImages = [
    assets.Banner1,
    assets.Banner2,
    assets.Banner3,
    assets.Banner4,
  ];

  return (
    <div className="relative w-full sm:h-[400px] md:h-[500px] lg:h-[535px]">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2000 }}
        loop
        className="w-full h-full"
      >
        {bannerImages.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`banner-${index}`}
              className="w-full h-full object-cover rounded-lg sm:rounded-xl md:rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MainBanner;