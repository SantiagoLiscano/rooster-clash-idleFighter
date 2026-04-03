import type { FighterCardProps } from '@/types/ui';

export function FighterCard({
  fighter,
  isSelected,
  playerSide,
  onSelect,
  showXp = true,
  onEditColor,
}: FighterCardProps) {
  const selectedClass = isSelected ? `is-${playerSide}` : '';
  const isKo = playerSide === 'player' && fighter.hp <= 0;

  return (
    <article
      className={`fighter-option fighter-option--redesigned ${selectedClass} ${isKo ? 'is-ko' : ''}`.trim()}
      onClick={isKo ? undefined : onSelect}
      style={{ position: 'relative' }}
    >
      {isKo && <div className='ko-overlay'>Not available</div>}
      <div className='fighter-name-row'>
        <h4 className='fighter-title'>{fighter.name}</h4>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <div
          className='color-gallo-badge'
          style={{ backgroundColor: fighter.color, margin: 0 }}
        ></div>
        {playerSide === 'player' && onEditColor && (
          <div className='fighter-edit-actions'>
            <span
              onClick={(e) => {
                e.stopPropagation();
                onEditColor();
              }}
              title='Edit Color'
            >
              🎨
            </span>
          </div>
        )}
      </div>

      {playerSide === 'opponent' ? (
        <div
          className='fighter-level-pill'
          style={{ backgroundColor: '#e63946', color: 'white' }}
        >
          Rival
        </div>
      ) : (
        <div className='fighter-level-pill'>Lvl {fighter.level}</div>
      )}

      <div className='fighter-stats-list' style={{ fontSize: '1rem' }}>
        {playerSide === 'player' ? (
          <div className='hp-container' style={{ marginBottom: '8px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <span>❤️ HP:</span>
              <span>
                {fighter.hp}/{fighter.maxHp}
              </span>
            </div>
            <div
              className='hp-bar-bg'
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#444',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                className='hp-bar-fill'
                style={{
                  height: '100%',
                  backgroundColor: '#4ade80',
                  transition: 'width 0.3s ease',
                  width: `${Math.max(0, Math.min(100, (fighter.hp / fighter.maxHp) * 100))}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <p>
            ❤️ HP: {fighter.hp}/{fighter.maxHp}
          </p>
        )}
        <p>⚔️ Attack: {fighter.attack}</p>
        <p>🛡️ Defense: {fighter.defense}</p>
        <p>⚡ Speed: {fighter.speed}</p>
      </div>

      <hr className='stat-divider' />

      {showXp && (
        <div className='fighter-xp-row'>
          ⭐{' '}
          <i>
            XP: {fighter.xp}/{fighter.level * 100}
          </i>
        </div>
      )}
    </article>
  );
}
