import { wait } from './utils';

import type { BattleEffect, BattleState } from '@/types/battle';
import type { Combatant } from '@/types/fighter';
import type { Fighter } from '@/types/fighter';

const battleImages = {
  player: { idle: 'defensa', attack: 'ataque', ko: 'vencido' },
  opponent: { idle: 'defensa', attack: 'ataque', ko: 'vencido' },
} as const;

export function createCombatant(fighter: Fighter): Combatant {
  return { ...structuredClone(fighter), hp: fighter.hp, maxHp: fighter.hp };
}

export function rollDice(): number {
  return (Math.floor(Math.random() * 6) + 1) * 10;
}

function randomMultiplier(variance = 0.04): number {
  const min = 1 - variance;
  const max = 1 + variance;
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function calculateInitiative(
  a: Fighter & { hp?: number },
  b: Fighter & { hp?: number },
): [Fighter & { hp?: number }, Fighter & { hp?: number }] {
  const scoreA = a.speed + Math.random() * 12;
  const scoreB = b.speed + Math.random() * 12;
  return scoreA >= scoreB ? [a, b] : [b, a];
}

export function resolveAttack(attacker: Combatant, defender: Combatant) {
  const attackTempo = randomMultiplier(attacker.variance);
  const defenseTempo = randomMultiplier(defender.variance);
  const attackRoll = rollDice();
  const defenseRoll = rollDice();
  const attackPower =
    attacker.attack * attackTempo + attackRoll + attacker.speed * 0.18;
  const defensePower =
    defender.defense * defenseTempo + defenseRoll + defender.speed * 0.1;

  const dodgeChance = clamp(
    0.04 + defender.dodgeBonus + (defender.speed - attacker.speed) * 0.0015,
    0.02,
    0.22,
  );
  const didDodge = Math.random() < dodgeChance;

  if (didDodge) {
    return {
      attackPower: Math.round(attackPower),
      defensePower: Math.round(defensePower),
      damage: 0,
      didCrit: false,
      didDodge: true,
      didBlock: false,
    };
  }

  const critChance = clamp(
    0.06 + attacker.critBonus + (attacker.speed - defender.speed) * 0.001,
    0.04,
    0.2,
  );
  const didCrit = Math.random() < critChance;

  const blockChance = clamp(
    0.08 + defender.blockBonus + (defender.defense - attacker.attack) * 0.0008,
    0.03,
    0.24,
  );
  const didBlock = Math.random() < blockChance;

  const rawEdge = attackPower - defensePower;
  let damage = Math.max(0, rawEdge);

  if (didCrit) damage *= 1.22;
  // if (didBlock) damage *= 0.72;
  if (didBlock) damage *= 0;

  damage = Math.max(0, Math.round(damage));
  defender.hp -= damage;

  return {
    attackPower: Math.round(attackPower),
    defensePower: Math.round(defensePower),
    damage,
    didCrit,
    didDodge,
    didBlock,
  };
}

export function applyVictoryRewards(
  playerRoster: Fighter[],
  playerId: string,
  opponent: Fighter,
) {
  const fighter = playerRoster.find((item) => item.id === playerId);
  if (!fighter) return null;

  const weightedHpDiff = Math.round((opponent.hp - fighter.hp) * 0.5);
  const modifierBase =
    weightedHpDiff +
    (opponent.attack - fighter.attack) +
    (opponent.defense - fighter.defense);
  const modifier = Math.max(-80, Math.min(80, modifierBase * 2));
  const gainedExp = 100 + modifier;

  fighter.xp += gainedExp;

  let leveledUp = false;
  let neededExp = fighter.level * 100;

  while (fighter.xp >= neededExp && fighter.level < 99) {
    fighter.xp -= neededExp;
    fighter.level += 1;
    fighter.hp += 5;
    fighter.attack = Math.min(200, fighter.attack + 2);
    fighter.defense = Math.min(200, fighter.defense + 2);
    fighter.speed = Math.min(200, fighter.speed + 1);
    leveledUp = true;
    neededExp = fighter.level * 100;
  }

  if (fighter.level >= 99) fighter.xp = neededExp;

  return { gainedExp, modifier, leveledUp, fighter };
}

type RunLocalCombatArgs = {
  player: Fighter;
  opponent: Fighter;
  onUpdate: (state: Partial<BattleState>) => void;
  onLog: (message: string, type?: string) => void;
  checkSurrender?: () => boolean;
  onTurnComplete?: () => void;
};

export async function runLocalCombat({
  player,
  opponent,
  onUpdate,
  onLog,
  checkSurrender,
  onTurnComplete,
}: RunLocalCombatArgs) {
  const left = createCombatant(player);
  const right = createCombatant(opponent);
  const [first, second] = calculateInitiative(left, right) as [
    Combatant,
    Combatant,
  ];

  onLog(`${left.name} enters the arena.`);
  await wait(700);
  onLog(`${right.name} answers the challenge.`);
  await wait(700);
  onLog(`${first.name} takes initiative thanks to superior speed.`);
  await wait(450);

  while (left.hp > 0 && right.hp > 0) {
    if (checkSurrender && checkSurrender()) break;
    await executeTurn(
      first,
      second,
      left,
      right,
      onUpdate,
      onLog,
      checkSurrender,
    );
    if (onTurnComplete) onTurnComplete();
    if (left.hp <= 0 || right.hp <= 0 || (checkSurrender && checkSurrender()))
      break;

    await executeTurn(
      second,
      first,
      left,
      right,
      onUpdate,
      onLog,
      checkSurrender,
    );
    if (onTurnComplete) onTurnComplete();

    if (left.hp > 0 && right.hp > 0 && !(checkSurrender && checkSurrender())) {
      await wait(250);
    }
  }

  const winner = left.hp > 0 ? left : right.hp > 0 ? right : null;
  return { winner, player: left, opponent: right };
}

async function executeTurn(
  attacker: Combatant,
  defender: Combatant,
  left: Combatant,
  right: Combatant,
  onUpdate: (state: Partial<BattleState>) => void,
  onLog: (message: string, type?: string) => void,
  checkSurrender?: () => boolean,
) {
  // 1. Mostrar pose de ataque y limpiar efectos anteriores
  onUpdate({
    left,
    right,
    effect: null,
    images: {
      player:
        attacker.id === left.id
          ? battleImages.player.attack
          : left.hp <= 0
            ? battleImages.player.ko
            : battleImages.player.idle,
      opponent:
        attacker.id === right.id
          ? battleImages.opponent.attack
          : right.hp <= 0
            ? battleImages.opponent.ko
            : battleImages.opponent.idle,
    },
  });

  const isPlayerAttacking = attacker.id === left.id;
  if (isPlayerAttacking) {
    onLog(`${left.name}'s Attack Phase`, 'turn');
  } else {
    onLog(`${left.name}'s Defense Phase`, 'turn');
  }
  await wait(320);
  if (checkSurrender?.()) return;

  const result = resolveAttack(attacker, defender);
  let attackColor = 'inherit';
  let defenseColor = 'inherit';

  if (isPlayerAttacking) {
    if (result.attackPower > result.defensePower) {
      attackColor = 'var(--accent)';
    } else if (result.defensePower > result.attackPower) {
      defenseColor = 'var(--danger)';
    }
  } else {
    // Player is defending
    if (result.defensePower > result.attackPower) {
      defenseColor = 'var(--accent)';
    } else if (result.attackPower > result.defensePower) {
      attackColor = 'var(--danger)';
    }
  }

  if (isPlayerAttacking) {
    onLog(
      `${left.name} attacks with <b style="color: ${attackColor}">${result.attackPower}</b> / ${right.name} defends with <b style="color: ${defenseColor}">${result.defensePower}</b>`,
    );
  } else {
    onLog(
      `${left.name} defends with <b style="color: ${defenseColor}">${result.defensePower}</b> / ${right.name} attacks with <b style="color: ${attackColor}">${result.attackPower}</b>`,
    );
  }
  await wait(440);
  if (checkSurrender?.()) return;

  // 2. Determinar si mostramos garras o escudo
  let effectPayload: BattleEffect = null;

  if (result.didDodge) {
    effectPayload = {
      target: defender.id === left.id ? 'player' : 'opponent',
      type: 'dodge',
    };
    onLog(`${defender.name} dodges at the last second.`);
  } else {
    if (result.didBlock) {
      effectPayload = {
        target: defender.id === left.id ? 'player' : 'opponent',
        type: 'shield',
      };
      onLog(`${defender.name} completely blocks the damage.`);
      await wait(180);
    } else if (result.damage > 0) {
      effectPayload = {
        target: defender.id === left.id ? 'player' : 'opponent',
        type: 'claws',
      };
    } else {
      effectPayload = {
        target: defender.id === left.id ? 'player' : 'opponent',
        type: 'shield',
      };
      onLog(`${defender.name} stops the strike.`);
    }

    if (result.didCrit && result.damage > 0) {
      onLog(`Critical hit by ${attacker.name}.`);
      await wait(180);
    }

    if (result.damage > 0) {
      onLog(`${defender.name} takes ${result.damage} damage.`);
    }
  }

  // 3. Inyectar el efecto visual al componente
  onUpdate({
    left,
    right,
    effect: effectPayload,
    images: {
      player:
        attacker.id === left.id
          ? battleImages.player.attack
          : left.hp <= 0
            ? battleImages.player.ko
            : battleImages.player.idle,
      opponent:
        attacker.id === right.id
          ? battleImages.opponent.attack
          : right.hp <= 0
            ? battleImages.opponent.ko
            : battleImages.opponent.idle,
    },
  });

  // 4. Si hubo un efecto, esperar 1 segundo para que la animación termine
  if (effectPayload) {
    await wait(1000);
  } else {
    await wait(320);
  }
  if (checkSurrender?.()) return;

  // 5. Ocultar efecto y regresar a pose normal (idle) o de derrota
  onUpdate({
    left,
    right,
    effect: null,
    images: {
      player: left.hp <= 0 ? battleImages.player.ko : battleImages.player.idle,
      opponent:
        right.hp <= 0 ? battleImages.opponent.ko : battleImages.opponent.idle,
    },
  });

  await wait(1320);
}
