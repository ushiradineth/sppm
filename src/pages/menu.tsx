import { type GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

import icon from "../../public/icon.png";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      categories: await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          products: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
            },
          },
        },
      }),
    },
  };
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type Category = {
  id: string;
  name: string;
  description: string;
  products: Product[];
};

interface Props {
  categories: Category[];
}

export default function Menu({ categories }: Props) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Menu - The Brown Bean Coffee</title>
      </Head>
      <main className="flex w-full max-w-[1024px] flex-col items-center justify-center gap-12 bg-peach p-4 font-sans text-display text-primary tablet:gap-16">
        <div className="relative flex w-[100%] items-center justify-center">
          <Image
            src="https://ksapkpyzblzmnusrhtxk.supabase.co/storage/v1/object/public/ASSETS/product-image-1.jpg"
            alt={"Main Image"}
            width={0}
            height={0}
            sizes="100vw"
            style={{ objectFit: "cover" }}
            className="h-[512px] w-full rounded-lg opacity-40 tablet:h-[256px]"
          />
          <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-lg bg-black bg-opacity-50 p-4">
            <h1 className="text-center text-h1 text-peach drop-shadow-lg">Our Menu</h1>
            <div className="flex items-center justify-center">
              <Separator />
              <Image src={icon} alt="Brand Logo" width={40} />
              <Separator />
            </div>
            <h2 className="text-center text-h5 text-peach drop-shadow-lg">
              Expertly crafted, high-quality coffees roasted fresh to order on energy-efficient Loring Smart Roasters
            </h2>
          </div>
        </div>
        <Accordion defaultValue={String(router.query.category) ?? ""} type="single" collapsible className="relative w-full">
          {categories.map(
            (category) =>
              category.products.length > 0 && (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger>{category.name}</AccordionTrigger>
                  <AccordionContent>
                    <h2 className="mb-5">{category.description}</h2>
                    <div className="flex flex-col gap-4">
                      {category.products.map((product, index) => (
                        <ProductCard key={product.id} product={product} last={category.products.length - 1 === index} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ),
          )}
        </Accordion>
      </main>
    </>
  );
}

const ProductCard = ({ product, last }: { product: Product; last: boolean }) => {
  return (
    <Link href={`/product/${product.id}`} className={`flex items-center justify-center ${!last && "border-b pb-2"}`}>
      <div className="relative flex h-[100px] w-[100px] items-center justify-center p-8">
        <Image
          src={`${env.NEXT_PUBLIC_SUPABASE_URL}/${env.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}/${product.id}/0.jpg`}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-full"
        />
      </div>
      <div className="flex w-full items-center justify-center rounded-lg p-4">
        <div>
          <p className="text-h5 drop-shadow-lg">{product.name}</p>
          <p className="text-label font-normal drop-shadow-lg">{product.description}</p>
        </div>
        <p className="ml-auto pl-4 text-h5 drop-shadow-lg">LKR {product.price}</p>
      </div>
    </Link>
  );
};
