import React, { useState } from "react";
import { X, Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import produtoService from "@/services/produto.service";

const CATEGORIAS_VALIDAS = [
  "Cerveja",
  "Refrigerante",
  "Destilado",
  "Vinho",
  "Agua",
  "Suco",
  "Energetico",
  "Outros",
];

/**
 * Gera e faz download do template CSV
 */
const downloadTemplate = () => {
  const headers = [
    "nome",
    "categoria",
    "volume",
    "estoqueAtual",
    "estoqueMinimo",
    "precoCompra",
    "precoVenda",
  ];

  const exemplo = [
    "Cerveja Heineken 600ml",
    "Cerveja",
    "600ml",
    "100",
    "5",
    "4.50",
    "8.90",
  ];

  const csv =
    headers.join(",") +
    "\n" +
    exemplo.join(",") +
    "\n" +
    "Refrigerante Coca-Cola 2L,Refrigerante,2L,50,10,6.00,12.00";

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "template_produtos.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Parseia CSV para array de objetos
 */
const parseCSV = (text) => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("Arquivo CSV vazio ou inválido");
  }

  const headers = lines[0].split(",").map((h) => h.trim());

  // Validar headers obrigatórios
  const requiredHeaders = ["nome", "categoria"];
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(
      `Colunas obrigatórias ausentes: ${missingHeaders.join(", ")}`,
    );
  }

  const produtos = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length !== headers.length) {
      console.warn(`Linha ${i + 1} ignorada: número de colunas incorreto`);
      continue;
    }

    const produto = {};
    headers.forEach((header, index) => {
      produto[header] = values[index];
    });

    // Validar categoria
    if (!CATEGORIAS_VALIDAS.includes(produto.categoria)) {
      throw new Error(
        `Linha ${i + 1}: Categoria inválida "${produto.categoria}". ` +
          `Categorias válidas: ${CATEGORIAS_VALIDAS.join(", ")}`,
      );
    }

    // Converter campos numéricos
    produto.estoqueAtual = parseInt(produto.estoqueAtual) || 0;
    produto.estoqueMinimo = parseInt(produto.estoqueMinimo) || 5;
    produto.precoCompra =
      parseFloat(produto.precoCompra?.replace(",", ".")) || 0;
    produto.precoVenda = parseFloat(produto.precoVenda?.replace(",", ".")) || 0;

    produtos.push(produto);
  }

  return produtos;
};

export default function ImportProdutosModal({ open, onClose, onSuccess }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Por favor, selecione um arquivo CSV");
      return;
    }

    setError("");
    setResultado(null);

    // Ler e parsear arquivo
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const produtosParsed = parseCSV(text);
        setProdutos(produtosParsed);
        setError("");
      } catch (err) {
        setError(err.message);
        setProdutos([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (produtos.length === 0) {
      setError("Nenhum produto para importar");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await produtoService.importarLote(produtos);
      setResultado(response);

      if (response.sucessos > 0) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 3000);
      }
    } catch (err) {
      setError(err.message || "Erro ao importar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProdutos([]);
    setError("");
    setResultado(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Importar Produtos em Lote
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Importe múltiplos produtos de uma vez usando um arquivo CSV
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Botão Download Template */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">
                  1. Baixe o template
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Baixe nosso modelo CSV com as colunas corretas e exemplos de
                  preenchimento
                </p>
                <Button
                  onClick={downloadTemplate}
                  variant="outline"
                  size="sm"
                  className="bg-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Template CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-900 mb-1">
                  2. Preencha e envie
                </h3>
                <p className="text-sm text-emerald-700 mb-3">
                  Preencha o template com seus produtos e faça o upload aqui
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          {produtos.length > 0 && !resultado && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                {produtos.length} produto(s) pronto(s) para importar
              </h3>
              <div className="max-h-40 overflow-y-auto">
                <ul className="text-sm text-gray-600 space-y-1">
                  {produtos.slice(0, 5).map((p, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {p.nome} - {p.categoria}
                    </li>
                  ))}
                  {produtos.length > 5 && (
                    <li className="text-gray-400">
                      ... e mais {produtos.length - 5} produtos
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  {error.includes("limite") || error.includes("Limite")
                    ? "Limite do Plano Atingido"
                    : "Erro"}
                </h3>
                <p className="text-sm text-red-700 whitespace-pre-line">
                  {error}
                </p>
                {(error.includes("PRO") || error.includes("upgrade")) && (
                  <a
                    href="/plano"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    <span>✨</span>
                    Fazer Upgrade para PRO
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Resultado */}
          {resultado && (
            <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-emerald-900 mb-1">
                    Importação Concluída!
                  </h3>
                  <p className="text-sm text-emerald-700">
                    {resultado.sucessos} de {resultado.total} produtos
                    importados com sucesso
                  </p>
                  {resultado.erros > 0 && (
                    <div className="mt-3 p-3 bg-white rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {resultado.erros} erro(s):
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                        {resultado.detalhes.erros.map((e, i) => (
                          <li key={i}>
                            Linha {e.linha}: {e.erro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button onClick={handleClose} variant="outline">
              {resultado ? "Fechar" : "Cancelar"}
            </Button>
            {!resultado && (
              <Button
                onClick={handleImport}
                disabled={produtos.length === 0 || loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar {produtos.length} produto(s)
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
