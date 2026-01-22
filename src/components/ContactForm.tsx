// TypeScript
import React, { useState } from 'react';
import ContactFormView from '../views/ContactFormView';

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

  const handleReset = () => setStatus(null);

  return (
    <ContactFormView
      status={status}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onReset={handleReset}
    />
  );
};

export default ContactForm;
