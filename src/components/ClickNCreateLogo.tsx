import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useCustomization } from '../context/CustomizationContext.tsx';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  brandColorClass?: string;
  overrideLogoUrl?: string;
  overrideDisplayMode?: 'image_text' | 'image_only' | 'text_only';
}

/**
 * Dynamic Brandmark & Custom Logo Renderer for Click N Create
 * Automatically renders custom admin-uploaded logo image or typographic brandmark.
 */
export const ClickNCreateLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  brandColorClass,
  overrideLogoUrl,
  overrideDisplayMode,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { customization } = useCustomization();
  const themeTokens = customization?.theme;
  const [imageError, setImageError] = useState(false);

  const customLogoUrl = overrideLogoUrl !== undefined ? overrideLogoUrl : themeTokens?.customLogoUrl;
  const logoDisplayMode = overrideDisplayMode || themeTokens?.logoDisplayMode || 'image_text';
  const logoHeight = themeTokens?.logoHeight || 36;

  // Reset error when logo URL changes
  useEffect(() => {
    setImageError(false);
  }, [customLogoUrl]);

  const sizeClasses = {
    sm: {
      brand: 'text-base sm:text-lg',
      sub: 'text-[9px]',
      dot: 'w-1.5 h-1.5',
      imgHeight: 'max-h-7',
      iconBox: 'w-6 h-6',
    },
    md: {
      brand: 'text-lg sm:text-xl',
      sub: 'text-[10px]',
      dot: 'w-2 h-2',
      imgHeight: 'max-h-9',
      iconBox: 'w-8 h-8',
    },
    lg: {
      brand: 'text-xl sm:text-2xl',
      sub: 'text-[11px]',
      dot: 'w-2.5 h-2.5',
      imgHeight: 'max-h-11',
      iconBox: 'w-10 h-10',
    },
    xl: {
      brand: 'text-2xl sm:text-3xl',
      sub: 'text-xs',
      dot: 'w-3 h-3',
      imgHeight: 'max-h-14',
      iconBox: 'w-12 h-12',
    },
  };

  const currentSize = sizeClasses[size];

  // Case 1: Custom Image Logo Available (and not errored)
  const hasValidCustomLogo = Boolean(customLogoUrl && customLogoUrl.trim() !== '' && !imageError);

  if (hasValidCustomLogo) {
    if (logoDisplayMode === 'image_only') {
      return (
        <div className={`flex items-center gap-2 select-none group cursor-pointer ${className}`}>
          <img
            src={customLogoUrl}
            alt="Click N Create Logo"
            onError={() => setImageError(true)}
            style={{ height: `${logoHeight}px`, maxHeight: '56px' }}
            className={`w-auto max-w-[240px] object-contain transition-transform duration-200 group-hover:scale-105 rounded-md`}
          />
        </div>
      );
    }

    if (logoDisplayMode === 'image_text') {
      return (
        <div className={`flex items-center gap-2.5 leading-none select-none group cursor-pointer ${className}`}>
          <div className="relative shrink-0 flex items-center justify-center">
            <img
              src={customLogoUrl}
              alt="Click N Create Logo Icon"
              onError={() => setImageError(true)}
              style={{ height: `${Math.min(logoHeight, 44)}px`, maxHeight: '44px' }}
              className={`w-auto max-w-[140px] object-contain transition-transform duration-200 group-hover:scale-105 rounded-lg`}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                className={`font-display font-extrabold tracking-tight transition-colors duration-200 ${
                  brandColorClass
                    ? brandColorClass
                    : isDark
                    ? 'text-white group-hover:text-zinc-200'
                    : 'text-zinc-950 group-hover:text-zinc-800'
                } ${currentSize.brand}`}
              >
                CLICK <span className="font-light text-zinc-500">N</span> CREATE
              </span>
              <span className={`rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] ${currentSize.dot}`} />
            </div>
            {showText && (
              <span className={`font-mono tracking-widest uppercase mt-0.5 text-zinc-500 font-medium ${currentSize.sub}`}>
                Saad M // Freelance Web Dev
              </span>
            )}
          </div>
        </div>
      );
    }
  }

  // Case 2: Pure Typographic Brandmark (Default or Text-Only mode)
  return (
    <div className={`flex flex-col leading-none select-none group cursor-pointer ${className}`}>
      <div className="flex items-center gap-1.5">
        <span
          className={`font-display font-extrabold tracking-tight transition-colors duration-200 ${
            brandColorClass
              ? brandColorClass
              : isDark
              ? 'text-white group-hover:text-zinc-200'
              : 'text-zinc-950 group-hover:text-zinc-800'
          } ${currentSize.brand}`}
        >
          CLICK <span className="font-light text-zinc-500">N</span> CREATE
        </span>
        <span className={`rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] ${currentSize.dot}`} />
      </div>
      {showText && (
        <span className={`font-mono tracking-widest uppercase mt-1 text-zinc-500 font-medium ${currentSize.sub}`}>
          Saad M // Freelance Web Dev
        </span>
      )}
    </div>
  );
};
