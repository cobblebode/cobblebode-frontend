import { useEffect, useState } from "react";
import Navbar from "@/react-app/components/Navbar";
import Footer from "@/react-app/components/Footer";

interface VIPProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: string;
}

interface PaymentResponse {
  orderId: number;
  paymentId: string;
  status: string;
  qrCode: string;
  qrCodeText: string;
  amount: number;
}

export default function Store() {
  const [products, setProducts] = useState<VIPProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<VIPProduct | null>(null);

  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");

  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadVips() {
      try {
        const res = await fetch("https://cobblebode-backend.onrender.com/api/vip");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Erro ao carregar VIPs", err);
      } finally {
        setLoading(false);
      }
    }
    loadVips();
  }, []);

  function handleBuy(product: VIPProduct) {
    setSelectedProduct(product);
    setShowCheckout(true);
    setPayment(null);
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;

    setProcessing(true);

    try {
      const res = await fetch(
        "https://cobblebode-backend.onrender.com/api/payments/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: selectedProduct.id,
            productType: "vip",
            playerName,
            playerEmail,
          }),
        }
      );

      const data = await res.json();
      setPayment(data);
    } catch {
      alert("Erro ao gerar PIX");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="pt-32 pb-20 container mx-auto text-center">
        <h1 className="text-5xl font-bold text-blue-400 mb-4">Loja VIP</h1>

        <p className="text-blue-300 mb-6">
          Adquira vantagens exclusivas e aproveite ao máximo sua experiência no
          CobbleBode
        </p>

        <div className="inline-block mb-10 px-6 py-3 rounded border border-yellow-500 text-yellow-400 bg-yellow-500/10">
          ⚠️ O jogador deve estar ONLINE no servidor para receber o VIP
        </div>

        <div className="flex justify-center gap-8 flex-wrap">
          {products.map((vip) => {
            const features = vip.features.split("|");

            return (
              <div
                key={vip.id}
                className="bg-slate-900 border border-blue-500/30 rounded-xl p-6 w-96 text-left"
              >
                <h2 className="text-2xl font-bold text-blue-200 mb-1">
                  {vip.name}
                </h2>

                <p className="text-blue-300/70 mb-4">{vip.description}</p>

                <p className="text-green-400 text-3xl font-bold mb-4">
                  R$ {vip.price.toFixed(2)}{" "}
                  <span className="text-sm text-gray-400">
                    /{vip.duration_days} dias
                  </span>
                </p>

                <ul className="space-y-2 mb-6">
                  {features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-green-400">✔</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(vip)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold text-center"
                >
                  Comprar Agora
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL CHECKOUT */}
      {showCheckout && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedProduct.name}
            </h2>

            {!payment ? (
              <form onSubmit={handleCheckout} className="space-y-4">
                <input
                  required
                  placeholder="Nick no Minecraft"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full p-3 rounded bg-slate-800"
                />

                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={playerEmail}
                  onChange={(e) => setPlayerEmail(e.target.value)}
                  className="w-full p-3 rounded bg-slate-800"
                />

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 bg-green-600 rounded font-bold"
                >
                  {processing ? "Gerando PIX..." : "Gerar PIX"}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p>Escaneie o QR Code PIX</p>

                <img
                  src={`data:image/png;base64,${payment.qrCode}`}
                  className="mx-auto bg-white p-2 rounded"
                />

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(payment.qrCodeText)
                  }
                  className="underline text-blue-400"
                >
                  Copiar código PIX
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setShowCheckout(false);
                setPayment(null);
              }}
              className="mt-4 text-sm text-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
