import { yupResolver } from "@hookform/resolvers/yup";
import { ExternalLink } from "lucide-react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useState } from "react";

import { type GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "@/utils/api";
import { LoginSchema, RegisterSchema, type LoginFormData, type RegisterFormData } from "@/utils/validators";

import FormFieldError from "@/components/FormFieldError";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import icon from "../../../public/icon.png";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ ctx: context });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default function Auth() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") return <Loader background />;

  return (
    <>
      <Head>
        <title>Authentication - The Coffee Shop</title>
      </Head>
      <main className="flex h-screen flex-col items-center justify-center">
        <Link href="/" className="absolute left-12 top-12 rounded-full border p-4 hover:bg-peach-dark-2">
          <Image src={icon} alt="Brand Logo" width={50} />
        </Link>
        <Tabs defaultValue={router.query.register ? "register" : "login"} className="w-[90%] mobile:w-[300px] tablet:w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registration</TabsTrigger>
          </TabsList>
          <Login />
          <Registration />
        </Tabs>
        <Card className="mt-2 w-[90%] mobile:w-[300px] tablet:w-[400px]">
          <CardHeader>
            <CardDescription className="flex items-center justify-center gap-2">
              <Link href={"/auth/reset"} className="text-xs">
                Forgot your password? Reset your password here.
              </Link>
              <ExternalLink size={"20px"} />
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </>
  );
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(LoginSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    const auth = await signIn("credentials", { email: data.Email, password: data.Password, redirect: false, callbackUrl: "/" });
    auth?.status === 401 && toast.error("Incorrect Credentials");
    if (auth?.status !== 401 && auth?.error) {
      console.error(auth.error);
      toast.error("An unknown error has occured");
    }
    setLoading(false);
  };

  return (
    <TabsContent value="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Be a member of our cozy cafe!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Email</Label>
              <Input id="email" placeholder="user@email.com" type="email" {...register("Email")} />
              <FormFieldError error={errors.Email?.message} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="********" type="password" {...register("Password")} />
              <FormFieldError error={errors.Password?.message} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" loading={loading}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </TabsContent>
  );
}

function Registration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(RegisterSchema),
  });

  const { mutate, isLoading } = api.user.register.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => toast.success("Account has been created"),
  });
  const onSubmit = (data: RegisterFormData) => mutate({ name: data.Name, email: data.Email, password: data.Password });

  return (
    <TabsContent value="register">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Registration</CardTitle>
            <CardDescription>Fill out the form to enjoy our products!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" type="text" {...register("Name")} />
              <FormFieldError error={errors.Name?.message} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="user@email.com" type="email" {...register("Email")} />
              <FormFieldError error={errors.Email?.message} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="********" type="password" {...register("Password")} />
              <FormFieldError error={errors.Password?.message} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" placeholder="********" type="password" {...register("ConfirmPassword")} />
              <FormFieldError error={errors.ConfirmPassword?.message} />
            </div>
          </CardContent>
          <CardFooter>
            <Button loading={isLoading}>Register</Button>
          </CardFooter>
        </Card>
      </form>
    </TabsContent>
  );
}
