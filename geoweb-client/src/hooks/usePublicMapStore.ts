import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
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
  userLayers: TileLayer[];
  setUserLayers: (layers: TileLayer[]) => void;
};

export const usePublicMapStore = create<PublicMapState>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
  mapMode: MapMode.IDENTIFY,
  setMapMode: (mapMode) => set({ mapMode }),
  userLayers: [],
  setUserLayers: (userLayers) => set({ userLayers }),
}));
