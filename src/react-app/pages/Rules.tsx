import { motion } from 'framer-motion';
import { Shield, Users, Sword, Heart, AlertTriangle, Ban } from 'lucide-react';
import Navbar from '@/react-app/components/Navbar';
import Footer from '@/react-app/components/Footer';

export default function Rules() {
  const ruleCategories = [
    {
      icon: <Shield />,
      title: 'Respeito e Convivência',
      color: 'from-blue-500 to-cyan-500',
      rules: [
        'Trate todos os jogadores com respeito e educação',
        'Não use linguagem ofensiva, racista ou discriminatória',
        'Não faça spam no chat',
        'Respeite a staff e suas decisões',
        'Não divulgue outros servidores',
      ],
    },
    {
      icon: <Users />,
      title: 'Gameplay e Competição',
      color: 'from-purple-500 to-pink-500',
      rules: [
        'Não use hacks, cheats ou mods proibidos',
        'Não abuse de bugs ou glitches',
        'Não faça kill aura ou auto-click',
        'Respeite as áreas de proteção',
        'PvP apenas em áreas designadas',
      ],
    },
    {
      icon: <Sword />,
      title: 'Batalhas e Trocas',
      color: 'from-orange-500 to-red-500',
      rules: [
        'Não faça scam em trocas',
        'Respeite acordos de batalha',
        'Não roube Pokémon de outros jogadores',
        'Batalhas justas - sem modificadores ilegais',
        'Honre apostas e acordos',
      ],
    },
    {
      icon: <Heart />,
      title: 'Construções e Terrenos',
      color: 'from-green-500 to-emerald-500',
      rules: [
        'Não construa próximo a outros sem permissão',
        'Respeite construções alheias',
        'Não griefe ou destrua propriedades',
        'Mantenha construções apropriadas',
        'Siga regras de zoneamento',
      ],
    },
    {
      icon: <AlertTriangle />,
      title: 'Economia e Comércio',
      color: 'from-yellow-500 to-orange-500',
      rules: [
        'Não manipule preços de mercado',
        'Honre transações comerciais',
        'Não faça duplication de itens',
        'Reporte bugs econômicos à staff',
        'Evite monopólios abusivos',
      ],
    },
    {
      icon: <Ban />,
      title: 'Punições',
      color: 'from-red-500 to-rose-500',
      rules: [
        '1ª infração: Advertência',
        '2ª infração: Mute/Kick',
        '3ª infração: Ban temporário (1-7 dias)',
        'Infrações graves: Ban permanente',
        'Hacks/Cheats: Ban permanente imediato',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Regras do Servidor
            </h1>
            <p className="text-xl text-blue-300/70 max-w-2xl mx-auto">
              Leia atentamente e siga as regras para garantir uma experiência agradável para todos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {ruleCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {category.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-blue-100 mb-4">
                  {category.title}
                </h3>

                <ul className="space-y-3">
                  {category.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-blue-300/90 text-sm">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-br from-red-500/10 to-rose-500/10 border-2 border-red-500/30 rounded-2xl p-8 max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-red-300 mb-4">
                  Importante
                </h3>
                <div className="space-y-2 text-red-200/90">
                  <p>
                    • O desconhecimento das regras não isenta o jogador de punições
                  </p>
                  <p>
                    • A staff tem autoridade final em todas as decisões
                  </p>
                  <p>
                    • Tentativas de contornar punições resultarão em ban permanente
                  </p>
                  <p>
                    • Reporte infrações à staff através do Discord ou /report in-game
                  </p>
                  <p>
                    • Estas regras podem ser atualizadas a qualquer momento
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-blue-300/70 mb-6">
              Dúvidas sobre as regras? Entre em contato com a staff
            </p>
            <a
              href="#discord"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70 transition-all"
            >
              Falar com Staff
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
