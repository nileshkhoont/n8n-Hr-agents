import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ACTION_WEBHOOK = 'https://n8n.movya.com/webhook-test/movya-post';

export const LinkedInPostForm: React.FC = () => {
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [skill, setSkill] = useState('');
  const [posting, setPosting] = useState(false);

  const [errors, setErrors] = useState<{ position?: string; experience?: string; skill?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!position.trim()) newErrors.position = 'Position is required';
    if (!experience.trim()) newErrors.experience = 'Experience is required';
    if (!skill.trim()) newErrors.skill = 'Skill is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePost = async () => {
    if (!validate()) {
      toast({ title: 'Validation Error', description: 'Please fill all required fields', variant: 'destructive' });
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
      try {
        json = await res.json();
      } catch (_) {
        json = {};
      }

      setPosition(json.Position || json.position || position);
      setExperience(json.Experience || json.experience || experience);
      setSkill(json.Skill || json.skill || skill);

      toast({ title: 'Posted', description: 'LinkedIn post processed by webhook' });
      setErrors({});
    } catch (e: any) {
      toast({ title: 'Post failed', description: e.message || String(e), variant: 'destructive' });
    } finally {
      setPosting(false);
    }
  };

  const allFieldsFilled = position.trim() && experience.trim() && skill.trim();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Position <span className="text-red-500">*</span>
        </label>
        <Input
          value={position}
          onChange={e => setPosition(e.target.value)}
          className={errors.position ? 'border-red-500' : ''}
          required
        />
        {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Experience <span className="text-red-500">*</span>
        </label>
        <Input
          value={experience}
          onChange={e => setExperience(e.target.value)}
          className={errors.experience ? 'border-red-500' : ''}
          required
        />
        {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Skill <span className="text-red-500">*</span>
        </label>
        <Input
          value={skill}
          onChange={e => setSkill(e.target.value)}
          className={errors.skill ? 'border-red-500' : ''}
          required
        />
        {errors.skill && <p className="text-red-500 text-xs mt-1">{errors.skill}</p>}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handlePost}
          disabled={posting || !allFieldsFilled}
          className="gap-2"
        >
          {posting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  );
};

export default LinkedInPostForm;
