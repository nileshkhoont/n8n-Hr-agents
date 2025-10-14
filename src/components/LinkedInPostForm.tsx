import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ACTION_WEBHOOK = 'https://n8n.movya.com/webhook/movya-post';

export const LinkedInPostForm: React.FC = () => {
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [skill, setSkill] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!position.trim() || !experience.trim() || !skill.trim()) {
      toast({ title: 'Missing fields', description: 'Please fill Position, Experience and Skill', variant: 'destructive' });
      return;
    }
    setPosting(true);
    try {
      const payload = {
        Type: 'LinkedInPost',
        Position: position,
        Experience: experience,
        Skill: skill
      };
      const res = await fetch(ACTION_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Webhook failed');
      let json: any = {};
      try { json = await res.json(); } catch (_) { json = {}; }

      const returnedPosition = json.Position || json.position || position;
      const returnedExperience = json.Experience || json.experience || experience;
      const returnedSkill = json.Skill || json.skill || skill;

      setPosition(returnedPosition);
      setExperience(returnedExperience);
      setSkill(returnedSkill);

      toast({ title: 'Posted', description: 'LinkedIn post processed by webhook' });
    } catch (e: any) {
      toast({ title: 'Post failed', description: e.message || String(e), variant: 'destructive' });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm text-muted-foreground mb-1">Position</label>
        <Input value={position} onChange={e => setPosition(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1">Experience</label>
        <Input value={experience} onChange={e => setExperience(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1">Skill</label>
        <Input value={skill} onChange={e => setSkill(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <Button onClick={handlePost} disabled={posting} className="gap-2">
          {posting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  );
};

export default LinkedInPostForm;
