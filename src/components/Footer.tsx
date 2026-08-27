interface FooterProps {
  scrapedAt?: string;
}

export default function Footer({ scrapedAt }: FooterProps) {
  const formatted = scrapedAt
    ? new Date(scrapedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-slate-500">
        <div className="space-y-1">
          {formatted && <p>Data updated {formatted}</p>}
          <p>
            Data from{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/e/2PACX-1vS3d2RVZh7OT4-wHFWvaTe0CnT3eSH-1rwGxLNyBURh8IZLThRAMXx5pd56XF6AURpWm1cDSsuhsQDj/pubhtml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue hover:underline dark:text-blue-300"
            >
              KOTC League Standings
            </a>
          </p>
        </div>
        <a
          href="https://www.paddleuppickleballclub.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue hover:underline dark:text-blue-300"
        >
          paddleuppickleballclub.com
        </a>
      </div>
    </footer>
  );
}
