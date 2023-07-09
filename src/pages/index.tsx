import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome to SPPM</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-peach font-sans text-display text-primary">
        <p>Welcome to SPPM-1 edit</p>
      </main>
    </>
  );
};

export default Home;
