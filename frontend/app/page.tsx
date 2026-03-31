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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [editErrors, setEditErrors] = useState<{ name?: string; email?: string }>({});

  const fetchContacts = async () => {
    const res = await fetch('http://localhost:3000/contacts');
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const validateFields = (n: string, e: string) => {
    const newErrors: { name?: string; email?: string } = {};
    if (!n.trim()) newErrors.name = 'El nombre es obligatorio';
    else if (n.trim().length < 2) newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    if (!e.trim()) newErrors.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) newErrors.email = 'El email no es válido';
    return newErrors;
  };

  const createContact = async () => {
    const newErrors = validateFields(name, email);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
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

  const startEditing = (contact: Contact) => {
    setEditingId(contact.id);
    setEditName(contact.name);
    setEditEmail(contact.email);
    setEditErrors({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
    setEditErrors({});
  };

  const saveEdit = async (id: number) => {
    const newErrors = validateFields(editName, editEmail);
    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      return;
    }
    setEditErrors({});
    await fetch(`http://localhost:3000/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, email: editEmail }),
    });
    setEditingId(null);
    fetchContacts();
  };

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Contactos</h1>

      <div className="flex flex-col gap-3 mb-8">
        <div>
          <input
            className="border p-2 rounded text-black w-full"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            className="border p-2 rounded text-black w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={createContact}
        >
          Agregar contacto
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {contacts.map((contact) => (
          <li key={contact.id} className="border p-3 rounded">
            {editingId === contact.id ? (
              <div className="flex flex-col gap-2">
                <div>
                  <input
                    className="border p-2 rounded text-black w-full"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  {editErrors.name && <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>}
                </div>
                <div>
                  <input
                    className="border p-2 rounded text-black w-full"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                  {editErrors.email && <p className="text-red-500 text-sm mt-1">{editErrors.email}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700 flex-1"
                    onClick={() => saveEdit(contact.id)}
                  >
                    Guardar
                  </button>
                  <button
                    className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500 flex-1"
                    onClick={cancelEditing}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => startEditing(contact)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteContact(contact.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}