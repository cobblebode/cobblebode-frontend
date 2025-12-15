import { useEffect, useState } from "react";
import { api } from "../services/api";
import { motion } from "framer-motion";
import { Key, Loader2, QrCode, Copy, Check, X } from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import Footer from "@/react-app/components/Footer";

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface PaymentResponse {
  orderId: number;
  paymentId: string;
  status: string;
  qrCode: string;
  qrCodeText: string;
  amount: number;
}

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");

  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  /* =========================
     CARREGAR ITENS DA API
     ========================= */
  useEffect(() => {
    async function loadItems() {
      try {
        const response = await api.get("/api/shop");
        setItems(response.data);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  /* =========================
     FUNÇÕES AUXILIARES
     ========================= */
  const handleBuyClick = (item: ShopItem) => {
    setSelectedItem(item);
    setShowCheckout(true);
    setPayment(null);
  };

  const handleCopyPix = () => {
    if (!payment) return;
    navigator.clipboard.writeText(payment.qrCodeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGenerationColor = (name: string) => {
    if (name.includes("1-3")) return "from-red-500 to-orange-500";
    if (name.includes("4-5")) return "from-purple-500 to-pink-500";
    if (name.includes("6-7")) return "from-blue-500 to-cyan-500";
    if (name.includes("8-9")) return "from-green-500 to-emerald-500";
    return "from-blue-500 to-cyan-500";
  };

  /* =========================
     LOADING
     ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
      </div>
    );
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-center mb-6 text-purple-300">
            Loja de Itens
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-purple-500/30 rounded-xl p-6"
              >
                <div
                  className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${getGenerationColor(
                    item.name
                  )} p-3`}
                >
                  <Key className="text-white w-full h-full" />
                </div>

                <h3 className="text-xl font-bold text-purple-100 mb-2">
                  {item.name}
                </h3>

                <p className="text-purple-300/70 text-sm mb-4">
                  {item.description}
                </p>

                <p className="text-2xl font-bold text-green-400 mb-4">
                  R$ {item.price.toFixed(2)}
                </p>

                <button
                  onClick={() => handleBuyClick(item)}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-bold"
                >
                  Comprar
                </button>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <p className="text-center text-purple-300 mt-12">
              Nenhum item disponível no momento
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
