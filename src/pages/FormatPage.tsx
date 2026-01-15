import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Clock, Users, Swords, Star, ExternalLink } from 'lucide-react';

const FormatPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Pickleball League — Season 1 (Competitive)';
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-alt via-surface to-surface-alt border border-border shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-text-muted/5 to-primary/5"></div>
        <div className="relative px-6 py-8 md:px-12 md:py-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Icon and Title */}
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="text-4xl md:text-5xl mb-2">🏓</div>
              </div>

              {/* Main Content */}
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-black text-text-main mb-2 leading-tight">
                  Paddle Up Premier League
                </h1>
                <div className="text-lg md:text-xl font-bold text-text-accent mb-3">
                  Season 1 (Competitive)
                </div>
                <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-2xl">
                  First competitive season • DUPR 3.5+ • Two structured rounds • Monthly & seasonal
                  rankings
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/schedule"
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-hover transition-colors shadow-md"
                >
                  Register Tonight
                </Link>
                <a
                  href="https://paddleup.github.io"
                  className="bg-surface-highlight border border-border text-text-main px-6 py-3 rounded-xl font-semibold text-sm hover:bg-surface-alt transition-colors flex items-center gap-2"
                >
                  View Standings
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-text-accent/5 rounded-full blur-lg -z-10"></div>
      </div>

      {/* Leaderboard Info Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-surface to-surface-alt rounded-2xl p-6 border border-border shadow-lg">
          <div className="flex items-center justify-center gap-3 text-text-main mb-3">
            <ExternalLink className="h-6 w-6 text-primary" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">Live Leaderboard & Results</span>
              {/* Live Badge */}
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full border border-success/20 animate-pulse">
                LIVE
              </span>
            </div>
          </div>
          <p className="text-text-muted text-center">
            Track your points, season standings, and all-time rankings in real-time at{' '}
            <a
              href="https://paddleup.github.io/#/standings"
              className="text-primary hover:text-primary-hover font-semibold underline decoration-primary/30 hover:decoration-primary transition-colors"
            >
              paddleup.github.io
            </a>
          </p>
        </div>
      </div>

      {/* Season Overview */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-warning/5 via-surface to-primary/5 rounded-3xl p-8 md:p-12 border border-warning/20 shadow-2xl">
          {/* Header with animated trophy */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-warning to-warning/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
              Season 1 Championship
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Compete for exclusive prizes and eternal glory in our inaugural competitive season
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Duration Section */}
            <div className="text-center lg:text-left">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20 shadow-lg">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold text-text-main">Season Duration</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-center lg:text-left">
                    <div className="text-4xl font-black text-primary mb-2">4</div>
                    <div className="text-xl font-semibold text-text-main">Weeks of Competition</div>
                    <div className="text-text-muted mt-2">Every Sunday • 7PM-10PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prizes Section */}
            <div>
              <h3 className="text-2xl font-bold text-text-main mb-6 text-center lg:text-left">
                Championship Rewards
              </h3>
              <p className="text-text-muted mb-6 text-center lg:text-left">
                Top 3 finishers earn exclusive Joola gear and club points:
              </p>

              <div className="space-y-4">
                {/* 1st Place */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-warning/20 via-warning/10 to-warning/5 border-2 border-warning/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-black text-white">1st</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-lg font-bold text-text-main mb-1">Champion</div>
                      <div className="text-text-muted">
                        <span className="font-semibold text-warning">Joola Hat</span> +
                        <span className="font-semibold text-primary ml-1">25 Club Points</span>
                      </div>
                    </div>
                    <div className="text-3xl opacity-50">🧢</div>
                  </div>
                </div>

                {/* 2nd Place */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-text-accent/20 via-text-accent/10 to-text-accent/5 border-2 border-text-accent/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-text-accent to-text-accent/80 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-black text-white">2nd</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-lg font-bold text-text-main mb-1">Runner-up</div>
                      <div className="text-text-muted">
                        <span className="font-semibold text-text-accent">Joola Water Bottle</span> +
                        <span className="font-semibold text-primary ml-1">15 Club Points</span>
                      </div>
                    </div>
                    <div className="text-3xl opacity-50">🍶</div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-bronze/20 via-bronze/10 to-bronze/5 border-2 border-bronze/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-bronze to-bronze/80 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-black text-white">3rd</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-lg font-bold text-text-main mb-1">Third Place</div>
                      <div className="text-text-muted">
                        <span className="font-semibold text-bronze">Joola Wristbands</span> +
                        <span className="font-semibold text-primary ml-1">10 Club Points</span>
                      </div>
                    </div>
                    <div className="text-3xl opacity-50">⌚</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-warning/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Nightly Format */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-surface to-success/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
              Nightly Experience
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Every Sunday brings competitive action with structured rounds and exciting gameplay
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Schedule Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-text-main mb-3">Schedule</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-primary">7PM – 10PM</div>
                  <div className="text-text-muted font-medium">Every Sunday</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
            </div>

            {/* Entry Fee Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-text-main mb-3">Entry Fee</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-success">$20</div>
                  <div className="text-text-muted font-medium">per night</div>
                  <div className="text-sm text-success font-semibold bg-success/10 rounded-full px-3 py-1">
                    Free for Annual Members
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-success/5 rounded-full blur-xl"></div>
            </div>

            {/* Eligibility Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/10 to-warning/5 border-2 border-warning/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-text-main mb-3">Eligibility</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-warning">DUPR 3.5+</div>
                  <div className="text-text-muted font-medium">Required Rating</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-warning/5 rounded-full blur-xl"></div>
            </div>

            {/* Format Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-text-accent/10 to-text-accent/5 border-2 border-text-accent/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-bold text-text-main mb-3">Format</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-text-accent">2 Rounds</div>
                  <div className="text-text-muted font-medium">per night</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-text-accent/5 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Round Format */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-success/5 via-surface to-text-accent/5 rounded-3xl p-8 md:p-12 border border-success/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success to-success/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Swords className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">Game Format</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Structured gameplay with rotating partnerships and dynamic scoring systems
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Players per Court */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-5xl mb-6">👥</div>
                <h3 className="text-2xl font-bold text-text-main mb-4">Players per Court</h3>
                <div className="text-4xl font-black text-primary mb-2">4–5</div>
                <div className="text-text-muted font-medium">Players</div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
            </div>

            {/* Teams */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/10 to-warning/5 border-2 border-warning/20 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-5xl mb-6">🤝</div>
                <h3 className="text-2xl font-bold text-text-main mb-4">Partnership</h3>
                <div className="text-text-muted font-medium leading-relaxed">
                  Every player partners <strong className="text-warning">once per round</strong>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-warning/5 rounded-full blur-xl"></div>
            </div>

            {/* Scoring */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-text-accent/10 to-text-accent/5 border-2 border-text-accent/20 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-5xl mb-6">🏆</div>
                <h3 className="text-2xl font-bold text-text-main mb-4">Scoring</h3>
                <div className="space-y-3">
                  <div className="bg-text-accent/10 rounded-xl p-4 border border-text-accent/20">
                    <div className="font-bold text-text-main text-lg">4-Player Courts</div>
                    <div className="text-text-muted font-medium">3 games • 15 pts • win by 1</div>
                  </div>
                  <div className="bg-text-accent/10 rounded-xl p-4 border border-text-accent/20">
                    <div className="font-bold text-text-main text-lg">5-Player Courts</div>
                    <div className="text-text-muted font-medium">4 games • 11 pts • win by 1</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-text-accent/5 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-text-accent/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Round Details */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Round 1 */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-surface to-success/10 rounded-3xl p-8 md:p-10 border border-primary/20 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-4 transform hover:scale-110 transition-all duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-text-main mb-2">Round 1: Initial Seeding</h2>
              {/* <p className="text-lg text-text-muted font-medium">Initial Seeding</p> */}
            </div>

            <div className="space-y-6">
              {/* Court Assignment */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg font-black text-white">🎲</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-text-main mb-2">Court Assignment</h4>
                    <p className="text-text-muted leading-relaxed">
                      Courts assigned via <strong className="text-primary">snake draft</strong>{' '}
                      (back-and-forth order)
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
              </div>

              {/* Seeding Basis */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg font-black text-white">📊</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-text-main mb-2">Seeding Basis</h4>
                    <p className="text-text-muted leading-relaxed">
                      Seeding based on{' '}
                      <strong className="text-success">previous weeks&apos; performance</strong> (or
                      random for the first week)
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-success/5 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
          </div>
        </div>

        {/* Round 2 */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-warning/10 via-surface to-text-accent/10 rounded-3xl p-8 md:p-10 border border-warning/20 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-warning to-warning/70 rounded-full shadow-lg mb-4 transform hover:scale-110 transition-all duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-text-main mb-2">Round 2</h2>
              <p className="text-lg text-text-muted font-medium">Ranked Courts</p>
            </div>

            <div className="space-y-6">
              {/* Court Placement */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-warning/10 to-warning/5 border-2 border-warning/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg font-black text-white">🏆</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-text-main mb-2">Court Placement</h4>
                    <p className="text-text-muted leading-relaxed">
                      Players ranked by{' '}
                      <strong className="text-warning">Round 1 performance</strong>
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-warning/5 rounded-full blur-xl"></div>
              </div>

              {/* Court Assignment */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-text-accent/10 to-text-accent/5 border-2 border-text-accent/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-text-accent to-text-accent/80 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg font-black text-white">🎯</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-text-main mb-2">Court Assignment</h4>
                    <p className="text-text-muted leading-relaxed">
                      Top finishers placed on <strong className="text-text-accent">Court 1</strong>,
                      next group on <strong className="text-text-accent">Court 2</strong>, etc.
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-text-accent/5 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-warning/10 to-transparent rounded-full blur-xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-text-accent/10 to-transparent rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      </div>

      {/* Points & Prizes */}
      <div className="bg-gradient-to-r from-primary/10 to-warning/10 rounded-2xl p-8 border border-primary/30">
        <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
          <Trophy className="h-8 w-8 text-warning" />
          Points & Prizes
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-text-main mb-4">Top Finisher Points</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-warning/20 rounded-lg border border-warning/50">
                <span className="font-bold text-warning">1st Place</span>
                <span className="font-bold text-text-main">1000 points</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                <span className="font-bold text-text-accent">2nd Place</span>
                <span className="font-bold text-text-main">800 points</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-bronze/20 rounded-lg border border-bronze/50">
                <span className="font-bold text-bronze">3rd Place</span>
                <span className="font-bold text-text-main">600 points</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                <span className="font-bold text-text-main">4th Place</span>
                <span className="font-bold text-text-main">500 points</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-text-main mb-4">Point System</h3>
            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-lg border border-border">
                <p className="text-text-muted">
                  <strong>All finishing positions earn points</strong>, with points dropping by half
                  every three ranks (approximate)
                </p>
              </div>

              <div className="p-4 bg-primary-light rounded-lg border border-primary/50">
                <p className="text-text-main">
                  Points from every game count toward{' '}
                  <strong>monthly and cumulative rankings</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-surface rounded-2xl p-8 border border-border">
        <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3">
          <Star className="h-8 w-8 text-success" />✅ Key Takeaways
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-success text-lg">✓</span>
              <p className="text-text-muted">
                Structured, competitive league for <strong>DUPR 3.5+ players</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-success text-lg">✓</span>
              <p className="text-text-muted">
                Sunday evenings, <strong>7PM–10PM</strong>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-success text-lg">✓</span>
              <p className="text-text-muted">
                <strong>Two rounds each night</strong>, with partner rotation
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-success text-lg">✓</span>
              <p className="text-text-muted">
                Points determine{' '}
                <strong>court placement, monthly standings, and season/all-time rankings</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary-light rounded-2xl p-8 md:p-12 text-center border border-primary/50">
        <h2 className="text-3xl font-bold text-text-main mb-4">Ready to Compete?</h2>
        <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
          Check your standings online and track points for this season and all-time rankings for
          every player.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a
            href="https://paddleup.github.io"
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            🌐 Check Your Standings
            <ExternalLink className="h-5 w-5" />
          </a>
          <Link
            to="/schedule"
            className="bg-surface border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-colors"
          >
            Register for Tonight
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormatPage;
