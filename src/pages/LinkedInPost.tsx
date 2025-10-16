import React from 'react';
import NavBar from '@/components/NavBar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const WEBHOOK = 'https://n8n.movya.com/webhook/movya-post';

const LinkedInPost: React.FC = () => {
  const schema = z.object({
    // Position and Skill must start with a letter (no leading numbers or special chars).
    // Allow letters, numbers, spaces and common punctuation after the first letter.
    Position: z.string().trim().min(1, 'Position is required').regex(/^[A-Za-z][A-Za-z0-9\s,\.\-\/&()]*$/, 'Position must start with a letter and may contain letters, numbers and ,.-/&()'),
  // Experience can include numbers, letters and common punctuation (e.g. '3', '3 years', '3+ years', '1.5', '3-5')
  Experience: z.string().trim().min(1, 'Experience is required').regex(/^[A-Za-z0-9\s+\-\.\/()%]+$/, 'Experience may include numbers, letters and symbols like + - . / ( ) %'),
    Skill: z.string().trim().min(1, 'Skill is required').regex(/^[A-Za-z][A-Za-z0-9\s,\.\-]*$/, 'Skill must start with a letter and may contain letters, numbers and ,.-')
  });
  type FormValues = z.infer<typeof schema>;

  const { register, handleSubmit, reset, formState: { errors, isValid, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { Position: '', Experience: '', Skill: '' }
  });

  const handlePost =  handleSubmit(async (values: FormValues) => {
    try {
      const payload = { Position: values.Position, Experience: values.Experience, Skill: values.Skill };
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
  const respPosition = parsed.Position || parsed.position || values.Position;
  const respExperience = parsed.Experience || parsed.experience || values.Experience;
  const respSkill = parsed.Skill || parsed.skill || values.Skill;

  // Do not display the response in the UI; only notify the user
      console.log('Webhook response parsed:', parsed, 'raw:', rawText);
      toast({ title: 'Posted', description: 'Successfully posted on LinkedIn.' });
      // reset form on success
      reset();
    } catch (e: any) {
      toast({ title: 'Failed to post', description: e.message || String(e), variant: 'destructive' });
    } finally {
      // react-hook-form manages isSubmitting
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">LinkedIn Post</h2>
          <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Position</label>
                <Input placeholder="e.g. Frontend Engineer" {...register('Position')} />
                {errors.Position?.message && <div className="text-sm text-destructive mt-1">{String(errors.Position.message)}</div>}
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Experience</label>
                <Input placeholder="e.g. 3 years" {...register('Experience')} />
                {errors.Experience?.message && <div className="text-sm text-destructive mt-1">{String(errors.Experience.message)}</div>}
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Skill</label>
                <Input placeholder="e.g. React, TypeScript" {...register('Skill')} />
                {errors.Skill?.message && <div className="text-sm text-destructive mt-1">{String(errors.Skill.message)}</div>}
              </div>
            <div className="flex justify-end">
              <Button onClick={handlePost} disabled={!isValid || isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post'}
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
