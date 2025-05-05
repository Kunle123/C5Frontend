const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard', protected: true },
  { label: 'Pricing', path: '/pricing', hideWhenLoggedIn: true },
  { label: 'Account', path: '/account', account: true },
]; 