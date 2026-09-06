type CharacterSpriteProps = { readonly position: readonly [number, number]; readonly label: string; readonly className?: string };

export function CharacterSprite({ position, label, className = '' }: CharacterSpriteProps) {
  const [column, row] = position;
  return (
    <figure className={`character-sprite ${className}`} aria-label={label}>
      <div className="character-sprite__sheet" style={{ backgroundPosition: `${(column / 3) * 100}% ${(row / 5) * 100}%` }} />
    </figure>
  );
}
