<script>
    import { onMount } from 'svelte';
    import { fetchContacts, createContact } from '$lib/stores';
    import { writable } from 'svelte/store';
  
    let contacts = writable([]);
    let showDrawer = writable(false);
    let newContact = {
      name: '',
      email: '',
      phone: '',
      title: '',
      status: 'Active',
    };
  
    onMount(async () => {
      try {
        const contactList = await fetchContacts();
        contacts.set(contactList);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    });
  
    async function handleAddContact() {
      try {
        const createdContact = await createContact(newContact);
        contacts.update((existing) => [...existing, createdContact]);
        showDrawer.set(false);
        newContact = { name: '', email: '', phone: '', title: '', status: 'Active' }; // Reset form
      } catch (error) {
        console.error('Error creating contact:', error);
      }
    }
  </script>
  
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Contacts</h1>
        <p class="mt-2 text-sm text-gray-700">Manage your contacts here.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button 
          type="button" 
          class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          on:click={() => showDrawer.set(true)}>
          Add Contact
        </button>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {#each $contacts as contact (contact.id)}
              <tr>
                <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div class="flex items-center">
                    <div class="ml-4">
                      <div class="font-medium text-gray-900">{contact.name}</div>
                      <div class="mt-1 text-gray-500">{contact.email}</div>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{contact.phone}</td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{contact.title}</td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {contact.status}
                  </span>
                </td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  
  {#if $showDrawer}
    <div class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div class="pointer-events-auto w-screen max-w-md">
        <form class="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
          <div class="h-0 flex-1 overflow-y-auto">
            <div class="bg-indigo-700 px-4 py-6 sm:px-6">
              <div class="flex items-center justify-between">
                <h2 class="text-base font-semibold leading-6 text-white">New Contact</h2>
                <button type="button" class="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" on:click={() => showDrawer.set(false)}>
                  <span class="sr-only">Close panel</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="mt-1">
                <p class="text-sm text-indigo-300">Add a new contact to your CRM.</p>
              </div>
            </div>
            <div class="flex flex-1 flex-col justify-between">
              <div class="divide-y divide-gray-200 px-4 sm:px-6">
                <div class="space-y-6 pb-5 pt-6">
                  <div>
                    <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
                    <div class="mt-2">
                      <input type="text" name="name" id="name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" bind:value={newContact.name} required>
                    </div>
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                    <div class="mt-2">
                      <input type="email" name="email" id="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" bind:value={newContact.email} required>
                    </div>
                  </div>
                  <div>
                    <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone</label>
                    <div class="mt-2">
                      <input type="text" name="phone" id="phone" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" bind:value={newContact.phone} required>
                    </div>
                  </div>
                  <div>
                    <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
                    <div class="mt-2">
                      <input type="text" name="title" id="title" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" bind:value={newContact.title} required>
                    </div>
                  </div>
                  <div>
                    <label for="status" class="block text-sm font-medium leading-6 text-gray-900">Status</label>
                    <div class="mt-2">
                      <select name="status" id="status" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" bind:value={newContact.status}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-shrink-0 justify-end px-4 py-4">
            <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" on:click={() => showDrawer.set(false)}>Cancel</button>
            <button type="button" class="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" on:click={handleAddContact}>Save</button>
          </div>
        </form>
      </div>
    </div>
  {/if}
  