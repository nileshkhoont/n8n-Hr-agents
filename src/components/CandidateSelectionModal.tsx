import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, User, Mail, Phone, Briefcase, GraduationCap, Star, Target, Award, BookOpen } from 'lucide-react';
import type { CandidateSelection } from '@/hooks/useCandidateSelection';

interface CandidateSelectionModalProps {
  candidate: CandidateSelection | null;
  open: boolean;
  onClose: () => void;
  onAccept: (candidate: CandidateSelection) => void;
  onReject: (candidate: CandidateSelection) => void;
  isProcessing?: boolean;
}

export const CandidateSelectionModal: React.FC<CandidateSelectionModalProps> = ({
  candidate,
  open,
  onClose,
  onAccept,
  onReject,
  isProcessing = false
}) => {
  if (!candidate) return null;

  const name = candidate["Name "]?.trim() || "Unknown";
  const technicalScore = candidate["Technical Score"] || 0;
  const experienceScore = candidate["Experience Score"] || 0;
  const achievementsScore = candidate["Achievements Score"] || 0;
  const educationScore = candidate["Education Score"] || 0;
  const overallScore = candidate["Overall Score "] || 0;
  
// Parse technical skills and remove any "Soft Skills" prefix (case-insensitive)
const skills = (candidate["Technical skill"] || '')
  .toString()
  .split(/[,\.\n;]+/)
  .map(s => s.replace(/\bsoft\s*skills\b\s*[:\-–—]*\s*/i, '').trim())
  .filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <User className="h-6 w-6" />
              {name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Professional Info & Contact - Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Professional Info */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Professional Info</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Designation:</span>{' '}
                  <span className="text-foreground font-medium">{candidate.Designation || "Not Mentioned"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Job Role:</span>{' '}
                  <span className="text-foreground font-medium">{candidate["Job Role Candidate"]}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Organization:</span>{' '}
                  <span className="text-foreground font-medium">{candidate["Current Organization\n"]?.trim() || "Not Mentioned"}</span>
                </div>
              </div>
            </Card>

            {/* Contact */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Contact</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>{' '}
                  <span className="text-foreground font-medium">{candidate.Email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mobile:</span>{' '}
                  <span className="text-foreground font-medium">{String(candidate["Mobile no"])}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4 text-center bg-surface">
              <div className="text-muted-foreground text-sm mb-1">Technical Score</div>
              <div className="text-2xl font-bold text-foreground">{technicalScore}</div>
            </Card>
            <Card className="p-4 text-center bg-surface">
              <div className="text-muted-foreground text-sm mb-1">Experience Score</div>
              <div className="text-2xl font-bold text-foreground">{experienceScore}</div>
            </Card>
            <Card className="p-4 text-center bg-surface">
              <div className="text-muted-foreground text-sm mb-1">Achievements Score</div>
              <div className="text-2xl font-bold text-foreground">{achievementsScore}</div>
            </Card>
            <Card className="p-4 text-center bg-surface">
              <div className="text-muted-foreground text-sm mb-1">Education Score</div>
              <div className="text-2xl font-bold text-foreground">{educationScore}</div>
            </Card>
          </div>

          {/* Overall Score */}
          <Card className="p-4 bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold text-lg">OverAll Scoring</span>
              </div>
              <div className="text-3xl font-bold">{overallScore}/10</div>
            </div>
          </Card>

          {/* Experience & Education */}
          <Card className="p-4 bg-surface">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Experience</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-success/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-semibold text-foreground mb-1">
                  {candidate["Years of relevent experience"] || "0"} 
                </div>
                <div className="text-sm text-muted-foreground">Relevant Experience</div>
              </div>
              <div className="bg-success/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-semibold text-foreground mb-1">
                  {candidate["Years of total experience"] || "0"} 
                </div>
                <div className="text-sm text-muted-foreground">Total Experience</div>
              </div>
              <div className="bg-success/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-semibold text-foreground mb-1">
                  {candidate["Experience Type"] || "Fresher"}
                </div>
                <div className="text-sm text-muted-foreground">Experience Type</div>
              </div>
            </div>
          </Card>

          {/* Education */}
          {candidate.Education && (
            <Card className="p-4 bg-surface">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Education</h3>
              </div>
              <div className="space-y-1">
                {candidate.Education.split(/\n|,|;/).map((edu, idx) => {
                  const parts = edu.split(/\|/).map(s => s.trim()).filter(Boolean);
                  return (
                    <div key={idx} className="pl-1">
                      {parts.length > 0 && (
                        <span className="font-medium text-foreground">{parts[0]}</span>
                      )}
                      {parts.length > 1 && (
                        <span className="text-muted-foreground"> — {parts.slice(1).join(' | ')}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Tech Skills */}
          <Card className="p-4 bg-surface">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Technical Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="rounded-lg bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors px-3 py-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>


          {/* Projects & Achievements */}
          {candidate["Projects & Achievements\n"] && (
            <Card className="p-4 bg-surface">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Projects & Achievements</h3>
              </div>
              <p className="text-sm text-muted-foreground">{candidate["Projects & Achievements\n"]}</p>
            </Card>
          )}

          {/* Summary */}
          {candidate.Summry && (
            <Card className="p-4 bg-surface">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground">{candidate.Summry}</p>
            </Card>
          )}

          {/* Quick Read */}
          {candidate["Quick read"] && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Quick Read</h3>
              </div>
              <p className="text-sm text-muted-foreground italic">"{candidate["Quick read"]}"</p>
            </Card>
          )}
  

          
        </div>
      </DialogContent>
    </Dialog>
  );
};
