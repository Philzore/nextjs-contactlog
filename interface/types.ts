import { Types } from "mongoose";


export interface Contact {
    _id: Types.ObjectId ;
    name: {
        firstName: string;
        lastName: string;
    };
    email: string;
    phoneNumber: string;
    address: {
        street: string;
        houseNumber: string;
        city: string;
        zipCode: string;
    };
}