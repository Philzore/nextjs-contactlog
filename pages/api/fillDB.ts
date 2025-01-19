// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import mongodb from "@/utils/mongodb";
import contactDB from "../../db/contacts.json";
import contactModel from "@/models/Contact";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>,
) {
  const { method } = req;

  if (method === 'GET') {
    await mongodb.dbConnect();
    await contactModel.deleteMany();
    await contactModel.insertMany(contactDB);
    const contacts = await contactModel.find({});
    await mongodb.dbDisconnect;
    res.status(200).json({ contacts });
  }
}
