import { Menu, User, UserCircle2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import React, { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { BREAKPOINTS } from "@/utils/const";

import { env } from "@/env.mjs";
import useWindowDimensions from "@/hooks/useWindowDimensions";

import icon from "../../public/icon.png";
import Footer from "./Footer";
import Loader from "./Loader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "./ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const UNALLOWED_UNAUTHED_PATHS = ["/cart", "orders", "/settings"];
const NAVBAR_HIDDEN_PATHS = ["/auth", "/auth/reset"];

function Layout(props: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading" && router.pathname !== "/") return <Loader background />;

  if (status === "unauthenticated" && UNALLOWED_UNAUTHED_PATHS.includes(router.pathname)) router.push("/auth");
  if (status === "unauthenticated" && router.pathname.startsWith("/user")) router.push("/auth");
  if (status === "unauthenticated" && router.pathname.startsWith("/order")) router.push("/auth");

  if (status === "authenticated" && router.pathname === "/auth") router.push("/");

  return (
    <main className="flex min-h-screen flex-col bg-peach text-primary">
      <div
        style={{ zIndex: 100 }}
        className={`sticky top-0 flex h-14 items-center border-b bg-teak-light-1 backdrop-blur ${
          NAVBAR_HIDDEN_PATHS.includes(router.pathname) && "hidden"
        }`}>
        <Link href={"/"} className="mx-2 flex items-center justify-center gap-2">
          <Image src={icon} alt="Brand Logo" width={40} />
          <h1 className="text-h5 tablet:block">The Brown Bean Coffee</h1>
        </Link>
        <div className="ml-auto hidden items-center gap-4 tablet:flex">
          <NavItems />
          <AuthButton />
        </div>
        <NavSheet />
      </div>
      <div
        style={{ zIndex: 50, position: "relative" }}
        className={`flex flex-grow flex-col items-center justify-center scroll-smooth text-white ${
          !NAVBAR_HIDDEN_PATHS.includes(router.pathname) && "my-10"
        }`}>
        {props.children}
      </div>
      <div style={{ display: `${NAVBAR_HIDDEN_PATHS.includes(router.pathname) ? "none" : "block"}` }}>
        <Footer />
      </div>
    </main>
  );
}

export default Layout;

function NavItems() {
  const { data: session, status } = useSession();

  const UserNavItems = useCallback(
    () => (
      <div className="flex flex-col items-center justify-center gap-4 tablet:flex-row">
        <Link href={"/"}>Home</Link>
        <Link href={"/menu"}>Menu</Link>
        <Link href={"/location"}>Location</Link>
        <Link href={"/franchise"}>Franchise</Link>
      </div>
    ),
    [],
  );

  const AdminNavItems = useCallback(
    () => (
      <NavigationMenu className="absolute left-1/2 -translate-x-1/2 transform">
        <NavigationMenuList>
          <Link href={"/user"}>
            <NavigationMenuItem className={`${navigationMenuTriggerStyle()} bg-teak-dark-1 text-white hover:bg-teak-dark-2`}>
              Users
            </NavigationMenuItem>
          </Link>
          <Link href={"/order"}>
            <NavigationMenuItem className={`${navigationMenuTriggerStyle()} bg-teak-dark-1 text-white hover:bg-teak-dark-2`}>
              Orders
            </NavigationMenuItem>
          </Link>
          <NavigationMenuItem>
            <Link href={"/product"}>
              <NavigationMenuTrigger className="bg-teak-dark-1 text-white hover:bg-teak-dark-2">Products</NavigationMenuTrigger>
            </Link>
            <NavigationMenuContent>
              <div className={`md:grid-cols-2 flex w-[400px] flex-col gap-3 p-4`}>
                <Link href={"/product"}>
                  <NavigationMenuItem className={navigationMenuTriggerStyle()}>All Products</NavigationMenuItem>
                </Link>
                <Link href={"/product/new"}>
                  <NavigationMenuItem className={navigationMenuTriggerStyle()}>Create Product</NavigationMenuItem>
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={"/category"}>
              <NavigationMenuTrigger className="bg-teak-dark-1 text-white hover:bg-teak-dark-2">Categories</NavigationMenuTrigger>
            </Link>
            <NavigationMenuContent>
              <div className={`md:grid-cols-2 flex w-[400px] flex-col gap-3 p-4`}>
                <Link href={"/category"}>
                  <NavigationMenuItem className={navigationMenuTriggerStyle()}>All Categories</NavigationMenuItem>
                </Link>
                <Link href={"/category/new"}>
                  <NavigationMenuItem className={navigationMenuTriggerStyle()}>Create Category</NavigationMenuItem>
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    [],
  );

  return <>{status !== "loading" && <>{session?.user.role === "Admin" ? <AdminNavItems /> : <UserNavItems />}</>}</>;
}

function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const Profile = useCallback(
    () => (
      <Link href={session?.user.role === "User" ? `/user/${session?.user.id}` : `/`}>
        <MenubarItem className="flex flex-col items-center justify-center p-4">
          <Avatar>
            <AvatarImage
              src={`${env.NEXT_PUBLIC_SUPABASE_URL}/${env.NEXT_PUBLIC_USER_ICON_BUCKET}/${session?.user.id}/0.jpg`}
              alt="User Avatar"
              width={100}
              height={100}
            />
            <AvatarFallback>
              <UserCircle2 width={100} height={100} />
            </AvatarFallback>
          </Avatar>
          <p>{session?.user.name}</p>
          <p>{session?.user.email}</p>
        </MenubarItem>
      </Link>
    ),
    [session?.user.email, session?.user.id, session?.user.name, session?.user.role],
  );

  return (
    <>
      {status === "unauthenticated" ? (
        <>
          <div className="hidden tablet:block">
            <Button
              className="hidden w-fit bg-teak-dark-2 text-h6 font-light text-white hover:bg-teak-dark-1 tablet:ml-auto tablet:mr-4 tablet:block"
              onClick={() => router.push("/auth")}>
              Sign in
            </Button>
          </div>
          <p className="block text-p tablet:hidden">Sign in</p>
        </>
      ) : (
        status === "authenticated" && (
          <Menubar className="hidden w-fit border-none bg-teak-dark-1 hover:bg-teak-dark-2 tablet:ml-auto tablet:mr-4 tablet:flex">
            <MenubarMenu>
              <MenubarTrigger>
                <User className="text-peach-dark-1" />
              </MenubarTrigger>
              <MenubarContent className="hidden bg-peach tablet:block">
                <Profile />
                <MenubarSeparator />
                {session?.user.role !== "Admin" && (
                  <>
                    <Link href={`/cart`}>
                      <MenubarItem>Cart</MenubarItem>
                    </Link>
                    <Link href={`/orders`}>
                      <MenubarItem>Orders</MenubarItem>
                    </Link>
                    <MenubarSeparator />
                  </>
                )}
                <Link href={`/settings`}>
                  <MenubarItem>Settings</MenubarItem>
                </Link>
                <MenubarItem onClick={() => signOut()}>Log out</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )
      )}
    </>
  );
}

function NavSheet() {
  const { status } = useSession();
  const { width } = useWindowDimensions();
  const [openSheet, setOpenSheet] = useState(false);
  const router = useRouter();

  useEffect(() => setOpenSheet(false), [router.pathname]);

  useEffect(() => {
    if (openSheet && width > Number(BREAKPOINTS.tablet.split("px")[0])) {
      setOpenSheet(false);
    }
  }, [width]);

  return (
    <Sheet open={openSheet} onOpenChange={(open) => setOpenSheet(open)}>
      <SheetTrigger className="ml-auto mr-2 block tablet:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent className="mt-14 bg-peach">
        <div className="flex h-full flex-col items-center justify-start gap-4 px-4 py-12">
          <NavItems />
          <Separator />
          {status === "unauthenticated" && <Link href={"/auth"}>Sign in</Link>}
          {status === "authenticated" && (
            <div className="flex flex-col items-center justify-center gap-4 tablet:hidden">
              <Link href={`/cart`}>Cart</Link>
              <Link href={`/orders`}>Orders</Link>
            </div>
          )}
          {status === "authenticated" && <Separator />}
          {status === "authenticated" && (
            <div className="flex flex-col items-center justify-center gap-4 tablet:hidden">
              <AuthButton />
              <Link href={`/settings`}>Settings</Link>
              <Link href={"/"} onClick={() => signOut()}>
                Log out
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
