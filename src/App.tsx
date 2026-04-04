import { useEffect, useRef, useState } from 'react';

import { BattleArena } from './components/BattleArena.jsx';
import { ColorEditorModal } from './components/ColorEditorModal.jsx';
import { MenuScreen } from './components/MenuScreen.jsx';
import { SelectionScreen } from './components/SelectionScreen.jsx';
import { applyVictoryRewards, runLocalCombat } from './core/combat';
import { generateOpponents } from './core/opponents';
import { clearGame, hasSavedGame, loadGame, saveGame } from './core/storage';
import { generateStarterRoster } from './data/characters';
import {
  BattleLogEntry,
  BattleLogEntryType,
  BattleState,
} from './types/battle.js';
import { Entity } from './types/core.js';
import { Fighter } from './types/fighter.js';

function getInitialGameState() {
  const saved = loadGame();
  if (saved) return saved;
  return {
    roster: generateStarterRoster(),
    opponents: generateOpponents(),
    icuTimestamp: undefined,
  };
}

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [rooster, setRooster] = useState<Fighter[]>(
    () => getInitialGameState().roster,
  );
  const [opponents, setOpponents] = useState<Fighter[]>(
    () => getInitialGameState().opponents || generateOpponents(),
  );
  const [lastRefreshDate, setLastRefreshDate] = useState<string | undefined>(
    () => getInitialGameState().lastRefreshDate,
  );
  const [icuTimestamp, setIcuTimestamp] = useState<number | undefined>(
    () => getInitialGameState().icuTimestamp,
  );
  const [selectedPlayerId, setSelectedPlayerId] = useState<Entity['id'] | null>(
    null,
  );
  const [selectedOpponentId, setSelectedOpponentId] = useState<
    Entity['id'] | null
  >(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [statusText, setStatusText] = useState(
    hasSavedGame() ? 'Saved progress available' : 'No progress available',
  );

  // Modal State
  const [colorEditorFighterId, setColorEditorFighterId] = useState<
    string | null
  >(null);

  // Surrender ref
  const surrenderedRef = useRef(false);
  const [canSurrender, setCanSurrender] = useState(false);
  const [isBattleFinished, setIsBattleFinished] = useState(false);

  // ICU Recovery Effect
  useEffect(() => {
    if (!icuTimestamp) return;

    const checkRecovery = () => {
      if (Date.now() - icuTimestamp >= 86400000) {
        setRooster((prev) => {
          const fullHealing = prev.map((f) => ({ ...f, hp: f.maxHp }));
          saveGame({
            roster: fullHealing,
            opponents,
            lastRefreshDate,
            icuTimestamp: undefined,
          });
          return fullHealing;
        });
        setIcuTimestamp(undefined);
      }
    };

    checkRecovery();
    const interval = setInterval(checkRecovery, 60000);
    return () => clearInterval(interval);
  }, [icuTimestamp, opponents, lastRefreshDate]);

  // Scroll to top when entering battle screen
  useEffect(() => {
    if (screen === 'battle') {
      window.scrollTo(0, 0);
    }
  }, [screen]);

  const selectedPlayer =
    rooster.find((fighter) => fighter.id === selectedPlayerId) ?? null;
  const selectedOpponent =
    opponents.find((fighter) => fighter.id === selectedOpponentId) ?? null;
  const canStartBattle = Boolean(selectedPlayer && selectedOpponent);

  function openMenu() {
    setScreen('menu');
    setStatusText(
      hasSavedGame() ? 'Saved progress available' : 'No progress available',
    );
  }

  function openSelection(
    nextRoster?: Fighter[],
    nextOpponents?: Fighter[],
    nextRefreshDate?: string,
    nextIcuTimestamp?: number,
  ) {
    setRooster(nextRoster ?? rooster);
    setOpponents(
      nextOpponents && nextOpponents.length > 0
        ? nextOpponents
        : nextOpponents
          ? generateOpponents()
          : opponents,
    );
    setLastRefreshDate(nextRefreshDate);
    setIcuTimestamp(nextIcuTimestamp);
    setSelectedPlayerId(null);
    setSelectedOpponentId(null);
    setScreen('selection');
    setStatusText(
      hasSavedGame() ? 'Saved progress available' : 'No progress available',
    );
  }

  function handleNewGame() {
    clearGame();
    const freshRoster = generateStarterRoster();
    const freshOpponents = generateOpponents();
    setBattleLog([]); // Limpiar log al iniciar nueva partida
    openSelection(freshRoster, freshOpponents, undefined, undefined);
  }

  function handleContinue() {
    const saved = loadGame();
    if (saved) {
      openSelection(
        saved.roster,
        saved.opponents || generateOpponents(),
        saved.lastRefreshDate,
        saved.icuTimestamp,
      );
    } else {
      openSelection(
        generateStarterRoster(),
        generateOpponents(),
        undefined,
        undefined,
      );
    }
  }

  function appendLog(message: string, type: BattleLogEntryType = 'default') {
    const entry: BattleLogEntry = {
      id: crypto.randomUUID(),
      message,
      type,
    };

    setBattleLog((current) => [...current, entry]);
  }

  function handleRefreshOpponents() {
    const today = new Date().toISOString().split('T')[0];
    if (lastRefreshDate === today) {
      alert('You can only refresh rivals once per day.');
      return;
    }
    const newOpponents = generateOpponents();
    setOpponents(newOpponents);
    setLastRefreshDate(today);
    saveGame({
      roster: rooster,
      opponents: newOpponents,
      lastRefreshDate: today,
      icuTimestamp,
    });
  }

  // Lógica para guardar color modificado
  function handleSaveColor(fighterId: string, newColorHex: string) {
    const updatedRoster = rooster.map((f) =>
      f.id === fighterId ? { ...f, color: newColorHex } : f,
    );
    setRooster(updatedRoster);
    saveGame({
      roster: updatedRoster,
      opponents,
      lastRefreshDate,
      icuTimestamp,
    });
    setColorEditorFighterId(null);
  }

  async function handleStartBattle() {
    if (!selectedPlayer || !selectedOpponent) return;

    setScreen('battle');
    setBattleLog([]);
    surrenderedRef.current = false;
    setCanSurrender(false);
    setIsBattleFinished(false);

    setBattleState({
      left: {
        ...selectedPlayer,
        hp: selectedPlayer.hp,
        maxHp: selectedPlayer.maxHp,
      },
      right: {
        ...selectedOpponent,
        hp: selectedOpponent.hp,
        maxHp: selectedOpponent.maxHp,
      },
      images: { player: 'defensa', opponent: 'defensa' },
      effect: null,
      modeText: 'Local Mode',
      isRampage: false,
    });

    const result = await runLocalCombat({
      player: selectedPlayer,
      opponent: selectedOpponent,
      checkSurrender: () => surrenderedRef.current,
      onTurnComplete: () => setCanSurrender(true), // Habilita rendirse al finalizar 1 turno
      onLog(message: string, type: string = 'default') {
        appendLog(
          message,
          message.startsWith('Intro:')
            ? 'system'
            : (type as BattleLogEntryType),
        );
      },
      onUpdate(payload: Partial<BattleState>) {
        setBattleState((current) => {
          if (!current) return current;
          return {
            ...current,
            left: payload.left ?? current.left,
            right: payload.right ?? current.right,
            images: payload.images ?? current.images,
            effect:
              payload.effect !== undefined ? payload.effect : current.effect,
            modeText: 'Local Mode',
            isRampage:
              payload.isRampage !== undefined
                ? payload.isRampage
                : current.isRampage,
          };
        });
      },
    });

    setIsBattleFinished(true);
    setBattleState((current) =>
      current ? { ...current, isRampage: false } : current,
    );

    const updatedRoster = structuredClone(rooster);
    const didPlayerWin =
      !surrenderedRef.current && result.winner?.id === selectedPlayer.id;
    let hadInjuredRoostersToHeal = false;

    // Recovery for non-selected roosters
    updatedRoster.forEach((f) => {
      if (f.id !== selectedPlayer.id) {
        if (f.hp < f.maxHp) {
          hadInjuredRoostersToHeal = true;
        }
        if (didPlayerWin) {
          f.hp = Math.min(f.maxHp, Math.ceil(f.hp + f.maxHp * 0.2));
        }
      }
    });

    const activePlayerRoster = updatedRoster.find(
      (f) => f.id === selectedPlayer.id,
    );
    if (activePlayerRoster) {
      // if surrendered or KO'd, HP is 0
      activePlayerRoster.hp = surrenderedRef.current
        ? 0
        : Math.max(0, result.player.hp);
    }

    if (surrenderedRef.current) {
      appendLog('You have surrendered. Combat abandoned.', 'system');
    } else if (result.winner && result.winner.id === selectedPlayer.id) {
      const rewards = applyVictoryRewards(
        updatedRoster,
        selectedPlayer.id,
        selectedOpponent,
      );
      if (rewards) {
        appendLog(`${result.winner.name} WINS the battle!`, 'winner');
        appendLog(`XP gained: ${rewards.gainedExp}.`);
        if (rewards.leveledUp) {
          appendLog(
            `${rewards.fighter.name} reaches level ${rewards.fighter.level}!`,
            'system',
          );
        }
      }
    } else if (result.winner) {
      appendLog(`${result.winner.name} WINS the battle!`, 'winner');
      appendLog('Your rooster has been defeated. You gain no experience.');
    } else {
      appendLog('Double KO. There is no winner this round.', 'system');
    }

    if (!didPlayerWin && hadInjuredRoostersToHeal) {
      appendLog(
        "There was some complications with your Roosters recovery, they didn't restored any health",
        'system',
      );
    }

    const allDead = updatedRoster.every((f) => f.hp <= 0);
    let newIcuTimestamp = icuTimestamp;
    if (allDead && !icuTimestamp) {
      newIcuTimestamp = Date.now();
      setIcuTimestamp(newIcuTimestamp);
    }

    const newOpponents = generateOpponents();
    setRooster(updatedRoster);
    setOpponents(newOpponents);
    saveGame({
      roster: updatedRoster,
      opponents: newOpponents,
      lastRefreshDate,
      icuTimestamp: newIcuTimestamp,
    });
    setStatusText('Progress saved');
  }

  function handleSurrender() {
    if (
      window.confirm(
        'Are you sure you want to surrender? Your rooster will lose the round.',
      )
    ) {
      surrenderedRef.current = true;
    }
  }

  return (
    <div id='app' className={screen === 'battle' ? 'is-battle-screen' : ''}>
      {screen === 'menu' && (
        <MenuScreen
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          canContinue={hasSavedGame()}
          saveStatus={statusText}
        />
      )}
      {screen === 'selection' && (
        <SelectionScreen
          rooster={rooster}
          opponents={opponents}
          selectedPlayerId={selectedPlayerId}
          selectedOpponentId={selectedOpponentId}
          onBack={openMenu}
          onRefreshOpponents={handleRefreshOpponents}
          onSelectPlayer={setSelectedPlayerId}
          onSelectOpponent={setSelectedOpponentId}
          onStartBattle={() => {
            void handleStartBattle();
          }}
          canStartBattle={canStartBattle}
          onOpenColorEditor={setColorEditorFighterId}
          hasRefreshedToday={
            lastRefreshDate === new Date().toISOString().split('T')[0]
          }
          isIcuActive={!!icuTimestamp}
        />
      )}
      {screen === 'battle' && battleState && (
        <BattleArena
          battleState={battleState}
          battleLog={battleLog}
          onBackToRoster={() => openSelection(rooster)}
          onSurrender={handleSurrender}
          canSurrender={canSurrender}
          isFinished={isBattleFinished}
        />
      )}
      {colorEditorFighterId && (
        <ColorEditorModal
          fighter={rooster.find((f) => f.id === colorEditorFighterId)}
          onClose={() => setColorEditorFighterId(null)}
          onSave={handleSaveColor}
        />
      )}
    </div>
  );
}
