<script>
    import { onMount } from 'svelte';
    import { fetchContacts, createContact, updateContact, userStore, loginUser, logoutUser } from '$lib/stores';
    import { writable } from 'svelte/store';
  
    let contacts = writable([]);
    let showDrawer = writable(false);
    let isEditing = writable(false);
    let editContactId = null;
    let newContact = {
      name: '',
      email: '',
      phone: '',
      title: '',
      status: 'Active',
    };
    let email = '';
    let password = '';
    let errorMessage = '';
  
    // Check if the user is logged in
    $: isLoggedIn = $userStore !== null;
  
    onMount(async () => {
      if (isLoggedIn) {
        try {
          const contactList = await fetchContacts();
          contacts.set(contactList);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      }
    });
  
    async function handleAddContact() {
      try {
        if ($isEditing) {
          await updateContact(editContactId, newContact);
        } else {
          const createdContact = await createContact(newContact);
          contacts.update((existing) => [...existing, createdContact]);
        }
        showDrawer.set(false);
        newContact = { name: '', email: '', phone: '', title: '', status: 'Active' }; // Reset form
      } catch (error) {
        console.error('Error creating or updating contact:', error);
      }
    }
  
    function handleEditContact(contact) {
      isEditing.set(true);
      editContactId = contact.id;
      newContact = { ...contact };
      showDrawer.set(true);
    }
  
    // Handle the login form submission
    async function handleLogin() {
      try {
        await loginUser(email, password);
        location.reload(); // Refresh the page after login
      } catch (error) {
        errorMessage = 'Login failed: ' + error.message;
      }
    }
  
    // Handle logout
    function handleLogout() {
      logoutUser();
      location.reload(); // Refresh the page after logout
    }
  </script>
  
  {#if isLoggedIn}
    <!-- CRM Interface -->
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
            on:click={() => { isEditing.set(false); showDrawer.set(true); }}>
            Add Contact
          </button>
          <button 
            type="button" 
            class="ml-4 block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            on:click={handleLogout}>
            Logout
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
                  <th class="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <span class="sr-only">Edit</span>
                  </th>
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
                  <td class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button on:click={() => handleEditContact(contact)} class="text-indigo-600 hover:text-indigo-900">Edit</button>
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
                  <h2 class="text-base font-semibold leading-6 text-white">
                    {#if isEditing} Edit Contact {:else} New Contact {/if}
                  </h2>
                  <button type="button" class="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" on:click={() => showDrawer.set(false)}>
                    <span class="sr-only">Close panel</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="mt-1">
                  <p class="text-sm text-indigo-300">Manage your contact details below.</p>
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
              <button type="button" class="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" on:click={handleAddContact}>
                {#if isEditing} Update {:else} Save {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    {/if}
  {:else}
    <!-- Login Interface -->
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 class="text-center text-2xl font-bold text-gray-800 mb-4">Login</h2>
        <form on:submit|preventDefault={handleLogin}>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" bind:value={email} required>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" bind:value={password} required>
          </div>
          {#if errorMessage}
            <p class="text-red-500 text-sm mb-4">{errorMessage}</p>
          {/if}
          <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white">Login</button>
        </form>
      </div>
    </div>
  {/if}
  