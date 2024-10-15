'use client';
import { useState } from 'react';
import axios from 'axios';
import MuxPlayer from '@mux/mux-player-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConfettiStore } from '@/hooks/use-confetti-store';

interface VideoPlayerProps {
  playbackId: string;
  chapterId: string;
  nextChapterId?: string;
  courseId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

const VideoPlayer = ({
  playbackId,
  chapterId,
  nextChapterId,
  courseId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapterId) {
          confetti.onOpen();
        }

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
        toast.success("Chapter's progress updated.");
        router.refresh();
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className='relative aspect-video'>
      {!isReady && !isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800'>
          <Loader2 className='h-8 w-8 animate-spin text-secondary' />
        </div>
      )}
      {isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'>
          <Lock className='h-8 w-8' />
          <p className='text-sm'>
            Unlock this chapter by purchasing the course.
          </p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          autoPlay
          playbackId={playbackId}
          title={title}
          className={cn('aspect-video', !isReady && 'hidden')}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
