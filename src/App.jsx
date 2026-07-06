import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";

export default function App() {
  const locations = [
    {
      id: 1,
      name: "Zagreb",
      lat: 45.815,
      lng: 15.9819,
      color: "red",
    },
    {
      id: 2,
      name: "Home",
      lat: 45.80041818398013,
      lng: 15.936644525578982,
      color: "blue",
    },
  ];

  return (
    <>
      <div class="bg-amber-50 w-full h-80 flex flex-row justify-around items-center">
        <h1 class="text-4xl font-semibold">1565 Projekta</h1>
        <h1 class="text-4xl font-semibold">154 Autora</h1>
        <h1 class="text-4xl font-semibold">352 Fotografa</h1>
      </div>

      <div class="bg-amber-100 w-full h-40 flex flex-row justify-around items-center">
        <h1 class="text-6xl font-bold flex items-center justify-center">
          Mapa Arheoloških Nalaza
        </h1>
      </div>

      <MapContainer
        center={[45.815, 15.9819]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <CircleMarker
            key={location.id}
            center={[location.lat, location.lng]}
            radius={8}
            pathOptions={{
              color: location.color, // border color
              fillColor: location.color, // inside color
              fillOpacity: 1,
            }}
          />
        ))}
      </MapContainer>

      <div class="bg-amber-50 w-full h-40 flex flex-col justify-around items-center">
        <div class="bg-amber-100 w-full h-20 flex flex-row justify-around items-center">
          <h1 class="text-4xl font-semibold">1565 Projekta</h1>
        </div>
        <div className="bg-amber-100 w-full h-200 flex flex-row justify-around items-center gap-4 p-8">
          <img
            src="https://images.unsplash.com/photo-1520587393050-c5298e1a8486?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="h-100 w-full object-cover rounded"
          />

          <img
            src="https://images.unsplash.com/photo-1520587393050-c5298e1a8486?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="h-100 w-full object-cover rounded"
          />

          <img
            src="https://images.unsplash.com/photo-1520587393050-c5298e1a8486?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="h-100 w-full object-cover rounded"
          />

          <img
            src="https://images.unsplash.com/photo-1520587393050-c5298e1a8486?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="h-100 w-full object-cover rounded"
          />
        </div>
      </div>
    </>
  );
}
