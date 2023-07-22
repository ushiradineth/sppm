import { yupResolver } from "@hookform/resolvers/yup";
import { type Category } from "@prisma/client";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";

import { type GetServerSideProps } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import { ProductSchema, type ProductFormData } from "@/utils/validators";

import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

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

  const categories = await prisma.category.findMany({ select: { name: true, id: true } });

  return {
    props: {
      categories: categories.map((category) => ({
        ...category,
      })),
    },
  };
};

interface pageProps {
  categories: Category[];
}

type ImageState = {
  completed: boolean;
  loading: boolean;
};

export default function NewProduct({ categories }: pageProps) {
  const [upload, setUpload] = useState(false);
  const [imagesState, setImagesState] = useState<ImageState>({ completed: false, loading: false });

  const form = useForm<ProductFormData>({
    resolver: yupResolver(ProductSchema),
    defaultValues: {
      Available: true,
    },
  });

  const { mutate, isLoading, data } = api.product.create.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      setUpload(true);
      setImagesState({ completed: false, loading: true });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    mutate({
      name: data.Name,
      description: data.Description,
      category: data.Category,
      available: data.Available,
      price: data.Price,
    });
  };

  useEffect(() => {
    if (imagesState.completed) {
      toast.success("Product has been created");
    }
  }, [imagesState.completed]);

  return (
    <>
      <Head>
        <title>Create Product</title>
      </Head>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Product</CardTitle>
            <CardDescription>Create a new Product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-8">
                <FormField
                  control={form.control}
                  name="Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the Product" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the Product" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Price of the tier in LKR" type="number" step={"0.01"} min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-[400px]">
                            <SelectValue placeholder="Select a Category" />
                          </SelectTrigger>
                          <SelectContent className="w-max">
                            {categories.map((category, index) => {
                              return (
                                <SelectItem key={index} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Available</FormLabel>
                        <FormDescription>Is the product currently available?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Images"
                  render={({}) => (
                    <FormItem>
                      <FormLabel>Product Images</FormLabel>
                      <FormControl>
                        <ImageUpload
                          itemId={data?.id ?? ""}
                          upload={upload}
                          onUpload={() => setImagesState({ completed: true, loading: false })}
                          setUpload={(value: boolean) => setUpload(value)}
                          setLoading={(value: boolean) =>
                            setImagesState((prev) => {
                              return { ...prev, loading: value };
                            })
                          }
                          setValue={(value: string) => form.setValue("Images", value)}
                          multiple
                          bucket={env.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" loading={isLoading || imagesState.loading}>
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
