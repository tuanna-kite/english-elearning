'use client';
import ConfirmModal from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useConfettiStore } from '@/hooks/use-confetti-store';

interface CourseActionsProps {
  disabled?: boolean;
  courseId: string;
  isPublished: boolean;
}

const CourseActions = ({ disabled = true, courseId, isPublished }: CourseActionsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const confetti = useConfettiStore();

  const onPublish = async () => {
    try {
      setLoading(true);
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success('Course unpublished successfully');
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success('Course published successfully');
        confetti.onOpen();
      }
      router.refresh();
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
      await axios.delete(`/api/courses/${courseId}`);
      toast.success('Course deleted successfully');
      router.push(`/dashboard/teacher/courses`);
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

export default CourseActions;
