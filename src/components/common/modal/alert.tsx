import { Dispatch, ReactNode, SetStateAction } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface AlertModalProps {
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  title?: ReactNode;
  description?: ReactNode;
  button?: ReactNode;
}

function AlertModal({ open, onOpenChange, title, description, button }: AlertModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-none w-max">
        <AlertDialogHeader>
          <AlertDialogTitle asChild>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>{button}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertModal;
