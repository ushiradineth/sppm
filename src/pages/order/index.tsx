import { type Order } from "@prisma/client";
import { Edit, Trash } from "lucide-react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";

import { type GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "@/utils/api";

import Loader from "@/components/Loader";
import PageNumbers from "@/components/PageNumbers";
import Search from "@/components/Search";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { formalizeDate } from "@/lib/utils";
import { prisma } from "@/server/db";

const ITEMS_PER_PAGE = 10;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ ctx: context });

  if (!session || session.user.role !== "Admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }

  const search = context.query.search ? (context.query.search as string).split(" ").join(" | ") : "";

  const searchQuery = {
    OR: [{ name: { search: search } }],
  };

  const where = search !== "" ? searchQuery : {};

  const orders = await prisma.order.findMany({
    take: ITEMS_PER_PAGE,
    skip: context.query.page ? (Number(context.query.page) - 1) * ITEMS_PER_PAGE : 0,
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const count = await prisma.order.count({
    where,
  });

  const total = await prisma.order.count();

  return {
    props: {
      orders: orders.map((order) => ({
        ...order,
        createdAt: formalizeDate(order.createdAt),
      })),
      count,
      total,
    },
  };
};

type OrderType = Order & {
  user: {
    name: string;
  };
  _count: {
    products: number;
  };
};

interface pageProps {
  orders: OrderType[];
  count: number;
  total: number;
}

export default function Index({ orders: serverOrders, count, total }: pageProps) {
  const router = useRouter();
  const pageNumber = Number(router.query.page || 1);
  const [orders, setOrders] = useState<OrderType[]>(serverOrders);

  useEffect(() => {
    setOrders(serverOrders);
  }, [serverOrders]);

  return (
    <>
      <Head>
        <title>Orders {router.query.page && `- Page ${router.query.page as string}`}</title>
      </Head>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>A list of all orders.</CardDescription>
            <Search
              search={router.query.search as string}
              placeholder="Search for orders"
              path={router.asPath}
              params={router.query}
              count={count}
            />
          </CardHeader>
          <CardContent>
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">User name</TableHead>
                  <TableHead className="text-center">Created At</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length !== 0 ? (
                  orders.map((order, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-center">{order.user.name}</TableCell>
                        <TableCell className="text-center">{order.createdAt.toString()}</TableCell>
                        <TableCell className="text-center">{order._count.products}</TableCell>
                        <TableCell>
                          <div className="flex gap-4">
                            <DeleteOrder id={order.id} onSuccess={() => setOrders(orders.filter((p) => p.id !== order.id))} />
                            <Link href={`/order/${order.id}/edit`}>
                              <Edit />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption>
                <p>Currently, a total of {total} Orders are on this website</p>
              </TableCaption>
            </Table>
          </CardContent>
          {count !== 0 && count > ITEMS_PER_PAGE && (
            <CardFooter className="flex justify-center">
              <TableCaption>
                <PageNumbers
                  count={count}
                  itemsPerPage={ITEMS_PER_PAGE}
                  pageNumber={pageNumber}
                  path={router.asPath}
                  params={router.query}
                />
              </TableCaption>
            </CardFooter>
          )}
        </Card>
      </main>
    </>
  );
}

const DeleteOrder = (props: { id: string; onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [deleteMenu, setDeleteMenu] = useState(false);

  const { mutate: deleteOrder } = api.order.delete.useMutation({
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
    onError: () => toast.error("Failed to delete order"),
    onSuccess: () => {
      props.onSuccess();
      setDeleteMenu(false);
      toast.success("Order has been deleted");
    },
  });

  return (
    <>
      {deleteMenu && (
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete the order.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteMenu(false)}>Cancel</AlertDialogCancel>
              <Button onClick={() => deleteOrder({ id: props.id })}>{loading ? <Loader /> : <button>Delete</button>}</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <button onClick={() => setDeleteMenu(true)}>
        <Trash />
      </button>
    </>
  );
};
