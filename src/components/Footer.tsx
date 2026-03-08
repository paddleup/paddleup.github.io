interface FooterProps {
  scrapedAt?: string;
}

export default function Footer({ scrapedAt }: FooterProps) {
  const formatted = scrapedAt
    ? new Date(scrapedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <footer className="mt-16 pb-8 text-center text-sm text-slate-400 dark:text-slate-500 space-y-1">
      {formatted && <p>Data updated: {formatted}</p>}
      <p>
        Data from{' '}
        <a
          href="https://www.quickscores.com/Orgs/ResultsDisplay.php?OrgDir=pupc&LeagueID=1620825"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2"
        >
          QuickScores
        </a>
      </p>
      <p>
        <a
          href="https://www.paddleuppickleballclub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2"
        >
          paddleuppickleballclub.com
        </a>
      </p>
    </footer>
  );
}
