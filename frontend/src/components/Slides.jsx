import React from "react";
import Logo from "../static/logo-text.png";
import { Carousel } from "@mantine/carousel";
import "@mantine/core/styles.css";

const Slides = () => {
  const images = [Logo, Logo, Logo, Logo];

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p className="text-3xl font-bold text-center mt-10">Heading</p>
      <p className="text-xl font-semibold text-center mt-5">Subheading</p>
      <div className="w-full">
      <Carousel withIndicators height={200}>
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
      {/* ...other slides */}
    </Carousel>
      </div>
    </div>
  );
};

export default Slides;
