import { Map } from 'ol';
import { create } from 'zustand';

export enum MapMode {
  IDENTIFY = 'identify',
  EDIT = 'edit',
}

type PublicMapState = {
  map: Map | null;
  setMap: (map: Map | null) => void;
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
};

export const usePublicMapStore = create<PublicMapState>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
  mapMode: MapMode.IDENTIFY,
  setMapMode: (mapMode) => set({ mapMode }),
}));
