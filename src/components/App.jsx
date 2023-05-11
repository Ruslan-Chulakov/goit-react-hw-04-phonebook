import { useState, useEffect } from 'react';
import { Notify } from 'notiflix';
import clsx from 'clsx'
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import {
  loadDataToLocalStarage,
  getDataFromLocalStorage,
} from 'Utils/localStorageHelper';
import Filter from './Filter';
import css from './App.module.css'

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const handleAddContact = contact => {
    if (contacts.find(person => person.name === contact.name)) {
      Notify.failure('This name is already exist');
      return;
    }
    if (contacts.find(person => person.number === contact.number)) {
      Notify.failure('This number is already exist');
      return;
    }
    setContacts(prevState => [...prevState, contact]);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(filter.toLowerCase().trim())
  );

  const handleDelete = id => {
    setContacts(prevState => prevState.filter(contact => contact.id !== id));
  };

  const handleChange = evt => setFilter(evt.target.value);

 
  useEffect(() => {
    const storedContacts = getDataFromLocalStorage('contacts');
    if (storedContacts.length > 0 && contacts.length === 0) {
      setContacts(storedContacts);
    }
  }, []);
  
  useEffect(() => {
    loadDataToLocalStarage('contacts', contacts);
  }, [contacts]);

  return (
    <div className={clsx(css.container)}>
      <span className={clsx(css.titleSpan)}>
        <h1 className={clsx(css.title)}>Phonebook</h1>
      </span>
      <ContactForm handleAddContact={handleAddContact} />

      {contacts.length !== 0 && (
        <span className={clsx(css.titleSpan)}>
          <h2 className={clsx(css.title)}>Contacts</h2>
        </span>
      )}

      {contacts.length > 3 && (
        <Filter value={filter} handleChange={handleChange} />
      )}

      {contacts.length !== 0 && (
        <ContactList contacts={filteredContacts} handleDelete={handleDelete} />
      )}
    </div>
  );
};
