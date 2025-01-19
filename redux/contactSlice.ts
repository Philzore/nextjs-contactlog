import { Contact } from "@/interface/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Redux slice to manage the contatcs state for CRUD operation
 * 
 */
const contactSlice = createSlice({
    name: "contact",
    initialState: {
        contacts: [] as Contact[],
    },
    reducers: {
        /**
         * fill state with list of contacts
         * 
         * @param {Object} state - The current state of the slice.
         * @param {PayloadAction<Contact[]>} action - The action containing the array of contacts to set.
         */
        fillContacts: (state, action: PayloadAction<Contact[]>) => {
            state.contacts = action.payload;
        },
        /**
         * Adds a new contact to the state.
         * 
         * @param {Object} state - The current state of the slice.
         * @param {PayloadAction<Contact>} action - The action containing the contact to add.
         */
        addContact: (state, action: PayloadAction<Contact>) => {
            state.contacts.push(action.payload);
        },
        /**
         * Updates an existing contact in the state.
         * 
         * @param {Object} state - The current state of the slice.
         * @param {PayloadAction<Contact>} action - The action containing the updated contact data.
         */
        updateContact: (state, action: PayloadAction<Contact>) => {
            const index = state.contacts.findIndex(contact => contact._id === action.payload._id);
            if (index !== -1) {
                state.contacts[index] = action.payload;
            }
        },
        /**
         * Deletes a contact from the state.
         * 
         * @param {Object} state - The current state of the slice.
         * @param {PayloadAction<Contact>} action - The action containing the contact to delete.
         */
        deleteContact: (state, action: PayloadAction<Contact>) => {
            state.contacts = state.contacts.filter((contact) => contact._id !== action.payload._id);
        }
    }

});


export const { fillContacts, addContact, updateContact, deleteContact } = contactSlice.actions;
export default contactSlice.reducer;