import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet'

// Fix for default marker icons in Leaflet
// Leaflet(map library) will not work without this in place DO NOT REMOVE!!!
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapPage({ position,
    setPosition,
    // loading,
    // error,
    onLocate, }) {
    // this instantiates the map initial state for reference as a mutable variable
    const mapRef = useRef();

    //we need to create a function to trigger location finding
    // const handleLocate = () => {
    //     //this triggers map.locatd() in location marker when mounted
    //     if (mapRef.current) {
    //         mapRef.current.locate();
    //     }
    // };

    useEffect(() => {  //this allows us to et the positional coords on component mount
        if (position && mapRef.current) {
            mapRef.current.flyTo(position, 13)
        }
    },[position]) //position as a dependancy for the side-effect

    return (
        //first fragment is a container for the entire page
        <>
            <div className="h-screen w-screen flex flex-col">
                {/*conditional render for loading/error states  will do here*/}
            
                <div className="p-4 bg-gray-100 flex justify-between items-center z-10"> {/*div for button styling*/}
                    <h1 className="text-xl font-bold">Map Location</h1>
                    <button onClick={onLocate} title="Find my location" className="bg-blue-700 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-75">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z" />
                        </svg>

                    </button> {/*button will only carry and svg image from online for better appearance, no text*/}
                </div>
                {/*imported map components from react leaflet will enter here*/}
                <MapContainer
                    center={position || [51.505, -0.09]}
                    zoom={13}
                    style={{ flexGrow: 1 }}
                    whenCreated={(map) => (mapRef.current = map)}
                    className="z-0">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                    <LocationMarker
                        position={position}
                        setPosition={setPosition}
                        isUserLocation={true}
                    />
                </MapContainer>

                {/*box to show coordinates at corner of the page layout */}
                {position && (
                    <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg z-[1000] border border-gray-200">
                        <div className="text-base font-semibold text-gray-800 mb-1">Cordinates</div>
                        <div>{position.lat.toFixed(5)},{position.lng.toFixed(5)}</div>
                    </div>
                ) }
            </div>
        </>
    )
}

// the location marker component will allow us to use mapEvents from leaflet to get the locatio
function LocationMarker({ position, setPosition, isUserLocation }) {

    const mapRef = useRef();
    
    const map = useMapEvents({
        click(e) {
            setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
            map.flyTo(e.latlang, map.getZoom())
        },
        locationfound(e) {
            setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
            map.flyTo(e.latlng, 13);
        },
        //add error handlingn in case map load fails 
        locationerror(e) {
            console.error('location error:', e.message);
            alert('Could not find your location. Ensure device location is on')
        }
    }); 

    useEffect(() => {
        if (isUserLocation && mapRef.current) {
            mapRef.current.locate()
        }
    }, [isUserLocation, mapRef])

    return position ? (
        <Marker>
            <Popup className="font-semibold text-gray-800 text-base">
                {isUserLocation ? "Current location" : "Selected location"}
            </Popup>
        </Marker>
    ) : null;
    
};