declare module "react-simple-maps" {
  import React from "react";

  export interface GeoFeature {
    rsmKey: string;
    id: string | number;
    properties: Record<string, unknown>;
  }

  export interface GeographyStyleState {
    default?: React.CSSProperties;
    hover?: React.CSSProperties;
    pressed?: React.CSSProperties;
  }

  export interface ComposableMapProps extends React.SVGAttributes<SVGElement> {
    projection?: string;
    projectionConfig?: {
      center?: [number, number];
      rotate?: [number, number, number];
      scale?: number;
      parallels?: [number, number];
    };
    width?: number;
    height?: number;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: GeoFeature[] }) => React.ReactNode;
    parseGeographies?: (features: unknown[]) => GeoFeature[];
  }

  export interface GeographyProps extends React.SVGAttributes<SVGPathElement> {
    geography: GeoFeature;
    style?: GeographyStyleState;
    tabable?: boolean;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const ZoomableGroup: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
  export const Marker: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
  export const Annotation: React.FC<React.PropsWithChildren<Record<string, unknown>>>;
  export const Graticule: React.FC<Record<string, unknown>>;
  export const Sphere: React.FC<Record<string, unknown>>;
}
