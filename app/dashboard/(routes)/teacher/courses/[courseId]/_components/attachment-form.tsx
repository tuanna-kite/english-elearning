'use client';

import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { File, ImageIcon, Loader2, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Attachment, Course } from '@prisma/client';
import { FileUpload } from '@/components/file-upload';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1).url(),
  name: z.string().optional(),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const toggleEdit = () => setIsEditing(!isEditing);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, data);
      toggleEdit();
      toast.success('Attachment added successfully.');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment deleted successfully.');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='mt-6 bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        <p className='font-semibold'>Attachments</p>
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (initialData.attachments.length > 0 ? (
          <div className='space-y-2'>
            {initialData.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className='flex items-center p-3 w-full bg-sky-100 border-key-200 border text-sky-700 rounded-md'
              >
                <div className='flex items-center gap-x-2'>
                  <File className='h-4 w-4' />
                  <a href={attachment.url} className='text-sm line-clamp-1'>
                    {attachment.name}
                  </a>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className='h-4 w-4 animate-spin' />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className='ml-auto hover:opacity-75 transition'
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center gap-x-4'>
              <ImageIcon className='h-6 w-6' />
              <p className='text-sm italic'>No attachments added</p>
            </div>
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url, name) => {
              if (url) onSubmit({ url, name });
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            Add a link to a file or resource that students can download.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
