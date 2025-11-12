export function ColorShowcase() {
  const colors = [
    {
      name: 'Primary - Dark Green',
      hex: '#1E4D2B',
      usage: 'Navbar, buttons, headings',
      className: 'bg-primary text-primary-foreground'
    },
    {
      name: 'Secondary - Teal Green',
      hex: '#3FA796',
      usage: 'Highlights, links, accents',
      className: 'bg-secondary text-secondary-foreground'
    },
    {
      name: 'Background - Soft White',
      hex: '#F9FAF9',
      usage: 'Clean, clinical base',
      className: 'bg-background text-foreground border border-border'
    },
    {
      name: 'Neutral - Cool Gray',
      hex: '#6B7280',
      usage: 'Text, secondary info',
      className: 'text-muted-foreground border border-border',
      style: { backgroundColor: '#6B7280', color: '#F9FAF9' }
    },
    {
      name: 'Accent - Light Mint',
      hex: '#D1FAE5',
      usage: 'Hover states, cards, subtle highlight',
      className: 'bg-accent text-accent-foreground'
    }
  ];

  return (
    <section>
      <h2 className="text-primary mb-6">Color Palette</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {colors.map((color) => (
          <div
            key={color.name}
            className={`p-6 rounded-lg transition-transform hover:scale-105 ${color.className}`}
            style={color.style}
          >
            <div className="space-y-2">
              <div className="font-medium">{color.name}</div>
              <div className="text-sm opacity-90">{color.hex}</div>
              <div className="text-xs opacity-75">{color.usage}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}