// macOS-inspired gradient colors for the dashboard
export const colors = {
  // Primary Gradient System
  primary: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    solid: '#667eea',
    hover: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    light: '#a855f7',
    dark: '#8b5cf6'
  },
  
  // Secondary Gradient System
  secondary: {
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    solid: '#e2e8f0',
    hover: 'linear-gradient(135deg, #9ae6e3 0%, #fecaca 100%)',
    blue: '#3B82F6',
    green: '#10B981',
    orange: '#F97316',
    red: '#EF4444',
    yellow: '#FACC15'
  },
  
  // Accent Gradients
  accent: {
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    solid: '#f1f5f9'
  },
  
  // Status Gradients
  status: {
    success: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
    warning: 'linear-gradient(135deg, #ffd43b 0%, #fab005 100%)',
    error: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    info: 'linear-gradient(135deg, #339af0 0%, #228be6 100%)'
  },
  
  // Neutral Colors
  neutral: {
    white: '#ffffff',
    lightGray: '#f8fafc',
    mediumGray: '#64748b',
    darkGray: '#1e293b'
  },
  
  // Glass morphism backgrounds
  glass: {
    light: 'rgba(255, 255, 255, 0.8)',
    medium: 'rgba(255, 255, 255, 0.6)',
    strong: 'rgba(255, 255, 255, 0.9)',
    darkLight: 'rgba(30, 41, 59, 0.8)',
    darkMedium: 'rgba(30, 41, 59, 0.6)',
    darkStrong: 'rgba(30, 41, 59, 0.9)'
  },
  
  // macOS-style shadows
  shadows: {
    soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    strong: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  }
};

// Utility functions for applying colors
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
    case 'active':
    case 'completed':
    case 'confirmed':
      return colors.status.success;
    case 'pending':
    case 'warning':
      return colors.status.warning;
    case 'error':
    case 'failed':
    case 'cancelled':
      return colors.status.error;
    case 'processing':
    case 'in-progress':
      return colors.status.info;
    default:
      return colors.neutral.mediumGray;
  }
};

export const getGrowthColor = (value: number) => {
  if (value > 0) return colors.status.success;
  if (value < 0) return colors.status.error;
  return colors.neutral.mediumGray;
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
    case 'urgent':
      return colors.status.error;
    case 'medium':
      return colors.status.warning;
    case 'low':
      return colors.status.info;
    default:
      return colors.neutral.mediumGray;
  }
};

// macOS-style gradient utilities
export const applyGradient = (element: HTMLElement, gradient: string) => {
  element.style.background = gradient;
};

export const applyGlassEffect = (element: HTMLElement, intensity: 'light' | 'medium' | 'strong' = 'medium') => {
  const isDark = document.documentElement.classList.contains('dark');
  const glassValue = isDark ? colors.glass[`dark${intensity.charAt(0).toUpperCase() + intensity.slice(1)}`] : colors.glass[intensity];
  
  element.style.background = glassValue;
  element.style.backdropFilter = 'blur(20px)';
  element.style.WebkitBackdropFilter = 'blur(20px)';
  element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  element.style.boxShadow = colors.shadows.soft;
};