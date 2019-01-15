import React, { useState, useEffect } from 'react';
import personService from './services/persons';

const Filter = ({onChange, value}) => (
  <div>
    rajaa näytettäviä: <input value={value} onChange={onChange}/>
  </div>
)

const Person = ({person, onDelete}) => (
  <tr>
    <td>{person.name}</td><td>{person.number}</td><td><button onClick={onDelete}>poista</button></td>
  </tr>
)

const NewPersonForm = ({onSubmit, onNameChange, onNumberChange, name, number}) => (
  <form onSubmit={onSubmit}>
    <div>
      nimi: <input value={name} onChange={onNameChange}/>
    </div>
    <div>
      numero: <input value={number} onChange={onNumberChange}/>
    </div>
    <div>
      <button type="submit">lisää</button>
    </div>
  </form>
)

const Notification = ({message}) => {
  if(message === null) return null;
  return (
    <div className="notification">
      {message}
    </div>
  )
}

const Error = ({message}) => {
  if(message == null) return null;
  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(persons => setPersons(persons));
  }, [])

  const handleNameChange = event => setNewName(event.target.value);

  const handleNumberChange = event => setNewNumber(event.target.value);

  const handleFilterChange = event => setFilter(event.target.value);

  const addPerson = event => {
    event.preventDefault();
    const newPerson = {name: newName, number: newNumber};
    const oldPerson = persons.find(person => person.name === newPerson.name);
    if(oldPerson) {
      newPerson.id = oldPerson.id;
      updatePerson(newPerson);
    }
    else {
      personService
        .create(newPerson)
        .then(newPerson => {
          setPersons(persons.concat(newPerson));
          setNewName('');
          setNewNumber('');
          setNotification('lisättiin ' + newPerson.name);
          setTimeout(() => setNotification(null), 5000);
        })
    }
  }

  const updatePerson = (updatedPerson) => {
    if(!window.confirm(updatedPerson.name + " on jo luettelossa, korvataanko vanha numero uudellta?")) return
    personService
      .update(updatedPerson)
      .then(updatedPerson => {
        setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person));
        setNotification('päivitettiin ' + updatedPerson.name + ' numeroa');
        setTimeout(() => setNotification(null), 5000);
      })
      .catch(error => {
        setError('henkilö ' + updatedPerson.name + ' on jo poistettu palvelimelta');
        setTimeout(() => setError(null), 5000);
      });
  }

  const deletePerson = (removedPerson) => () => {
    if(!window.confirm("poistetaanko " + removedPerson.name + "?")) return;
    personService
      .remove(removedPerson)
      .then(() => {
        setPersons(persons.filter(person => person.id !== removedPerson.id));
        setNotification('poistettiin ' + removedPerson.name);
        setTimeout(() => setNotification(null), 5000);
      });
  }

  const filteredPersons = persons
    .filter(person => person.name.toLowerCase().includes(filter))
    .map(person => (
      <Person person={person} onDelete={deletePerson(person)} key={person.name} />
    ));

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Notification message={notification} />
      <Error message={error} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>Lisää uusi</h2>
      <NewPersonForm 
        onSubmit={addPerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        name={newName}
        number={newNumber} />
      <h2>Numerot</h2>
      <table>
        <tbody>
          {filteredPersons}
        </tbody>
      </table>
    </div>
  )
}

export default App
