import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    email: { type: String, required: true, maxlength: 50 },
    phoneNumber: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        houseNumber: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
    }

})

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;