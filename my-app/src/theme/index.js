export const lightTheme = {
  colors: {
    // Основные цвета из вашего :root
    primary: '#FFFFFF',
    secondary: '#3C4242',
    text: '#807D7E',
    background: '#F6F6F6',
    accent: '#8A33FD',
    accentHover: '#7e22ce',
    bgHover: '#f5f5f5',
    
    // Футер
    footerBg: '#3C4242',
    footerText: '#FFFFFF',
    footerAccent: '#8A33FD',
    footerBorder: 'rgba(246, 246, 246, 0.1)',
    
    // Модальные окна
    modalSuccessBg: '#e6f4e6',
    modalSuccessText: '#2e7d32',
    modalErrorBg: '#ffe6e6',
    modalErrorText: '#d32f2f',
    modalConfirmBg: '#8A33FD',
    modalConfirmHover: '#6d28c4',
    
    // Дополнительные
    colorOptionBorder: '#000',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(246, 246, 246, 0.2)',
    
    // Градиенты
    promoGradient1: 'linear-gradient(135deg, #f9a825, #fb8c00, #f57c00)',
    promoGradient2: 'linear-gradient(135deg, #b085d2, #9b59c9, #7e4ab7)',
  },
  
  fonts: {
    main: "'Lato', sans-serif",
    heading: "'Core Sans C', sans-serif",
    accent: "'Montserrat', sans-serif",
  },
  
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
  
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1920px',
  },
  
  transitions: {
    base: 'all 0.3s ease',
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#1a1a1a',
    secondary: '#f8f9fa',
    text: '#e9ecef',
    background: '#121212',
    footerBg: '#0a0a0a',
    footerText: '#e9ecef',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
};