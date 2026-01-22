// TypeScript
import React from 'react';
import { CheckCircle, Send } from 'lucide-react';
import Button from '../components/ui/Button';

interface ContactFormViewProps {
  status: 'success' | 'error' | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

const ContactFormView: React.FC<ContactFormViewProps> = ({
  status,
  isSubmitting,
  onSubmit,
  onReset,
}) => {
  if (status === 'success') {
    return (
      <div className="bg-success/20 p-6 rounded-xl border border-success/50 text-center">
        <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
        <h3 className="text-lg font-bold text-success mb-2">Message Sent!</h3>
        <p className="text-success">We&#39;ll get back to you shortly.</p>
        <Button
          onClick={onReset}
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
    <form onSubmit={onSubmit} className="space-y-4">
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

export default ContactFormView;
