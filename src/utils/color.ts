/**
 * Computes the relative luminance of a color using the sRGB coefficients
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns Relative luminance value between 0 and 1
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parses a hex color string into RGB components
 * @param hex Hex color string (e.g. "#FF0000" or "FF0000")
 * @returns Object containing r, g, b components (0-255)
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');
  
  // Handle shorthand hex (e.g. "F00" -> "FF0000")
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Determines if a color is light or dark
 * @param color Hex color string (e.g. "#FF0000" or "FF0000")
 * @returns true if the color is light, false if dark
 */
export function isLightColor(color: string): boolean {
  const { r, g, b } = hexToRgb(color);
  const luminance = getLuminance(r, g, b);
  return luminance > 0.5;
}

/**
 * Gets the appropriate text color (black or white) for a given background color
 * @param backgroundColor Hex color string (e.g. "#FF0000" or "FF0000")
 * @returns "#000000" for light backgrounds, "#FFFFFF" for dark backgrounds
 */
export function getContrastingTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}

/**
 * Adjusts a color's brightness
 * @param color Hex color string (e.g. "#FF0000" or "FF0000")
 * @param amount Amount to adjust (-1 to 1, where -1 is darkest and 1 is brightest)
 * @returns Adjusted hex color string
 */
export function adjustColorBrightness(color: string, amount: number): string {
  const { r, g, b } = hexToRgb(color);
  
  const adjust = (c: number) => {
    const newValue = c + (amount * 255);
    return Math.max(0, Math.min(255, Math.round(newValue)));
  };
  
  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
} 