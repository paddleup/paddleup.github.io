import React, { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import Button from './ui/Button';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://formspree.io/f/xanrzonk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subject: 'League Question (Format Page)',
        }),
      });

      if (response.ok) {
        setStatus('success');
        e.currentTarget.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-success/20 p-6 rounded-xl border border-success/50 text-center">
        <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
        <h3 className="text-lg font-bold text-success mb-2">Message Sent!</h3>
        <p className="text-success">We{"'"}ll get back to you shortly.</p>
        <Button
          onClick={() => setStatus(null)}
          variant="ghost"
          size="sm"
          className="mt-4 text-sm text-success hover:underline"
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">
          Your Email
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg bg-surface-highlight border-border text-text-main shadow-sm focus:border-primary focus:ring-primary placeholder:text-text-muted p-3"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-1">
          Question
        </label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full rounded-lg bg-surface-highlight border-border text-text-main shadow-sm focus:border-primary focus:ring-primary placeholder:text-text-muted p-3"
          placeholder="How can we help?"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="primary"
        size="md"
        className="w-full py-2.5 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            <Send className="h-4 w-4" /> Send Message
          </>
        )}
      </Button>
      {status === 'error' && (
        <p className="text-error text-sm text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
};

export default ContactForm;
