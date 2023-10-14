import { type Item, type Order, type Product } from "@prisma/client";
import { getSession } from "next-auth/react";

import { type GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { type Status } from "@/utils/validators";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { env } from "@/env.mjs";
import { formalizeDate } from "@/lib/utils";
import { prisma } from "@/server/db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ ctx: context });

  if (!session || session.user.role === "Admin") {
    return {
      redirect: {
        destination: "/",
      },
      props: {},
    };
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return {
    props: {
      orders: orders.map((order) => ({
        ...order,
        createdAt: formalizeDate(order.createdAt),
        items: order.items.map((item) => ({ ...item, product: { ...item.product, createdAt: formalizeDate(item.product.createdAt) } })),
      })),
    },
  };
};

interface ItemWithProduct extends Item {
  product: Product;
}

interface OrderWithItems extends Order {
  items: ItemWithProduct[];
}

interface Props {
  orders: OrderWithItems[];
}

export default function Orders({ orders }: Props) {
  return (
    <>
      <Head>
        <title>Orders - The Coffee Shop</title>
      </Head>
      <main className="flex w-full max-w-[1024px] flex-col items-center justify-center gap-12 bg-peach p-4 font-sans text-display text-primary tablet:gap-16">
        <Accordion type="single" collapsible className="relative w-full">
          {orders.map((order) => (
            <AccordionItem key={order.id} value={order.id}>
              <AccordionTrigger>
                <div className="flex w-full items-center justify-center text-label">
                  <p>Order No: {order.id}</p>
                  <p
                    style={{ borderColor: getStatusColor(order.status as Status), color: getStatusColor(order.status as Status) }}
                    className="ml-auto mr-2 rounded-xl border-2 p-1">
                    {order.status}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h2 className="mb-5">Order items</h2>
                <div className="flex flex-col gap-4">
                  {order.items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                  <p className="ml-auto">
                    LKR{" "}
                    {`${order.items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0)} for ${order.items.reduce(
                      (acc, curr) => acc + curr.quantity,
                      0,
                    )} items`}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </>
  );
}

const ItemCard = ({ item }: { item: ItemWithProduct }) => {
  return (
    <Link href={`/product/${item.product.id}`} className={`flex items-center justify-center border-b pb-2`}>
      <div className="relative flex h-[100px] w-[100px] items-center justify-center p-8">
        <Image
          src={`${env.NEXT_PUBLIC_SUPABASE_URL}/${env.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}/${item.product.id}/0.jpg`}
          alt={item.product.name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-full"
        />
      </div>
      <div className="flex w-full items-center justify-center gap-4 rounded-lg p-4">
        <div>
          <p className="text-h6 drop-shadow-lg tablet:text-h5">{item.product.name}</p>
          <p className="text-p font-normal drop-shadow-lg tablet:text-h6">{item.product.description}</p>
        </div>
        <p className="ml-auto text-tiny drop-shadow-lg tablet:text-label">
          LKR {item.product.price * item.quantity} for {item.quantity} PC
        </p>
      </div>
    </Link>
  );
};

const getStatusColor = (status: Status) => {
  switch (status) {
    case "Cancelled":
      return "rgb(239 68 68)";
    case "Processing":
      return "rgb(234 179 8)";
    case "Preparing":
      return "rgb(234 179 8)";
    case "Prepared":
      return "rgb(234 179 8)";
    case "OTW":
      return "rgb(249 115 22)";
    case "Completed":
      return "rgb(34 197 94)";
  }
};
