import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlanLimitModal({ open, onClose, message }) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate("/upgrade");
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-800 border-slate-700">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl text-white">
            Limite do Plano Atingido
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-slate-300 text-base">
            {message || "Você atingiu o limite do plano FREE."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-slate-900/50 p-6 rounded-lg my-4">
          <h3 className="text-white font-semibold mb-3 text-center">
            Upgrade para PRO e tenha:
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Produtos ilimitados
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Usuários ilimitados
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Dashboard completo
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Suporte prioritário
            </li>
          </ul>
          <p className="text-center mt-4 text-xl font-bold text-white">
            Apenas R$ 29,90/mês
          </p>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 text-white border-0">
            Agora Não
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Crown className="w-4 h-4 mr-2" />
            Fazer Upgrade
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
