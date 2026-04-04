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
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrollEnabledRef = useRef(true);

  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    if (isAutoScrollEnabledRef.current && logContainerRef.current) {
      isProgrammaticScrollRef.current = true;
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: 'auto',
      });
      // Small timeout to reset the programmatic flag after the scroll event has likely fired
      const timeout = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [battleLog]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticScrollRef.current) return;

    const target = e.currentTarget;
    // Más robusto para Safari y navegadores móviles con scroll elástico
    const isAtBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 50;
    isAutoScrollEnabledRef.current = isAtBottom;
  };
  const actionButtons = (
    <>
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
    </>
  );

  return (
    <section className='screen screen--active'>
      <header className='topbar'>
        <div
          className='hide-on-mobile'
          style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}
        >
          {actionButtons}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p
            className='eyebrow hide-on-mobile'
            style={{ margin: 0, fontSize: '2rem', whiteSpace: 'nowrap' }}
          >
            FIGHT ARENA
          </p>
        </div>
        <div style={{ flex: 1 }} />
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
          {battleState.isRampage ? (
            <span className='versus versus--rampage'>RAMPAGE!!</span>
          ) : (
            <span className='versus'>VS</span>
          )}
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
        <div
          className='battle-log'
          ref={logContainerRef}
          onScroll={handleScroll}
        >
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
        </div>
      </section>

      <footer className='battle-footer show-on-mobile'>{actionButtons}</footer>
    </section>
  );
}
