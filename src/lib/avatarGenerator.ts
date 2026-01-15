/**
 * Competitive League Avatar Generator
 * Generates unique, deterministic SVG avatars for players without profile images
 * Themed around competitive pickleball with performance-based styling
 */

// Balanced color palettes - tasteful but with some presence
const AVATAR_THEMES = {
  champion: {
    name: 'Champion',
    gradient: ['#FFF8DC', '#F0E68C'], // Soft gold tones
    accent: '#DAA520',
    text: '#8B4513'
  },
  competitive: {
    name: 'Competitive',
    gradient: ['#E6F3FF', '#B0D4F1'], // Soft blue tones
    accent: '#4682B4',
    text: '#2F4F4F'
  },
  rising: {
    name: 'Rising Star',
    gradient: ['#F0FFF0', '#C1E1C1'], // Soft green tones
    accent: '#6B8E23',
    text: '#2E5D2E'
  },
  rookie: {
    name: 'Rookie',
    gradient: ['#FFE4E1', '#F5DEB3'], // Soft peach to wheat
    accent: '#CD853F',
    text: '#8B4513'
  },
  default: {
    name: 'Player',
    gradient: ['#F5F5F5', '#E0E0E0'], // Soft gray tones
    accent: '#808080',
    text: '#505050'
  }
} as const;

// Geometric pattern templates
const PATTERN_TYPES = [
  'hexagon',
  'diamond',
  'paddle',
  'court',
  'geometric'
] as const;

type PatternType = typeof PATTERN_TYPES[number];
type ThemeKey = keyof typeof AVATAR_THEMES;

interface AvatarConfig {
  playerId: string;
  playerName: string;
  size?: number;
}

/**
 * Simple hash function to generate consistent numbers from strings
 */
function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Determine theme based solely on player ID for consistency
 */
function getPlayerTheme(playerId: string): ThemeKey {
  const hash = hashString(playerId);
  const themeKeys = Object.keys(AVATAR_THEMES) as ThemeKey[];
  return themeKeys[hash % themeKeys.length];
}

/**
 * Generate SVG path for hexagon pattern
 */
function generateHexagonPattern(size: number, theme: typeof AVATAR_THEMES[ThemeKey]): string {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.3;
  
  let path = '';
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  path += ' Z';
  
  return `<path d="${path}" fill="${theme.accent}" opacity="0.25"/>`;
}

/**
 * Generate SVG path for diamond pattern
 */
function generateDiamondPattern(size: number, theme: typeof AVATAR_THEMES[ThemeKey]): string {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.25;
  
  const diamonds = [];
  for (let i = 0; i < 3; i++) {
    const offset = (i - 1) * radius * 0.8;
    const path = `M ${centerX} ${centerY - radius + offset} 
                  L ${centerX + radius * 0.6} ${centerY + offset} 
                  L ${centerX} ${centerY + radius + offset} 
                  L ${centerX - radius * 0.6} ${centerY + offset} Z`;
    diamonds.push(`<path d="${path}" fill="${theme.accent}" opacity="${0.15 + i * 0.08}"/>`);
  }
  
  return diamonds.join('');
}

/**
 * Generate SVG path for paddle pattern
 */
function generatePaddlePattern(size: number, theme: typeof AVATAR_THEMES[ThemeKey]): string {
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Paddle handle
  const handlePath = `M ${centerX - 2} ${centerY + size * 0.2} 
                      L ${centerX + 2} ${centerY + size * 0.2} 
                      L ${centerX + 2} ${centerY + size * 0.35} 
                      L ${centerX - 2} ${centerY + size * 0.35} Z`;
  
  // Paddle head (rounded rectangle)
  const headRadius = size * 0.15;
  const headPath = `M ${centerX - headRadius} ${centerY - size * 0.15} 
                    A ${headRadius} ${headRadius} 0 0 1 ${centerX + headRadius} ${centerY - size * 0.15} 
                    L ${centerX + headRadius} ${centerY + size * 0.15} 
                    A ${headRadius} ${headRadius} 0 0 1 ${centerX - headRadius} ${centerY + size * 0.15} Z`;
  
  return `
    <path d="${headPath}" fill="${theme.accent}" opacity="0.2"/>
    <path d="${handlePath}" fill="${theme.accent}" opacity="0.3"/>
  `;
}

/**
 * Generate SVG path for court lines pattern
 */
function generateCourtPattern(size: number, theme: typeof AVATAR_THEMES[ThemeKey]): string {
  const lines = [];
  const lineWidth = 1;
  const spacing = size / 5;
  
  // Horizontal lines
  for (let i = 1; i < 5; i++) {
    const y = i * spacing;
    lines.push(`<line x1="0" y1="${y}" x2="${size}" y2="${y}" stroke="${theme.accent}" stroke-width="${lineWidth}" opacity="0.25"/>`);
  }
  
  // Vertical center line
  lines.push(`<line x1="${size/2}" y1="${spacing}" x2="${size/2}" y2="${size - spacing}" stroke="${theme.accent}" stroke-width="${lineWidth}" opacity="0.3"/>`);
  
  return lines.join('');
}

/**
 * Generate geometric abstract pattern
 */
function generateGeometricPattern(size: number, theme: typeof AVATAR_THEMES[ThemeKey], seed: number): string {
  const shapes = [];
  const numShapes = 2 + (seed % 3); // Moderate number of shapes
  
  for (let i = 0; i < numShapes; i++) {
    const shapeSize = (size * 0.1) + (seed % 18); // Medium-sized shapes
    const x = (seed * (i + 1)) % (size - shapeSize);
    const y = (seed * (i + 2)) % (size - shapeSize);
    const opacity = 0.1 + (i * 0.05); // Balanced opacity
    
    if (i % 2 === 0) {
      // Circle
      shapes.push(`<circle cx="${x + shapeSize/2}" cy="${y + shapeSize/2}" r="${shapeSize/2}" fill="${theme.accent}" opacity="${opacity}"/>`);
    } else {
      // Rectangle
      shapes.push(`<rect x="${x}" y="${y}" width="${shapeSize}" height="${shapeSize}" fill="${theme.accent}" opacity="${opacity}"/>`);
    }
  }
  
  return shapes.join('');
}

/**
 * Generate pattern based on type
 */
function generatePattern(patternType: PatternType, size: number, theme: typeof AVATAR_THEMES[ThemeKey], seed: number): string {
  switch (patternType) {
    case 'hexagon':
      return generateHexagonPattern(size, theme);
    case 'diamond':
      return generateDiamondPattern(size, theme);
    case 'paddle':
      return generatePaddlePattern(size, theme);
    case 'court':
      return generateCourtPattern(size, theme);
    case 'geometric':
      return generateGeometricPattern(size, theme, seed);
    default:
      return generateHexagonPattern(size, theme);
  }
}

/**
 * Generate a competitive league avatar
 */
export function generatePlayerAvatar(config: AvatarConfig): string {
  const { playerId, playerName, size = 64 } = config;
  
  // Generate deterministic values from player ID
  const seed = hashString(playerId + playerName);
  const theme = getPlayerTheme(playerId);
  const themeConfig = AVATAR_THEMES[theme];
  const patternType = PATTERN_TYPES[seed % PATTERN_TYPES.length];
  
  // Get player initials
  const initials = playerName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  
  // Generate the pattern
  const pattern = generatePattern(patternType, size, themeConfig, seed);
  
  // Create SVG
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-gradient-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${themeConfig.gradient[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${themeConfig.gradient[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${size}" height="${size}" fill="url(#bg-gradient-${seed})" rx="${size * 0.1}" />
      
      <!-- Pattern -->
      ${pattern}
      
      <!-- Initials -->
      <text 
        x="${size / 2}" 
        y="${size / 2 + 5}" 
        text-anchor="middle" 
        font-family="Inter, system-ui, -apple-system, sans-serif" 
        font-size="${size * 0.35}" 
        font-weight="700" 
        fill="${themeConfig.text}"
        opacity="0.9"
      >
        ${initials}
      </text>
    </svg>
  `;
  
  return svg.trim();
}

/**
 * Generate avatar as data URL for use in img src
 */
export function generatePlayerAvatarDataUrl(config: AvatarConfig): string {
  const svg = generatePlayerAvatar(config);
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get theme name for display purposes
 */
export function getPlayerThemeName(playerId: string): string {
  const theme = getPlayerTheme(playerId);
  return AVATAR_THEMES[theme].name;
}
