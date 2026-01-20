import { useQuery } from '@tanstack/react-query';
import { totalAnimalsPerStage } from '../../../services';

export const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['animals', 'total-per-stage'],
    queryFn: totalAnimalsPerStage,
  });

  if (isLoading) return <p>Carregando...</p>;

  if (isError || !data) return <p>Erro ao carregar dados</p>;

  return (
    <>
      <h1>Dashboard</h1>

      <p>Total em quarentena: {data.quarantine.total}</p>
      <p>Total em abrigo: {data.sheltered.total}</p>
      <p>Total adotados: {data.adopted.total}</p>
    </>
  );
};
