import React from 'react';
import { twMerge } from 'tailwind-merge';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../../hooks/useTheme';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
  showThemeToggle?: boolean;
  headerContent?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  title,
  maxWidth = 'xl',
  centered = false,
  showThemeToggle = true,
  headerContent,
}) => {
  const { theme, toggleTheme } = useTheme();
  
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {showThemeToggle && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      )}

      <div className={twMerge(
        'mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:min-w-[1200px]',
        maxWidthClass[maxWidth],
        centered && 'flex flex-col justify-center items-center min-h-screen',
        className
      )}>
        {(title || headerContent) && (
          <header className="mb-6">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            )}
            {headerContent}
          </header>
        )}

        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout; 