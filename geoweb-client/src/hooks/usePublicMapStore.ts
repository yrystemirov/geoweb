import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { create } from 'zustand';

export enum MapMode {
  IDENTIFY = 'identify',
  EDIT = 'edit',
}

type PublicMapState = {
  systemThemeColor: string;
  map: Map | null;
  setMap: (map: Map | null) => void;
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
  userLayers: TileLayer[];
  setUserLayers: (layers: TileLayer[]) => void;
  identifyEventData: any;
  setIdentifyEventData: (identifyEventData: any) => void;
  attributeTables: any[];
  setAttributeTables: (attributeTables: any[]) => void;
  currentAttributeTable: any;
  setCurrentAttributeTable: (currentAttributeTable: any) => void;
};

export const usePublicMapStore = create<PublicMapState>((set) => ({
  systemThemeColor: '#196fa6', // //5ebc67-green    196fa6-blue
  map: null,
  setMap: (map) => set({ map }),
  mapMode: MapMode.IDENTIFY,
  setMapMode: (mapMode) => set({ mapMode }),
  userLayers: [],
  setUserLayers: (userLayers) => set({ userLayers }),
  identifyEventData: null,
  setIdentifyEventData: (identifyEventData) => set({ identifyEventData }),
  attributeTables: [],
  setAttributeTables: (attributeTables: any[]) => set({ attributeTables }),
  currentAttributeTable: null,
  setCurrentAttributeTable: (currentAttributeTable: any) => set({ currentAttributeTable }),
}));