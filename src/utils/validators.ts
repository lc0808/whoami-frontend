export function isValidPlayerName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 20;
}

export function isValidRoomId(roomId: string): boolean {
  return /^[A-Z0-9]{6}$/.test(roomId);
}

export function isValidCharacter(character: string): boolean {
  return character.trim().length >= 2 && character.trim().length <= 50;
}
