'use client'; 

import { FC } from 'react';
import { useRouter } from 'next/navigation';

const RevalidateButton: FC = () => {
  const router = useRouter();

  const handleRevalidate = async () => {
    
    router.refresh();
    console.log('Página atualizada.');
  };

  return (
    <button onClick={handleRevalidate} className="btn btn-primary">
      Atualizar
    </button>
  );
};

export default RevalidateButton;