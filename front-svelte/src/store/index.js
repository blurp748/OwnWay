import { writable } from 'svelte/store';

const storedUserId = localStorage.getItem("userId");
export const userId = writable(storedUserId ? storedUserId : -1);