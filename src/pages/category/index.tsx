import { type Category } from "@prisma/client";
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

  const where =
    search !== ""
      ? {
          OR: [{ name: { search: search } }, { description: { search: search } }],
        }
      : {};

  const categories = await prisma.category.findMany({
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
    },
  });

  const count = await prisma.category.count({ where });

  const total = await prisma.category.count();

  return {
    props: {
      categories: categories.map((category) => ({
        ...category,
        createdAt: formalizeDate(category.createdAt),
      })),
      count,
      total,
    },
  };
};

type CategoryType = Category & {
  _count: {
    products: number;
  };
};

interface pageProps {
  categories: CategoryType[];
  count: number;
  total: number;
}

export default function Categories({ categories: serverCategories, count, total }: pageProps) {
  const router = useRouter();
  const pageNumber = Number(router.query.page || 1);
  const [categories, setCategories] = useState<CategoryType[]>(serverCategories);

  useEffect(() => {
    setCategories(serverCategories);
  }, [serverCategories]);

  return (
    <>
      <Head>
        <title>Categories {router.query.page && `- Page ${router.query.page as string}`}</title>
      </Head>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>A list of all categories.</CardDescription>
            <Search
              search={router.query.search as string}
              placeholder="Search for categories"
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
                  <TableHead className="text-center">Created At</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length !== 0 ? (
                  categories.map((category, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-center">
                          <Link href={`/menu/#${category.name ?? ""}`}>{category.name}</Link>
                        </TableCell>
                        <TableCell className="text-center">{category.createdAt.toString()}</TableCell>
                        <TableCell className="text-center">
                          <Link href={`/product?search=${category.id}`}>{category._count.products}</Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-4">
                            <DeleteCategory
                              id={category.id}
                              onSuccess={() => setCategories(categories.filter((p) => p.id !== category.id))}
                            />
                            <Link href={`/category/${category.id}/edit`}>
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
                <p>Currently, a total of {total} Categories are on this website</p>
              </TableCaption>
              <TableCaption>
                <PageNumbers
                  count={count}
                  itemsPerPage={ITEMS_PER_PAGE}
                  pageNumber={pageNumber}
                  path={router.asPath}
                  params={router.query}
                />
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

const DeleteCategory = (props: { id: string; onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [deleteMenu, setDeleteMenu] = useState(false);

  const { mutate: deleteCategory } = api.category.delete.useMutation({
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      setDeleteMenu(false);
    },
    onError: () => toast.error("Failed to delete category"),
    onSuccess: () => {
      props.onSuccess();
      toast.success("Category has been deleted");
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
                This action cannot be undone. This will permanently delete the category and its products.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteMenu(false)}>Cancel</AlertDialogCancel>
              <Button onClick={() => deleteCategory({ id: props.id })}>{loading ? <Loader /> : <button>Delete</button>}</Button>
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
