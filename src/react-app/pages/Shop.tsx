import { useEffect, useState } from "react";
import { api } from "../services/api";
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
  const [quantity, setQuantity] = useState(1);

  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [copied, setCopied] = useState(false);

  /* =========================
     CARREGAR ITENS
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
     FUNÇÕES
     ========================= */
  const handleBuyClick = (item: ShopItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setPlayerName("");
    setPlayerEmail("");
    setPayment(null);
    setShowCheckout(true);
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
     PAGAMENTO PIX
     ========================= */
  const handleCreatePayment = async () => {
    if (!selectedItem || !playerName || !playerEmail || quantity < 1) {
      alert("Preencha todos os campos corretamente");
      return;
    }

    try {
      setProcessingPayment(true);

      const response = await api.post("/api/payments/create", {
        productId: selectedItem.id,
        productType: "shop",
        quantity,
        playerName,
        playerEmail,
      });

      setPayment(response.data);
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      alert("Erro ao criar pagamento PIX");
    } finally {
      setProcessingPayment(false);
    }
  };

  /* =========================
     LOADING
     ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
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
          <h1 className="text-5xl font-bold text-center mb-3 text-purple-300">
            Loja de Itens
          </h1>

          <p className="text-center text-purple-300/80 mb-10">
            Adquira chaves lendárias e tenha acesso aos pokémons mais raros
          </p>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-8
          ">
            {items.map((item) => (
              <div
                key={item.id}
                className="
                  bg-gradient-to-b from-slate-900 to-slate-950
                  border border-purple-500/30
                  rounded-2xl
                  p-6
                  shadow-lg
                  hover:scale-[1.02]
                  transition
                "
              >
                <div
                  className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-br ${getGenerationColor(
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
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold"
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

      {/* CHECKOUT */}
      {showCheckout && selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-3 right-3 text-purple-300"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-purple-300 mb-4">
              {selectedItem.name}
            </h2>

            {!payment ? (
              <>
                <input
                  placeholder="Nome do jogador"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full mb-3 p-3 rounded-lg bg-slate-800 text-white"
                />

                <input
                  placeholder="Email"
                  value={playerEmail}
                  onChange={(e) => setPlayerEmail(e.target.value)}
                  className="w-full mb-3 p-3 rounded-lg bg-slate-800 text-white"
                />

                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white"
                  placeholder="Quantidade"
                />

                <p className="text-green-400 font-bold mb-4">
                  Total: R$ {(selectedItem.price * quantity).toFixed(2)}
                </p>

                <button
                  onClick={handleCreatePayment}
                  disabled={processingPayment}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                >
                  {processingPayment ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <QrCode /> Pagar com PIX
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <img
                  src={`data:image/png;base64,${payment.qrCode}`}
                  alt="QR Code PIX"
                  className="mx-auto mb-4"
                />

                <button
                  onClick={handleCopyPix}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold flex items-center justify-center gap-2"
                >
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copiado!" : "Copiar PIX"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
