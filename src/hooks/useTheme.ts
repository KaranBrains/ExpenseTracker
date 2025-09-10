import { useAsyncStorage } from './useAsyncStorage';

const THEME_STORAGE_KEY = 'expense_tracker_theme';

export const useTheme = () => {
  const [isDark, setIsDark, loading] = useAsyncStorage<boolean>(THEME_STORAGE_KEY, false);

  const toggleTheme = async () => {
    await setIsDark(!isDark);
  };

  return {
    isDark,
    toggleTheme,
    loading,
  };
};
