'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

export default function LocationSettingsPage() {
  const [isGoogleApiEnabled, setIsGoogleApiEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyDVYLNEnxK7cGrPY69Dnt9nupLE5UkmQTo');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/locations/settings/google-api')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then(data => {
        setIsGoogleApiEnabled(data.enabled);
        setApiKey(data.apiKey || apiKey);
        setError(null);
      })
      .catch(error => {
        console.error('Settings error:', error);
        setError('Failed to load settings');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleApiToggle = async (enabled: boolean) => {
    try {
      setError(null);
      const response = await fetch('/api/locations/settings/google-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled, apiKey }),
      });

      if (!response.ok) throw new Error('Failed to update setting');
      
      setIsGoogleApiEnabled(enabled);
    } catch (error) {
      console.error('Failed to update API settings:', error);
      setError('Failed to update settings');
      setIsGoogleApiEnabled(!enabled);
    }
  };

  const handleApiKeyChange = async (newApiKey: string) => {
    setApiKey(newApiKey);
    try {
      const response = await fetch('/api/locations/settings/google-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: isGoogleApiEnabled, apiKey: newApiKey }),
      });

      if (!response.ok) throw new Error('Failed to update API key');
    } catch (error) {
      console.error('Failed to update API key:', error);
      setError('Failed to update API key');
    }
  };

  if (isLoading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Location Settings</h2>
      </div>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white">Google Maps API</h3>
              <p className="text-sm text-gray-400">Enable or disable Google Maps API for location search</p>
            </div>
            <Switch
              checked={isGoogleApiEnabled}
              onCheckedChange={handleApiToggle}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">API Key</label>
            <Input
              type="text"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Enter Google Maps API Key"
            />
          </div>
        </div>
      </div>
    </div>
  );
}