'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProgressPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/progress');
      const data = await response.json();
      setGoals(data.goals || []);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='p-8'>Loading...</div>;
  }

  return (
    <div className='p-8'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Progress Tracking</h1>
        <Button>Add Goal</Button>
      </div>

      <div className='grid gap-4'>
        {goals.length === 0 ? (
          <Card>
            <div className='p-8 text-center text-gray-500'>
              No progress goals yet. Add your first goal to get started.
            </div>
          </Card>
        ) : (
          goals.map(goal => (
            <Card key={goal.id}>
              <div className='p-4'>
                <h3 className='font-semibold'>{goal.title}</h3>
                <p className='text-sm text-gray-600'>{goal.description}</p>
                <div className='mt-2'>
                  <span className='text-sm'>
                    Progress: {goal.current_value || 0} /{' '}
                    {goal.target_value || 0}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
