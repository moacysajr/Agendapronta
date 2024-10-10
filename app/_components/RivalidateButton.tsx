'use client';

import { useState } from 'react';
import { Button } from '@/app/_components/ui/button';
import { toast } from 'sonner';

const RevalidateButton = () => {
  const [loading, setLoading] = useState(false);

  const handleRevalidate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/revalidate/bookings', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Falha aoatualizar');
      }
      toast.success('Atualizado com sucesso.');
      window.location.reload(); // Força a atualização da página
    } catch (error) {
      console.error('Erro ao Atualizar:', error);
      toast.error('Erro ao Atualizar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleRevalidate} disabled={loading}>
      {loading ? 'Atualizando...' : 'Atualizar'}
    </Button>
  );
};

export default RevalidateButton;
