import { type Product } from "@prisma/client";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

import { useState } from "react";

import { type GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "@/utils/api";

import { Button } from "@/components/ui/button";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ ctx: context });

  const product = await prisma.product.findUnique({
    where: { id: context.params?.id as string },
    select: { id: true, name: true, price: true, description: true },
  });

  if (!product) {
    return {
      props: {},
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {
      product,
      InCart: Boolean((await prisma.item.findMany({ where: { userId: session?.user.id, productId: product.id } })).length > 0),
    },
  };
};

interface pageProps {
  product: Product;
  InCart: string;
}

export default function ProductPage({ product, InCart }: pageProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(0);

  const { mutate: Checkout, isLoading: CheckingOut } = api.cart.create.useMutation({
    onSuccess: () => {
      router.push("/cart");
    },
  });

  const { mutate: AddToCart, isLoading: AddingToCart } = api.cart.create.useMutation({
    onSuccess: () => {
      toast("Added to cart");
      location.reload();
    },
  });

  return (
    <>
      <Head>
        <title>{product.name} - The Brown Bean Coffee</title>
      </Head>
      <main className="grid grid-flow-row grid-rows-2 items-start justify-center gap-4 p-4 text-primary tablet:grid-cols-2 tablet:grid-rows-none">
        <div>
          <Image
            src={`${env.NEXT_PUBLIC_SUPABASE_URL}/${env.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}/${product.id}/0.jpg`}
            alt={`${product.name} image`}
            width={1000}
            height={1000}
            style={{ objectFit: "cover" }}
            className="h-[343px] w-full rounded-lg tablet:h-[700px]"
          />
        </div>
        <div className="flex h-full flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-h3">{product.name}</h1>
            <p className="text-h5">{product.description}</p>
          </div>
          <div>
            <div className="flex select-none border-b-2 border-black py-4">
              <p className="text-h6">Quantity</p>
              <div className="ml-auto flex w-20 justify-evenly">
                <p className="cursor-pointer text-h6" onClick={() => quantity !== 0 && setQuantity(quantity - 1)}>
                  -
                </p>
                <p className="select-none text-h6">{quantity}</p>
                <p className="cursor-pointer text-h6" onClick={() => quantity < 10 && setQuantity(quantity + 1)}>
                  +
                </p>
              </div>
            </div>
            <div className="flex border-b-2 border-black py-4">
              <p className="text-h6">Price</p>
              <p className="ml-auto text-h6">LKR {product.price}</p>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <div className="flex border-b-2 border-black py-4">
              <p className="text-h6">Price</p>
              <p className="ml-auto text-h6">LKR {(product.price * quantity).toFixed(2)}</p>
            </div>
            <div className="grid grid-flow-col grid-cols-2 gap-2">
              {InCart ? (
                <Link href={"/cart"} className="col-span-2 grid">
                  <Button>
                    <CheckCircle2 strokeWidth={3} className="mr-2 h-4 w-4 text-green-500" /> Added to cart
                  </Button>
                </Link>
              ) : (
                <>
                  <Button disabled={quantity === 0} onClick={() => Checkout({ productId: product.id, quantity })} loading={CheckingOut}>
                    <CheckCircle2 strokeWidth={3} className="mr-2 h-4 w-4" /> Checkout
                  </Button>
                  <Button disabled={quantity === 0} onClick={() => AddToCart({ productId: product.id, quantity })} loading={AddingToCart}>
                    <ShoppingCart strokeWidth={3} className="mr-2 h-4 w-4" /> Add to cart
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
