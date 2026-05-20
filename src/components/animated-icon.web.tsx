import React from 'react';

export function AnimatedSplashOverlay() {
  return null;
}

export function AnimatedIcon() {
  return (
    <div style={styles.iconContainer}>
      {/* Inject premium keyframe animations directly */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customPulse {
          0%, 100% { transform: scale(0.96); opacity: 0.9; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        @keyframes customRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .pulse-anim {
          animation: customPulse 3s ease-in-out infinite;
        }
        .rotate-anim {
          animation: customRotate 12s linear infinite;
          transform-origin: center;
        }
      `}} />

      {/* Glow Backdrop */}
      <div style={styles.glowWrapper} className="pulse-anim">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="url(#glowGrad)" />
        </svg>
      </div>

      {/* Rotating Dotted Orbital Ring */}
      <div style={styles.absoluteFill} className="rotate-anim">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="accentGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <circle 
            cx="60" 
            cy="60" 
            r="46" 
            stroke="url(#accentGrad1)" 
            strokeWidth="1.5" 
            strokeDasharray="6,4"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Main Brand Wings & Upward Jet */}
      <div style={styles.absoluteFill}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="accentGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Steering Wheel/Compass Ring */}
          <circle 
            cx="60" 
            cy="60" 
            r="38" 
            stroke="url(#accentGrad2)" 
            strokeWidth="2.5" 
            fill="none"
            opacity="0.8"
          />

          {/* Compass Steering Ticks */}
          <path d="M60 18 L60 24" stroke="url(#accentGrad2)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M60 96 L60 102" stroke="url(#accentGrad2)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 60 L24 60" stroke="url(#accentGrad2)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M96 60 L102 60" stroke="url(#accentGrad2)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Pilot Wings & Growth Jet Emblem */}
          <g transform="translate(30, 30) scale(0.5)">
            <path 
              d="M10 50 C30 22, 90 22, 110 50 C90 78, 30 78, 10 50 Z" 
              fill="none" 
              stroke="url(#accentGrad2)" 
              strokeWidth="4" 
              opacity="0.55" 
            />
            {/* Soaring Rocket/Jet */}
            <path 
              d="M60 15 L85 85 L60 70 L35 85 Z" 
              fill="url(#accentGrad2)" 
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Orange thrust flame */}
            <path 
              d="M52 75 L60 95 L68 75 Z" 
              fill="#FB7185" 
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

const styles = {
  iconContainer: {
    width: '120px',
    height: '120px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as const,
  },
  glowWrapper: {
    position: 'absolute' as const,
    width: '120px',
    height: '120px',
  },
  absoluteFill: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
