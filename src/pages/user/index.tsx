import { type User } from "@prisma/client";
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

  const users = await prisma.user.findMany({
    take: ITEMS_PER_PAGE,
    skip: context.query.page ? (Number(context.query.page) - 1) * ITEMS_PER_PAGE : 0,
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  const count = await prisma.user.count({
    where,
  });

  const total = await prisma.user.count();

  return {
    props: {
      users: users.map((user) => ({
        ...user,
        createdAt: formalizeDate(user.createdAt),
      })),
      count,
      total,
    },
  };
};

type UserType = User & {
  _count: {
    orders: number;
  };
};

interface pageProps {
  users: UserType[];
  count: number;
  total: number;
}

export default function Index({ users: serverUsers, count, total }: pageProps) {
  const router = useRouter();
  const pageNumber = Number(router.query.page || 1);
  const [users, setUsers] = useState<UserType[]>(serverUsers);

  useEffect(() => {
    setUsers(serverUsers);
  }, [serverUsers]);

  return (
    <>
      <Head>
        <title>Users {router.query.page && `- Page ${router.query.page as string}`}</title>
      </Head>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>A list of all users.</CardDescription>
            <Search
              search={router.query.search as string}
              placeholder="Search for users"
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
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length !== 0 ? (
                  users.map((user, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-center">{user.name}</TableCell>
                        <TableCell className="text-center">{user.createdAt.toString()}</TableCell>
                        <TableCell className="text-center">{user._count.orders}</TableCell>
                        <TableCell>
                          <div className="flex gap-4">
                            <DeleteUser id={user.id} onSuccess={() => setUsers(users.filter((p) => p.id !== user.id))} />
                            <Link href={`/user/${user.id}/edit`}>
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
                <p>Currently, a total of {total} Users are registered on this website</p>
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

const DeleteUser = (props: { id: string; onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [deleteMenu, setDeleteMenu] = useState(false);

  const { mutate: deleteUser } = api.user.delete.useMutation({
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
    onError: () => toast.error("Failed to delete user"),
    onSuccess: () => {
      props.onSuccess();
      setDeleteMenu(false);
      toast.success("User has been deleted");
    },
  });

  return (
    <>
      {deleteMenu && (
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete the user.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteMenu(false)}>Cancel</AlertDialogCancel>
              <Button onClick={() => deleteUser({ id: props.id })}>{loading ? <Loader /> : <button>Delete</button>}</Button>
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
