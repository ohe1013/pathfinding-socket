import { Tablet } from "../tablet/Tablet";
const GuestTablet = () => {
  return <Tablet position={[0, 0, 0]} scale={0.01} rotation-x={Math.PI / 2} />;
};

export default GuestTablet;
