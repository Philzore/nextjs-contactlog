import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { Contact } from "../interface/types";
import { toast } from "react-toastify";
import axios from 'axios';
import { useAppDispatch } from '@/hooks';
import { addContact, updateContact } from "@/redux/contactSlice";
import { Types } from 'mongoose';

/**
 * props for form component
 * 
 */
interface FormComponentProps {
    selectedContact?: Contact | null;
    resetSelectedContact: () => void;
}

/**
 * The FormComponent handles creating and editing contacts.
 * It manages form state, handles input changes, and communicates with an API to add or update contacts.
 *
 * @param {FormComponentProps} props - The component's props.
 * @param  props.selectedContact - The contact to edit, or null for a new contact.
 * @param  props.resetSelectedContact - A function to reset the selected contact after form submission or cancellation.
 * @returns {JSX.Element} The rendered form component.
 */
export default function FormComponent({ selectedContact, resetSelectedContact }: FormComponentProps) {
    const initialFormData: Contact = {
        _id: new Types.ObjectId,
        name: {
            firstName: '',
            lastName: '',
        },
        email: '',
        phoneNumber: '',
        address: {
            street: '',
            houseNumber: '',
            city: '',
            zipCode: '',
        }
    }

    const dispatch = useAppDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState<Contact>(initialFormData);


    /**
     * Reset form to initial values
     * 
     */
    const resetForm = () => {
        setFormData(initialFormData);
        setValidated(false);
        toast.info("Formular wurde zurückgesetzt", {
            position: "top-center",
            autoClose: 3000,
        });
        setIsEditMode(false);
        resetSelectedContact();
    };

    /**
     * update form when selectedContact changes
     * 
     */
    useEffect(() => {
        if (selectedContact) {
            setFormData(selectedContact);
            setIsEditMode(true);
        }
    }, [selectedContact]);

    /**
     * Handles input change events and updates the `formData` state.
     * 
     * This function determines which part of the form has been updated
     * based on the `id` of the input element. Then delegates the update
     * to the appropriate handler function or directly updates the `formData`
     * if no subfield is present.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - event triggered when input changed
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const [field, subfield] = id.split('.');

        if (field === 'name') {
            handleFieldName(subfield, value);
        } else if (field === 'address') {
            handleFieldAddress(subfield, value);
        } else if (!subfield) {
            setFormData((prevState) => ({ ...prevState, [field]: value }));
        }
    };

    /**
     * Updates the `formData` state when a subfield of the `name` field changes.
     * 
     * This function handles updates to the `name` field, specifically its subfields
     * such as `firstName` and `lastName`.
     * 
     * @param {string} subfield - The subfield of `name` being updated ('firstName', 'lastName').
     * @param {string} value - The new value for the specified subfield.
     */
    const handleFieldName = (subfield: string, value: string) => {
        if (subfield === 'firstName') {
            setFormData((prevState) => ({
                ...prevState,
                name: { ...prevState.name, firstName: value }
            }));
        } else if (subfield === 'lastName') {
            setFormData((prevState) => ({
                ...prevState,
                name: { ...prevState.name, lastName: value }
            }));
        }
    };

    /**
     * Updates the `formData` state when a subfield of the `address` field changes.
     * 
     * This function handles updates to the `address` field, specifically its subfields
     * such as `street`, `houseNumber`, `city`, and `zipCode`.
     * 
     * @param {string} subfield - The subfield of `address` being updated ('street', 'city').
     * @param {string} value - The new value for the specified subfield.
     */
    const handleFieldAddress = (subfield: string, value: string) => {
        if (subfield === 'street') {
            setFormData((prevState) => ({
                ...prevState,
                address: { ...prevState.address, street: value }
            }));
        } else if (subfield === 'houseNumber') {
            setFormData((prevState) => ({
                ...prevState,
                address: { ...prevState.address, houseNumber: value }
            }));
        } else if (subfield === 'city') {
            setFormData((prevState) => ({
                ...prevState,
                address: { ...prevState.address, city: value }
            }));
        } else if (subfield === 'zipCode') {
            setFormData((prevState) => ({
                ...prevState,
                address: { ...prevState.address, zipCode: value }
            }));
        }
    };

    /**
     * handle form submission to either create a new contact or update an existing contact
     * 
     * @param {React.FormEvent<HTMLFormElement>} event - form event
     */
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            if (!isEditMode) {
                await handleCreateContact(formData);
            } else {
                await handleUpdateContact(formData);
            }
        }
        setValidated(true);
    };

    /**
     * create new contact
     * 
     * @param {Contact} formData - data for new contact
     */
    const handleCreateContact = async (formData: Contact) => {
        try {
            const res = await axios.post('https://nextjs-contactlog.vercel.app/api/contacts', formData);
            if (res.status === 201) {
                dispatch(addContact(res.data));
                toast.success("Neuer Kontakt wurde erstellt", {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            handleError(error);
        }
    };

    /**
     * update existing contact
     * 
     * @param {Contact} formData - data to update a contact
     */
    const handleUpdateContact = async (formData: Contact) => {
        try {
            const res = await axios.patch('https://nextjs-contactlog.vercel.app/api/contacts', formData);
            if (res.status === 200) {
                dispatch(updateContact(res.data));
                toast.success("Kontakt wurde erfolgreich überarbeitet", {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            handleError(error);
        }
    };

    /**
     * throw error that occur during contact operations
     * 
     * @param {any} error - error that occured 
     */
    const handleError = (error: unknown) => {
        throw new Error(String(error));
    };

    return (
        <div className='mb-3'>
            <h2>{isEditMode ? 'Bearbeite Kontakt' : 'Erstelle einen neuen Kontakt'}</h2>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="name.firstName">
                        <Form.Label>Vorname</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Peter"
                            minLength={3}
                            maxLength={30}
                            value={formData.name.firstName}
                            onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">Kein gültiger Vorname</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="name.lastName">
                        <Form.Label>Nachname</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Müller"
                            minLength={3}
                            maxLength={30}
                            value={formData.name.lastName}
                            onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">Kein gültiger Nachname</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder="beispiel@web.de"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">Keine gültige Email Adresse</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="address.street">
                        <Form.Label>Straße</Form.Label>
                        <Form.Control type="text" placeholder="Hauptstraße"
                            required
                            minLength={3}
                            maxLength={50}
                            value={formData.address.street}
                            onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Keine gültige Straße
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="address.houseNumber">
                        <Form.Label>Hausnummer</Form.Label>
                        <Form.Control type="number" placeholder="12"
                            required
                            min={1} max={9999}
                            value={formData.address.houseNumber}
                            onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Keine gültige Hausnummer
                        </Form.Control.Feedback>
                        <Form.Text id="houseNumberHelpBlock" muted>
                            1-9999
                        </Form.Text>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="address.city">
                        <Form.Label>Stadt</Form.Label>
                        <Form.Control type="text" placeholder="Großschönau"
                            required
                            minLength={3}
                            maxLength={50}
                            value={formData.address.city}
                            onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Keine gültige Stadt
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="address.zipCode">
                        <Form.Label>Postleitzahl</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="02779"
                            minLength={5}
                            required
                            pattern="^\d{5}$"
                            value={formData.address.zipCode}
                            onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Keine gültige Postleitzahl
                        </Form.Control.Feedback>
                        <Form.Text id="zipCodeHelpBlock" muted>
                            Die Postleitzahl muss 5 Zeichen lang sein.
                        </Form.Text>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="3" controlId="phoneNumber">
                        <Form.Label>Telefonnumer</Form.Label>
                        <InputGroup>
                            <InputGroup.Text id="basic-addon1">+49</InputGroup.Text>
                            <Form.Control
                                type="tel"
                                placeholder="01523978452"
                                minLength={5}
                                maxLength={15}
                                required
                                pattern="^\d{10,15}$"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                            Keine gültige Telefonnumer
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <div className='d-flex gap-2'>
                    <Button type="submit">{isEditMode ? 'Kontakt speichern' : 'Kontakt erstellen'}</Button>
                    <Button variant="warning" onClick={resetForm}>Zurücksetzen</Button>
                </div>
            </Form>
        </div>
    );
}
