import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // We need to return a new Promise here if we are asynchronously handling processing
  return new Promise<void>((resolve) => {
    const { method, query } = req;
    const { id } = query;

    // With Math.random() we get random floating point number between 0 and 1,
    // including 0. On order to get from a floating point number between 0 and 1 to
    // a proper amount of milliseconds we multiply by 10000, which will give us a
    // timeout in a range between 0 seconds and 10 seconds.
    const RANDOM_DELAY_IN_SECONDS = Math.random() * 10000;

    switch (method) {
      case "GET":
        console.log(
          `Request ${id} will have a simulated delay of ${
            RANDOM_DELAY_IN_SECONDS / 1000
          } second(s)`
        );

        // Fake an expensive operation (like archiving data)
        setTimeout(async () => {
          console.log(`Completing request ${id}`);
          return resolve(handleGET(req, res));
        }, RANDOM_DELAY_IN_SECONDS);

        break;

      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({
          data: null,
          error: { message: `Method ${method} Not Allowed` },
        });
    }
  });
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const { id } = query;

  return res.status(200).json({
    data: {
      id,
      message: "Your request was successful.",
    },
    error: null,
  });
};
