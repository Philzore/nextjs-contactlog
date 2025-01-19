import type { NextApiRequest, NextApiResponse } from "next";
import mongodb from "@/utils/mongodb";
import contactModel from "@/models/Contact";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<unknown>,
) {
    const { method } = req;
    await mongodb.dbConnect();
    if (method === 'GET') {
        try {
            const contacts = await contactModel.find();
            res.status(200).json(contacts);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    if (method === 'POST') {
        try {
            const contact = await contactModel.create(req.body);
            res.status(201).json(contact);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    if (method === 'DELETE') {
        try {
            const contact = await contactModel.findByIdAndDelete(req.body._id);
            res.status(200).json(contact);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    if (method === 'PATCH') {
        try {
            const contact = await contactModel.findByIdAndUpdate(
                req.body._id, //contact id
                req.body, //complete form data
                { new: true, overwrite: true }
            );
            res.status(200).json(contact);
        } catch (error) {
            res.status(500).json(error);
        }
    }

}