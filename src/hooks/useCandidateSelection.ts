import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';

export interface CandidateSelection {
  "Name ": string;
  "Mobile no": number | string;
  Email: string;
  Designation: string;
  Education: string;
  "Years of relevent experience": string;
  "Years of total experience": string;
  "Experience Type": string;
  "Technical Score": number;
  "Experience Score": number;
  "Achievements Score": number;
  "Education Score": number;
  "Overall Score ": number;
  "Current Organization\n": string;
  "Projects & Achievements\n": string;
  "Job Role Candidate": string;
  Summry: string;
  "Quick read": string;
  "Technical skill": string;
}

const SELECTION_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1l7JQiHkOV2y1QMBuK5erGLWbgcSv-CEIsqv3KW_YYd4/gviz/tq?tqx=out:json';

async function fetchCandidateSelection(): Promise<CandidateSelection[]> {
  try {
    const response = await fetch(SELECTION_SHEET_URL);
    const text = await response.text();
    
    // Google Sheets gviz returns JSONP, strip the wrapper
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/s);
    if (!jsonMatch) throw new Error("Failed to parse Google Sheets response");
    
    const data = JSON.parse(jsonMatch[1]);
    const rows = data.table.rows;
    const cols = data.table.cols;
    
    // Map rows to objects
    return rows.map((row: any) => {
      const obj: any = {};
      cols.forEach((col: any, idx: number) => {
        const cellValue = row.c[idx]?.v ?? '';
        obj[col.label || `col${idx}`] = cellValue;
      });
      return obj as CandidateSelection;
    });
  } catch (error) {
    console.error('Error fetching candidate selection:', error);
    throw error;
  }
}

export function useCandidateSelection() {
  return useQuery({
    queryKey: ['candidateSelection'],
    queryFn: fetchCandidateSelection,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
