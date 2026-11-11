'use client';

import { Atmosphere } from './Atmosphere';
import { Chair } from './Chair';
import { Desk } from './Desk';
import { Lamp } from './Lamp';
import { NeonSign } from './NeonSign';
import { Plant } from './Plant';
import { Shelf } from './Shelf';
import { Shell } from './Shell';
import { Window } from './Window';
import { Workstation } from './Workstation';

/** The hero scene: a procedural, night-lit developer room. Units ≈ metres. */
export function Room() {
  return (
    <group>
      <Shell />
      <Window />
      <Desk />
      <Workstation />
      <Lamp />
      <NeonSign />
      <Shelf />
      <Plant />
      <Chair />
      <Atmosphere />
    </group>
  );
}
