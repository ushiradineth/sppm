import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome to SPPM</title>
      </Head>
      <main className="flex flex-col items-center justify-center bg-peach font-sans text-display text-primary">
        <p>Landing Page TODO</p>
      </main>
    </>
  );
};

export default Home;
