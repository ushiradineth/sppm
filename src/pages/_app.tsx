import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import { DM_Sans, Libre_Baskerville } from "@next/font/google";

const dmsans = DM_Sans({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-sans",
});
const libre = Libre_Baskerville({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-libre",
});

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <style jsx global>
        {`
          :root {
            --font-sans: ${dmsans.style.fontFamily};
            --font-libre: ${libre.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
