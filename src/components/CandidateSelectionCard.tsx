import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Star, Briefcase, Clock } from "lucide-react";
import type { CandidateSelection } from "@/hooks/useCandidateSelection";

interface CandidateSelectionCardProps {
  candidate: CandidateSelection;
  onAccept: (candidate: CandidateSelection) => void;
  onReject: (candidate: CandidateSelection) => void;
  onClick: (candidate: CandidateSelection) => void;
  isProcessing?: boolean;
}

export const CandidateSelectionCard: React.FC<CandidateSelectionCardProps> = ({
  candidate,
  onAccept,
  onReject,
  onClick,
  isProcessing = false
}) => {
  const name = candidate["Name "]?.trim() || "Unknown";
  const overallScore = candidate["Overall Score "] || 0;

  // Normalize candidate text fields to ensure proper spacing/formatting when rendered
  const designation = candidate.Designation?.toString().trim() || "Not Mentioned";
  const email = candidate.Email?.toString().trim() || "";
  const mobile = String(candidate["Mobile no"] ?? "").trim();
  const currentOrg = candidate["Current Organization\n"]?.toString().replace(/\s+/g, ' ').trim() || "Not Mentioned";
  const quickRead = candidate["Quick read"]?.toString().trim() || "";

  // Clean and trim technical skills; keep count for the "+n more" badge
  const allSkills = candidate["Technical skill"]
    ? candidate["Technical skill"].toString().split(/[,\.\n;]+/).map(s => s.trim()).filter(Boolean)
    : [];
  // Remove the phrase "Soft Skills" if present in any skill entry (keep the rest)
  const cleanedSkills = allSkills
    .map(s => s.replace(/\bsoft\s*skills\b\s*[:\-–—]*\s*/i, '').trim())
    .filter(Boolean);
  const skills = cleanedSkills.slice(0, 3);
  const extraSkillsCount = Math.max(0, cleanedSkills.length - skills.length);
  const experience = candidate["Years of relevent experience"] || "0";

  return (
    <Card
      className="p-5 hover:shadow-lg transition-all duration-200 bg-card border-border flex flex-col h-full"
    >
      <div className="flex flex-col h-full">
        <div onClick={() => onClick(candidate)} className="space-y-4 cursor-pointer flex-grow overflow-hidden">
          <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">{name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{designation}</p>
          </div>
          <Badge className="bg-info/10 text-info gap-1.5 shrink-0 px-2.5 py-1">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-semibold">{overallScore}</span>
          </Badge>
        </div>

        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{mobile}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1.5 text-muted-foreground">
            <Briefcase className="h-4 w-4 shrink-0" />
            <span  className="truncate">{currentOrg}</span>
          </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{experience} exp</span>
          </div>
        </div>

{skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {skills.map((skill, idx) => (
              <Badge
                key={idx}
                className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200 shadow-sm rounded-full text-xs font-semibold px-3 py-1 transition-colors duration-150 hover:from-blue-200 hover:to-blue-300 hover:text-blue-900"
              >
                {skill}
              </Badge>
            ))}
            {extraSkillsCount > 0 && (
              <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200 shadow-sm rounded-full text-xs font-semibold px-3 py-1 transition-colors duration-150 hover:from-blue-200 hover:to-blue-300 hover:text-blue-900">
                +{extraSkillsCount} more
              </Badge>
            )}
          </div>
        )}


          <p className="text-sm text-muted-foreground line-clamp-2 italic leading-relaxed">
            {quickRead ? `"${quickRead}"` : ''}
          </p>
        </div>

        {/* Footer - buttons anchored at the bottom */}
        <div className="mt-auto pt-2 flex gap-3 items-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAccept(candidate);
            }}
            disabled={isProcessing}
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-medium"
          >
            ✓ Accept
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onReject(candidate);
            }}
            disabled={isProcessing}
            variant="destructive"
            className="flex-1 font-medium"
          >
            ✕ Reject
          </Button>
        </div>
      </div>
    </Card>
  );
};
