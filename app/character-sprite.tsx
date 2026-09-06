type CharacterSpriteProps = { readonly position: readonly [number, number]; readonly label: string; readonly className?: string };

function imageFor(position: readonly [number, number]): string {
  const key = `${position[0]},${position[1]}`;
  const base = import.meta.env.BASE_URL;
  switch (key) {
    case '2,0': return `${base}type-guide.png`;
    case '1,1': return `${base}type-hideout.png`;
    case '0,1': return `${base}type-field.png`;
    case '3,2': return `${base}type-rehearsal.png`;
    case '2,5': return `${base}type-quest.png`;
    default: return `${base}type-field.png`;
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
