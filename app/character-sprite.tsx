type CharacterSpriteProps = { readonly position: readonly [number, number]; readonly label: string; readonly className?: string };

function imageFor(position: readonly [number, number]): string {
  const key = `${position[0]},${position[1]}`;
  switch (key) {
    case '2,0': return '/type-guide.png';
    case '1,1': return '/type-hideout.png';
    case '0,1': return '/type-field.png';
    case '3,2': return '/type-rehearsal.png';
    case '2,5': return '/type-quest.png';
    default: return '/type-field.png';
  }
}

export function CharacterSprite({ position, label, className = '' }: CharacterSpriteProps) {
  return (
    <figure className={`character-sprite ${className}`}>
      {/* oxlint-disable-next-line next/no-img-element -- generated local result art must retain its transparent canvas */}
      <img src={imageFor(position)} alt={label} />
    </figure>
  );
}
