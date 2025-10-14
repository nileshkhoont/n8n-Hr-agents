import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ACTION_WEBHOOK = 'https://n8n.movya.com/webhook/d6804eae-5fac-4c53-a274-75b9db15d0eb';

export const LinkedInPostForm: React.FC = () => {
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [skill, setSkill] = useState('');
  const [posting, setPosting] = useState(false);

  const [errors, setErrors] = useState<{ position?: string; experience?: string; skill?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!position.trim()) newErrors.position = 'Position is required';
    else if (position.length < 2) newErrors.position = 'Position must be at least 2 characters';

    if (!experience.trim()) newErrors.experience = 'Experience is required';
    else if (!/^\d+(\.\d+)?$/.test(experience)) newErrors.experience = 'Experience must be a number';

    if (!skill.trim()) newErrors.skill = 'Skill is required';
    else if (skill.length < 2) newErrors.skill = 'Skill must be at least 2 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePost = async () => {
    if (!validate()) {
      toast({ title: 'Validation Error', description: 'Please fix the errors in the form', variant: 'destructive' });
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

      setPosition(json.Position || json.position || position);
      setExperience(json.Experience || json.experience || experience);
      setSkill(json.Skill || json.skill || skill);

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
        {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Experience (years)</label>
        <Input value={experience} onChange={e => setExperience(e.target.value)} />
        {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Skill</label>
        <Input value={skill} onChange={e => setSkill(e.target.value)} />
        {errors.skill && <p className="text-red-500 text-xs mt-1">{errors.skill}</p>}
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
