export interface SafetyVideo {
  id: string;
  title: string;
  disasterType: 'flood' | 'earthquake' | 'cyclone' | 'wildfire';
  phase: 'before' | 'after';
  videoId: string;
  description: string;
}

export const safetyVideos: SafetyVideo[] = [
  // FLOODS
  {
    id: 'f1',
    title: 'Flood Preparedness: 101',
    disasterType: 'flood',
    phase: 'before',
    videoId: '43V4r_rN5N0',
    description: 'Essential steps to secure your property and evacuate safely before floodwaters rise.'
  },
  {
    id: 'f2',
    title: 'Post-Flood Recovery Safeguards',
    disasterType: 'flood',
    phase: 'after',
    videoId: '6v7-F0wX6n4',
    description: 'Safe re-entry protocols, mold prevention, and electrical hazards during cleanup.'
  },
  // EARTHQUAKES
  {
    id: 'e1',
    title: 'Drop, Cover, and Hold On',
    disasterType: 'earthquake',
    phase: 'before',
    videoId: 'BLEPac0Sefw',
    description: 'Immediate survival techniques for the first seconds of seismic activity.'
  },
  {
    id: 'e2',
    title: 'Seismic Recovery Operations',
    disasterType: 'earthquake',
    phase: 'after',
    videoId: 'G0PZ867n6_E',
    description: 'Structural integrity checks and avoiding secondary hazards like gas leaks.'
  },
  // CYCLONES
  {
    id: 'c1',
    title: 'Cyclone Impact Mitigation',
    disasterType: 'cyclone',
    phase: 'before',
    videoId: 'vV238A7S_4k',
    description: 'Securing structures and establishing communication lines before high-wind impact.'
  },
  {
    id: 'c2',
    title: 'Cyclone Aftermath & Clearance',
    disasterType: 'cyclone',
    phase: 'after',
    videoId: 'YpbeZ1w0qWc',
    description: 'Managing debris safely and coordinating with regional rescue nodes.'
  },
  // WILDFIRES
  {
    id: 'w1',
    title: 'Wildfire Defense Strategies',
    disasterType: 'wildfire',
    phase: 'before',
    videoId: '5W0zSreV94A',
    description: 'Creating defensible space and early evacuation planning for fire-prone zones.'
  },
  {
    id: 'w2',
    title: 'Wildfire Sector Restoration',
    disasterType: 'wildfire',
    phase: 'after',
    videoId: 'F0f5_10i_i0',
    description: 'Safe return to fire-impacted areas and managing ash/toxic residue.'
  }
];
