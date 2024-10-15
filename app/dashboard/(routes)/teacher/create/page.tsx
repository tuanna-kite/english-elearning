'use client';

import * as zod from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const formSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required' }),
});

const CreateCoursePage = () => {
  const router = useRouter();
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: zod.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/courses', data);
      router.push(`/dashboard/teacher/courses/${response.data.id}`);
      toast.success('Course created successfully!');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div>
        <h1 className='text-2xl'>Name your course</h1>
        <p className='text-sm text-slate-600'>
          Choose a name that will give students a clear idea of what they will learn.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='title'>Course title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='title'
                      disabled={isSubmitting}
                      placeholder='e.g. Algebra 1'
                    />
                  </FormControl>
                  <FormDescription>What will you teach in this course?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Link href='/dashboard/teacher/courses'>
                <Button variant='ghost'>Cancel</Button>
              </Link>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
