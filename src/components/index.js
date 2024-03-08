import dynamic from "next/dynamic";

const MapPage = dynamic(() => import("./GoogleMap"), {
  ssr: false,
});
export default MapPage;
