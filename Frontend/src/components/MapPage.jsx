import { useEffect, useRef } from "react"

export default function MapPage() {
    // this instantiates the map initial state for reference as a mutable variable
    const mapRef = useRef();

    useEffect(() => {  //this allows us to et the positional coords on component mount
        if (position && mapRef.current) {
            mapRef.current.flyTo(position, 13)
        }
    },[position]) //position as a dependancy for the side-effect

    return (
        <></>
    )
}