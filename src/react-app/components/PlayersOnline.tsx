import { motion } from 'framer-motion';
import { Users, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PlayersOnline() {
  const [onlineCount, setOnlineCount] = useState<number | null>(null);

  useEffect(() => {
    // Try to fetch real player count
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/players/count');
        if (response.ok) {
          const data = await response.json();
          setOnlineCount(data.count);
        }
      } catch (error) {
        console.log('Could not fetch player count');
      }
    };

    fetchPlayers();
    const interval = setInterval(fetchPlayers, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Entre no Servidor
          </h2>
          {onlineCount !== null ? (
            <div className="flex items-center justify-center gap-2 text-blue-300">
              <Activity className="animate-pulse text-green-400" />
              <span className="text-2xl font-bold text-green-400">{onlineCount}</span>
              <span>jogadores online</span>
            </div>
          ) : (
            <p className="text-xl text-blue-300/70">
              Junte-se à nossa comunidade de treinadores Pokémon
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-2xl font-bold text-blue-100 mb-4">Versão do Jogo</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-blue-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Minecraft <strong>1.21.1</strong></span>
                </div>
                <div className="flex items-center gap-3 text-blue-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span>Cobblemon mod</span>
                </div>
                <div className="flex items-center gap-3 text-blue-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span>Links dos mods no Discord</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-blue-100 mb-4">Como Começar</h3>
              <div className="space-y-3 text-blue-300">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Baixe o Minecraft 1.21.1</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Instale o Fabric</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Adicione os mods (disponíveis no Discord)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Conecte-se ao IP e divirta-se!</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a
            href="https://discord.gg/ZaqvDWB8jZ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/50 hover:shadow-indigo-400/70 transition-all"
          >
            <Users size={20} />
            Baixar Mods no Discord
          </a>
        </motion.div>
      </div>
    </section>
  );
}
