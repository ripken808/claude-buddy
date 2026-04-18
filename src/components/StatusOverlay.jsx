import { getSessionPercent } from '../utils/tokenTracker'
import { getStateMoodColor } from '../utils/stateEngine'

export default function StatusOverlay({ usage, buddyState }) {
  const pct = getSessionPercent(usage)
  const color = getStateMoodColor(buddyState)
  const barPct = Math.min(pct * 100, 100)
  const SESSION_LIMIT = 50000

  return (
    <div style={{
      position: 'absolute',
      bottom: '-72px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '160px',
      textAlign: 'center',
      pointerEvents: 'none',
      fontFamily: '"Courier New", monospace',
    }}>
      {/* State label */}
      <div style={{
        color,
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '6px',
        textShadow: `0 0 8px ${color}`,
      }}>
        {buddyState.replace('_', ' ')}
      </div>

      {/* Token bar — terminal style */}
      <div style={{
        width: '100%',
        height: '8px',
        background: '#1A1A1A',
        border: '1px solid #333',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${barPct}%`,
          height: '100%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
          transition: 'width 0.6s ease, background 0.6s ease',
        }} />
        {/* Segment ticks */}
        {[25, 50, 75].map(t => (
          <div key={t} style={{
            position: 'absolute',
            left: `${t}%`,
            top: 0,
            width: '1px',
            height: '100%',
            background: '#333',
          }} />
        ))}
      </div>

      {/* Token count */}
      <div style={{
        color: 'rgba(232,97,26,0.35)',
        fontSize: '9px',
        marginTop: '5px',
        letterSpacing: '1px',
      }}>
        {(usage.sessionTokens || 0).toLocaleString()} / {SESSION_LIMIT.toLocaleString()} tkn
      </div>
    </div>
  )
}
