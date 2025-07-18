
import { useState, useRef } from "react"
import axios from 'axios'
import getCurrentPosition from "../components/locationMap"
//import NavBar from "../components/navbar"

// import { useState } from "react"
// import axios from 'axios'


const backendURL = 'http://localhost:5000'

export default function ReportForm() {
    // set states for input fields as form data
    const [formData, setFormData] = useState({
        incident: '',
        details: '',
        media: []
    })
    // Ref for the file input to clear it visually after submission
    const fileInputRef = useRef(null);

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
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-100 bg-opacity-80 backdrop-blur-sm">
                <div className="max-w-md mx-auto p-6 bg-red-50 rounded-2xl border border-red-100 shadow-lg">
                    <h2 className="text-3xl font-bold text-red-800 mb-6 ml-12">Report an emergency</h2>
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-xl font-bold text-red-700 mb-1">Incident</h3>
                        <select
                            name="Incident"
                            className="w-full p-3 border-2 border-gray-200 rounded-full bg-white 
            focus:border-red-400 focus:ring-2 focus:ring-red-100 
            transition-all appearance-none cursor-pointer
            hover:border-red-300"
                        >
                            <option value="Fire" className="bg-red-50 rounded-full my-1">🔥 Fire</option>
                            <option value="Traffic accident" className="bg-red-50 rounded-full my-1">🚦 Traffic</option>
                            <option value="Infrastructure accident" className="bg-red-50 rounded-full my-1">🏗️ Infrastructure</option>
                            <option value="Workplace" className="bg-red-50 rounded-full my-1">🏢 Workplace</option>
                        </select>
                        <h3 className="text-xl font-bold text-red-700 mb-1">Details</h3>
                        <input type="text" placeholder="e.g. Accident on Alali Rd involving two vehicles, Fire at Mjengo Apartments etc." name='details' value={formData.details} onChange={handleTextChange} required className="w-full p-3 border border-gray-300 rounded-full bg-white 
                 focus:border-red-400 focus:ring-2 focus:ring-red-100 
                 transition-all placeholder-gray-400"/>
                        <h4 className="text-xl font-bold text-red-700 mb-1">Location</h4>
                        <div className="flex flex-row w-full items-center">
                            <div className="flex flex-1 rounded-full border-2 border-gray-300 overflow-hidden
                  hover:border-red-300 transition-colors bg-gray-50">
                                <input
                                    type="text"
                                    className="flex-1 min-w-0 p-4 text-center focus:outline-none border-none bg-transparent"
                                    placeholder="Longitude"
                                />
                                <div className="border-l border-gray-300 h-8 self-center"></div> {/* Divider */}
                                <input
                                    type="text"
                                    className="flex-1 min-w-0 p-4 text-center focus:outline-none border-none bg-transparent"
                                    placeholder="Latitude"
                                />
                            </div>
                            <div className="w-4"></div>
                            <button
                                className="shrink-0 py-3 px-6 bg-red-500 text-white font-medium rounded-full
              hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 
              focus:ring-offset-2 shadow-sm transition-all"
                            >
                                Get location
                            </button>
                        </div>
    
                        <h3 className="text-xl mt-2 font-bold text-red-700 mb-2">Attach image</h3>
                        <input type='file' name='media' accept="image/*,video/*"
                            multiple onChange={handleMediaChange} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center
                     hover:border-red-300 transition-colors bg-gray-50 w-full" />
                        <div>
                            {/* Display selected file names (optional) */}
                            {formData.media.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-red-700 mb-1">Selected Files:</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
                                        <ul>
                                            {formData.media.map((file, index) => (
                                                <li key={index}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="w-full mt-4 py-3 px-4 bg-red-500 text-white font-medium rounded-full
               hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 

               focus:ring-offset-2 shadow-sm transition-all" type="submit" onClick={getCurrentPosition} >Submit Report</button>

                    </form>
                </div>
            </div>
        </>
    )
}