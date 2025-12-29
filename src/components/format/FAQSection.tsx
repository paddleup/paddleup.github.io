import React from 'react';
import Card from '../ui/Card';

type Props = {
  hideChallengeFAQs?: boolean;
};

const FAQSection: React.FC<Props> = ({ hideChallengeFAQs }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-text-main">Frequently Asked Questions</h2>
      <div className="space-y-4 mt-4">
        {!hideChallengeFAQs && (
          <>
            <Card>
              <h3 className="font-bold text-text-main mb-2">What happens if I miss a week?</h3>
              <p className="text-text-muted">If you miss a week, you receive 0 points for that night. You must notify the league admin so a substitute can be assigned. You are allowed a maximum of 2 sub replacements per season.</p>
            </Card>

            <Card>
              <h3 className="font-bold text-text-main mb-2">Can I choose my own sub?</h3>
              <p className="text-text-muted">No. To ensure competitive balance and fairness, all substitutes are assigned by the league administration from the approved sub pool.</p>
            </Card>

            <Card>
              <h3 className="font-bold text-text-main mb-2">How do I qualify for the next season?</h3>
              <p className="text-text-muted">The top 4 players from the current season automatically qualify for the next season. Other spots may be filled through open registration or qualifying nights.</p>
            </Card>
          </>
        )}

        <Card>
          <h3 className="font-bold text-text-main mb-2">Is there a warm-up period?</h3>
          <p className="text-text-muted">Yes, courts are available for warm-up starting at 6:45 PM. League play begins promptly at 7:00 PM.</p>
        </Card>
      </div>
    </div>
  );
};

export default FAQSection;
