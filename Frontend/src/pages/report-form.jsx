import { useState } from "react"
import axios from 'axios'

const backendURL = 'http://localhost:5000'

export default function ReportForm() {
    // set states for input fields as form data
    const [formData, setFormData] = useState({
        incident: '',
        details: '',
        media: []
    })
    

    // handle form changes in text fields
    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
    // handle media changes for the input area
    // subject to change during discussion on how to handle media uploads
    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);

        // Validate files
        const validFiles = files.filter(file =>
            file.type.startsWith('image/') || file.type.startsWith('video/')
        );

        setFormData(prev => ({
            ...prev,
            media: [...prev.media, ...validFiles]
        }));
    }

    // create function to handle form data
    const handleSubmit = async (e) => {
        e.preventDefault()

        const dataToSend = new FormData();
        dataToSend.append('incident', formData.incident);
        dataToSend.append('details', formData.details);
        // Append each selected media file
        formData.media.forEach((file, index) => {
            dataToSend.append(`media[${index}]`, file);
        });

        try {
            const response = await axios.post(`${backendURL}/user/reports`, dataToSend)
            console.log(response.data)

            // reset the form
            setIncident('')
            setDetails('')
            setMedia([])

            //this clears the media boxes
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error adding incident', error)
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <p>Incident</p>
                    <input type="text" placeholder="e.g. Fire, motor accident, workplace accident etc." name='incident' value={formData.incident} onChange={handleTextChange} required />
                    <p>Details</p>
                    <input type="text" placeholder="e.g. Accident on Alali Rd involving two vehicles, Fire at Mjengo Apartments etc." name='details' value={formData.details} onChange={handleTextChange} required />
                    <p>Attach image</p>
                    <input type='file' placeholder="Attach photo or video" name='media' accept="image/*,video/*"
                        multiple onChange={handleMediaChange} />
                    <div>
                        {/* Display selected file names (optional) */}
                        {formData.media.length > 0 && (
                            <div>
                                <p>Selected Files:</p>
                                <ul>
                                    {formData.media.map((file, index) => (
                                        <li key={index}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button type="submit" >Submit Report</button>
                </form>
            </div>
        </>
    )
}