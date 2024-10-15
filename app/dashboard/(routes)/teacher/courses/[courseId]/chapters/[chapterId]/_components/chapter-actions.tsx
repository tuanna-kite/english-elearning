'use client';
import ConfirmModal from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ChapterActionsProps {
  disabled?: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterActions = ({
  disabled = true,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onPublish = async () => {
    try {
      setLoading(true);
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
        toast.success('Chapter unpublished successfully');
      } else {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
        toast.success('Chapter published successfully');
      }
      router.refresh();
      router.push(`/dashboard/teacher/courses/${courseId}`);
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success('Chapter deleted successfully');
      router.refresh();
      router.push(`/dashboard/teacher/courses/${courseId}`);
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button onClick={onPublish} disabled={disabled || loading}>
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button variant='destructive' disabled={loading}>
          <TrashIcon />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
