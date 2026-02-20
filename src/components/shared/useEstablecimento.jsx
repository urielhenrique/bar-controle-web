import { useState, useEffect } from "react";
import authService from "@/services/auth.service";
import estabelecimentoService from "@/services/estabelecimento.service";

export function useEstabelecimento() {
  const [user, setUser] = useState(null);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const me = await authService.getCurrentUser();
        setUser(me);

        if (me.estabelecimentoId) {
          const est = await estabelecimentoService.getById(
            me.estabelecimentoId,
          );
          setEstabelecimento(est);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        // Usuário não autenticado
        setUser(null);
        setEstabelecimento(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const setupEstabelecimento = async (nome) => {
    try {
      const est = await estabelecimentoService.create({ nome });
      const updatedUser = await authService.updateUser({
        estabelecimentoId: est.id,
        estabelecimentoNome: nome,
      });
      setEstabelecimento(est);
      setUser(updatedUser);
      return est;
    } catch (error) {
      console.error("Erro ao criar estabelecimento:", error);
      throw error;
    }
  };

  return { user, estabelecimento, loading, setupEstabelecimento };
}
