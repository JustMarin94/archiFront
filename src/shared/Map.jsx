import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

const categoryColors = {
  celebrated: "gold",
  documented: "blue",
  vanished: "red",
};

const Map = ({ locations = [] }) => {
  console.log("locations", locations);

  return (
    <MapContainer
      center={[45.815, 15.9819]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png"
      />

      {locations.map((location, index) => {
        const color = categoryColors[location.category] || "red";

        return (
          <CircleMarker
            key={index}
            center={[location.latitude, location.longitude]}
            radius={8}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <strong>{location.title}</strong>
              <br />
              Category: {location.category}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
