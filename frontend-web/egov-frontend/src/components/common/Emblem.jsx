import React from 'react';

/**
 * Affiche l'emblème officiel du Burkina Faso
 * depuis le fichier image /embleme.png (dossier public)
 */
const Emblem = ({ className = 'w-8 h-8' }) => {
  return (
    <img
      src="/embleme.png"
      alt="Emblème du Burkina Faso"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default Emblem;
