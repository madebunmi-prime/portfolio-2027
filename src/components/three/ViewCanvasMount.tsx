'use client';

import dynamic from 'next/dynamic';

const ViewCanvas = dynamic(() => import('./ViewCanvas'), { ssr: false });

export function ViewCanvasMount() {
  return <ViewCanvas />;
}
