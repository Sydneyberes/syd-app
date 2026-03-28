import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  AreaChart, Area,
  PieChart, Pie, Sector,
  ResponsiveContainer, Cell,
} from 'recharts'

import {
  fleetScore,
  statCards,
  drivers,
  fleetMedianRoutes,
  vehicles,
  vehicleFleetAvgRoutes,
  vehicleFleetAvgMiles,
  last7Days,
  weeklyTrends,
  weekdayAvg,
  podData,
} from '../data/dashboardData'

// ─── Color helpers (Curri design tokens) ─────────────────────
const ACCENT    = 'var(--color-icon-accent-hivis)'
const MUTED     = 'var(--color-text-tertiary)'
const RED       = 'var(--color-background-system-danger)'
const AMBER     = 'var(--color-border-warning)'
const TEXT_3    = 'var(--color-text-tertiary)'
const BG_RAISED = 'var(--color-elevation-surface-raised)'
const BORDER    = 'var(--color-border-primary)'

const vehicleBarColor = (routes, avg) => {
  const ratio = routes / avg
  if (ratio > 1.3) return RED
  if (ratio >= 0.8) return ACCENT
  return MUTED
}

// ─── Chart style 1: Vertical bars, peak highlighted ──────────
// Pure CSS vertical bar chart — same visual weight as InlineBarCard and LollipopCard
function PeakBarCard({ data, field, label, unit = '', formatName }) {
  const sorted = [...data].sort((a, b) => a[field] - b[field]) // ascending = peak on right
  const max = Math.max(...sorted.map(d => d[field]))

  return (
    <div className="db-card db-card--peak">
      <div className="db-card-title">{label}</div>
      <div className="db-peak-chart">
        {sorted.map((d, i) => {
          const isMax = d[field] === max
          const heightPct = (d[field] / max) * 100
          const name = formatName ? formatName(d.name) : d.name
          return (
            <div key={d.id ?? i} className="db-peak-col">
              <span className="db-peak-val" style={{ color: isMax ? ACCENT : TEXT_3 }}>
                {d[field]}{unit}
              </span>
              <div className="db-peak-bar-wrap">
                <div
                  className="db-peak-bar"
                  style={{
                    height: `${heightPct}%`,
                    background: isMax ? ACCENT : 'rgba(112,109,101,0.4)',
                  }}
                />
              </div>
              <span className="db-peak-name" style={{ color: isMax ? 'var(--text-2)' : TEXT_3 }}>
                {name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Chart style 2: Inline thin-bar table ─────────────────────
// Like Curri's "Activity comparison" — label | thin bar | value
function InlineBarCard({ data, field, label, unit = '', isPercent = false, barColor = ACCENT }) {
  const sorted = [...data].sort((a, b) => b[field] - a[field])
  const max = sorted[0][field]
  const domainMin = isPercent ? sorted[sorted.length - 1][field] * 0.9 : 0

  return (
    <div className="db-card">
      <div className="db-card-title">{label}</div>
      <div className="db-inline-list">
        {sorted.map((d, i) => {
          const pct = ((d[field] - domainMin) / (max - domainMin)) * 100
          const isTop = i === 0
          return (
            <div key={d.id ?? i} className="db-inline-row">
              <span className="db-inline-label">{d.name.split(' ')[0]}</span>
              <div className="db-inline-track">
                <div
                  className="db-inline-fill"
                  style={{
                    width: `${pct}%`,
                    background: isTop ? barColor : 'rgba(112,109,101,0.4)',
                  }}
                />
              </div>
              <span className="db-inline-val">
                {d[field]}{isPercent ? '%' : unit ? '\u00a0' + unit : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Chart style 3: Lollipop ──────────────────────────────────
// Thin stem ending in a dot — clean, compact
function LollipopCard({ data, field, label, unit = '', isPercent = false, colorFn }) {
  const sorted = [...data].sort((a, b) => b[field] - a[field])
  const max = sorted[0][field]
  const domainMin = isPercent ? sorted[sorted.length - 1][field] * 0.85 : 0
  const range = max - domainMin

  return (
    <div className="db-card">
      <div className="db-card-title">{label}</div>
      <div className="db-lollipop-list">
        {sorted.map((d, i) => {
          const pct = ((d[field] - domainMin) / range) * 100
          const color = colorFn ? colorFn(d) : (i === 0 ? ACCENT : MUTED)
          return (
            <div key={d.id ?? i} className="db-lollipop-row">
              <span className="db-lollipop-label">{d.name.split(' ')[0]}</span>
              <div className="db-lollipop-track">
                <div className="db-lollipop-bg" />
                <div className="db-lollipop-stem" style={{ width: `${pct}%`, background: color }} />
                <div
                  className="db-lollipop-dot"
                  style={{ left: `${pct}%`, background: color }}
                />
              </div>
              <span className="db-lollipop-val">
                {d[field]}{isPercent ? '%' : unit ? '\u00a0' + unit : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const podBarColor = (rate) => rate >= 95 ? ACCENT : rate >= 70 ? MUTED : RED

// ─── Driver Rates Card (POD + On-time combined) ───────────────
const AVATAR_BG = 'var(--color-background-neutral-bold)'
const avatarInitials = (name) => name.split(' ').map(n => n[0]).join('')

function DriverRatesCard() {
  const [hovered, setHovered] = useState(null)
  const sorted = [...drivers].sort((a, b) => b.pod - a.pod)
  const allVals = drivers.flatMap(d => [d.pod, d.onTime])
  const domainMin = Math.min(...allVals) * 0.88
  const domainMax = Math.max(...allVals)
  const range = domainMax - domainMin

  return (
    <div className="db-card">
      <div className="db-card-title-row">
        <span className="db-card-title">Driver leaderboard</span>
        <div className="db-dual-legend">
          <span><span className="db-dual-legend-dot" style={{ background: ACCENT }} />POD</span>
          <span><span className="db-dual-legend-dot" style={{ background: MUTED }} />On-time</span>
        </div>
      </div>
      <div>
        {sorted.map((d, i) => {
          const isTop = i === 0
          const podPct = ((d.pod - domainMin) / range) * 100
          const onTimePct = ((d.onTime - domainMin) / range) * 100
          return (
            <div
              key={d.id}
              className="db-dual-row"
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="db-dual-avatar" style={{ background: AVATAR_BG }}>
                {avatarInitials(d.name)}
              </div>
              <span className="db-dual-name">{d.name.split(' ')[0]}</span>
              <div className="db-dual-bars">
                <div className="db-dual-track">
                  <div className="db-dual-fill" style={{ width: `${podPct}%`, background: isTop ? ACCENT : 'rgba(220,218,115,0.3)' }} />
                </div>
                <div className="db-dual-track">
                  <div className="db-dual-fill" style={{ width: `${onTimePct}%`, background: MUTED }} />
                </div>
              </div>
              {hovered === d.id && (
                <div className="db-dual-tooltip">
                  <div className="db-dual-tooltip-name">{d.name}</div>
                  <div className="db-dual-tooltip-row">
                    <span style={{ color: ACCENT }}>POD</span>
                    <span>{d.pod}%</span>
                  </div>
                  <div className="db-dual-tooltip-row">
                    <span style={{ color: TEXT_3 }}>On-time</span>
                    <span>{d.onTime}%</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const deltaSymbol = (d) => {
  if (!d || d === '=' || d === 'NEW') return d
  if (d.startsWith('+')) return `↑${d.slice(1)}`
  return `↓${d.slice(1)}`
}

const tierSymbol = (tier) => {
  switch (tier) {
    case 'Gold':    return '↑'
    case 'Silver':  return '→'
    case 'Bronze':  return '↓'
    case 'At Risk': return '⚠'
    default:        return ''
  }
}

// Dark recharts tooltip
const darkTooltipStyle = {
  background: 'var(--color-elevation-surface-overlay)',
  border: `1px solid var(--color-border-primary)`,
  borderRadius: 6,
  fontSize: 12,
  color: 'var(--color-text-primary)',
}

// ─── Header ──────────────────────────────────────────────────
function DashHeader() {
  return (
    <div className="db-header">
      <span className="db-header-title">Route Planner Metrics</span>
      <div className="db-header-filters">
        <button className="db-filter-pill">Jan 1 – Mar 26, 2026</button>
        <button className="db-filter-pill">All Drivers ↓</button>
        <button className="db-filter-pill">All Vehicles ↓</button>
        <button className="db-export-btn">Export</button>
      </div>
    </div>
  )
}

// ─── Fleet Score Band ─────────────────────────────────────────
const bandComponents = [
  { label: 'On-time',    value: `${fleetScore.components.onTime}%` },
  { label: 'POD',        value: `${fleetScore.components.pod}%` },
  { label: 'Actual vs plan', value: '−6%' },
  { label: 'Completion', value: `${fleetScore.components.stopCompletion}%` },
]

function FleetScoreBand() {
  const score = fleetScore.score
  return (
    <div className="db-band">
      <div className="db-band-inner">

        <div className="db-band-score-group">
          <span className="db-band-label">Fleet Score</span>
          <div className="db-band-score-row">
            <span className="db-band-score">{score}</span>
            <div className="db-band-score-meta">
              <span className="db-band-badge">GOOD</span>
              <span className="db-band-delta">↑4 vs prior</span>
            </div>
          </div>
        </div>

        <div className="db-band-divider" />

        <div className="db-band-components">
          {bandComponents.map((c, i) => (
            <div key={i} className="db-band-component">
              <span className="db-band-comp-label">{c.label}</span>
              <span className="db-band-comp-value">{c.value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

// ─── Stat Cards ───────────────────────────────────────────────
function StatGrid() {
  return (
    <div className="db-stat-grid">
      {statCards.map((card, i) => (
        <div key={i} className="db-stat-card">
          <div className="db-stat-label">{card.label}</div>
          <div className="db-stat-value">{card.value}</div>
          <div className="db-stat-delta">
            {card.delta} {card.positive ? '↗' : '↘'}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Driver Leaderboard ───────────────────────────────────────
function DriverLeaderboard() {
  const maxScore = Math.max(...drivers.map(d => d.score))

  return (
    <div className="db-card">
      <div className="db-card-title">Driver leaderboard</div>
      <div>
        {drivers.map((d, idx) => {
          const isTop = idx === 0
          const scorePct = Math.round((d.score / maxScore) * 100)

          const delta = d.delta
          const deltaEl = delta === '=' || !delta ? null
            : delta === 'NEW' ? <span className="db-lb-delta">NEW</span>
            : delta.startsWith('+') ? <span className="db-lb-delta db-lb-delta--up">↑{delta.slice(1)}</span>
            : <span className="db-lb-delta db-lb-delta--down">↓{delta.slice(1)}</span>

          return (
            <div key={d.id} className="db-lb-row">
              <span className="db-lb-rank" style={{ color: isTop ? ACCENT : 'var(--text-3)' }}>
                {d.rank}
              </span>
              <span className="db-lb-name">{d.name}</span>
              <div className="db-lb-bar-track">
                <div
                  className="db-lb-bar-fill"
                  style={{
                    width: `${scorePct}%`,
                    background: isTop ? ACCENT : MUTED,
                  }}
                />
              </div>
              <span className="db-lb-score" style={{ color: isTop ? ACCENT : 'var(--text-2)' }}>
                {d.score}
              </span>
              <span className="db-lb-delta-wrap">{deltaEl}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Routes Over Time ─────────────────────────────────────────
function RoutesOverTimeCard() {
  return (
    <div className="db-card">
      <div className="db-card-title-row">
        <span className="db-card-title">Routes over time</span>
        <span style={{ fontSize: 11, color: ACCENT }}>↑14% vs prior period</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={weeklyTrends} margin={{ left: -16, right: 8, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="routesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.15} />
              <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(82,79,73,0.6)" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: TEXT_3 }} axisLine={false} tickLine={false} interval={1} />
          <YAxis tick={{ fontSize: 11, fill: TEXT_3 }} axisLine={false} tickLine={false} domain={[28, 50]} width={28} />
          <Tooltip contentStyle={darkTooltipStyle} formatter={(v) => [v, 'Routes']} />
          <Area type="monotone" dataKey="routes" stroke={ACCENT} strokeWidth={1.5} fill="url(#routesGrad)" dot={false} activeDot={{ r: 3, fill: ACCENT }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Weekday Pattern Card ──────────────────────────────────────
function WeekdayCard() {
  const maxDay = Math.max(...weekdayAvg.map(d => d.avgRoutes))
  return (
    <div className="db-card">
      <div className="db-card-title">Avg routes by weekday</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={weekdayAvg} margin={{ left: -16, right: 8, top: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(82,79,73,0.6)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: TEXT_3 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: TEXT_3 }} axisLine={false} tickLine={false} width={32} tickFormatter={(v) => Math.round(v)} />
          <Tooltip contentStyle={darkTooltipStyle} formatter={(v) => [v, 'Avg Routes']} />
          <Bar dataKey="avgRoutes" radius={[2, 2, 0, 0]} maxBarSize={28}>
            {weekdayAvg.map((d, i) => (
              <Cell key={i} fill={d.avgRoutes === maxDay ? ACCENT : MUTED} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── On-Time + POD Card ───────────────────────────────────────
function OnTimePodCard() {
  const taskRates = podData.byTaskType.filter(t =>
    ['Photo', 'Signature', 'Pickup', 'Recipient Name'].includes(t.type)
  )
  return (
    <div className="db-card db-card--split">
      <div className="db-card-half">
        <div className="db-card-label">On-time arrival score</div>
        <div className="db-big-num">{fleetScore.components.onTime}%</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>↑2pp vs prior</div>
        <div className="db-progress-track">
          <div className="db-progress-fill" style={{ width: `${fleetScore.components.onTime}%`, background: ACCENT }} />
        </div>
      </div>
      <div className="db-card-half-divider" />
      <div className="db-card-half">
        <div className="db-card-label">POD compliance score</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <div className="db-big-num">{podData.overallRate}%</div>
          <span style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.04em' }}>SILVER</span>
        </div>
        <div className="db-progress-track" style={{ marginBottom: 8 }}>
          <div className="db-progress-fill" style={{ width: `${podData.overallRate}%`, background: ACCENT }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6 }}>
          {taskRates.map((t, i) => (
            <span key={i}>
              {t.type} {t.rate}%{i < taskRates.length - 1 && <span style={{ margin: '0 4px', opacity: 0.4 }}>·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Util status pill ────────────────────────────────────────
const utilStatusStyle = (status) => {
  switch (status) {
    case 'Over-utilized':  return { dot: RED,   bg: 'rgba(248,113,113,0.1)',   color: RED   }
    case 'Optimized':      return { dot: ACCENT, bg: 'rgba(220,218,115,0.1)', color: ACCENT }
    case 'Under-utilized': return { dot: MUTED,  bg: 'rgba(112,109,101,0.15)', color: TEXT_3 }
    default:               return { dot: MUTED,  bg: 'rgba(112,109,101,0.15)', color: TEXT_3 }
  }
}

// ─── Vehicle Utilization Card ─────────────────────────────────
const UTIL_COLS = [
  { key: 'name',    label: 'Name',   numeric: false },
  { key: 'type',    label: 'Type',   numeric: false },
  { key: 'status',  label: 'Status', numeric: false },
  { key: 'utilPct', label: 'Util %', numeric: true  },
  { key: 'pmh',     label: 'PMH',    numeric: true  },
  { key: 'smh',     label: 'SMH',    numeric: true  },
]

function VehicleUtilCard() {
  const [view, setView] = useState('table')
  const [metric, setMetric] = useState('routes')
  const [sortKey, setSortKey] = useState('utilPct')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const tableSorted = [...vehicles].sort((a, b) => {
    const valA = a[sortKey]; const valB = b[sortKey]
    const cmp = typeof valA === 'string' ? valA.localeCompare(valB) : valA - valB
    return sortDir === 'desc' ? -cmp : cmp
  })

  const sorted = [...vehicles].sort((a, b) => b[metric] - a[metric])
  const avg = metric === 'routes' ? vehicleFleetAvgRoutes : vehicleFleetAvgMiles
  const unitLabel = metric === 'routes' ? 'Routes' : 'Miles'

  return (
    <div className="db-card">
      <div className="db-card-title-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className="db-card-title">Vehicle utilization</span>
          <span style={{ fontSize: 10, color: TEXT_3, letterSpacing: '0.02em' }}>
            Utilization&nbsp;=&nbsp;PMH&nbsp;÷&nbsp;SMH&nbsp;×&nbsp;100
          </span>
        </div>
        <div className="db-toggle">
          {['table', 'chart'].map(v => (
            <button
              key={v}
              className={`db-toggle-btn${view === v ? ' active' : ''}`}
              onClick={() => setView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {view === 'table' ? (
        <div className="db-util-table-wrap">
          <table className="db-util-table">
            <thead>
              <tr>
                {UTIL_COLS.map(col => (
                  <th
                    key={col.key}
                    className="db-util-th"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    <span className={`db-util-sort-icon${sortKey === col.key ? ' active' : ''}`}>
                      {sortKey === col.key && sortDir === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableSorted.map(v => {
                const ss = utilStatusStyle(v.status)
                return (
                  <tr key={v.id}>
                    <td className="db-util-name">{v.name}</td>
                    <td className="db-util-type">{v.type}</td>
                    <td>
                      <span className="db-util-badge" style={{ background: ss.bg, color: ss.color }}>
                        <span className="db-util-dot" style={{ background: ss.dot }} />
                        {v.status}
                      </span>
                    </td>
                    <td className="db-util-pct" style={{ color: ss.color }}>{v.utilPct}%</td>
                    <td className="db-util-num">{v.pmh} hrs</td>
                    <td className="db-util-num">{v.smh} hrs</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <div className="db-toggle">
              {['routes', 'miles'].map(m => (
                <button
                  key={m}
                  className={`db-toggle-btn${metric === m ? ' active' : ''}`}
                  onClick={() => setMetric(m)}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sorted} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(82,79,73,0.6)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: TEXT_3 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={56} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={darkTooltipStyle} formatter={(v) => [`${v} ${unitLabel}`, unitLabel]} />
              <ReferenceLine x={avg} stroke={TEXT_3} strokeDasharray="4 3" strokeWidth={1}
                label={{ value: `Avg ${avg}`, position: 'insideTopRight', fontSize: 10, fill: TEXT_3 }} />
              <Bar dataKey={metric} radius={[0, 3, 3, 0]} maxBarSize={22}>
                {sorted.map((v, i) => (
                  <Cell key={i} fill={vehicleBarColor(v.routes, vehicleFleetAvgRoutes)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="db-legend">
            <span><span className="db-legend-dot" style={{ background: RED }} />Over-utilized &gt;85%</span>
            <span><span className="db-legend-dot" style={{ background: ACCENT }} />Optimized 55–85%</span>
            <span><span className="db-legend-dot" style={{ background: MUTED }} />Under-utilized &lt;55%</span>
          </div>
        </>
      )}

      <div className="db-callout db-callout--warn">
        Van 02 and Van 04 at 40% and 17% productive utilization — SMH scheduled but PMH not delivered. Van 03 at 93% — accelerated wear risk.
      </div>
    </div>
  )
}

// ─── Route Efficiency Card ────────────────────────────────────
function RouteEfficiencyCard() {
  return (
    <div className="db-card">
      <div className="db-card-title-row">
        <span className="db-card-title">Route efficiency</span>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-3)' }}>
          <span><span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: TEXT_3, marginRight: 5, verticalAlign: 'middle' }} />Planned</span>
          <span><span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: ACCENT, marginRight: 5, verticalAlign: 'middle' }} />Actual</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={last7Days} margin={{ left: -8, right: 8, top: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(82,79,73,0.6)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: TEXT_3 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: TEXT_3 }}
            axisLine={false}
            tickLine={false}
            unit="h"
            domain={[0, 5]}
            width={32}
          />
          <Tooltip
            contentStyle={darkTooltipStyle}
            formatter={(v, name) => [`${v}h`, name]}
          />
          <Bar dataKey="planned" name="Planned" fill={TEXT_3} radius={[2, 2, 0, 0]} maxBarSize={14} />
          <Bar dataKey="actual"  name="Actual"  fill={ACCENT} radius={[2, 2, 0, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
        Routes averaging 8% over plan. Consider recalibrating time buffers.
      </div>
    </div>
  )
}

// ─── POD Task Breakdown Card ──────────────────────────────────
function PodBreakdownCard() {
  const max = Math.max(...podData.byTaskType.map(t => t.rate))
  const domainMin = Math.min(...podData.byTaskType.map(t => t.rate)) * 0.9

  return (
    <div className="db-card">
      <div className="db-card-title">POD by task type</div>
      <div className="db-inline-list">
        {podData.byTaskType.map((t, i) => {
          const pct = ((t.rate - domainMin) / (max - domainMin)) * 100
          const color = podBarColor(t.rate)
          return (
            <div key={i} className="db-inline-row">
              <span className="db-inline-label">{t.type}</span>
              <div className="db-inline-track">
                <div className="db-inline-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
              <span className="db-inline-val" style={{ color }}>{t.rate}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Failure Reasons Donut Card ───────────────────────────────
const DONUT_COLORS = [
  'var(--color-chart-categorical-1)',
  'var(--color-chart-categorical-2)',
  'var(--color-chart-categorical-3)',
  'var(--color-chart-categorical-4)',
  'var(--color-chart-categorical-5)',
]

const renderActiveSlice = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <Sector
      cx={cx} cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  )
}

function FailureReasonsCard() {
  const total = podData.failureReasons.reduce((s, r) => s + r.count, 0)
  const [activeIdx, setActiveIdx] = useState(null)
  const active = activeIdx !== null ? podData.failureReasons[activeIdx] : null

  return (
    <div className="db-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="db-card-title">POD failure reasons</div>
      <div className="db-donut-layout" style={{ flex: 1 }}>
        <div className="db-donut-wrap">
          <PieChart width={120} height={120}>
            <Pie
              data={podData.failureReasons}
              dataKey="count"
              nameKey="reason"
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={54}
              paddingAngle={1}
              activeIndex={activeIdx ?? undefined}
              activeShape={renderActiveSlice}
              onMouseEnter={(_, i) => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              {podData.failureReasons.map((r, i) => (
                <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />
              ))}
            </Pie>
          </PieChart>
          <div className="db-donut-center">
            {active ? (
              <>
                <span className="db-donut-total">{Math.round(active.count / total * 100)}%</span>
                <span className="db-donut-label" style={{ maxWidth: 44, textAlign: 'center', lineHeight: 1.2 }}>
                  {active.reason.split(' ').slice(0, 2).join(' ')}
                </span>
              </>
            ) : (
              <>
                <span className="db-donut-total">{total}</span>
                <span className="db-donut-label">total</span>
              </>
            )}
          </div>
        </div>
        <div className="db-donut-legend">
          {podData.failureReasons.map((r, i) => {
            const pct = Math.round(r.count / total * 100)
            const isActive = activeIdx === i
            return (
              <div
                key={i}
                className="db-donut-legend-row"
                style={{ opacity: activeIdx !== null && !isActive ? 0.35 : 1, transition: 'opacity 0.15s', cursor: 'default' }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <span className="db-donut-legend-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                <span className="db-donut-legend-name">{r.reason}</span>
                <span className="db-donut-legend-val" style={{ color: isActive ? 'var(--text)' : TEXT_3 }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Insights Card ────────────────────────────────────────────
const insightItems = [
  {
    type: 'warn',
    category: 'WARNING',
    text: 'Marcus Webb at 1.4× fleet median — monitor workload distribution',
  },
  {
    type: 'good',
    category: 'POSITIVE',
    text: 'Route volume +14% over 8 weeks — fleet at sustained growth',
  },
  {
    type: 'danger',
    category: 'WARNING',
    text: 'Amber Zhou POD at 61% (At Risk) — coaching recommended',
  },
  {
    type: 'info',
    category: 'INFO',
    text: 'Tuesday peak at 8.4 routes/day — schedule around this pattern',
  },
]

const insightBorderColor = (type) => {
  if (type === 'warn')   return AMBER
  if (type === 'good')   return ACCENT
  if (type === 'danger') return RED
  return TEXT_3
}

function InsightsCard() {
  return (
    <div className="db-card">
      <div className="db-insights-grid">
        {insightItems.map((item, i) => (
          <div
            key={i}
            className="db-insight-item"
            style={{ borderLeftColor: insightBorderColor(item.type) }}
          >
            <div className="db-insight-category">{item.category}</div>
            <div className="db-insight-text">{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="db-page">
      <DashHeader />
      <FleetScoreBand />
      <StatGrid />

      <div className="db-card-grid">

        {/* ── Vehicle utilization + Driver leaderboard ──────── */}
        <div className="db-span-2">
          <VehicleUtilCard />
        </div>
        <DriverRatesCard />

        {/* ── Delivery quality ─────────────────────────────── */}
        <div className="db-section-label db-span-3">Delivery quality</div>
        <OnTimePodCard />
        <PodBreakdownCard />
        <FailureReasonsCard />

        {/* ── Route trends ─────────────────────────────────── */}
        <div className="db-section-label db-span-3">Route trends</div>
        <RoutesOverTimeCard />
        <WeekdayCard />
        <RouteEfficiencyCard />

        {/* ── Vehicle breakdown ─────────────────────────────── */}
        <div className="db-section-label db-span-3">Vehicle breakdown</div>
        <PeakBarCard
          data={vehicles}
          field="routes"
          label="Routes per vehicle"
        />
        <PeakBarCard
          data={vehicles}
          field="hours"
          label="Hours per vehicle"
          unit="hrs"
        />
        <LollipopCard
          data={vehicles}
          field="miles"
          label="Miles per vehicle"
          unit="mi"
          colorFn={(v) => vehicleBarColor(v.routes, vehicleFleetAvgRoutes)}
        />

        {/* ── Alerts & observations ────────────────────────── */}
        <div className="db-section-label db-span-3">Alerts &amp; observations</div>
        <div className="db-span-3"><InsightsCard /></div>

      </div>
    </div>
  )
}
