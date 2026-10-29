export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="flex flex-col gap-1 pt-2">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </header>
  );
}
