import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Candidate } from '@/components/CandidateDropdown';

interface UseCandidateDataReturn {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1ADVbUldwgn6fFEBq0cXEMdPnZRNYc4XpfFMro-FpCPA/export?format=csv';

export const useCandidateData = (): UseCandidateDataReturn => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(CSV_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          // Clean up header names
          return header.trim();
        },
        transform: (value: string) => {
          // Clean up cell values
          return value.trim();
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }

          // Filter out completely empty rows
          const validCandidates = results.data.filter((row: any) => {
            return Object.values(row).some(value =>
              value && typeof value === 'string' && value.trim() !== ''
            );
          });

          // Sort so that Pending candidates show first, then Completed
          // A candidate is considered 'Completed' if any of these interview-related
          // fields are present: 'Interview Status', 'Interview Scheduled', 'Interview Date'
          const isCompleted = (row: any) => {
            const v = (row['Interview Status'] || row['Interview Scheduled'] || row['Interview Date']);
            return !!(v && typeof v === 'string' && v.trim() !== '');
          };

          const sorted = validCandidates.sort((a: any, b: any) => {
            const aCompleted = isCompleted(a);
            const bCompleted = isCompleted(b);
            if (aCompleted === bCompleted) return 0;
            // pending (not completed) should come first
            return aCompleted ? 1 : -1;
          });

          setCandidates(sorted as Candidate[]);
          setLoading(false);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          setError('Failed to parse CSV data');
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    candidates,
    loading,
    error,
    refetch: fetchData
  };
};
