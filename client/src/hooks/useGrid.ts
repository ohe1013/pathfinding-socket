import useMapStore from "@/store/map";
import { useMemo } from "react";
import * as THREE from "three";

export const useGrid = () => {
  const map = useMapStore((state) => state.state);

  return useMemo(() => {
    if (!map) return null;

    return {
      vector3ToGrid: (vector3: THREE.Vector3) => {
        return [Math.floor(vector3.x * map.gridDivision), Math.floor(vector3.z * map.gridDivision)];
      },
      gridToVector3: (gridPosition: [number, number, number], width = 1, height = 1) => {
        return new THREE.Vector3(
          width / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
          0,
          height / map.gridDivision / 2 + gridPosition[1] / map.gridDivision
        );
      },
    };
  }, [map]);
};
