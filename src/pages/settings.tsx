import { yupResolver } from "@hookform/resolvers/yup";
import type { Admin, User } from "@prisma/client";
import { type Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";

import { type GetServerSideProps } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import { UserSchema, type UserFormData } from "@/utils/validators";

import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { env } from "@/env.mjs";
import { formalizeDate } from "@/lib/utils";
import { prisma } from "@/server/db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ ctx: context });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }

  const user =
    session?.user.role === "Admin"
      ? await prisma.admin.findUnique({ where: { id: session?.user.id } })
      : await prisma.user.findUnique({ where: { id: session?.user.id } });

  return {
    props: {
      user: {
        ...user,
        createdAt: formalizeDate(user?.createdAt),
      },
      session,
    },
  };
};

interface pageProps {
  user: Admin | User;
  session: Session;
}

export default function Settings({ user }: pageProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);

  const form = useForm<UserFormData>({
    resolver: yupResolver(UserSchema),
  });

  const { mutate: mutateUser, isLoading: isLoadingUser } = api.user.update.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      setUpload(true);
      toast.success("Account has been updated");
    },
  });

  const { mutate: mutateAdmin, isLoading: isLoadingAdmin } = api.admin.update.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      setUpload(true);
      toast.success("Account has been updated");
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (data.Name !== user.name) {
      session?.user.role === "Admin" ? mutateAdmin({ id: user.id, name: data.Name }) : mutateUser({ id: user.id, name: data.Name });
    }
    if (typeof form.watch("Image") !== "undefined" && form.watch("Image") !== "") {
      setUpload(true);
    }
  };

  useEffect(() => {
    if (user.name && user.email) {
      form.setValue("Name", user.name);
      form.setValue("Email", user.email);
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-[200px] space-y-8 mobile:w-[300px] tablet:w-[400px]">
                <FormField
                  control={form.control}
                  name="Image"
                  render={({}) => (
                    <FormItem>
                      <FormLabel>User Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          upload={upload}
                          setUpload={(value: boolean) => setUpload(value)}
                          itemId={user.id}
                          setLoading={(value: boolean) => setLoading(value)}
                          setValue={(value: string) => form.setValue("Image", value)}
                          onUpload={() => toast.success("Image has been uploaded")}
                          bucket={env.NEXT_PUBLIC_USER_ICON_BUCKET}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email of the user" disabled={true} defaultValue={user.email || ""} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the user" defaultValue={user.name || ""} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  loading={isLoadingAdmin || isLoadingUser || loading}
                  disabled={form.watch("Name") === user.name && (typeof form.watch("Image") === "undefined" || form.watch("Image") === "")}>
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
