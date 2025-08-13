import React, { useState } from 'react'
import Banner from '../components/Banner'
import { useAuth } from '../contexts/AuthContext'

const About = () => {
  const { isAdmin } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    mission: "Our mission is the creation of a global platform from which we, and those who join us, create ebooks and ebookini (small ebooks) that relate to a current technology in music and its relationship to the culture around us.",
    editors: [
      { name: "Joel Chadabe", location: "New York" },
      { name: "Sharon Kanach", location: "France" },
      { name: "Marcelo Wanderley", location: "Canada" }
    ],
    authors: [
      { name: "Bob Gluck", location: "US" },
      { name: "Leigh Landy", location: "UK" }
    ],
    friendsPartners: [
      { name: "Bill Blakeney", location: "Canada" },
      { name: "Marc Battier", location: "France, China" },
      { name: "Carla Scaletti", location: "US" },
      { name: "Maggie Qi", location: "China" },
      { name: "Warren Burt", location: "Australia" },
      { name: "Ricardo Dal Farra", location: "Canada" },
      { name: "Nate Aldrich", location: "US" },
      { name: "Kim Cunio", location: "Australia" }
    ]
  })

  const handleSave = () => {
    // TODO: Save to database
    console.log('Saving data:', formData)
    setIsEditing(false)
  }

  const addPerson = (section) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], { name: "", location: "" }]
    }))
  }

  const removePerson = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const updatePerson = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      )
    }))
  }

  return (
    <div className="pt-6">
      <div className="px-4 sm:px-[30px] max-w-7xl mx-auto">
        <Banner type="all" limit={1} />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold font-[Lato] mb-4">About Us</h1>
          <p className="text-gray-600">Learn about our mission and the people behind Intelligent Arts</p>
        </div>

        {/* Mission Statement */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Mission Statement</h2>
          <div className="bg-white rounded-lg shadow-sm border p-8">
            {isEditing ? (
              <textarea
                value={formData.mission}
                onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                className="w-full h-32 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed text-lg text-center max-w-3xl mx-auto">
                {formData.mission}
              </p>
            )}
          </div>
        </section>

        {/* Editors */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Editors</h2>
          <div className="bg-white rounded-lg shadow-sm border p-8">
            {isEditing ? (
              <div className="space-y-4">
                {formData.editors.map((editor, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Name"
                      value={editor.name}
                      onChange={(e) => updatePerson('editors', index, 'name', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editor.location}
                      onChange={(e) => updatePerson('editors', index, 'location', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      onClick={() => removePerson('editors', index)}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addPerson('editors')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Editor
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {formData.editors.map((editor, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium">{editor.name}</span>
                    <span className="text-gray-600">{editor.location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Authors */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Authors</h2>
          <div className="bg-white rounded-lg shadow-sm border p-8">
            {isEditing ? (
              <div className="space-y-4">
                {formData.authors.map((author, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Name"
                      value={author.name}
                      onChange={(e) => updatePerson('authors', index, 'name', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={author.location}
                      onChange={(e) => updatePerson('authors', index, 'location', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      onClick={() => removePerson('authors', index)}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addPerson('authors')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Author
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {formData.authors.map((author, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium">{author.name}</span>
                    <span className="text-gray-600">{author.location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Friends & Partners */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Friends & Partners</h2>
          <div className="bg-white rounded-lg shadow-sm border p-8">
            {isEditing ? (
              <div className="space-y-4">
                {formData.friendsPartners.map((person, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Name"
                      value={person.name}
                      onChange={(e) => updatePerson('friendsPartners', index, 'name', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={person.location}
                      onChange={(e) => updatePerson('friendsPartners', index, 'location', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      onClick={() => removePerson('friendsPartners', index)}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addPerson('friendsPartners')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Friend/Partner
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {formData.friendsPartners.map((person, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium">{person.name}</span>
                    <span className="text-gray-600">{person.location}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Edit Controls - Only show for admin users */}
        {isAdmin() && (
          <div className="text-center">
            {isEditing ? (
              <div className="space-x-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Edit Information
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default About;
