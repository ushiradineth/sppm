import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

import { useState } from "react";

import { type GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";

import { api } from "@/utils/api";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ ctx: context });

  if (!session || session.user.role === "Admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {
      cart: (
        await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            cart: {
              select: {
                id: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    category: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                quantity: true,
              },
            },
          },
        })
      )?.cart,
    },
  };
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    name: string;
  };
};

type Item = {
  id: string;
  product: Product;
  quantity: number;
};

interface Props {
  cart: Item[];
}

export default function Cart({ cart: serverCart }: Props) {
  const [cart, setCart] = useState(serverCart);
  const [delivery, setDelivery] = useState(false);

  const { mutate: clearCart, isLoading } = api.user.clearCart.useMutation({ onSuccess: () => toast("Order has been created") });
  const { mutate } = api.order.create.useMutation({ onSuccess: () => clearCart({ ids: cart.map((item) => item.id) }) });

  return (
    <>
      <Head>
        <title>Cart - The Coffee Shop</title>
      </Head>
      <main className="flex w-full max-w-[1024px] flex-col items-center justify-center gap-12 bg-peach p-4 font-sans text-display text-primary tablet:gap-16">
        <div className="flex w-[100%] flex-col items-start justify-start gap-4">
          <h1 className="text-h3">Cart</h1>
          <div className="flex w-full flex-col-reverse gap-4 tablet:flex-row">
            <div className="flex flex-col gap-2">
              {cart.length === 0 && <div className="text-label text-black">No items in cart</div>}
              {cart.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onChange={(id, quantity) =>
                    setCart((cart) => cart.map((prevItem) => (prevItem.id === id ? { ...prevItem, quantity } : prevItem)))
                  }
                  onDelete={(id) => setCart((cart) => cart.filter((prevItem) => prevItem.id !== id))}
                />
              ))}
            </div>
            {cart.length !== 0 && (
              <div className="flex h-fit flex-col gap-2 rounded-xl bg-white p-4 shadow-lg first-letter:w-[100%] tablet:ml-auto tablet:w-[222px]">
                <h2 className="text-label">Order summery</h2>
                <div className="flex w-full flex-col items-center justify-between gap-4">
                  <div className="flex w-full justify-between">
                    <p className="text-tiny">Item{cart.length > 1 && "s"}</p>
                    <p className="text-tiny">{cart.length}</p>
                  </div>
                  <Separator className="bg-black" />
                  <div className="flex w-full justify-between">
                    <p className="text-tiny">Total</p>
                    <p className="text-tiny">LKR {cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-center text-label">
                    Pick up
                    <Switch onChange={() => setDelivery(!delivery)} />
                    Deliver
                  </div>
                  <Button
                    onClick={() =>
                      mutate({
                        delivery,
                        items: cart.map((item) => item.id),
                        status: "Processing",
                      })
                    }
                    loading={isLoading}
                    className="w-full">
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

const ItemCard = ({
  item,
  onChange,
  onDelete,
}: {
  item: Item;
  onChange: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const { mutate, isLoading } = api.cart.update.useMutation({
    onSuccess: (data) => {
      if (data === 0) {
        onDelete(item.id);
      } else {
        onChange(item.id, data);
        setQuantity(data);
      }
    },
  });

  return (
    <div className="flex w-full items-center justify-center rounded-2xl bg-white p-4 shadow-lg tablet:w-[428px]">
      <div className="relative flex h-[100px] w-[100px] items-center justify-center p-8">
        <Image
          src={`${env.NEXT_PUBLIC_SUPABASE_URL}/${env.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}/${item.product.id}/0.jpg`}
          alt={item.product.name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-2xl"
        />
      </div>
      <div className="flex w-full items-center justify-center gap-8 rounded-lg p-4">
        <div>
          <p className="text-label font-normal drop-shadow-lg">{item.product.category.name}</p>
          <p className="text-h5 drop-shadow-lg">{item.product.name}</p>
        </div>
        <Separator orientation="vertical" className="ml-auto h-[112px] bg-primary" />
        <div className="flex flex-col items-center justify-center">
          <div className="flex w-[60px] items-center justify-center text-center">
            {isLoading ? (
              <Loader />
            ) : (
              <div className="flex w-full justify-evenly">
                <p className="cursor-pointer text-h6" onClick={() => mutate({ id: item.id, quantity: quantity - 1 })}>
                  -
                </p>
                <p className="select-none text-h6">{quantity}</p>
                <p className="cursor-pointer text-h6" onClick={() => quantity < 10 && mutate({ id: item.id, quantity: quantity + 1 })}>
                  +
                </p>
              </div>
            )}
          </div>
          <p className="text-center text-h6 drop-shadow-lg">LKR {item.product.price}</p>
        </div>
      </div>
    </div>
  );
};
