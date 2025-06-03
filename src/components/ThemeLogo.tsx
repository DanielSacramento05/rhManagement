
import { useTheme } from "./ThemeProvider";

interface ThemeLogoProps {
  className?: string;
  alt?: string;
}

export function ThemeLogo({ className = "w-full h-full object-contain", alt = "HR Management" }: ThemeLogoProps) {
  const { resolvedTheme } = useTheme();

  // Fallback SVG for light mode (darker colors for visibility on light background)
  const lightModeFallback = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path 
        d="M11.997 24a2.803 2.803 0 0 1-1.468-.4c-1.645-1-3.593-2.405-5.313-3.881C1.701 16.56 0 13.798 0 11.143V4.297a1.315 1.315 0 0 1 .695-1.174A21.754 21.754 0 0 1 11.997 0a21.758 21.758 0 0 1 11.303 3.123c.414.244.7.72.7 1.174v6.846c0 2.654-1.701 5.417-5.209 8.576-1.72 1.471-3.669 2.88-5.327 3.881a2.78 2.78 0 0 1-1.467.4zm-5.402-8.375v-.99h3.169v-1.16H6.595v-.99h3.169v-1.159H6.595v-.99h2.504v-.968l1.054-.977h-3.56v-.99h4.715l1.27 1.152 1.54-1.152h4.287v.99h-3.12l-1.1.835v.11h2.405v.99H14.56v1.162h2.626v.99H14.56v1.16h2.626v.99H9.809v-.99h3.169v-1.16H9.809v-.99h3.169v-1.16H9.809v-.99h2.132l-.99-.842-1.32.842H6.595z" 
        fill="#1e293b"
      />
    </svg>
  );

  // Fallback SVG for dark mode (lighter colors for visibility on dark background)
  const darkModeFallback = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path 
        d="M11.997 24a2.803 2.803 0 0 1-1.468-.4c-1.645-1-3.593-2.405-5.313-3.881C1.701 16.56 0 13.798 0 11.143V4.297a1.315 1.315 0 0 1 .695-1.174A21.754 21.754 0 0 1 11.997 0a21.758 21.758 0 0 1 11.303 3.123c.414.244.7.72.7 1.174v6.846c0 2.654-1.701 5.417-5.209 8.576-1.72 1.471-3.669 2.88-5.327 3.881a2.78 2.78 0 0 1-1.467.4zm-5.402-8.375v-.99h3.169v-1.16H6.595v-.99h3.169v-1.159H6.595v-.99h2.504v-.968l1.054-.977h-3.56v-.99h4.715l1.27 1.152 1.54-1.152h4.287v.99h-3.12l-1.1.835v.11h2.405v.99H14.56v1.162h2.626v.99H14.56v1.16h2.626v.99H9.809v-.99h3.169v-1.16H9.809v-.99h3.169v-1.16H9.809v-.99h2.132l-.99-.842-1.32.842H6.595z" 
        fill="#f1f5f9"
      />
    </svg>
  );

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, fallback: React.ReactElement) => {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    
    // Create a container for the fallback SVG
    const fallbackContainer = document.createElement('div');
    fallbackContainer.innerHTML = fallback.props.children.props.children;
    fallbackContainer.className = className;
    
    // Replace the broken image with the fallback
    if (target.parentNode) {
      target.parentNode.appendChild(fallbackContainer);
    }
  };

  return (
    <div className={className}>
      {resolvedTheme === "light" ? (
        <img 
          src="/assets/logo-light.png" 
          alt={alt}
          className={className}
          onError={(e) => handleImageError(e, lightModeFallback)}
          style={{ display: 'block' }}
        />
      ) : (
        <img 
          src="/assets/logo-dark.png" 
          alt={alt}
          className={className}
          onError={(e) => handleImageError(e, darkModeFallback)}
          style={{ display: 'block' }}
        />
      )}
    </div>
  );
}
