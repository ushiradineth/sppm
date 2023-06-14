import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  const [asd, setAsd] = useState(1);
  return (
    <>
      <Head>
        <title>Welcome to SPPM</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
        <p>Welcome to SPPM</p>
      </main>
    </>
  );
};

export default Home;
