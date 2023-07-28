import { Star } from "lucide-react";
import moment from "moment";

import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { api } from "@/utils/api";

import Carousel from "@/components/Carousel";
import Loader from "@/components/Loader";

import { generalizeDate } from "@/lib/utils";

type Category = {
  name: string;
  image: string;
};

type Testimonial = {
  name: string;
  date: string;
  rating: number;
  review: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "User Name Initials",
    date: "24/12/2022",
    rating: 4,
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia, ipsum at viverra vulputate, eros tortor gravida leo, at aliquet nisi nisi nec nisi. Nulla facilisi. Sed",
  },
  {
    name: "User Name Initials",
    date: "24/12/2022",
    rating: 4,
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia, ipsum at viverra vulputate, eros tortor gravida leo, at aliquet nisi nisi nec nisi. Nulla facilisi. Sed",
  },
  {
    name: "User Name Initials",
    date: "24/12/2022",
    rating: 4,
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia, ipsum at viverra vulputate, eros tortor gravida leo, at aliquet nisi nisi nec nisi. Nulla facilisi. Sed",
  },
  {
    name: "User Name Initials",
    date: "24/12/2022",
    rating: 4,
    review:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia, ipsum at viverra vulputate, eros tortor gravida leo, at aliquet nisi nisi nec nisi. Nulla facilisi. Sed",
  },
];

const Home: NextPage = () => {
  const { data: categories } = api.category.getAll.useQuery();

  if (!categories) return <Loader background />;

  return (
    <>
      <Head>
        <title>Welcome to SPPM</title>
      </Head>
      <main className="flex w-full max-w-[1024px] flex-col items-center justify-center gap-12 bg-peach p-4 font-sans text-display text-primary tablet:gap-16">
        <div className="relative flex w-[100%] items-center justify-center">
          <Image
            src="https://ksapkpyzblzmnusrhtxk.supabase.co/storage/v1/object/public/ASSETS/product-image-1.jpg"
            alt={"Main Image"}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "500px", objectFit: "cover", opacity: "40%" }}
            className="rounded-lg"
          />
          <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-lg bg-black bg-opacity-50 p-4">
            <h1 className="text-h1 text-peach drop-shadow-lg ">The Brown Bean Coffee</h1>
            <h2 className="text-h5 text-peach drop-shadow-lg ">Serving the Best Coffee and Delightful Food Since 2012</h2>
          </div>
        </div>
        <div>
          <h2 className="text-h1">Who we are</h2>
          <div className="flex flex-col gap-4 tablet:flex-row">
            <div className="flex flex-col gap-4">
              <h5 className="text-h5">Our Story and Mission</h5>
              <p className="text-tiny">
                Welcome to The Brown Bean Coffee, where we create unforgettable experiences through delectable food and a welcoming
                ambiance. Since 2012, we have dedicated ourselves to serving the finest coffee and a diverse range of coffee varieties that
                will tantalise your taste buds. At The Brown Bean Coffee, we believe that good food is an art that goes beyond mere
                sustenance. Our talented chefs and baristas work tirelessly to craft dishes and brews that not only taste exceptional but
                also please the eye.
              </p>
              <p className="text-tiny">
                Coffee is our specialty and the heart of our brand. As you step into our café, you&apos;ll be greeted by the enticing aroma
                of freshly ground beans, guiding you to a world of remarkable coffee experiences. Whether you prefer a robust espresso, a
                velvety latte, or a refreshing cold brew, our skilled baristas ensure each cup is perfected for an unforgettable sip.
              </p>
            </div>
            <Image
              src="https://ksapkpyzblzmnusrhtxk.supabase.co/storage/v1/object/public/ASSETS/product-image-1.jpg"
              alt={"Main Image"}
              width={0}
              height={0}
              sizes="100vh"
              className="max-h-[340px] w-full rounded-lg tablet:max-h-[340px] tablet:w-auto tablet:max-w-[362px] desktop:max-h-[260px] desktop:max-w-[489px]"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col-reverse gap-4 tablet:flex-row">
            <Image
              src="https://ksapkpyzblzmnusrhtxk.supabase.co/storage/v1/object/public/ASSETS/product-image-1.jpg"
              alt={"Main Image"}
              width={0}
              height={0}
              sizes="100vh"
              className="max-h-[340px] w-full rounded-lg tablet:max-h-[340px] tablet:w-auto tablet:max-w-[362px] desktop:max-h-[260px] desktop:max-w-[489px]"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="flex flex-col gap-4">
              <h5 className="text-h5">Our Story and Mission</h5>
              <p className="text-tiny">
                Our commitment to excellence extends beyond coffee. Our carefully curated menu features a wide range of culinary delights,
                including hearty English breakfasts, mouthwatering burgers, nutritious salads, nourishing soups, and delightful submarines.
                Each dish is crafted with the finest ingredients and infused with flavors that will leave you craving for more.
              </p>
              <p className="text-tiny">
                The Brown Bean Coffee offers more than just great food. Our cozy and comfortable ambiance provides the perfect space to
                unwind, whether you&apos;re meeting friends, catching up on work, or seeking a moment of solace. Join us at The Brown Bean
                Coffee and indulge in our passion for exceptional food and a warm atmosphere. Experience the best coffee and coffee
                varieties in Sri Lanka since 2012.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-h1">Menu</h2>
          <h5 className="text-h5">Discover Our Delights</h5>
          <div className="mt-4">
            <div className="desktop:grid-row-2 tablet:grid-row-4 hidden gap-2 tablet:grid tablet:grid-cols-3 desktop:grid-flow-row desktop:grid-cols-5">
              {categories.map((category, index) => (
                <WebCategory category={category.data} last={index === categories.length - 1} key={category.id} />
              ))}
            </div>
            <div className="flex tablet:hidden">
              <Carousel indicators navButtons autoScroll>
                {categories.map((category) => (
                  <MobileCategory category={category.data} key={category.id} />
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-h1">Testimonials</h2>
          <h5 className="text-h5">Words from Our Satisfied Customers</h5>
          <div className="mt-4">
            <div className="desktop:grid-row-2 tablet:grid-row-4 grid gap-2 tablet:grid tablet:grid-cols-2">
              {TESTIMONIALS.map((testimonial, index) => (
                <TestimonialCard testimonial={testimonial} key={index} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const WebCategory = ({ category, last }: { category: Category; last: boolean }) => {
  return (
    <div className={`flex h-40 items-center justify-center rounded-lg ${last ? "tablet:col-span-3 desktop:col-span-1" : ""}`}>
      <div className="relative flex h-40 w-full items-center justify-center rounded-lg">
        <Image
          src={category.image}
          alt={category.name}
          width={0}
          height={0}
          sizes="100%"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: "40%" }}
          className="rounded-lg"
        />
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-lg bg-black bg-opacity-50 p-4">
          <p className="text-h5 text-peach drop-shadow-lg">{category.name}</p>
        </div>
      </div>
    </div>
  );
};

const MobileCategory = ({ category }: { category: Category }) => {
  return (
    <div className="flex h-[100vw] w-screen items-center justify-center rounded-lg bg-peach-dark-3">
      <div className="relative flex h-[100vw] w-screen items-center justify-center rounded-lg">
        <Image
          src={category.image}
          alt={category.name}
          width={0}
          height={0}
          sizes="100%"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: "40%" }}
        />
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-50 p-4">
          <p className="text-h5 text-peach drop-shadow-lg">{category.name}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="flex flex-col rounded-xl bg-peach-dark-1 p-4">
      <div className="flex items-center justify-start gap-2 text-p">
        {testimonial.name}
        <p className="text-tiny">{generalizeDate(moment(testimonial.date, "DD/MM/YYYY").toDate())}</p>
      </div>
      <div className="mb-2 flex">
        {new Array(testimonial.rating).fill(0).map((_, index) => (
          <Star key={index} size={18} fill="#FFAC3A" color="#FFAC3A" />
        ))}
        {new Array(5 - testimonial.rating).fill(0).map((_, index) => (
          <Star key={index} size={18} fill="#B8B8B8" color="#B8B8B8" />
        ))}
      </div>
      <p className="text-tiny">{testimonial.review}</p>
    </div>
  );
};
