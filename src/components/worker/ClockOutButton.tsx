import { useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import { getCurrentPosition } from '@/lib/geolocation';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface ClockOutButtonProps {
  onClockOutSuccess: () => void;
  clockInTime: Date;
}

export default function ClockOutButton({ 
  onClockOutSuccess,
  clockInTime
}: ClockOutButtonProps) {
  const { getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');

  // Calculate time since clock in
  const getElapsedTime = () => {
    const now = new Date();
    const clockIn = new Date(clockInTime);
    const diffMs = now.getTime() - clockIn.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  const handleClockOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current position
      const position = await getCurrentPosition();
      
      // Call clock-out API
      const response = await axios.post('/api/clockout', {
        latitude: position.latitude,
        longitude: position.longitude,
        note: note || undefined
      });
      
      setIsLoading(false);
      setShowNoteInput(false);
      setNote('');
      onClockOutSuccess();

    } catch (error: any) {
      setIsLoading(false);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.message) {
        setError(error.message);
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
      <h3 className="mb-2 text-xl font-semibold text-gray-800">
        You are currently clocked in
      </h3>
      <p className="mb-4 text-sm text-gray-600">
        Time since clock in: <span className="font-medium">{getElapsedTime()}</span>
      </p>
      
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
              onClick={handleClockOut}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm Clock Out'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleNoteInput}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          <FaRegClock className="h-5 w-5" />
          <span>Clock Out Now</span>
        </button>
      )}
    </div>
  );
} 