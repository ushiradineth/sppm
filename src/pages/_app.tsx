import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import { DM_Sans, Libre_Baskerville } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { XIcon } from "lucide-react";

import Layout from "@/components/Layout";

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
      <Layout>
        <NextNProgress
          color="#FFF6ED"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
          options={{ showSpinner: false }}
        />{" "}
        <style jsx global>
          {`
            :root {
              --font-sans: ${dmsans.style.fontFamily};
              --font-libre: ${libre.style.fontFamily};
            }
          `}
        </style>
        <Component {...pageProps} />
        <Analytics />
        <ToastContainer
          position="bottom-right"
          toastClassName={() =>
            "bg-peach-dark-1 border border-peach-dark-3 border relative flex p-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
          }
          bodyClassName={() => "text-sm text-black font-medium block flex flex-row p-3"}
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          closeButton={<XIcon color={"black"} />}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
