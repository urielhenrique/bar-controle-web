import { Check, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PricingCard({
  title,
  price,
  description,
  features,
  isHighlighted,
  onUpgrade,
  buttonText = "Escolher Plano",
  isCurrentPlan = false,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isCurrentPlan) {
      navigate("/");
    } else if (onUpgrade) {
      onUpgrade();
    }
  };

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl ${
        isHighlighted
          ? "border-emerald-500 scale-105"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
            <Crown className="w-4 h-4" />
            RECOMENDADO
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-gray-900">{price}</span>
            {price !== "Grátis" && (
              <span className="text-gray-500 text-lg">/mês</span>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <p className="text-sm font-semibold text-gray-900 mb-4">Incluso:</p>
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isHighlighted ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                <Check
                  className={`w-3.5 h-3.5 ${
                    isHighlighted ? "text-emerald-600" : "text-gray-600"
                  }`}
                />
              </div>
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleClick}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
            isHighlighted
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
              : isCurrentPlan
                ? "bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
