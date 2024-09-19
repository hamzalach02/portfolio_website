"use client"

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface Feedback {
  id: number;
  name: string;
  feedback: string;
  stars: number;
  profileImage: string | null;
  imageUrl: string | null; // Add this line
}

const PROFILE_IMAGE_SIZE = 100;
const REFRESH_INTERVAL = 30000;

const FeedbackList: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchFeedback = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/feedback`);
      if (!res.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await res.json();
      
      setFeedbackList(data);
    } catch (err) {
      setError('Error fetching feedback. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();

    const intervalId = setInterval(() => {
      fetchFeedback();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchFeedback]);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-300">Loading feedback...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 sm:text-4xl">
          Feedbacks
        </h2>
      </div>
      {feedbackList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbackList.map((feedback) => (
            <div key={feedback.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-[1px] border-indigo-600 dark:border-gray-100">
              <div className="p-6 flex flex-col items-start">
                <div className="relative w-[100px] h-[100px] mb-4">
                  {feedback.profileImage ? ( // Use imageUrl instead of profileImage
                    <img
                      src={feedback.profileImage}
                      alt={` profile`}
                      width={PROFILE_IMAGE_SIZE}
                      height={PROFILE_IMAGE_SIZE}
                      className="rounded-full object-cover border-4 border-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-2xl">
                      ?
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feedback.name}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < feedback.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{feedback.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">No feedback available</p>
      )}
    </div>
  );
};

export default FeedbackList;