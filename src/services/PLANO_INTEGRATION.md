# Integração do Sistema de Planos (Free vs Pro)

## Estrutura Criada

### 1. Serviço: `plano.service.ts`

Gerencia a comunicação com o backend para obter o status do plano.

**Interface `PlanoStatus`:**

```typescript
{
  plano: "FREE" | "PRO",
  limites: {
    produtos: number | null,
    usuarios: number | null,
    movimentacoesMes: number | null
  },
  uso: {
    produtos: number,
    usuarios: number,
    movimentacoesMes: number
  }
}
```

**Métodos:**

- `getStatus()`: Retorna `Promise<PlanoStatus>`

### 2. Hook: `usePlano.ts`

Custom hook que encapsula a lógica de gerenciamento do status do plano.

**Retorna:**

```typescript
{
  plano: "FREE" | "PRO" | null,
  limites: Limites | null,
  uso: Uso | null,
  percentuais: Percentuais | null,
  isLoading: boolean,
  isFree: boolean,
  isPro: boolean,
  error: Error | null
}
```

**Recursos:**

- Calcula percentuais de uso de forma segura
- Suporta limites `null` (ilimitado)
- Flags `isFree` e `isPro` para controle fácil

### 3. Componente: `PlanoStatusCard.tsx`

Componente React que exibe o status do plano com barras de progresso.

**Recursos:**

- ✅ Exibe plano atual (FREE/PRO)
- ✅ Mostra uso vs limite para:
  - Produtos
  - Usuários
  - Movimentações do Mês
- ✅ Barras de progresso com cores dinâmicas:
  - Verde (0-79%): `bg-emerald-500`
  - Amarelo (80-99%): `bg-yellow-500` com ícone ⚠️
  - Vermelho (100%+): `bg-red-500` com ícone ❌
- ✅ Botão "Fazer Upgrade para PRO" (visível apenas no plano FREE)
- ✅ Estados de loading e erro
- ✅ Design responsivo e consistente com Tailwind CSS

### 4. Integração no Dashboard

Added to `Dashboard.jsx`:

- Import do componente `PlanoStatusCard`
- Renderização abaixo dos alertas de reposição

## Como Usar

### Usar o Hook em um Componente

```tsx
import { usePlano } from "@/hooks/usePlano";

function MeuComponente() {
  const { plano, limites, uso, percentuais, isLoading, isFree, isPro, error } =
    usePlano();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar</div>;

  return (
    <div>
      <p>Você está no plano: {plano}</p>
      {isFree && <p>Faça upgrade para PRO!</p>}
    </div>
  );
}
```

### Usar o Componente

```tsx
import PlanoStatusCard from "@/components/plano/PlanoStatusCard";

export default function MinhaPage() {
  return (
    <div>
      <PlanoStatusCard />
    </div>
  );
}
```

## Fluxo de Dados

```
Backend (/plano/status)
    ↓
PlanoService.getStatus()
    ↓
usePlano Hook
  ├─ Fetch status
  ├─ Calcula percentuais
  └─ Retorna dados + flags
    ↓
PlanoStatusCard (ou outro componente)
  └─ Renderiza UI com cores e avisos dinâmicos
```

## Tratamento de Limites Nulos

Quando `limites.X` é `null`, significa **ilimitado**:

- Percentual é calculado como 0% (green)
- Label exibe "Ilimitado"
- Sem avisos de limite

Exemplo de cálculo:

```typescript
const calcPercentual = (usado: number, limite: number | null): number => {
  if (!limite || limite <= 0) return 0;
  return Math.min((usado / limite) * 100, 100);
};
```

## Cores e Estados

| Estado  | Cor     | Ícone | Intervalo |
| ------- | ------- | ----- | --------- |
| OK      | Emerald | ✓     | 0-79%     |
| Aviso   | Yellow  | ⚠️    | 80-99%    |
| Crítico | Red     | ❌    | 100%+     |

## Próximos Passos

1. **Implementar lógica de redirect no botão "Upgrade"**
   - Adicionar handler para redirecionar a página de upgrade
   - Ou abrir modal de upgrade

2. **Verificações de limite em criação**
   - Validar se usuário pode criar novo produto/usuário
   - Hook adicional: `useCanCreate(entityType)`

3. **Notificações**
   - Mostrar toast quando limite está próximo de ser atingido
   - Sincronização em tempo real com WebSocket (opcional)

4. **Testes**
   - Testes unitários do hook `usePlano`
   - Testes de renderização do `PlanoStatusCard`
