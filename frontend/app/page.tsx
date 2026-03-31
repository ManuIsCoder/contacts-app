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
  const [search, setSearch] = useState('');

  const fetchContacts = async () => {
    const res = await fetch('http://localhost:3000/contacts');
    const data = await res.json();
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

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
    await fetch(`http://localhost:3000/contacts/${id}`, { method: 'DELETE' });
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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">

        <h1 className="text-4xl font-bold text-gray-800 mb-2">Contactos</h1>
        <p className="text-gray-500 mb-8">Gestioná tus contactos fácilmente</p>

        {/* Formulario agregar */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Nuevo contacto</h2>
          <div className="flex flex-col gap-3">
            <div>
              <input
                className="border border-gray-300 p-3 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                className="border border-gray-300 p-3 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <button
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              onClick={createContact}
            >
              + Agregar contacto
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="mb-4">
          <input
            className="border border-gray-300 p-3 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="🔍 Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Lista de contactos */}
        {filteredContacts.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            {search ? 'No se encontraron contactos' : 'No hay contactos todavía'}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filteredContacts.map((contact) => (
              <li key={contact.id} className="bg-white border rounded-2xl shadow-sm p-4">
                {editingId === contact.id ? (
                  <div className="flex flex-col gap-2">
                    <div>
                      <input
                        className="border border-gray-300 p-2 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      {editErrors.name && <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>}
                    </div>
                    <div>
                      <input
                        className="border border-gray-300 p-2 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                      {editErrors.email && <p className="text-red-500 text-sm mt-1">{editErrors.email}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 flex-1 font-semibold transition-colors"
                        onClick={() => saveEdit(contact.id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 flex-1 font-semibold transition-colors"
                        onClick={cancelEditing}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                        {contact.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                        onClick={() => startEditing(contact)}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 font-medium transition-colors"
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
        )}
      </div>
    </main>
  );
}