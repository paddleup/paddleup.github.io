import React from 'react';
import Card from '../ui/Card';
import ContactForm from '../ContactForm';
import { MessageSquare } from 'lucide-react';

const ContactCard: React.FC = () => {
  return (
    <Card className="sticky top-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-text-main">Have Questions?</h2>
      </div>
      <p className="text-text-muted text-sm mb-6">Can't find what you're looking for? Send us a message and we'll help you out.</p>
      <ContactForm />
    </Card>
  );
};

export default ContactCard;
