import { ref } from 'vue'

// Shared so other parts of the profile (e.g. the smart summary card) can open the assistant.
export const assistantOpen = ref(false)
