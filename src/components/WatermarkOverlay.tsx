// src/components/WatermarkOverlay.tsx
import React from 'react';
import Lottie from 'lottie-react';

// --- IMPORT YOUR LOTTIE JSONS ---
// You will get these from your animator
import fawnAnimation from './lotties/fawn-blink.json';
import phoenixAnimation from './lotties/phoenix-flare.json';
import lionAnimation from './lotties/lion-holo.json';

interface WatermarkOverlayProps {
  tier: 'basic' | 'featured' | 'premium';
  collectionName?: string;
  artistName?: string;
}

const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  tier,
  collectionName,
  artistName,
}) => {
  if (tier === 'premium') {
    return (
      <div className="watermark premium-watermark">
        <Lottie
          animationData={lionAnimation}
          loop={true}
          className="watermark-animation"
        />
        <span className="premium-text">{artistName} x Hair Studio</span>
      </div>
    );
  }

  if (tier === 'featured') {
    return (
      <div className="watermark featured-watermark">
        <Lottie
          animationData={phoenixAnimation}
          loop={true}
          className="watermark-animation-small"
        />
        <span className="featured-text">
          {collectionName} | HS
        </span>
      </div>
    );
  }

  // Basic Tier
  return (
    <div className="watermark basic-watermark">
      <Lottie
        animationData={fawnAnimation}
        loop={true}
        className="watermark-animation-small"
      />
      <span className="basic-text">Hair Studio</span>
    </div>
  );
};

export default WatermarkOverlay;