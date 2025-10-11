import React, { useState, useEffect } from 'react';
import { CandidateDropdown, Candidate } from '@/components/CandidateDropdown';
import { CandidateDetails } from '@/components/CandidateDetails';
import { useCandidateData } from '@/hooks/useCandidateData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Users, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';

const Index = () => {
  const { candidates, loading, error, refetch } = useCandidateData();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Auto-select a candidate when the list loads.
  // Auto-select a candidate when the list loads.
  // Prefer a "completed" candidate (has interview-related fields). If none,
  // prefer any candidate with extra data, else fall back to the first candidate.
  useEffect(() => {
    if (!selectedCandidate && !loading && candidates.length > 0) {
      const isCompleted = (c: any) => {
        const v = (c['Interview Status'] || c['Interview Scheduled'] || c['Interview Date']);
        return !!(v && typeof v === 'string' && v.trim() !== '');
      };

      const completedCandidate = candidates.find(isCompleted);
      if (completedCandidate) {
        setSelectedCandidate(completedCandidate);
        return;
      }

      const candidateWithData = candidates.find(c =>
        Object.entries(c).some(([key, value]) => {
          if (!value) return false;
          const k = (key || '').trim();
          if (k === 'Name' || k === 'Email') return false;
          return value.toString().trim() !== '';
        })
      );
      setSelectedCandidate(candidateWithData || candidates[0]);
    }
  }, [candidates, loading, selectedCandidate]);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Candidate data has been reloaded from the source.",
    });
  };


  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="p-8 bg-surface border-card-border shadow-sm max-w-md">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-lg font-medium text-foreground mb-2">Failed to Load Data</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Candidate Dashboard
              </h1>
              <p className="text-muted-foreground">
                Search and view candidate information from the live database
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{candidates.length} candidates</span>
              </div>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                className="gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <Card className="p-6 bg-surface border-card-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">
                Select Candidate
              </h2>
            </div>
            <CandidateDropdown
              candidates={candidates}
              selectedCandidate={selectedCandidate}
              onSelectCandidate={setSelectedCandidate}
            />
          </Card>
        </div>

        {/* Details Section */}
        <div className="mb-8">
          <CandidateDetails candidate={selectedCandidate} />
        </div>
      </div>
    </div>
  );
};

export default Index;

