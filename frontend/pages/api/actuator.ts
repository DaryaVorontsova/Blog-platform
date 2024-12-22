import type { NextApiRequest, NextApiResponse } from 'next';

const actuatorHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'OK' });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default actuatorHandler;
