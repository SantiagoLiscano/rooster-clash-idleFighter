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
      <div className='fighter-card-header'>
        <div className='fighter-header-left'>
          <h4 className='fighter-title'>{fighter.name}</h4>
          <div
            className='color-gallo-badge'
            style={{ backgroundColor: fighter.color }}
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
      </div>

      <div className='fighter-stats-list' style={{ fontSize: '1rem' }}>
        <div className='hp-container'>
          <div className='hp-label-row'>
            <span>
              <span className='hide-on-mobile'>❤️</span> HP:
            </span>
            <span>
              {fighter.hp}/{fighter.maxHp}
            </span>
          </div>
          <div className='hp-bar-bg'>
            <div
              className='hp-bar-fill'
              style={{
                width: `${Math.max(0, Math.min(100, (fighter.hp / fighter.maxHp) * 100))}%`,
              }}
            />
          </div>
        </div>

        {playerSide === 'player' && showXp && (
          <div className='xp-container'>
            <div className='xp-label-row'>
              <span>
                <span className='hide-on-mobile'>⭐</span> XP:
              </span>
              <span>
                {fighter.xp}/{fighter.level * 100}
              </span>
            </div>
            <div className='xp-bar-bg'>
              <div
                className='xp-bar-fill'
                style={{
                  width: `${Math.max(0, Math.min(100, (fighter.xp / (fighter.level * 100)) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className='fighter-stats-row'>
          <div className='stat-item'>
            <span className='stat-label'>ATK</span>
            <span className='stat-value'>{fighter.attack}</span>
          </div>
          <div className='stat-item'>
            <span className='stat-label'>DEF</span>
            <span className='stat-value'>{fighter.defense}</span>
          </div>
          <div className='stat-item'>
            <span className='stat-label'>SPD</span>
            <span className='stat-value'>{fighter.speed}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
