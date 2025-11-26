"use client";

import Image from "next/image";
import Header from "../../components/Header";
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

type Location = {
  name: string;
  images: string[];
  text1: string;
  text2: string;
  link: string;
  mapUrl: string;
};

type Category = {
  name: string;
  illustration: string;
  locations: Location[];
};

const categories: Category[] = [
  {
    name: "Shopping",
    illustration: "/blog/shop.svg",
    locations: [
      {
        name: "Kokusai Dori Shopping Street",
        images: ["/blog/kokusai1.jpg", "/blog/kokusai2.jpg"],
        text1: `Kokusai Dori (国際通り), often called “The Miracle Mile,” is the
                most famous shopping and entertainment street in Naha, the
                capital city of Okinawa, Japan. Stretching for about 1.6
                kilometers (1 mile) through the heart of the city, it is lined
                with hundreds of shops, restaurants, cafés, and markets, making
                it a lively destination both day and night.`,
        text2: `Originally rebuilt after World War II, Kokusai Dori became a
                symbol of Okinawa’s postwar recovery and prosperity. Today, it’s
                a vibrant blend of local culture, modern trends, and Okinawan
                hospitality. Visitors can enjoy a wide range of experiences —
                from shopping for traditional crafts and souvenirs like Ryukyu
                glass, bingata fabrics, and shisa statues, to tasting local
                specialties such as Okinawa soba, taco rice, and purple sweet
                potato desserts.`,
        link: "https://naha-kokusaidori.okinawa/",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.4014228879105!2d127.68549177541547!3d26.216143277069197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e56977701f0ffb%3A0x137a2164664af9fc!2z6YKj6KaHIOWbvemam-mAmuOCiuWVhuW6l-ihlw!5e0!3m2!1sja!2sjp!4v1763000892206!5m2!1sja!2sjp",
      },
      {
        name: "American Village",
        images: ["/blog/02.jpg", "/blog/02-2.jpg"],
        text1: `The American Village (アメリカンビレッジ) is a popular
                entertainment and shopping complex located in Chatan, central
                Okinawa. Built on a former U.S. military base area, it reflects
                a unique blend of American and Okinawan cultures, creating a
                lively and colorful resort town atmosphere by the sea.`,
        text2: `The area is filled with boutiques, cafés, restaurants, cinemas,
                and souvenir shops, all designed with a distinctly Western flair
                — neon lights, murals, and wide streets reminiscent of an
                American beach town. At its center stands the iconic Ferris
                wheel, a well-known landmark that offers stunning panoramic
                views of Chatan and the coastline, especially beautiful at
                sunset.`,
        link: "https://www.okinawa-americanvillage.com/",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3576.327748777823!2d127.75143277303812!3d26.315884685488548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e5130508159acd%3A0x1bde7c8b1d9e8bcc!2z576O5rWc44K_44Km44Oz44Oq44K-44O844OI44O744Ki44Oh44Oq44Kr44Oz44OT44Os44OD44K4!5e0!3m2!1sja!2sjp!4v1763000988207!5m2!1sja!2sjp",
      },
      {
        name: "Tsuboya Yachimun Street",
        images: ["/blog/03.jpg", "/blog/03-3.jpg"],
        text1: `Tsuboya Yachimun Street (壺屋やちむん通り) is a charming,
                historic street in Naha, Okinawa, famous for its traditional
                pottery, known locally as “yachimun.” The street dates back to
                the 17th century, when the Ryukyu Kingdom gathered pottery
                makers in the Tsuboya area to produce ceramics for daily use and
                royal demand.`,
        text2: `Today, Tsuboya Yachimun Street is lined with old stone-paved
                paths, red-tiled roofs, and rustic workshops, giving visitors a
                glimpse into Okinawa’s rich craft heritage. Dozens of pottery
                studios, galleries, and shops showcase beautiful handmade items
                — from cups and bowls to decorative shisa guardian lions — each
                piece reflecting Okinawa’s distinct artistic style and colors.`,
        link: "https://visitokinawajapan.com/travel-inspiration/visiting-tsuboya-yachimun-street/",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.4950940927133!2d127.68870247303302!3d26.213098089810273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e56970174faaab%3A0x8008422aafb38575!2z5aO65bGL44KE44Gh44KA44KT6YCa44KK!5e0!3m2!1sja!2sjp!4v1763001039943!5m2!1sja!2sjp",
      },
    ],
  },
  {
    name: "Sightseeing",
    illustration: "/blog/beach.svg",
    locations: [
      {
        name: "Okinawa Churaumi Aquarium",
        images: ["/blog/04.jpg", "/blog/04-4.jpg"],
        text1: `The Okinawa Churaumi Aquarium (沖縄美ら海水族館) is one of
                Japan’s most famous and impressive aquariums, located within the
                Ocean Expo Park in Motobu, northern Okinawa. The name “Churaumi”
                means “beautiful ocean” in the Okinawan language, reflecting the
                aquarium’s mission to showcase the rich marine life of Okinawa
                and the surrounding seas. `,
        text2: `The highlight of the aquarium is the massive Kuroshio Sea tank,
                one of the largest in the world, featuring giant whale sharks,
                manta rays, and hundreds of tropical fish swimming together in a
                breathtaking underwater scene. Other exhibits include coral
                reefs, deep-sea creatures, and marine life from tropical
                Okinawan waters, all displayed in realistic and educational
                settings.`,
        link: "https://churaumi.okinawa/en/",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564.5665211187707!2d127.87543817305702!3d26.694342769445257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e4fa3152619e3d%3A0xea08a6700fdd9ffe!2z5rKW57iE576O44KJ5rW35rC05peP6aSo!5e0!3m2!1sja!2sjp!4v1763002751704!5m2!1sja!2sjp",
      },
      {
        name: "Junglia Okinawa",
        images: ["/blog/05.jpg", "/blog/05-5.jpg"],
        text1: `Junglia Okinawa is a large-scale nature-themed amusement park
                located in northern Okinawa, in the lush Yambaru region near
                Nago and Nakijin. Opened in July 2025, the park combines
                adventure, entertainment, and relaxation, offering visitors a
                unique mix of attractions set in a tropical forest environment.`,
        text2: `The park features safari-style experiences, including a
                “Dinosaur Safari” with life-like animatronic dinosaurs, treetop
                courses and zip lines, and scenic rides like the “Horizon
                Balloon” that provides panoramic views of Okinawa’s greenery.
                For those seeking relaxation, Junglia also offers spa facilities
                and resort-style dining with locally sourced ingredients.`,
        link: "https://junglia.jp/",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3566.195418870763!2d127.97102327305439!3d26.642224871666738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e4f918d1678393%3A0x5f0be3652cb094b2!2z44K444Oj44Oz44Kw44Oq44Ki5rKW57iE!5e0!3m2!1sja!2sjp!4v1763003072091!5m2!1sja!2sjp",
      },
      {
        name: "Naminoue Shrine",
        images: ["/blog/06.jpg", "/blog/06-6.jpg"],
        text1: `Naminoue Shrine (波上宮, Naminoue-gū) is one of Okinawa’s most
                important and historic Shinto shrines, located on a cliff
                overlooking Naha’s Naminoue Beach. The name “Naminoue” means
                “above the waves”, reflecting its scenic location with the ocean
                stretching out beneath it.`,
        text2: `Dating back to the 14th century, the shrine was originally a
                place where locals prayed for safe voyages, bountiful fishing,
                and protection from natural disasters. The main hall (honden)
                and surrounding structures have been rebuilt several times, most
                recently in the early 20th century, while still preserving its
                traditional Ryukyu architectural style.`,
        link: "https://naminouegu.jp/english.html",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.2599546803453!2d127.66852627303334!3d26.220741689489397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e56985510a3f75%3A0x776a51e1e15524ac!2z5rOi5LiK5a6u!5e0!3m2!1sja!2sjp!4v1763003315002!5m2!1sja!2sjp",
      },
    ],
  },
  {
    name: "Eating Out",
    illustration: "/blog/food.svg",
    locations: [
      {
        name: "Ufuya",
        images: ["/blog/08.jpg", "/blog/08-8.jpg"],
        text1: `Ufuya (百年古家 大家, meaning “The Great House”) is a famous
                Okinawan restaurant located in Nago, northern Okinawa. Set
                within a beautifully restored 100-year-old traditional
                Ryukyu-style house, Ufuya offers visitors a unique dining
                experience that combines Okinawan history, architecture, and
                cuisine.`,
        text2: `Surrounded by lush greenery, waterfalls, and stone paths, the
                restaurant’s serene atmosphere makes it feel like a hidden
                mountain retreat. Guests can enjoy authentic Okinawan dishes
                such as soki soba (noodles with braised pork ribs), rafute
                (stewed pork belly), gōya champurū (bitter melon stir-fry), and
                local desserts made with purple sweet potatoes and brown sugar.`,
        link: "https://ufuya.com/",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3566.8579041086814!2d127.96109677305344!3d26.621001072570298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e4ff4cb9b910f1%3A0x6c5682a23a94e475!2z55m-5bm05Y-k5a62IOWkp-WutiDjgYbjgbXjgoTjg7w!5e0!3m2!1sja!2sjp!4v1763002033977!5m2!1sja!2sjp",
      },
      {
        name: "Jack's Steak House",
        images: ["/blog/07.jpg", "/blog/07-7.jpg"],
        text1: `Jack’s Steak House is a legendary restaurant located in Naha,
                Okinawa, famous for serving delicious and affordable
                American-style steaks since 1953. Opened soon after World War
                II, it originally catered to U.S. military personnel stationed
                in Okinawa, but over the decades it has become a beloved dining
                spot for both locals and tourists.`,
        text2: `The restaurant’s atmosphere is retro and casual, with simple
                décor, friendly service, and the nostalgic feel of old Okinawa.
                Jack’s signature dishes include juicy sirloin and tenderloin
                steaks, served on sizzling hot plates with a side of vegetables,
                soup, and rice or bread. Many visitors also enjoy their homemade
                sauces and garlic steak toppings, which add a unique Okinawan
                twist to classic American flavors.`,
        link: "https://steak.co.jp/",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.5011843032976!2d127.66992027303297!3d26.212900089818643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e56999b06c66db%3A0x5a84f40a1e58fcf7!2z44K444Oj44OD44Kt44O844K544OG44O844Kt44OP44Km44K5!5e0!3m2!1sja!2sjp!4v1763001408734!5m2!1sja!2sjp",
      },
      {
        name: "Okinawa soba EIBUN",
        images: ["/blog/09.jpg", "/blog/09-9.jpg"],
        text1: `Okinawa Soba EIBUN is a popular and modern noodle restaurant
                located in Naha, Okinawa, known for giving a creative twist to
                the island’s traditional Okinawa soba. Blending classic flavors
                with innovative presentation, EIBUN has become a favorite among
                both locals and tourists looking for a fresh take on Okinawan
                comfort food.`,
        text2: `The restaurant uses high-quality local ingredients, including
                handmade noodles and rich, flavorful broths made from pork,
                bonito, and seaweed. Its signature dishes often feature colorful
                toppings like tender pork belly (rafute), soki (spare ribs), or
                even spicy and vegan-friendly options. The stylish yet cozy
                interior gives the restaurant a relaxed and welcoming vibe.`,
        link: "https://sobaeibun.okinawa/",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.5070314804116!2d127.68750407303291!3d26.212709989826585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e5697045bd3cfd%3A0x33dd9aa73dc39f7c!2sOKINAWA%20SOBA%20EIBUN!5e0!3m2!1sja!2sjp!4v1763002283335!5m2!1sja!2sjp",
      },
    ],
  },
];

export default function BlogPage() {
  // const [openCategory, setOpenCategory] = useState<string | null>(null);

  // const toggleCategory = (name: string) => {
  //   setOpenCategory(openCategory === name ? null : name);
  // };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const resetState = () => {
    setSelectedCategory(null);
    setActiveLocation(null);
  };

  return (
    <>
      <Header onBlogClick={resetState} />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center text-[#3e2723]">
          Okinawa Travel Recommendations
        </h1>

        <div className="flex gap-10 pt-4">
          {/* ---------------- ЛЕВОЕ МЕНЮ КАТЕГОРИЙ ---------------- */}
          <aside className="w-72 flex flex-col gap-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.name ? null : cat.name
                  )
                }
                className={`flex items-center gap-4 p-3 rounded-lg transition cursor-pointer
                  ${
                    selectedCategory === cat.name
                      ? "bg-yellow-300"
                      : "bg-yellow-200 hover:bg-yellow-300"
                  }`}
              >
                <Image
                  src={cat.illustration}
                  alt={cat.name}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
                <span className="text-xl font-semibold text-[#3e2723]">
                  {cat.name}
                </span>
              </button>
            ))}
          </aside>

          {/* ---------------- ПРАВЫЙ БЛОК ---------------- */}
          <div className="flex-1 min-h-[420px] relative">
            {/* Если категория не выбрана → заставка */}
            {!selectedCategory && (
              <div className="h-full flex flex-col items-center justify-start text-center opacity-90">
                <Image
                  src="/think.svg"
                  alt="Choose category"
                  width={620}
                  height={620}
                  className="mb-6"
                />
                {/* <p className="text-xl text-[#3e2723]">
                  Choose a category to see locations
                </p> */}
              </div>
            )}

            {/* Мини-карточки локаций */}
            {selectedCategory && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {categories
                  .find((c) => c.name === selectedCategory)
                  ?.locations.map((loc) => (
                    <div
                      key={loc.name}
                      onClick={() => setActiveLocation(loc)}
                      className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition p-3"
                    >
                      <Image
                        src={loc.images[0]}
                        alt={loc.name}
                        width={300}
                        height={200}
                        className="rounded-md object-cover h-32 w-full"
                      />
                      <p className="mt-3 text-lg font-semibold text-[#3e2723]">
                        {loc.name}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* ---------------- МОДАЛЬНОЕ ОКНО ---------------- */}
        {activeLocation && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setActiveLocation(null)}
          >
            <div
              className="bg-white w-[90%] max-w-3xl max-h-[90vh] rounded-2xl relative shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Контейнер со скроллом */}
              <div className="scrollbar-hide overflow-y-auto max-h-[90vh] pl-2 pr-1 py-4">
                {/* Фото-карусель */}
                <Slider
                  dots={true}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  arrows={true}
                  autoplay={true} // включаем автопрокрутку
                  autoplaySpeed={4000} // время между сменой слайдов (мс)
                >
                  {activeLocation.images.map((img: string) => (
                    <div key={img} className="px-1 flex justify-center">
                      <div className="px-1 flex justify-center">
                        <div className="w-full h-96 overflow-hidden rounded-lg relative mx-auto">
                          <Image
                            src={img}
                            alt={activeLocation.name}
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>

                {/* Название */}
                <h2 className="text-3xl font-bold text-[#3e2723] text-center pt-8 pb-2">
                  {activeLocation.name}
                </h2>

                {/* Текст */}
                <p className="text-lg text-[#3e2723] px-6 pb-4 pt-2">
                  {activeLocation.text1}
                </p>
                <p className="text-lg text-[#3e2723] px-6">
                  {activeLocation.text2}
                </p>

                {/* Кнопка */}
                <div className="flex justify-center mt-6">
                  <a
                    href={activeLocation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#e74c3c] font-bold text-white px-6 py-2 rounded-lg hover:bg-[#d84333] transition"
                  >
                    Visit website
                  </a>
                </div>

                {/* Карта */}
                <div className="w-[500px] h-48 h-80 mx-auto overflow-hidden rounded-lg mt-8 mb-6">
                  <iframe
                    src={activeLocation.mapUrl}
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
