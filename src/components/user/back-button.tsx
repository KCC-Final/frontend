import { ArrowLeft } from 'lucide-react';

interface LoginBackButtonProps {
  onClick?: () => void;
}

function LoginBackButton({ onClick }: LoginBackButtonProps) {
  return (
    <div>
      <button onClick={onClick}>
        <ArrowLeft color="#333333" />
      </button>
    </div>
  );
}

export default LoginBackButton;
