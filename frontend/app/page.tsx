'use client';

import { useEffect, useState } from 'react';

type Contact = {
  id: number;
  name: string;
  email: string;
};

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchContacts = async () => {
    const res = await fetch('http://localhost:3000/contacts');
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const createContact = async () => {
    if (!name || !email) return;
    await fetch('http://localhost:3000/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    setName('');
    setEmail('');
    fetchContacts();
  };

  const deleteContact = async (id: number) => {
    await fetch(`http://localhost:3000/contacts/${id}`, {
      method: 'DELETE',
    });
    fetchContacts();
  };

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Contactos</h1>

      <div className="flex flex-col gap-3 mb-8">
        <input
          className="border p-2 rounded text-black"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={createContact}
        >
          Agregar contacto
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-semibold">{contact.name}</p>
              <p className="text-sm text-gray-500">{contact.email}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => deleteContact(contact.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}