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
          href="https://docs.google.com/spreadsheets/d/e/2PACX-1vS3d2RVZh7OT4-wHFWvaTe0CnT3eSH-1rwGxLNyBURh8IZLThRAMXx5pd56XF6AURpWm1cDSsuhsQDj/pubhtml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-600 dark:text-accent-400 hover:underline underline-offset-2"
        >
          KOTC League Standings
        </a>
      </p>
      <p>
        <a
          href="https://www.paddleuppickleballclub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-600 dark:text-accent-400 hover:underline underline-offset-2"
        >
          paddleuppickleballclub.com
        </a>
      </p>
    </footer>
  );
}
