"use client";
import { useEdgeStore } from '@/lib/edgestore';
import React, { useState, useCallback, useRef } from 'react';
import { FiStar, FiUpload } from 'react-icons/fi';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const PROFILE_IMAGE_SIZE = 150; // Size of the cropped image
const IMAGE_DISPLAY_HEIGHT = 300; // Consistent height for displayed images

const FeedbackForm: React.FC = () => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [stars, setStars] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [imageAspect, setImageAspect] = useState(1);
  const { edgestore } = useEdgeStore();
  const [image, setImage] = useState<string | null>(null);
  
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }, []);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setImageAspect(width / height);
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }, []);

  const generateCroppedImage = useCallback(async (): Promise<File | null> => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
  
      if (!ctx) {
        console.error('No 2d context');
        return null;
      }
  
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
  
      canvas.width = PROFILE_IMAGE_SIZE;
      canvas.height = PROFILE_IMAGE_SIZE;
  
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        PROFILE_IMAGE_SIZE,
        PROFILE_IMAGE_SIZE
      );
  
      return new Promise<File | null>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `profile-${Date.now()}.jpg`, { type: 'image/jpeg' });
            resolve(file);
          } else {
            console.error('Failed to create blob from canvas');
            resolve(null);
          }
        }, 'image/jpeg', 0.95);
      });
    }
    console.error('Crop not complete or image reference not available');
    return null;
  }, [completedCrop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('feedback', feedback);
      formData.append('stars', stars.toString());

      if (profileImage && completedCrop) {
        const croppedImageFile = await generateCroppedImage();
        if (croppedImageFile) {
          const res = await edgestore.publicFiles.upload({
            file: croppedImageFile,
            onProgressChange: (progress) => {
              console.log(progress);
            },
          });

          if (res && res.url) {
            setImage(res.url);
            formData.append('profileImage', res.url);
          } else {
            throw new Error('Image upload failed or returned no URL');
          }
        } else {
          throw new Error('Failed to generate cropped image file');
        }
      } else {
        setSubmitMessage('Please upload and crop an image before submitting.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`/api/feedback`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitMessage('Feedback submitted successfully!');
        setName('');
        setFeedback('');
        setStars(0);
        setProfileImage(null);
        setCompletedCrop(null);
        setImage(null);
      } else {
        setSubmitMessage('Error submitting feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden md:max-w-2xl m-4 transition-all duration-300 hover:shadow-2xl">
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Share Your Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-600 transition duration-200 ease-in-out"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-600 transition duration-200 ease-in-out"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
          <div className="mt-1 flex items-center justify-center">
            {profileImage ? (
              <div className="relative" style={{ height: `${IMAGE_DISPLAY_HEIGHT}px`, width: `${IMAGE_DISPLAY_HEIGHT * imageAspect}px`, maxWidth: '100%' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={profileImage}
                    alt="Profile"
                    onLoad={onImageLoad}
                    style={{ height: `${IMAGE_DISPLAY_HEIGHT}px`, width: 'auto' }}
                    className="rounded-lg"
                  />
                </ReactCrop>
                <button
                  type="button"
                  onClick={() => setProfileImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="cursor-pointer bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg text-indigo-700 dark:text-indigo-300 border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition duration-200 ease-in-out">
                <FiUpload className="inline-block mr-2 text-2xl" />
                <span className="font-medium">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setStars(star)}
                className={`p-1 rounded-full transition-all duration-200 ${stars >= star ? 'text-yellow-400 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
              >
                <FiStar className="w-8 h-8" />
              </button>
            ))}
          </div>
        </div>

        {submitMessage && (
          <p className={`text-sm text-center font-medium ${submitMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {submitMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : 'Submit Feedback'}
        </button>
      </form>
    </div>
    <canvas
      ref={previewCanvasRef}
      style={{
        display: 'none',
        width: Math.round(completedCrop?.width ?? 0),
        height: Math.round(completedCrop?.height ?? 0)
      }}
    />
  </div>
  );
};

export default FeedbackForm;