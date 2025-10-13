import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const WEBHOOK = 'https://n8n.movya.com/webhook-test/movya-post';

const LinkedInPost: React.FC = () => {
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
  setLoading(true);
    try {
      const payload = { Position: position, Experience: experience, Skill: skill };
      const res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Webhook call failed');
      // Try to parse JSON, but accept text fallback
      let parsed: any = {};
      let rawText = '';
      try {
        // Some webhooks may return non-JSON; read text first
        rawText = await res.text();
        try {
          parsed = rawText ? JSON.parse(rawText) : {};
        } catch (e) {
          // not JSON
          parsed = {};
        }
      } catch (e) {
        console.error('Failed to read webhook response body', e);
      }

      console.log('Webhook response parsed:', parsed, 'raw:', rawText);

      // Expecting Position, Experience, Skill in response; fall back to submitted values
      const respPosition = parsed.Position || parsed.position || position;
      const respExperience = parsed.Experience || parsed.experience || experience;
      const respSkill = parsed.Skill || parsed.skill || skill;

  // Do not display the response in the UI; only notify the user
  console.log('Webhook response parsed:', parsed, 'raw:', rawText);
  toast({ title: 'Posted', description: 'Sucessfully post on LinkedIn  .' });
  // Clear inputs after successful post
  setPosition('');
  setExperience('');
  setSkill('');
    } catch (e: any) {
      toast({ title: 'Failed to post', description: e.message || String(e), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">LinkedIn Post</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Position</label>
              <Input value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. Frontend Engineer" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Experience</label>
              <Input value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 3 years" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Skill</label>
              <Input value={skill} onChange={e => setSkill(e.target.value)} placeholder="e.g. React, TypeScript" />
            </div>
            <div className="flex justify-end">
              <Button onClick={handlePost} disabled={loading}>
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>

          {/* Response not shown in UI by design; webhook call occurs on Post and user receives a toast */}
        </Card>
      </main>
    </div>
  );
};

export default LinkedInPost;
