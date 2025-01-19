
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { PencilSquare, PersonDash } from 'react-bootstrap-icons';
import { Button } from "react-bootstrap";
import { Contact } from "../interface/types";
import { useAppSelector } from "../hooks";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/hooks';
import { deleteContact } from "@/redux/contactSlice";

/**
 * props for contact component
 * 
 */
interface ContactListProps {
  onEditContact: (contact: Contact) => void;
}


/**
 * The Contacts component displays a list of contacts with options to edit or delete each contact.
 * It fetches the contacts from the Redux store and provides UI elements for interaction.
 *
 * @param {ContactListProps} props - The component's props.
 * @param  props.onEditContact - A function to handle the editing of a contact.
 * @returns {JSX.Element} The rendered Contacts component.
 */
export default function Contacts({ onEditContact }: ContactListProps) {
  const contacts: Contact[] = useAppSelector((state) => (state.contact.contacts));
  const dispatch = useAppDispatch();

  /**
   * delete single user 
   * 
   * @param {Contact} contact - contact which should delete 
   */
  const deleteUser = async (contact: Contact) => {
    try {
      const res = await axios.delete('http://localhost:3000/api/contacts', { data: { _id: contact._id } });
      if (res.status === 200) {
        dispatch(deleteContact(contact));
        toast.error("Kontakt wurde gelöscht", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return (
    <>
      <h2>Kontakt Liste</h2>
      {contacts.length === 0 ? <h3>Die Liste ist noch leer, erstelle einen Kontakt</h3> : ''}
      <div className="row">
        {contacts.map((contact, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Card style={{ width: '100%' }} className='resp-card'>
              <Card.Body>
                <Card.Title>{contact.name.firstName} {contact.name.lastName}</Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>{contact.email}</ListGroup.Item>
                <ListGroup.Item>{contact.address.street} {contact.address.houseNumber}</ListGroup.Item>
                <ListGroup.Item>{contact.address.zipCode} {contact.address.city}</ListGroup.Item>
                <ListGroup.Item>{contact.phoneNumber}</ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <Button onClick={() =>{window.scrollTo(0,0);onEditContact(contact)}}>
                    <PencilSquare></PencilSquare>
                  </Button>
                  <Button onClick={() => deleteUser(contact)} variant="danger">
                    <PersonDash></PersonDash>
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </div>
        ))}
      </div>
    </>
  )
}
