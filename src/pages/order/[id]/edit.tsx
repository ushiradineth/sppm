import { yupResolver } from "@hookform/resolvers/yup";
import { type Category, type Product } from "@prisma/client";
import { Minus, Plus } from "lucide-react";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useEffect } from "react";

import { type GetServerSideProps } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import { OrderEditSchema, status, type OrderEditFormData, type Status } from "@/utils/validators";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { prisma } from "@/server/db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ ctx: context });

  if (!session || session.user.role === "User") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }

  const order = await prisma.order.findFirst({
    where: { id: context.params?.id as string },
    select: {
      id: true,
      user: {
        select: {
          id: true,
        },
      },
      items: {
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      status: true,
      delivery: true,
    },
  });

  const products = await prisma.product.findMany({ select: { id: true, name: true } });

  if (!order) return { props: {} };

  return {
    props: {
      order,
      products,
    },
  };
};

interface Order {
  id: string;
  user: {
    id: string;
  };
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
    };
  }[];
  status: Status;
  delivery: boolean;
}

interface pageProps {
  order: Order;
  products: Product[];
  categories: Category[];
}

export default function EditProduct({ order, products }: pageProps) {
  const form = useForm<OrderEditFormData>({
    resolver: yupResolver(OrderEditSchema),
  });

  const { mutate, isLoading } = api.order.update.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success("Order has been updated");
      location.reload();
    },
  });

  const onSubmit = (data: OrderEditFormData) => {
    mutate({
      delivery: data.Delivery,
      status: data.Status,
      orderId: order.id,
      userId: order.user.id,
      items: data.Items.map((item) => {
        return { id: item.id ?? "", quantity: item.quantity, productId: item.product.id };
      }),
    });
  };

  useEffect(() => {
    if (order) {
      form.setValue("Items", order.items);
      form.setValue("Delivery", order.delivery);
      form.setValue("Status", order.status);
    }
  }, [order]);

  if (!order) return <div>Order not found</div>;

  return (
    <>
      <Head>
        <title>Edit Order</title>
      </Head>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Order</CardTitle>
            <CardDescription>Edit Order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-8">
                <FormField
                  control={form.control}
                  name="Status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-[400px]">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent className="w-max">
                            {status.map((status, index) => {
                              return (
                                <SelectItem key={index} value={status}>
                                  {status}
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
                  name="Items"
                  render={({}) => (
                    <FormItem>
                      <FormLabel>Products</FormLabel>
                      <FormControl>
                        <>
                          {form.getValues("Items")?.filter((item) => item.quantity > 0).length > 0 && (
                            <Card className="select-none p-4">
                              <ul className="list-disc">
                                {(Array.isArray(form.getValues("Items"))
                                  ? form.getValues("Items").filter((item) => item.quantity > 0)
                                  : []
                                ).map((item, index) => (
                                  <li key={index} className="flex">
                                    <p className="w-full truncate">{item.product.name}</p>
                                    <div className="ml-auto flex gap-2">
                                      <Minus
                                        className="cursor-pointer"
                                        onClick={() => {
                                          form.setValue(
                                            "Items",
                                            form.getValues("Items").map((item, innerIndex) => {
                                              if (index === innerIndex) {
                                                return {
                                                  ...item,
                                                  quantity: item.quantity - 1,
                                                };
                                              } else {
                                                return item;
                                              }
                                            }),
                                          );
                                        }}
                                      />
                                      <p className="select-none">{item.quantity}</p>
                                      <Plus
                                        className="cursor-pointer"
                                        onClick={() =>
                                          form.setValue(
                                            "Items",
                                            form.getValues("Items").map((item, innerIndex) => {
                                              if (index === innerIndex) {
                                                return {
                                                  ...item,
                                                  quantity: item.quantity + 1,
                                                };
                                              } else {
                                                return item;
                                              }
                                            }),
                                          )
                                        }
                                      />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </Card>
                          )}
                          <div className="flex flex-row gap-2">
                            <Select
                              onValueChange={(value) => {
                                if (form.getValues("Items")?.filter((item) => item.product.id === JSON.parse(value).id)[0] !== undefined) {
                                  form.setValue(
                                    "Items",
                                    form.getValues("Items").map((item) => {
                                      if (item.product.id === JSON.parse(value).id) {
                                        return {
                                          ...item,
                                          quantity: item.quantity + 1,
                                        };
                                      } else {
                                        return item;
                                      }
                                    }),
                                  );
                                } else {
                                  form.setValue("Items", [...form.getValues("Items"), { id: "", product: JSON.parse(value), quantity: 1 }]);
                                }
                              }}
                              value={undefined}>
                              <SelectTrigger className="w-[400px]">
                                <SelectValue placeholder="Add a product" />
                              </SelectTrigger>
                              <SelectContent className="w-max">
                                {products.map((product, index) => {
                                  return (
                                    <SelectItem key={index} value={JSON.stringify(product)}>
                                      {product.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Delivery"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Deliver</FormLabel>
                        <FormDescription>Is this product delivered to the customer?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" loading={isLoading}>
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
