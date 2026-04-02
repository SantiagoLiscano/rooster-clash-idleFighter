import { useEffect, useRef } from 'react';

import { FighterPanel } from './FighterPanel';

import type { BattleArenaProps } from '@/types/ui';

export function BattleArena({
  battleState,
  battleLog,
  onBackToRoster,
  onSurrender,
  canSurrender,
  isFinished,
}: BattleArenaProps) {
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [battleLog]);
  return (
    <section className='screen screen--active'>
      <header className='topbar'>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          {isFinished ? (
            <button
              type='button'
              className='button button--ghost'
              onClick={onBackToRoster}
            >
              Back to Roster
            </button>
          ) : (
            <button
              type='button'
              className='button button--danger'
              onClick={onSurrender}
              disabled={!canSurrender}
            >
              🏳️ Surrender
            </button>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p
            className='eyebrow'
            style={{ margin: 0, fontSize: '2rem', whiteSpace: 'nowrap' }}
          >
            FIGHT ARENA
          </p>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <span className='pill'>{battleState.modeText}</span>
        </div>
      </header>

      <div className='arena'>
        <FighterPanel
          playerSide='player'
          fighter={battleState.left}
          image={battleState.images.player}
          effect={
            battleState.effect?.target === 'player'
              ? battleState.effect.type
              : null
          }
        />
        <div className='arena-center'>
          <span className='versus'>VS</span>
        </div>
        <FighterPanel
          playerSide='opponent'
          fighter={battleState.right}
          image={battleState.images.opponent}
          effect={
            battleState.effect?.target === 'opponent'
              ? battleState.effect.type
              : null
          }
        />
      </div>

      <section className='panel'>
        <div className='battle-log'>
          {battleLog.map((entry) => {
            let classNames = 'log-entry';
            if (entry.type === 'system') classNames += ' log-entry--system';
            else if (entry.type === 'turn') classNames += ' log-entry--turn';
            else if (entry.type === 'winner')
              classNames += ' log-entry--winner';

            return (
              <p
                key={entry.id}
                className={classNames}
                dangerouslySetInnerHTML={{ __html: entry.message }}
              />
            );
          })}
          <div ref={logEndRef} />
        </div>
      </section>
    </section>
  );
}
