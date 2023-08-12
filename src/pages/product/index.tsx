import { type Product } from "@prisma/client";
import { Edit, Trash } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
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
    OR: [
      { name: { search: search } },
      {
        category: { OR: [{ name: { search: search } }, { description: { search: search } }, { id: { search: search } }] },
      },
      { vendor: { OR: [{ name: { search: search } }, { id: { search: search } }] } },
    ],
  };

  const where = search !== "" ? searchQuery : {};

  const products = await prisma.product.findMany({
    take: ITEMS_PER_PAGE,
    skip: context.query.page ? (Number(context.query.page) - 1) * ITEMS_PER_PAGE : 0,
    where: { ...where },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  const count = await prisma.product.count({ where: { ...where } });

  const total = await prisma.product.count();

  return {
    props: {
      products: products.map((product) => ({
        ...product,
        createdAt: formalizeDate(product.createdAt),
      })),
      count,
      total,
    },
  };
};

interface ProductWithDetails extends Product {
  category: {
    name: string;
    id: string;
  };
}

interface pageProps {
  products: ProductWithDetails[];
  count: number;
  total: number;
}

export default function ProductsPage({ products: serverProducts, count, total }: pageProps) {
  const { data: session } = useSession();

  const router = useRouter();
  const pageNumber = Number(router.query.page || 1);
  const [products, setProducts] = useState<ProductWithDetails[]>(serverProducts);

  useEffect(() => {
    setProducts(serverProducts);
  }, [serverProducts]);

  return (
    <>
      <Head>
        <title>Products {router.query.page && `- Page ${router.query.page as string}`}</title>
      </Head>
      <main className="flex flex-col items-center">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>A list of all products.</CardDescription>
            <Search
              search={router.query.search as string}
              placeholder="Search for products"
              path={router.asPath}
              params={router.query}
              count={count}
            />
          </CardHeader>
          <CardContent>
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Category</TableHead>
                  <TableHead className="text-center">Created At</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length !== 0 ? (
                  products.map((product, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-center">
                          <Link href={`/product/${product.id}`}>{product.name}</Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/category/${product.category.id}`}>{product.category.name}</Link>
                        </TableCell>
                        <TableCell className="text-center">{product.createdAt.toString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-4">
                            <DeleleProduct id={product.id} onSuccess={() => setProducts(products.filter((p) => p.id !== product.id))} />
                            <Link href={`/product/${product.id}/edit`}>
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
                <p>Currently, a total of {total} Product(s) are on this website.</p>
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

const DeleleProduct = (props: { id: string; onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [deleteMenu, setDeleteMenu] = useState(false);

  const { mutate: deleteProduct } = api.product.delete.useMutation({
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
    onError: () => toast.error("Failed to delete product"),
    onSuccess: () => {
      props.onSuccess();
      setDeleteMenu(false);
      toast.success("Product has been deleted");
    },
  });

  return (
    <>
      {deleteMenu && (
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product, including all the tiers and subsciptions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteMenu(false)}>Cancel</AlertDialogCancel>
              <Button onClick={() => deleteProduct({ id: props.id })}>{loading ? <Loader /> : <button>Delete</button>}</Button>
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
