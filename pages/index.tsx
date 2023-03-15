import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

type SimulatedJobType = {
  id: number;
};

const createSimulatedJobs = (numberOfJobs: number): SimulatedJobType[] => {
  const arr: SimulatedJobType[] = [];

  for (let i = 0; i < numberOfJobs; i++) {
    const JOB_ID = i;
    const simulatedJob = { id: JOB_ID };

    arr.push(simulatedJob);
  }

  // [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}]
  return arr;
};

async function makeAPIRequest(job: SimulatedJobType) {
  return new Promise<void>((resolve, reject) => {
    fetch(`api/randomdelay?id=${job.id}`)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        // If there was a server error, we need to reject and handle this
        return reject(`Unable to successfully process ID ${job.id}`);
      });
  });
}

export default function Home() {
  const dataFetchedRef = useRef(false);
  const [data, setData] = useState<SimulatedJobType[] | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // If we don't use a ref to keep track of our fetching, we will have two API calls instead of the one we expect
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const createOurSimulatedJobs = async () => {
      setLoading(true);

      // Create our simulated jobs
      const simulatedJobs = createSimulatedJobs(10);
      console.log(simulatedJobs);

      // Can your API, backend services, and backend datastores handle all of these at once?
      // You've set up scaling and are a true professional, right? 😈
      const assaultTheServerWithPromises = () => {
        let promiseArray = [];
        for (let i = 0; i < simulatedJobs.length; i++) {
          promiseArray.push(
            makeAPIRequest(simulatedJobs[i])
              .then(() => console.log(`Processed ID ${simulatedJobs[i].id}`))
              .catch((err) => {
                // Do any client-side logic here to let the user know the error is handled
                console.log(
                  `myPromises: ** HANDLE THE ERROR CASE - ${err} - ***`
                );
              })
          );
        }
        return promiseArray;
      };

      // Wanna play it safe? If time isn't critical, you can use these promises to
      // send requests to the server sequentially 😇
      const sequentialPromises = async () => {
        let promiseArray = [];
        for (let i = 0; i < simulatedJobs.length; i++) {
          promiseArray.push(
            await makeAPIRequest(simulatedJobs[i])
              .then(() => console.log(`Processed ID ${simulatedJobs[i].id}`))
              .catch((err) => {
                // Do any client-side logic here to let the user know the error is handled
                console.log(
                  `mySequentialPromises: ** HANDLE THE ERROR CASE - ${err} - ***`
                );
              })
          );
        }
        return promiseArray;
      };

      // Get ready, backend API. All the requests are being blasted your way here.
      const sendAllTheJobs = await Promise.all(assaultTheServerWithPromises());

      // Be kind. This example will allow each job to process sequentially and
      // will take more time to complete. On the upside, the load to our backend is light. 😇
      const sequentialJobs = await Promise.all(await sequentialPromises());

      setData(simulatedJobs);
      setLoading(false);
    };

    createOurSimulatedJobs();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No data available.</p>;

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Let's get started by editing&nbsp;
            <code className={styles.code}>pages/index.tsx</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Docs <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Templates <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Deploy <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
