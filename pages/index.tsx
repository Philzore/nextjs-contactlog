import Form from "../components/Form";
import Contacts from "../components/Contacts";
import { useEffect, useState } from "react";
import { Contact } from "../interface/types";
import axios from "axios";

import { fillContacts } from "@/redux/contactSlice";
import { useAppDispatch } from "../hooks";


/**
 * props for index.tsx
 * 
 */
interface HomeProps {
  contacts: Contact[];
  error?: string;
}

/**
 * The Home component displays the form and contacts list on the home page.
 * It receives the initial list of contacts and an error message as props.
 * The component also manages the selected contact and provides functionality to reset it.
 *
 * @param HomeProps - props Object for index.tsx
 * @param contacts - An array of contact objects passed from `getServerSideProps`.
 * @param error - An optional error message that can be displayed if the data fetch fails.
 * 
 * @returns JSX.Element - The rendered component.
 */
function Home({ contacts, error }: HomeProps) {
  // condition to administrate the chossen contact (undefined if no contact is selected)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const dispatch = useAppDispatch();

  /**
   * This useEffect hook runs on component mount and dispatches the contacts
   * to the Redux store.
   * Dispatches the contacts to the Redux store using the fillContacts action.
   */
  useEffect(() => {
    dispatch(fillContacts(contacts));
  }, [contacts, dispatch]);

  /**
   * reset selected contact to null
   * 
   */
  const resetSelectedContact = () => {
    setSelectedContact(null);
  };

  return (
    <>
      {error ? (
        <div>
          <h3>Fehler beim Abrufen der Daten, prüfen Sie die Verbindung zur Datenbank.</h3>
          <h4>{error}</h4>
        </div>
      ) : (
        <>
          {/* Form component receives the selected contact and reset function as props */}
          <Form selectedContact={selectedContact} resetSelectedContact={resetSelectedContact}></Form>
          {/* Contacts component allows selecting a contact to edit */}
          <Contacts onEditContact={setSelectedContact}></Contacts>
        </>
      )}
    </>
  );
}

export default Home;


/**
 * Fetches contact data from the database and passes it as props to the Home component.
 *
 * If the API call is successful, the contact data is passed as props to the page.
 * If an error occurs, an empty array of contacts and an error message are returned.
 *
 * 
 * @returns props - An object containing props for the page.
 * @returns props.contacts - An array of contacts from the database.
 * @returns props.error - An optional error message that will be displayed in case of failure.
 */
export async function getServerSideProps() {
  try {
    const res = await axios.get('http://localhost:3000/api/contacts');
    const contacts = res.data;

    // success 
    return {
      props: { contacts: JSON.parse(JSON.stringify(contacts)) },
    };
  } catch (error) {
    return {
      props: {
        contacts: [],
        error: error instanceof Error ? error.message : 'Unbekannter Fehler' ,
      },
    };
  }
}


