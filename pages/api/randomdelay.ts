import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // We need to return a new Promise here if we are asynchronously handling processing
  // PRO TIP: We also need to make sure ANY and EVERY call that uses this Promise
  //          MUST HAVE A CATCH to handle the rejection
  return new Promise<void>((resolve, reject) => {
    const { method, query } = req;
    const { id } = query;

    // With Math.random() we get random floating point number between 0 and 1,
    // including 0. On order to get from a floating point number between 0 and 1 to
    // a proper amount of milliseconds we multiply by 10000, which will give us a
    // timeout in a range between 0 seconds and 10 seconds.
    const RANDOM_DELAY_IN_SECONDS = Math.random() * 10000;

    // DEVELOPMENT ONLY: This example will randomly create failures in the backend API
    const FAILURE_THRESHOLD = 78;
    const FAILURE_VALUE = Math.random() * 100;

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

          // DEVELOPMENT ONLY: Here is a simulated failure with an appropriate
          // promise rejection
          if (FAILURE_VALUE >= FAILURE_THRESHOLD) {
            console.error(
              `\tReceived failure value ${FAILURE_VALUE} and we have NOT handled it`
            );

            // Do any server-side logic or clean-up here before rejecting the request
            return reject(`Sorry - ID ${id} failed to successfully complete.`);
          }

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
