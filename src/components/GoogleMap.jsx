// pages/map.js

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PersonIcon from "@mui/icons-material/Person";
import { Icon } from "leaflet";
const userData = [
  {
    id: 1,
    name: "User 1",
    latitude: 11.0183,
    longitude: 76.9747,
    description: "Description of User 1",
  },
  {
    id: 2,
    name: "User 2",
    latitude: 11.0122,
    longitude: 76.9821,
    description: "Description of User 2",
  },
  {
    id: 3,
    name: "User 3",
    latitude: 10.9982,
    longitude: 76.9797,
    description: "Description of User 3",
  },
  {
    id: 4,
    name: "User 4",
    latitude: 11.0016,
    longitude: 76.9628,
    description: "Description of User 4",
  },
];

const MapPage = () => {
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/7376/7376166.png",
    // shadowUrl: PersonIcon,
    iconSize: [50, 50],
    // iconAnchor: [12, 41],
  });
  return (
    <div style={{ height: "100vh" }}>
      <MapContainer
        center={[11.0168, 76.9558]}
        zoom={13}
        style={{ height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Map through user data and render markers */}
        {userData.map((user, index) => (
          <Marker
            title={user.name}
            key={index}
            position={[user.latitude, user.longitude]}
            icon={customIcon}
          >
            <Popup>
              {/* Customize popup content */}
              <div>
                <h2>{user.name}</h2>
                <p>{user.description}</p>
              </div>
            </Popup>
            {/* <Tooltip permanent direction="top" offset={[0, -30]}>
              <PersonIcon /> {user.name}
            </Tooltip> */}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
