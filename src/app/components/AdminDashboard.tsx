"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Feedback {
  id: number;
  name: string;
  feedback: string;
  stars: number;
  imageUrl: string | null;
  imageSize: number;
}

const AdminDashboard: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [stars, setStars] = useState(0);
  const [imageSize, setImageSize] = useState(0);
  const [profileImage, setProfileImage] = useState<File | null>(null);
 
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`/api/feedback`);
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/feedback`, { data: { id } });
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const handleUpdate = async () => {
    if (selectedFeedback) {
      const formData = new FormData();
      formData.append('id', String(selectedFeedback.id));
      formData.append('name', name);
      formData.append('feedback', feedback);
      formData.append('stars', String(stars));
      formData.append('imageSize', String(imageSize));
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      try {
        await axios.put(`/api/feedback`, formData);
        setFeedbacks(feedbacks.map((fb) =>
          fb.id === selectedFeedback.id ? { ...fb, name, feedback, stars, imageSize, profileImage: profileImage?.name || fb.imageUrl } : fb
        ));
        setSelectedFeedback(null);
      } catch (error) {
        console.error('Error updating feedback:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">ID</th>
            <th className="border-b px-4 py-2">Name</th>
            <th className="border-b px-4 py-2">Feedback</th>
            <th className="border-b px-4 py-2">Stars</th>
            <th className="border-b px-4 py-2">Profile Image</th>
            <th className="border-b px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb.id}>
              <td className="border-b px-4 py-2">{fb.id}</td>
              <td className="border-b px-4 py-2">{fb.name}</td>
              <td className="border-b px-4 py-2">{fb.feedback}</td>
              <td className="border-b px-4 py-2">{fb.stars}</td>
              <td className="border-b px-4 py-2">
                {fb.imageUrl ? (
                  <img src={`${fb.imageUrl}`} alt="Profile" className="w-16 h-16 object-cover" />
                ) : (
                  'No Image'
                )}
              </td>
              <td className="border-b px-4 py-2">
                <button
                  onClick={() => handleDelete(fb.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedFeedback(fb);
                    setName(fb.name);
                    setFeedback(fb.feedback);
                    setStars(fb.stars);
                    setImageSize(fb.imageSize);
                  }}
                  className="ml-4 text-blue-500 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFeedback && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Edit Feedback</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Feedback"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
          <input
            type="number"
            value={stars}
            onChange={(e) => setStars(parseInt(e.target.value))}
            placeholder="Stars"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
          <input
            type="number"
            value={imageSize}
            onChange={(e) => setImageSize(parseInt(e.target.value))}
            placeholder="Image Size"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files ? e.target.files[0] : null)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          />
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;