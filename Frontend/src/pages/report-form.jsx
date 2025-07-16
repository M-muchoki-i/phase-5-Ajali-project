import { useState } from "react"
import axios from 'axios'

export default function ReportForm() {
    // set states for input fields as form data
    const [formData, setFormData] = useState({
        incident: '',
        details: '',
        media:[]
    })

    // handle form changes in text fields
    const handleTextChange=(e)=>{
        const { name, value } = e.target;
        if (name === 'incident') { setIncident(value); }
        else if (name === 'details') { setDetails(value); }
    };

    // handle media changes for the input area
    // subject to change during discussion on how to handle media uploads
    const handleMediaChange = (e) => {
        const { name, value } = e.target;
        if (name === 'media') { setMedia(value); }
    };

    // create function to handle form data
    const handleSubmit= async(e) => {
        e.preventDefault()

        const newIncident = {
            incident, details, media
        }

        try {
            const response = await axios.post(`${backendURL}/user/reports`, newIncident)
            console.log(response.data)
            setIncident('')
            setDetails('')
            setMedia([])
        } catch (error) {
            console.error('Error adding incident', error)
        }
    }

    return (
        <>
            <div>
                <form action="submit" onSubmit={handleSubmit}>
                    <p>Incident</p>
                    <input type="text" placeholder="e.g. Fire, motor accident, workplace accident etc." name = 'incident' value={e.target.value} onChange={handleTextChange} />
                    <p>Details</p>
                    <input type="text" placeholder="e.g. Accident on Alali Rd involving two vehicles, Fire at Mjengo Apartments etc." name='details' value={e.target.value } onChange={handleTextChange } />
                    <p>Attach image</p>
                    <input type='file' placeholder="Attach photo or video" name='media' value={e.target.value } onChange={handleMediaChange } />
                    <button type="submit" >Submit Report</button>
                </form>
            </div>
        </>
    )
}