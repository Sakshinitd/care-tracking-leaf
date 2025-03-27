import { useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import { getCurrentPosition } from '@/lib/geolocation';
import axios from 'axios';

interface ClockInButtonProps {
  locationPerimeterId: string;
  locationName: string;
  onClockInSuccess: () => void;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export default function ClockInButton({ 
  locationPerimeterId, 
  locationName,
  onClockInSuccess 
}: ClockInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');

  const handleClockIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current position
      const position = await getCurrentPosition();
      
      // Call clock-in API
      await axios.post('/api/clockin', {
        latitude: position.latitude,
        longitude: position.longitude,
        locationPerimeterId,
        note: note || undefined
      });
      
      setIsLoading(false);
      setShowNoteInput(false);
      setNote('');
      onClockInSuccess();

    } catch (error) {
      setIsLoading(false);
      const apiError = error as ApiError;
      
      if (apiError.response?.data?.error) {
        setError(apiError.response.data.error);
      } else if (apiError.message) {
        setError(apiError.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const toggleNoteInput = () => {
    setShowNoteInput(!showNoteInput);
    if (!showNoteInput) {
      setNote('');
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-semibold text-gray-800">
        Clock In at {locationName}
      </h3>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {showNoteInput ? (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Add a note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            placeholder="Enter any additional information..."
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={toggleNoteInput}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleClockIn}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Clocking in...' : 'Clock In'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleNoteInput}
          className="flex w-full items-center justify-center space-x-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          <FaRegClock className="h-5 w-5" />
          <span>Clock In</span>
        </button>
      )}
    </div>
  );
} 