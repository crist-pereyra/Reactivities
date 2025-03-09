import { Button } from '@/components/ui/button';
import activityApi from '@/lib/api/activity.api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export const TestErrors = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { mutate } = useMutation({
    mutationFn: async ({
      path,
      method = 'get',
    }: {
      path: string;
      method: string;
    }) => {
      if (method === 'post') await activityApi.post(path, {});
      else await activityApi.get(path);
    },
    onError: (err) => {
      if (Array.isArray(err)) {
        setValidationErrors(err);
      } else {
        setValidationErrors([]);
      }
    },
  });

  const handleError = (path: string, method = 'get') => {
    mutate({ path, method });
  };
  return (
    <section className='mt-20'>
      <h2 className='text-2xl font-bold'>Test errors component</h2>

      <div className='flex flex-wrap gap-2 mt-4'>
        <Button
          variant='default'
          onClick={() => handleError('buggy/not-found')}
        >
          Not found
        </Button>
        <Button
          variant='default'
          onClick={() => handleError('buggy/bad-request')}
        >
          Bad request
        </Button>
        <Button
          variant='default'
          onClick={() => handleError('activities', 'post')}
        >
          Validation error
        </Button>
        <Button
          variant='default'
          onClick={() => handleError('buggy/server-error')}
        >
          Server error
        </Button>
        <Button
          variant='default'
          onClick={() => handleError('buggy/unauthorised')}
        >
          Unauthorized
        </Button>
      </div>

      {validationErrors.length > 0 && (
        <div className='mt-4 p-4 border border-destructive rounded-md bg-destructive/10'>
          <h3 className='text-lg font-semibold text-destructive'>
            Validation Errors
          </h3>
          <ul className='list-disc pl-5 mt-2'>
            {validationErrors.map((error, i) => (
              <li key={i} className='text-destructive'>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
