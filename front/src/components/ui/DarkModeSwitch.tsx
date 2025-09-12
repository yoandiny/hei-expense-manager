import { useEffect, useState } from 'react';

export const DarkModeSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);

  // Charger la préférence enregistrée
  useEffect(() => {
    if (localStorage.theme === 'dark') {
      setIsChecked(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleCheckboxChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);

    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className={`block h-8 w-14 rounded-full transition ${isChecked ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <div
          className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
            isChecked ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};
