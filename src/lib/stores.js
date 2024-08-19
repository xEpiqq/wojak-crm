import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';

// Initialize the PocketBase client with your specific URL
const pb = new PocketBase('https://pocketbase-production-2587.up.railway.app');

// Store for holding the current authenticated user
export const userStore = writable(pb.authStore.model);

// Listen for changes in the authentication state and update the store
pb.authStore.onChange(() => {
  userStore.set(pb.authStore.model);
});

// Function to log in a user
export async function loginUser(email, password) {
  try {
    await pb.collection('users').authWithPassword(email, password);
    userStore.set(pb.authStore.model); // Update the store with the logged-in user
  } catch (error) {
    console.error('Failed to log in:', error);
    throw error; // Re-throw the error so it can be handled in the UI
  }
}

// Function to log out a user
export function logoutUser() {
  pb.authStore.clear(); // Clear the authentication state
  userStore.set(null); // Reset the store
}

// Function to fetch all contacts
export async function fetchContacts() {
  try {
    const records = await pb.collection('contacts').getFullList({
      sort: '-created', // Example: Sort by creation date descending
    });
    return records;
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    throw error;
  }
}

// Function to create a new contact
export async function createContact(contactData) {
  try {
    const newContact = await pb.collection('contacts').create(contactData);
    return newContact;
  } catch (error) {
    console.error('Failed to create contact:', error);
    throw error;
  }
}

// Function to update a contact
export async function updateContact(contactId, updatedData) {
  try {
    const updatedContact = await pb.collection('contacts').update(contactId, updatedData);
    return updatedContact;
  } catch (error) {
    console.error('Failed to update contact:', error);
    throw error;
  }
}

// Function to delete a contact
export async function deleteContact(contactId) {
  try {
    await pb.collection('contacts').delete(contactId);
  } catch (error) {
    console.error('Failed to delete contact:', error);
    throw error;
  }
}
