import { useCallback, useEffect, useState } from 'react';

export function useAlunoResource(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await loader();
      setData(result);
      return result;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Nao foi possivel carregar os dados.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch().catch(() => {});
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}

export function useAlunoAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(async (action) => {
    setLoading(true);
    setError('');
    try {
      return await action();
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Nao foi possivel concluir a acao.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error };
}
