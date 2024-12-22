import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
  fallbackPath?: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  fallbackPath = '/',
  label = 'Back',
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (router.asPath !== fallbackPath) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };

  return (
    <Button
      onClick={handleBack}
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      color="primary"
    >
      {label}
    </Button>
  );
};

export default BackButton;
