import type { MenuScreenProps } from '@/types/ui';

export function MenuScreen({
  onNewGame,
  onContinue,
  canContinue,
  saveStatus,
}: MenuScreenProps) {
  return (
    <section className='screen screen--active'>
      <div className='hero-panel'>
        <div className='hero-visual'>
          <img
            src={`${import.meta.env.BASE_URL}shareImage.png`}
            alt='Rooster Clash Logo'
            className='hero-logo'
          />
        </div>
        <div className='hero-content'>
          <p className='eyebrow'>Tactical 1v1 arena</p>
          <h1>Rooster Clash</h1>
          <p className='hero-copy'>
            A tactical idle fighter prototype. Build your fighter rooster, fight
            1v1, and dominate the passive tournament.
          </p>
          <div className='menu-actions'>
            <button
              type='button'
              className='button button--primary'
              onClick={onNewGame}
            >
              New Game
            </button>
            <button
              type='button'
              className='button button--secondary'
              onClick={onContinue}
              disabled={!canContinue}
            >
              Continue Run
            </button>
          </div>
          <div className='status-bar'>
            <span>{saveStatus}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
