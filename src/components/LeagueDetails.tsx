import {
  CalendarDays,
  Clock,
  MapPin,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import Footer from "./Footer";

interface LeagueDetailsProps {
  leaderboardUrl: string;
}

const EVENT_POINTS = [
  { court: 1, win: 1000, loss: 200 },
  { court: 2, win: 715, loss: 143 },
  { court: 3, win: 510, loss: 102 },
  { court: 4, win: 365, loss: 73 },
];

const LEADERBOARD_POINTS = [
  { standing: "1st", two: 1000, three: 1500, six: 3000 },
  { standing: "2nd", two: 800, three: 1200, six: 2400 },
  { standing: "3rd", two: 600, three: 900, six: 1800 },
  { standing: "5th", two: 400, three: 600, six: 1200 },
  { standing: "8th", two: 200, three: 300, six: 600 },
  { standing: "11th", two: 100, three: 150, six: 300 },
];

function SectionHeading({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

export default function LeagueDetails({ leaderboardUrl }: LeagueDetailsProps) {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-4 flex items-center gap-3 text-blue">
            <span className="h-2 w-2 bg-blue" />
            <span className="text-xs font-bold uppercase tracking-[0.22em]">
              King of the Court
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            League format
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
            A weekly league built to provide consistent, competitive play for
            advanced players.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-10 sm:px-6 sm:py-14">
        <section>
          <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-800">
            {[
              { icon: Users, label: "Who", value: "4.0+ players" },
              { icon: CalendarDays, label: "When", value: "Wednesdays" },
              { icon: Clock, label: "Time", value: "8:00–10:00 PM" },
              { icon: MapPin, label: "Where", value: "Paddle Up Chesterfield" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 bg-white p-5 dark:bg-slate-900"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                  </span>
                  <span className="mt-1 block font-semibold">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Overview">
            How the league works
          </SectionHeading>
          <div className="grid gap-6 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <p>
              Initial court assignments at each event are based on leaderboard
              standings, with the top-ranked players starting on the highest
              courts.
            </p>
            <p>
              During play, Game Maker manages score entry, court movement, and
              event standings. Those standings determine the leaderboard points
              earned by each player.
            </p>
            <p>
              At the end of each calendar month, the top players receive prizes
              based on the final monthly leaderboard.
            </p>
            <p>
              See where you stand on the{" "}
              <a
                href={leaderboardUrl}
                className="font-semibold text-blue hover:underline dark:text-blue-300"
              >
                current league leaderboard
              </a>
              .
            </p>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Event format">What to expect</SectionHeading>
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <dl className="divide-y divide-slate-200 dark:divide-slate-800">
              {[
                [
                  "Schedule",
                  "10-minute warmup followed by 1 hour 50 minutes of King of the Court play.",
                ],
                [
                  "Initial seeding",
                  "Past 30-day ranking, then all-time ranking, DUPR, and finally random assignment.",
                ],
                [
                  "Scoring",
                  "Rally scoring to 21, win by 1, with no freeze on game point. Games are not DUPR-rated.",
                ],
                [
                  "Court movement",
                  "Winners move up, losers move down, and every game is played with a new partner.",
                ],
              ].map(([term, description]) => (
                <div
                  key={term}
                  className="grid gap-2 px-5 py-5 sm:grid-cols-[9rem_1fr] sm:px-6"
                >
                  <dt className="font-semibold text-ink dark:text-white">
                    {term}
                  </dt>
                  <dd className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Game Maker points">
            Points by court
          </SectionHeading>
          <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Match points are determined by the result and court number, where
            Court 1 is the highest court. Event standings are then ordered by GM
            points, win percentage, head-to-head wins, point differential
            percentage, and head-to-head point differential percentage.
          </p>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-blue/8 px-5 py-4 dark:bg-blue/15">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Win
              </span>
              <code className="mt-1 block font-semibold text-ink dark:text-white">
                1000 × 0.715^(C − 1)
              </code>
            </div>
            <div className="rounded-lg bg-blue/8 px-5 py-4 dark:bg-blue/15">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Loss
              </span>
              <code className="mt-1 block font-semibold text-ink dark:text-white">
                200 × 0.715^(C − 1)
              </code>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/60">
                <tr>
                  <th className="px-5 py-3 text-left">Court</th>
                  <th className="px-5 py-3 text-right">Win</th>
                  <th className="px-5 py-3 text-right">Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {EVENT_POINTS.map((row) => (
                  <tr key={row.court}>
                    <td className="px-5 py-3 font-semibold">{row.court}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.win}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.loss}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Leaderboard points">
            From event finish to league points
          </SectionHeading>
          <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Leaderboard points are based on Game Maker finishing position and
            the total number of courts running. First through third earn 500,
            400, and 300 points per court. Places 4–7 descend by halves, and
            places 8–24 descend by fifths.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full min-w-[30rem]">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-800/60">
                <tr>
                  <th className="px-5 py-3 text-left">GM standing</th>
                  <th className="px-5 py-3 text-right">2 courts</th>
                  <th className="px-5 py-3 text-right">3 courts</th>
                  <th className="px-5 py-3 text-right">6 courts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {LEADERBOARD_POINTS.map((row) => (
                  <tr key={row.standing}>
                    <td className="px-5 py-3 font-semibold">{row.standing}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.two}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.three}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {row.six}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-blue/20 bg-blue/5 p-6 dark:bg-blue/10 sm:flex sm:items-start sm:gap-5 sm:p-8">
          <Trophy className="mb-4 h-7 w-7 shrink-0 text-blue sm:mb-0" />
          <div>
            <h2 className="text-xl font-bold">Monthly prizes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              The top three players on the calendar-month leaderboard at
              month&apos;s end receive free entry to every KOTC event the
              following month.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
