import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPage({ position,
    setPosition,
    loading,
    error,
    onLocate, }) {
    // this instantiates the map initial state for reference as a mutable variable
    const mapRef = useRef();

    useEffect(() => {  //this allows us to et the positional coords on component mount
        if (position && mapRef.current) {
            mapRef.current.flyTo(position, 13)
        }
    },[position]) //position as a dependancy for the side-effect

    return (
        //first fragment is a container for the entire page
        <>
            <div>
                {/*conditional render for loading states  will do here*/}
            
                <div> {/*div for button styling*/}
                <button onClick={onLocate} title="Find my location"></button> {/*button will only carry and svg image from online for better appearance, no text*/}
                </div>
                {/*imported map components from react leaflet will enter here*/}
                <MapContainer>
                    <TileLayer />
                </MapContainer>

                {/*box to show coordinates at corner of the page layout */}
                {position && (
                    <div>
                        <div>Cordinates</div>
                        <div>{position.lat.toFixed(5)},{position.lng.toFixed(5)}</div>
                    </div>
                ) }
            </div>
        </>
    )
}

// the location marker component will allow us to use mapEvents from leaflet to get the locatio
function LocationMarker({ position, setPosition, isUserLocation }) {
    
    const map = useMapEvents({
        click(e) {
            setPosition({});
        },
        locationfound(e) {
            setPosition({});
            map.flyTo(e.latlng, 13);
        }
    }); 

    return position ? (
        <Marker>
            <Popup>
                {isUserLocation ? "Current location" : "Selected location"}
            </Popup>
        </Marker>
    ) : null;
    
};