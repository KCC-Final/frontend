import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick?: () => void;
}

function BackButton({ onClick }: BackButtonProps) {
  return (
    <div>
      <button onClick={onClick}>
        <ArrowLeft color="#333333" />
      </button>
    </div>
  );
}

export default BackButton;
