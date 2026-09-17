import { useState } from 'react';
import { profile } from '../../data/profile';
import { CONTACT_ACCESS_KEY as ACCESS_KEY } from '../../lib/contact';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export const ContactForm = () => {
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!ACCESS_KEY) return;

        setStatus('sending');
        setError('');

        const form = e.currentTarget;
        const data = new FormData(form);
        data.append('access_key', ACCESS_KEY);
        data.append('subject', `Portfolio enquiry — ${profile.name}`);

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: data,
            });
            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Something went wrong.');
            }

            setStatus('sent');
            form.reset();
        } catch (err) {
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        }
    };

    if (!ACCESS_KEY) return null;

    const field =
        'w-full bg-transparent border border-white/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-faint focus:border-accent focus:outline-none transition-colors duration-300';

    return (
        <form onSubmit={handleSubmit} className="max-w-xl w-full space-y-4" noValidate={false}>
            {/* Honeypot — bots fill this, humans never see it. */}
            <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="contact-name" className="sr-only">
                        Your name
                    </label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className={field}
                    />
                </div>
                <div>
                    <label htmlFor="contact-email" className="sr-only">
                        Your email
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Your email"
                        className={field}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="contact-message" className="sr-only">
                    Message
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="What are you working on?"
                    className={`${field} resize-y`}
                />
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="px-7 py-3 rounded-full bg-accent text-[#0a0a0a] text-sm font-bold tracking-widest uppercase hover:bg-accent/85 disabled:opacity-60 transition-colors duration-300"
                    data-cursor-hide
                >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>

                <p role="status" aria-live="polite" className="text-sm">
                    {status === 'sent' && (
                        <span className="text-accent">Thanks — I'll get back to you.</span>
                    )}
                    {status === 'error' && (
                        <span className="text-accent">
                            {error} You can also email{' '}
                            <a href={`mailto:${profile.email}`} className="underline">
                                {profile.email}
                            </a>
                            .
                        </span>
                    )}
                </p>
            </div>
        </form>
    );
};
