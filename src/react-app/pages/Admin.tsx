import { useState, useEffect } from "react";
import Navbar from "@/react-app/components/Navbar";
import Footer from "@/react-app/components/Footer";
import { Copy, CheckCircle, Lock } from "lucide-react";

interface PendingOrder {
  id: number;
  player_name: string;
  item_name: string;
  amount: number;
  payment_id: string;
  created_at: string;
  order_type: string;
  item_minecraft_id?: string;
  command?: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);

  useEffect(() => {
    // Check if already authenticated in session
    const savedPassword = sessionStorage.getItem("admin_password");
    if (savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      // Verify password by making a request to the admin API
      const response = await fetch("/api/admin/pending-orders", {
        headers: {
          "X-Admin-Password": password,
        },
      });

      if (response.status === 401) {
        setAuthError("Senha incorreta");
        return;
      }

      if (response.ok) {
        sessionStorage.setItem("admin_password", password);
        setIsAuthenticated(true);
        loadOrders();
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setAuthError("Erro ao conectar com o servidor");
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/pending-orders", {
        headers: {
          "X-Admin-Password": password || sessionStorage.getItem("admin_password") || "",
        },
      });

      if (response.status === 401) {
        sessionStorage.removeItem("admin_password");
        setIsAuthenticated(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      const interval = setInterval(loadOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const copyCommand = (orderId: number, command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const completeOrder = async (orderId: number) => {
    if (!confirm("Confirmar que o pedido foi entregue manualmente?")) {
      return;
    }

    setCompletingId(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/complete`, {
        method: "POST",
        headers: {
          "X-Admin-Password": password || sessionStorage.getItem("admin_password") || "",
        },
      });

      if (response.status === 401) {
        sessionStorage.removeItem("admin_password");
        setIsAuthenticated(false);
        return;
      }

      if (response.ok) {
        await loadOrders();
      }
    } catch (error) {
      console.error("Erro ao completar pedido:", error);
      alert("Erro ao completar pedido");
    } finally {
      setCompletingId(null);
    }
  };

  const buildItemCommand = (order: PendingOrder): string => {
    if (order.order_type === "vip") {
      return order.command || "";
    }
    
    if (order.order_type === "item" && order.item_minecraft_id) {
      const displayName = JSON.stringify({
        text: order.item_name,
        color: "gold",
        bold: true,
      });
      return `give ${order.player_name} ${order.item_minecraft_id}[minecraft:custom_name='${displayName}']`;
    }
    
    return "";
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-500/20 p-4 rounded-full">
              <Lock size={32} className="text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Acesso Administrativo
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-blue-200 text-sm mb-2">
                Senha de administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Digite a senha"
                required
              />
            </div>
            {authError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {authError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Painel de Administração
                </h1>
                <p className="text-blue-200">
                  Pedidos pagos aguardando entrega manual
                </p>
              </div>
              <button
                onClick={() => {
                  sessionStorage.removeItem("admin_password");
                  setIsAuthenticated(false);
                }}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-white mt-4">Carregando pedidos...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-white">
                  Nenhum pedido pendente! 🎉
                </p>
                <p className="text-blue-200 mt-2">
                  Todos os pagamentos foram processados.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const command = buildItemCommand(order);
                  return (
                    <div
                      key={order.id}
                      className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-blue-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {order.item_name}
                          </h3>
                          <p className="text-blue-200">
                            Jogador: <span className="font-semibold">{order.player_name}</span>
                          </p>
                          <p className="text-sm text-blue-300">
                            Pedido #{order.id} • R$ {order.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Pagamento: {order.payment_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {new Date(order.created_at).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      {command && (
                        <>
                          <div className="bg-black/30 rounded-lg p-4 mb-4 font-mono text-sm text-green-400 break-all">
                            {command}
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => copyCommand(order.id, command)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              {copiedId === order.id ? (
                                <>
                                  <CheckCircle size={18} />
                                  Copiado!
                                </>
                              ) : (
                                <>
                                  <Copy size={18} />
                                  Copiar Comando
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => completeOrder(order.id)}
                              disabled={completingId === order.id}
                              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              {completingId === order.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                  Processando...
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={18} />
                                  Marcar como Entregue
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-200 text-sm">
                <strong>Instruções:</strong> Copie o comando, cole no console do servidor, 
                execute e depois clique em "Marcar como Entregue" para remover da lista.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
