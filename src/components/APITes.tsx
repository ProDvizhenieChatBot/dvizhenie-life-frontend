// components/APITest.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const APITest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing API endpoints...');

    try {
      const credentials = { username: 'admin', password: 'Bhdsoxo2354jsdjJKCJnd28' };
      const token = btoa(`${credentials.username}:${credentials.password}`);

      // Тестируем разные endpoints
      const endpoints = [
        '/admin/applications/?limit=1',
        '/admin/applications/',
        '/applications',
        '/forms/schema/active',
        '/health',
      ];

      let results = 'API Test Results:\n\n';

      for (const endpoint of endpoints) {
        const url = `https://api.dvizhenie.ikemurami.com/api/v1${endpoint}`;
        results += `Testing: ${url}\n`;

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${token}`,
            },
          });

          results += `Status: ${response.status} ${response.statusText}\n`;
          results += `OK: ${response.ok}\n`;

          if (response.ok) {
            try {
              const data = await response.json();
              results += `Success: Received ${typeof data === 'object' ? 'object with keys: ' + Object.keys(data).join(', ') : 'data'}\n`;
            } catch {
              results += `Success: Response is not JSON\n`;
            }
          } else {
            try {
              const errorData = await response.json();
              results += `Error: ${JSON.stringify(errorData)}\n`;
            } catch {
              const errorText = await response.text();
              results += `Error Text: ${errorText.substring(0, 100)}...\n`;
            }
          }
        } catch (error) {
          results += `Network Error: ${error}\n`;
        }
        results += '─'.repeat(50) + '\n';
      }

      setResult(results);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testAPI} disabled={loading}>
          {loading ? 'Testing...' : 'Test All Endpoints'}
        </Button>

        <div className="p-4 bg-gray-100 rounded-md">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default APITest;
