import React from 'react';
import { rules } from '../../data/rules';
import { Player } from '../../types';

type CourtAssignment = {
  id: number;
  name: string;
  players: (Player & { seed: number })[];
};

type Props = {
  rankedPlayers: Player[];
  initialAssignments: CourtAssignment[];
};

/**
 * PrintMatchSheet - Premium B/W print styling
 * - Single sans serif (Arial) for predictable printers
 * - Semantic thead/tbody and colgroup with fixed widths
 * - Dotted underlines for handwriting fields and small boxed Total
 * - Monospace numeric columns for legibility
 * - Hairline separators, minimal visual noise
 */
const PrintMatchSheet: React.FC<Props> = ({ rankedPlayers, initialAssignments }) => {
  const playerLabel = (p?: (Player & { seed: number }) | null, seed?: number) => {
    if (!p) return seed ? `Seed ${seed}` : '';
    return `${p.seed} ${p.name}`;
  };

  const nextCourtMap: Record<number, Record<number, string[]>> = {
    1: {
      1: ['Court 1, Spot 1', 'Court 2, Spot 4', 'Court 3, Spot 1', 'Court 4, Spot 4'],
      2: ['Court 1, Spot 1', 'Court 1, Spot 4', 'Court 2, Spot 2', 'Court 2, Spot 3'],
    },
    2: {
      1: ['Court 2, Spot 1', 'Court 1, Spot 4', 'Court 4, Spot 1', 'Court 3, Spot 4'],
      2: ['Court 1, Spot 2', 'Court 1, Spot 3', 'Court 2, Spot 1', 'Court 2, Spot 4'],
    },
    3: {
      1: ['Court 2, Spot 2', 'Court 1, Spot 3', 'Court 4, Spot 2', 'Court 3, Spot 3'],
      2: ['Court 3, Spot 1', 'Court 3, Spot 4', 'Court 4, Spot 2', 'Court 4, Spot 3'],
    },
    4: {
      1: ['Court 1, Spot 2', 'Court 2, Spot 3', 'Court 3, Spot 2', 'Court 4, Spot 3'],
      2: ['Court 3, Spot 2', 'Court 3, Spot 3', 'Court 4, Spot 1', 'Court 4, Spot 4'],
    },
  };

  const ordinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
  };

  return (
    <div className="print-only" id="print-root">
      <style>{`
        @page { size: Letter landscape; margin: 0.20in; }

        /* Print styles */
        @media print {
          html, body { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
          nav, header, .nav, .navbar, .site-nav, .topbar, .sticky, .site-header, .page-header, .AppHeader, .no-print {
            display: none !important; visibility: hidden !important;
          }

          /* hide everything, then reveal print root to avoid external layout bleed */
          body * { visibility: hidden !important; }
          .print-only, #print-root, .print-only * , #print-root * { visibility: visible !important; }

          .print-only, #print-root {
            position: absolute !important; left: 0 !important; top: 0 !important;
            width: 100% !important; box-sizing: border-box !important; padding: 0.02in !important;
            font-family: Arial, Helvetica, sans-serif !important; color: #000 !important; background: transparent !important;
            line-height: 1.08 !important; font-size: 9pt !important;
          }

          .print-page { page-break-after: always; page-break-inside: avoid; width: 100%; box-sizing: border-box; padding: 0 0.02in; }

          /* Header */
          .court-header { font-weight: 700; font-size: 12pt; text-transform: none; letter-spacing: 0.4px; margin-bottom: 2px; }
          .court-sub { font-size: 9pt; color: #000; margin-bottom: 6px; }

          /* Layout */
          .round-block { margin-bottom: 6px; page-break-inside: avoid; }
          .round-title { font-weight: 600; font-size: 10pt; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.6px; }

          .round-row { display: flex !important; gap: 0.18in !important; align-items: stretch; }

          .match-col { flex: 1 1 66%; }
          .place-col { flex: 0 0 34%; }

          /* Clean table aesthetic */
          table { border-collapse: collapse !important; table-layout: fixed !important; width: 100% !important; color: #000 !important; }
          thead { display: table-header-group !important; }
          tbody { display: table-row-group !important; }

          .spot-table, .place-table { font-size: 9pt !important; background: transparent !important; color: #000 !important; }
          .spot-table th, .place-table th { text-align: left; font-weight: 700; padding: 4px 6px; border-bottom: 1px solid #000; }
          .spot-table td, .place-table td { padding: 3px 6px !important; vertical-align: middle; border: none; }

          /* header row heights */
          .spot-table thead tr th { height: auto !important; padding-top: 3px !important; padding-bottom: 3px !important; font-size: 9.5pt !important; }

          /* row height tuned for handwriting */
          .spot-table tbody tr, .place-table tbody tr { height: 15.5pt !important; }

          /* Column widths defined via colgroup, but give monospace numeric columns */
          .mono { font-family: "Courier New", Courier, monospace !important; letter-spacing: 0.6px; text-align: center; }

          /* Fill areas for handwritten input (dotted underline) */
          .fill {
            display: inline-block;
            width: 100%;
            min-height: 12px;
            border-bottom: 1px dotted #000;
            vertical-align: middle;
            box-sizing: border-box;
          }

          /* Small boxed total for a premium look */
          .total-box {
            display: inline-block;
            width: 46px;
            height: 14px;
            border: 1px solid #000;
            border-radius: 3px;
            vertical-align: middle;
            box-sizing: border-box;
          }

          /* Spot table specifics */
          .spot-table col.col-spot { width: 48px; }
          .spot-table col.col-player { width: 55%; }
          .spot-table col.col-g { width: 60px; }
          .spot-table col.col-total { width: 64px; }

          /* Place table specifics */
          .place-table col.col-place { width: 64px; }
          .place-table col.col-player { width: 140px; }
          .place-table col.col-next { width: 320px; }

          /* Prevent wrapping in next-court column */
          .place-table td.next { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-left: 8px; }

          /* hairline separators for rows (only bottom) */
          .spot-table tbody tr:not(:last-child) td { border-bottom: 1px solid #000; }
          .place-table tbody tr:not(:last-child) td { border-bottom: 1px solid #000; }

          /* screen hide */
        }

        /* Screen: hide print-only preview area in the app UI */
        @media screen {
          .print-only { display: none; }
        }
      `}</style>

      {initialAssignments.map((court) => (
        <section key={court.id} className="print-page" aria-label={`Print court ${court.name}`}>
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div className="court-header">{court.name}</div>
                {/* <div className="court-sub">Seeds: {court.players.map(p => p.seed).join(', ')}</div> */}
              </div>
              <div style={{ textAlign: 'right', fontSize: '8.5pt' }}>
                <div style={{ fontWeight: 700 }}>Paddle Up - The Challenge</div>
                {/* <div>Date: <span className="fill" style={{ width: 120, display: 'inline-block' }} /></div>
                <div>Time: <span className="fill" style={{ width: 80, display: 'inline-block' }} /></div> */}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 6, fontSize: '8.5pt' }} aria-hidden="true">
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Instructions</div>
            <div>Write points for each game in G1–G3. Total = sum of G1 + G2 + G3.</div>
            <div>Game order: G1 = Spots 1+2 vs 3+4; G2 = Spots 1+3 vs 2+4; G3 = Spots 1+4 vs 2+3.</div>
            <div>Rounds 1–2: record place and follow the "Next Court" destination. Round 3: write Overall Rank (1st / 2nd / 3rd / 4th).</div>
            <div>In case of a tie on Total, the player with the higher spot is used to break the tie.</div>
          </div>

          {/* Example round (single, grayed) */}
          <div style={{ marginBottom: 8 }} aria-hidden="true">
            <div style={{ fontWeight: 700, fontSize: '9pt', marginBottom: 4 }}>Example round (grayed)</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <table className="spot-table" style={{ opacity: 0.6, width: '60%' }}>
                <colgroup>
                  <col className="col-spot" />
                  <col className="col-player" />
                  <col className="col-g" />
                  <col className="col-g" />
                  <col className="col-g" />
                  <col className="col-total" />
                </colgroup>
                <thead>
                  <tr>
                    <th>Spot</th>
                    <th>Player</th>
                    <th className="mono">G1</th>
                    <th className="mono">G2</th>
                    <th className="mono">G3</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr aria-hidden="true" style={{ color: '#666' }}>
                    <td style={{ textAlign: 'center' }}>1</td>
                    <td style={{ color: '#666' }}>Alex J.</td>
                    <td className="mono">11</td>
                    <td className="mono">7</td>
                    <td className="mono">8</td>
                    <td style={{ textAlign: 'center' }}><span className="total-box" style={{ borderColor: '#666' }}>26</span></td>
                  </tr>
                  <tr aria-hidden="true" style={{ color: '#666' }}>
                    <td style={{ textAlign: 'center' }}>2</td>
                    <td style={{ color: '#666' }}>Ben K.</td>
                    <td className="mono">11</td>
                    <td className="mono">11</td>
                    <td className="mono">11</td>
                    <td style={{ textAlign: 'center' }}><span className="total-box" style={{ borderColor: '#666' }}>33</span></td>
                  </tr>
                  <tr aria-hidden="true" style={{ color: '#666' }}>
                    <td style={{ textAlign: 'center' }}>3</td>
                    <td style={{ color: '#666' }}>Casey L.</td>
                    <td className="mono">7</td>
                    <td className="mono">7</td>
                    <td className="mono">11</td>
                    <td style={{ textAlign: 'center' }}><span className="total-box" style={{ borderColor: '#666' }}>25</span></td>
                  </tr>
                  <tr aria-hidden="true" style={{ color: '#666' }}>
                    <td style={{ textAlign: 'center' }}>4</td>
                    <td style={{ color: '#666' }}>Dana M.</td>
                    <td className="mono">7</td>
                    <td className="mono">11</td>
                    <td className="mono">8</td>
                    <td style={{ textAlign: 'center' }}><span className="total-box" style={{ borderColor: '#666' }}>26</span></td>
                  </tr>
                </tbody>
              </table>

              <table className="place-table" style={{ opacity: 0.6, width: '34%' }}>
                <colgroup>
                  <col className="col-place" />
                  <col className="col-player" />
                  <col className="col-next" />
                </colgroup>
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Player</th>
                    <th>Next Court</th>
                  </tr>
                </thead>
                <tbody>
                  <tr aria-hidden="true" style={{ color: '#666' }}>
                    <td>1st</td>
                    <td style={{ color: '#666' }}>Ben K.</td>
                    <td className="next" style={{ color: '#666' }}>Court 1, Spot 1</td>
                  </tr>
                  <tr aria-hidden="true" style={{ color: '#666' }}>
                    <td>2nd</td>
                    <td style={{ color: '#666' }}>Alex J.</td>
                    <td className="next" style={{ color: '#666' }}>Court 2, Spot 4</td>
                  </tr>
                  <tr aria-hidden="true" style={{ color: '#666' }}>
                    <td>3rd</td>
                    <td style={{ color: '#666' }}>Dana M.</td>
                    <td className="next" style={{ color: '#666' }}>Court 3, Spot 1</td>
                  </tr>
                  <tr aria-hidden="true" style={{ color: '#666' }}>
                    <td>4th</td>
                    <td style={{ color: '#666' }}>Casey L.</td>
                    <td className="next" style={{ color: '#666' }}>Court 4, Spot 4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {[1, 2, 3].map((roundNum) => (
            <div key={roundNum} className="round-block">
              <div className="round-title">Round {roundNum}</div>
              <div className="round-row">
                <div className="match-col">
                  <table className="spot-table" aria-label={`Court ${court.id} Round ${roundNum}`}>
                    <colgroup>
                      <col className="col-spot" />
                      <col className="col-player" />
                      <col className="col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Spot</th>
                        <th>Player</th>
                        <th className="mono">Final Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 4 }).map((_, spotIdx) => {
                        const p = roundNum === 1 ? court.players[spotIdx] : null;
                        const seed = p ? p.seed : undefined;
                        return (
                          <tr key={spotIdx}>
                            <td style={{ textAlign: 'center' }}>{spotIdx + 1}</td>
                            <td>{playerLabel(p, seed)}</td>
                            <td className="mono" style={{ textAlign: 'center' }}><span className="fill" aria-hidden="true" /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="place-col">
                  <table className="place-table" aria-label={`Places Court ${court.id} Round ${roundNum}`}>
                    <colgroup>
                      <col className="col-place" />
                      <col className="col-player" />
                      <col className="col-next" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Place</th>
                        <th>Player</th>
                        {roundNum === 3 ? <th>Overall Rank</th> : <th>Next Court</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {roundNum < 3 ? (
                        <>
                          <tr>
                            <td>1st</td>
                            <td><span className="fill" aria-hidden="true" /></td>
                            <td className="next">{nextCourtMap[court.id]?.[roundNum]?.[0] ?? <span className="fill" aria-hidden="true" />}</td>
                          </tr>
                          <tr>
                            <td>2nd</td>
                            <td><span className="fill" aria-hidden="true" /></td>
                            <td className="next">{nextCourtMap[court.id]?.[roundNum]?.[1] ?? <span className="fill" aria-hidden="true" />}</td>
                          </tr>
                          <tr>
                            <td>3rd</td>
                            <td><span className="fill" aria-hidden="true" /></td>
                            <td className="next">{nextCourtMap[court.id]?.[roundNum]?.[2] ?? <span className="fill" aria-hidden="true" />}</td>
                          </tr>
                          <tr>
                            <td>4th</td>
                            <td><span className="fill" aria-hidden="true" /></td>
                            <td className="next">{nextCourtMap[court.id]?.[roundNum]?.[3] ?? <span className="fill" aria-hidden="true" />}</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td>1st</td>
                            <td><span className="fill" aria-hidden="true" /></td>
                            <td className="next">{ordinal((court.id - 1) * 4 + 1)}</td>
                          </tr>
                          <tr>
                            <td>2nd</td>
                            <td><span className="fill" aria-hidden="true" /></td>
                            <td className="next">{ordinal((court.id - 1) * 4 + 2)}</td>
                          </tr>
                          <tr>
                            <td>3rd</td>
                            <td><span className="fill" aria-hidden="true" /></td>
                            <td className="next">{ordinal((court.id - 1) * 4 + 3)}</td>
                          </tr>
                          <tr>
                            <td>4th</td>
                            <td><span className="fill" aria-hidden="true" /></td>
                            <td className="next">{ordinal((court.id - 1) * 4 + 4)}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};

export default PrintMatchSheet;
