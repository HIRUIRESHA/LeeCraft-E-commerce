const SWATCH: Record<string, string> = {
  'Light Tan': '#DCCBB0',
  'Golden Brown': '#C79A63',
  'Dark Brown': '#8B5E34',
  Espresso: '#5C4530',
};

/** Flat color fallback for product cards/galleries that have no photo yet. */
export function woodSwatch(color: string): string {
  return SWATCH[color] ?? 'var(--cream-2)';
}
