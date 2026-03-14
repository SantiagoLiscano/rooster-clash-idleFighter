import { useRef, useState } from 'react';

import { BattleArena } from './components/BattleArena.jsx';
import { ColorEditorModal } from './components/ColorEditorModal.jsx';
import { MenuScreen } from './components/MenuScreen.jsx';
import { SelectionScreen } from './components/SelectionScreen.jsx';
import { applyVictoryRewards, runLocalCombat } from './core/combat';
import { generateOpponents } from './core/opponents';
import {
  clearRoster,
  hasSavedRoster,
  loadRoster,
  saveRoster,
} from './core/storage';
import { cloneRoster, starterRoster } from './data/characters';
import {
  BattleLogEntry,
  BattleLogEntryType,
  BattleState,
} from './types/battle.js';
import { Entity } from './types/core.js';
import { Fighter } from './types/fighter.js';

function getInitialRoster() {
  const saved = loadRoster();
  return saved ?? cloneRoster(starterRoster);
}

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [rooster, setRooster] = useState<Fighter[]>(getInitialRoster);
  const [opponents, setOpponents] = useState<Fighter[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<Entity['id'] | null>(
    null,
  );
  const [selectedOpponentId, setSelectedOpponentId] = useState<
    Entity['id'] | null
  >(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [statusText, setStatusText] = useState(
    hasSavedRoster() ? 'Saved progress available' : 'No progress available',
  );

  // Modal State
  const [colorEditorFighterId, setColorEditorFighterId] = useState<
    string | null
  >(null);

  // Surrender ref
  const surrenderedRef = useRef(false);
  const [canSurrender, setCanSurrender] = useState(false);
  const [isBattleFinished, setIsBattleFinished] = useState(false);

  const selectedPlayer =
    rooster.find((fighter) => fighter.id === selectedPlayerId) ?? null;
  const selectedOpponent =
    opponents.find((fighter) => fighter.id === selectedOpponentId) ?? null;
  const canStartBattle = Boolean(selectedPlayer && selectedOpponent);

  function openMenu() {
    setScreen('menu');
    setStatusText(
      hasSavedRoster() ? 'Saved progress available' : 'No progress available',
    );
  }

  function openSelection(nextRoster = rooster) {
    setRooster(nextRoster);
    setOpponents(generateOpponents());
    setSelectedPlayerId(null);
    setSelectedOpponentId(null);
    setScreen('selection');
    setStatusText(
      hasSavedRoster() ? 'Saved progress available' : 'No progress available',
    );
  }

  function handleNewGame() {
    clearRoster();
    const freshRoster = cloneRoster(starterRoster);
    openSelection(freshRoster);
  }

  function handleContinue() {
    const saved = loadRoster();
    openSelection(saved ?? cloneRoster(starterRoster));
  }

  function appendLog(message: string, type: BattleLogEntryType = 'default') {
    const entry: BattleLogEntry = {
      id: crypto.randomUUID(),
      message,
      type,
    };

    setBattleLog((current) => [...current, entry]);
  }

  // Lógica para guardar color modificado
  function handleSaveColor(fighterId: string, newColorHex: string) {
    const updatedRoster = rooster.map((f) =>
      f.id === fighterId ? { ...f, color: newColorHex } : f,
    );
    setRooster(updatedRoster);
    saveRoster(updatedRoster);
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
        maxHp: selectedPlayer.hp,
      },
      right: {
        ...selectedOpponent,
        hp: selectedOpponent.hp,
        maxHp: selectedOpponent.hp,
      },
      images: { player: 'defensa', opponent: 'defensa' },
      effect: null,
      modeText: 'Local Mode',
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
          };
        });
      },
    });

    setIsBattleFinished(true);

    if (surrenderedRef.current) {
      appendLog('You have surrendered. Combat abandoned.', 'system');
    } else if (result.winner && result.winner.id === selectedPlayer.id) {
      const updatedRoster = structuredClone(rooster);
      const rewards = applyVictoryRewards(
        updatedRoster,
        selectedPlayer.id,
        selectedOpponent,
      );
      if (rewards) {
        setRooster(updatedRoster);
        saveRoster(updatedRoster);
        appendLog(`${result.winner.name} WINS the battle!`, 'winner');
        appendLog(
          `XP gained: ${rewards.gainedExp}. Modifier: ${rewards.modifier}.`,
        );
        if (rewards.leveledUp) {
          appendLog(
            `${rewards.fighter.name} reaches level ${rewards.fighter.level}!`,
            'system',
          );
        }
        setStatusText('Progress saved');
      }
    } else if (result.winner) {
      saveRoster(rooster);
      appendLog(`${result.winner.name} WINS the battle!`, 'winner');
      appendLog('Your rooster has been defeated. You gain no experience.');
      setStatusText('Progress saved');
    } else {
      appendLog('Double KO. There is no winner this round.', 'system');
    }
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
    <div id='app'>
      {screen === 'menu' && (
        <MenuScreen
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          canContinue={hasSavedRoster()}
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
          onRefreshOpponents={() => setOpponents(generateOpponents())}
          onSelectPlayer={setSelectedPlayerId}
          onSelectOpponent={setSelectedOpponentId}
          onStartBattle={() => {
            void handleStartBattle();
          }}
          canStartBattle={canStartBattle}
          onOpenColorEditor={setColorEditorFighterId}
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
