import { useEffect, useState } from 'react';

export const DarkModeSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsChecked(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsChecked(false);
      document.documentElement.classList.remove('dark');
    } else {

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsChecked(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const handleCheckboxChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);

    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <label 
      className="flex cursor-pointer select-none items-center"
      aria-label={`Basculer vers le mode ${isChecked ? 'light' : 'dark'}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
          aria-describedby="theme-toggle-description"
        />
        <div 
          className={`block h-8 w-14 rounded-full transition-colors duration-300 ease-in-out ${
            isChecked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
            isChecked ? 'translate-x-6' : 'translate-x-0'
          }`}
        >

          <div className="flex items-center justify-center h-full w-full text-xs">
            {isChecked ? (
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>
      <span id="theme-toggle-description" className="sr-only">
        Basculer entre le mode clair et dark
      </span>
    </label>
  );
};


export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    
    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return { isDark, toggleDarkMode };
};