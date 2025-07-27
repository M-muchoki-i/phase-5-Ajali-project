import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet'
import { useNavigate } from "react-router-dom";

// Fix for default marker icons in Leaflet
// Leaflet(map library) will not work without this in place DO NOT REMOVE!!!
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapPage() {
    // this instantiates the map initial state for reference as a mutable variable
    const mapRef = useRef();
    const navigate = useNavigate
    const [position, setPosition] = useState(null);
    const [locationSelected, setLocationSelected] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);


    //we need to create a function to trigger location finding
    const handleLocate = () => {
        setIsLocating(true);
        setLocationError(null);
        //this triggers map.locatd() in location marker when mounted
        if (mapRef.current) {
            mapRef.current.locate({
                setView: true,
                maxZoom: 16,
                timeout: 10000,
                enableHighAccuracy: true
            });
        }
    };

    const handleLocationFound = (e) => {
        const newPosition = e.latlng;
        setPosition(newPosition);
        setLocationSelected(true);
        setIsLocating(false);
        mapRef.current.flyTo(newPosition, 16);
    };

    const handleButtonClick = () => {
        if (!locationSelected) {
            handleLocate();
        } else {
            navigate('/report')
        }
     };

    // useEffect(() => {  //this allows us to et the positional coords on component mount
    //     if (position && mapRef.current) {
    //         mapRef.current.flyTo(position, 13)
    //     }
    // },[position]) //position as a dependancy for the side-effect

    return (
        //first fragment is a container for the entire page
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-red-950 flex flex-col font-inter text-white overflow-hidden relative">
                {/*conditional render for loading/error states  will do here*/}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
                    <div className="absolute w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob top-10 left-1/4"></div>
                    <div className="absolute w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 top-1/2 right-1/4"></div>
                </div>
                <main className="flex-1 flex items-center justify-center p-4">
                    {/* The giant floating card container for the map and its controls */}
                    <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col max-w-5xl w-full h-full max-h-[90vh] overflow-y-auto">

                        {/* Header/Control Panel - Glassy and prominent, now inside the card */}
                        <div className="p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-md flex flex-shrink-0 justify-between items-center mb-4"> {/* Added margin-bottom */}
                            <h1 className="text-2xl font-extrabold text-blue-300 drop-shadow-lg">Map Location</h1>
                            {/* Find My Location Button - Glassy and interactive */}
                            <button
                                onClick={handleLocate}
                                disabled={isLocating}
                                title="Find my location"
                                className={`relative bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-lg transition-all duration-300 flex items-center gap-2
                                   ${isLocating ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-blue-500/40 transform hover:scale-105'}
                                   border border-blue-500/50 hover:border-blue-400/70`}
                            >
                                {isLocating ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {isLocating ? 'Locating...' : 'Find My Location'}
                            </button>
                        </div>

                        {/* Map Container - now takes full height/width of its parent card */}
                        <MapContainer
                            center={position || [0, 0]} // Default to 0,0 if no position, LocationMarker will try to find user's
                            zoom={2} // Start with a lower zoom to show more of the world
                             // Fill parent card
                            whenCreated={(map) => (mapRef.current = map)}
                            className="z-0 flex-grow rounded-lg overflow-hidden min-h-[500px]" // Added rounded-lg to map itself
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker
                                position={position}
                                setPosition={setPosition}
                                isUserLocation={true} // This marker is for the user's location
                            />
                        </MapContainer>

                        {/* Coordinate Display Box - Glassy and subtle, now inside the card */}
                        {position && (
                            <div className="p-4 flex-shrink-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-md mt-4"> {/* Added margin-top */}
                                <div className="font-semibold text-blue-300">Current Coordinates:</div>
                                <div className="text-lg text-white/90">{position.lat.toFixed(5)}, {position.lng.toFixed(5)}</div>
                            </div>
                        )}
                    </div>
                </main>
                
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