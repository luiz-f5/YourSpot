import { useEffect, useState, useCallback } from "react";
import { getContacts, createContact, ContactPayload } from "@/services/apis/yourspot/contacts";
import nestApi from "@/services/apis/nest/nest";
import { getSession } from "@/services/auth/session";

export function useContacts() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchContacts = useCallback(async () => {
      try {
        setLoading(true);
        const data = await getContacts();
        setContacts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, []);

  async function addContact(payload: ContactPayload) {
    try {
      const newContact = await createContact(payload);
      setContacts((prev) => [...prev, newContact]);
      return newContact;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function updateContact(updated: any) {
    try {
      const token = (await getSession()) || "";
      const res = await nestApi.put(`/contacts/${updated.id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contact = res.data;
      setContacts((prev) => prev.map((c) => (c.id === contact.id ? contact : c)));
      return contact;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function deleteContact(id: number) {
    try {
      const token = (await getSession()) || "";
      await nestApi.delete(`/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  return { contacts, loading, error, addContact, updateContact, deleteContact, fetchContacts };
}