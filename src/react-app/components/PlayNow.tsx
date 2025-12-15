import { motion } from 'framer-motion';
import { Copy, Check, Download, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function PlayNow() {
  const [copied, setCopied] = useState(false);
  const serverIP = 'cobblebode.bed.ovh';

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      number: '01',
      title: 'Baixe o Modrinth',
      description: 'Launcher para modpacks',
      icon: <Download />,
    },
    {
      number: '02',
      title: 'Baixe o Modpack',
      description: 'Disponível na aba Downloads',
      icon: <BookOpen />,
    },
    {
      number: '03',
      title: 'Conecte-se ao IP',
      description: 'cobblebode.bed.ovh',
      icon: <Copy />,
    },
    {
      number: '04',
      title: 'Para Piratas',
      description: 'Cheque a aba de Downloads',
      icon: <BookOpen />,
    },
  ];

  return (
    <section id="play" className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Como Jogar
          </h2>
          <p className="text-xl text-blue-300/70 max-w-2xl mx-auto">
            Siga esses passos simples para começar sua aventura
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all h-full">
                <div className="text-6xl font-bold text-blue-500/20 mb-4">
                  {step.number}
                </div>
                <div className="mb-4 text-blue-400">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-blue-300/70">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl p-8 shadow-2xl shadow-blue-500/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-blue-100 mb-2">
                IP do Servidor
              </h3>
              <p className="text-blue-300/70">
                Copie e cole no Minecraft
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/50 rounded-xl p-4 border border-blue-500/30">
              <code className="flex-1 text-xl font-mono text-blue-400">
                {serverIP}
              </code>
              <motion.button
                onClick={handleCopy}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-bold text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    Copiar
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
