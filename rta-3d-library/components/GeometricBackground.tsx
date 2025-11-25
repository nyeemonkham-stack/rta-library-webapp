import React from 'react';

export const GeometricBackground: React.FC = () => {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full z-0 opacity-20"
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 50%, #333 0%, transparent 40%),
          radial-gradient(circle at 85% 30%, #333 0%, transparent 40%),
          url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"><defs><pattern id="p" width="100" height="100" patternUnits="userSpaceOnUse"><polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="%23222" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23p)"/></svg>')
        `,
        backgroundSize: 'cover, cover, 300px 300px',
        backgroundPosition: 'center, center, center',
      }}
    >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
    </div>
  );
};
