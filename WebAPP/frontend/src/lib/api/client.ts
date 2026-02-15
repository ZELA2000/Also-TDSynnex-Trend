/**
 * API Client Export
 * Re-export del client API per import più puliti
 */

import { ApiClient } from '../api-client';

// Crea un'istanza singleton del client API
export const apiClient = new ApiClient();

// Esporta anche la classe per usi avanzati
export { ApiClient } from '../api-client';
