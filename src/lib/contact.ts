/**
 * Web3Forms access key. Set VITE_WEB3FORMS_KEY in the environment (and in the
 * Vercel project settings) to switch the contact form on. Without it, Contact
 * falls back to a mailto button — better than a form that silently swallows
 * messages.
 */
export const CONTACT_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export const isContactFormEnabled = Boolean(CONTACT_ACCESS_KEY);
