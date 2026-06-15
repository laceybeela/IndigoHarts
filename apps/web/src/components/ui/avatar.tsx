interface AvatarProps {
  name: string;
  className?: string;
}

export function Avatar({ name, className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-xs font-medium text-sage-700 ${className}`}
    >
      {initials}
    </div>
  );
}
