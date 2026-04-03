import { FighterCard } from './FighterCard';

import type { SelectionScreenProps } from '@/types/ui';

export function SelectionScreen({
  rooster,
  opponents,
  selectedPlayerId,
  selectedOpponentId,
  onBack,
  onRefreshOpponents,
  onSelectPlayer,
  onSelectOpponent,
  onStartBattle,
  canStartBattle,
  onOpenColorEditor,
  hasRefreshedToday,
  isIcuActive,
}: SelectionScreenProps) {
  return (
    <section className='screen screen--active'>
      <header className='topbar'>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <button
            type='button'
            className='button button--ghost'
            onClick={onBack}
          >
            Back
          </button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p className='eyebrow selection-title'>MODULAR ROSTER MANAGEMENT</p>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <span className='pill'>React + Vite</span>
        </div>
      </header>

      <div className='selection-layout'>
        {isIcuActive && (
          <div
            style={{
              background: 'var(--danger)',
              color: 'white',
              textAlign: 'center',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: '0 4px 12px rgba(180, 60, 47, 0.3)',
            }}
          >
            Your team was rushed to the ICU, please wait 24 hours for their
            recovery
          </div>
        )}
        <section className='panel'>
          <div className='panel-heading'>
            <div>
              <p className='eyebrow'>Step 1</p>
              <h3>Select your Rooster</h3>
            </div>
          </div>
          <div className='card-grid'>
            {rooster.map((fighter) => (
              <FighterCard
                key={fighter.id}
                fighter={fighter}
                isSelected={fighter.id === selectedPlayerId}
                playerSide='player'
                onSelect={() => onSelectPlayer(fighter.id)}
                onEditColor={() => onOpenColorEditor(fighter.id)}
              />
            ))}
          </div>
        </section>

        <section className='panel'>
          <div className='panel-heading'>
            <div>
              <p className='eyebrow'>Step 2</p>
              <h3>Select an Opponent</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type='button'
                className='button button--ghost'
                style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                onClick={onRefreshOpponents}
                disabled={hasRefreshedToday}
              >
                Refresh
              </button>
              <span
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--muted)',
                  fontWeight: 'bold',
                }}
              >
                {hasRefreshedToday ? '0/1' : '1/1'}
              </span>
            </div>
          </div>
          <div className='card-grid'>
            {opponents.map((fighter) => (
              <FighterCard
                key={fighter.id}
                fighter={fighter}
                isSelected={fighter.id === selectedOpponentId}
                playerSide='opponent'
                onSelect={() => onSelectOpponent(fighter.id)}
                showXp={false}
                onEditColor={() => {}}
              />
            ))}
          </div>
        </section>
      </div>

      <div
        className='selection-actions'
        style={{ justifyContent: 'center', marginTop: '30px' }}
      >
        <button
          type='button'
          className='button button--primary'
          style={{ padding: '16px 40px', fontSize: '1.2rem' }}
          onClick={onStartBattle}
          disabled={!canStartBattle}
        >
          Battle!
        </button>
      </div>
    </section>
  );
}
