import type { MenuScreenProps } from "@/types/ui";

export function MenuScreen({ onNewGame, onContinue, canContinue, saveStatus }: MenuScreenProps) {
    return (
        <section className="screen screen--active">
            <div className="hero-panel">
                <p className="eyebrow">Tactical 1v1 arena</p>
                <h1>Rooster Clash</h1>
                <p className="hero-copy">
                    A turn-based combat prototype designed to grow with new fighters,
                    persistent progression, and future socket multiplayer.
                </p>
                <div className="menu-actions">
                    <button type="button" className="button button--primary" onClick={onNewGame}>
                        New game
                    </button>
                    <button type="button" className="button button--secondary" onClick={onContinue} disabled={!canContinue}>
                        Continue run
                    </button>
                </div>
                <div className="status-bar">
                    <span>{saveStatus}</span>
                    <span className="pill">Vite dev server ready</span>
                </div>
            </div>
        </section>
    );
}
