import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, HardDrive, Package, ExternalLink } from 'lucide-react';
import Navbar from '@/react-app/components/Navbar';
import Footer from '@/react-app/components/Footer';

export default function Downloads() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-600/10 to-transparent" />

        <div className="container mx-auto relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Downloads
            </h1>
            <p className="text-xl text-green-300/70">
              Baixe os arquivos necessários para jogar no CobbleBode
            </p>
          </motion.div>

          {/* Download Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-100">
                  Modpack CobbleBode
                </h2>
                <p className="text-green-300/70">
                  Versão 1.1.0 - Minecraft 1.21.1
                </p>
              </div>
            </div>

            <a
              href="https://www.dropbox.com/scl/fo/hfectxndcn8bspjs4vetl/AGHrv4WSw97Upk6gUVLFo3Y?rlkey=zurj93vaxh1xhy38b3xyb5ggi&st=6brdoi04&dl=0"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Baixar Modpack
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Server Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <HardDrive className="w-8 h-8 text-blue-400" />
              <h2 className="text-2xl font-bold text-blue-100">
                Informações do Servidor
              </h2>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20">
              <p className="text-blue-300/70 text-sm mb-2">IP do Servidor:</p>
              <code className="text-lg font-mono text-blue-100 bg-slate-950/50 px-4 py-2 rounded-lg block">
                cobblebode.bed.ovh
              </code>
            </div>
          </motion.div>

          {/* Installation Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Original Minecraft */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-100">
                  Minecraft Original
                </h3>
              </div>

              <div className="space-y-4 text-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-400 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">
                      Baixar o Modrinth Launcher
                    </p>
                    <p className="text-green-300/70 text-sm">
                      Faça o download do launcher Modrinth em{' '}
                      <a
                        href="https://modrinth.com/app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 underline"
                      >
                        modrinth.com/app
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-400 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Instalar o Modpack</p>
                    <p className="text-green-300/70 text-sm">
                      Baixe o arquivo{' '}
                      <code className="bg-slate-900/50 px-2 py-1 rounded text-green-300">
                        CobbleBode1.1.0.mrpack
                      </code>{' '}
                      do link acima e abra com o Modrinth.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-400 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Jogar!</p>
                    <p className="text-green-300/70 text-sm">
                      Inicie o jogo pelo Modrinth e conecte-se ao servidor usando
                      o IP acima.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pirate Minecraft (UPDATED) */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-orange-100">
                  Minecraft Pirata (SKLauncher)
                </h3>
              </div>

              <div className="space-y-4 text-orange-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-400 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">
                      Baixar o SKLauncher
                    </p>
                    <p className="text-orange-300/70 text-sm">
                      Faça o download do SKLauncher em{' '}
                      <a
                        href="https://skmedix.pl/downloads"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 underline"
                      >
                        skmedix.pl/downloads
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-400 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">
                      Instalar o Modpack
                    </p>
                    <p className="text-orange-300/70 text-sm">
                      Baixe o arquivo{' '}
                      <code className="bg-slate-900/50 px-2 py-1 rounded text-orange-300">
                        CobbleBode1.1.0.mrpack
                      </code>{' '}
                      do link acima e importe no SKLauncher.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-400 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Jogar!</p>
                    <p className="text-orange-300/70 text-sm">
                      Inicie o jogo pelo SKLauncher e conecte-se ao servidor
                      usando o IP acima.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gradient-to-br from-blue-800/20 to-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center"
          >
            <h3 className="text-xl font-bold text-blue-100 mb-3">
              Precisa de Ajuda?
            </h3>
            <p className="text-blue-300/70 mb-4">
              Entre no nosso Discord para suporte e tire suas dúvidas com a
              comunidade!
            </p>
            <a
              href="https://discord.gg/qkZdzWUfe9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg font-bold text-white transition-colors"
            >
              Entrar no Discord
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
