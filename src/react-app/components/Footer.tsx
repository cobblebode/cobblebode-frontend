import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { FaDiscord, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-blue-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://mocha-cdn.com/019aece0-5e0d-7d85-a9ee-1b10cd6e0132/ChatGPT-Image-4-de-dez.-de-2025-18_20_40.png"
                alt="CobbleBode Logo"
                className="w-12 h-12 rounded-lg shadow-lg shadow-blue-500/50"
              />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  CobbleBode
                </h3>
                <p className="text-xs text-blue-300/70">Servidor Cobblemon</p>
              </div>
            </div>
            <p className="text-blue-300/70 text-sm">
              O melhor servidor de Cobblemon do Brasil. Capture, treine e batalhe
              com seus Pokémon favoritos em uma experiência única.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-blue-100 font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-blue-300/70 hover:text-blue-400 transition-colors text-sm">
                  Início
                </a>
              </li>
              <li>
                <a href="/#play" className="text-blue-300/70 hover:text-blue-400 transition-colors text-sm">
                  Como Jogar
                </a>
              </li>
              <li>
                <a href="/store" className="text-blue-300/70 hover:text-blue-400 transition-colors text-sm">
                  Loja VIP
                </a>
              </li>
              <li>
                <a href="/rules" className="text-blue-300/70 hover:text-blue-400 transition-colors text-sm">
                  Regras
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-blue-100 font-bold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href="https://discord.gg/ZaqvDWB8jZ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 rounded-lg flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-all"
              >
                <FaDiscord size={20} />
              </a>
              <a
                href="#twitter"
                className="w-10 h-10 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50 rounded-lg flex items-center justify-center text-sky-400 hover:text-sky-300 transition-all"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#youtube"
                className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="border-t border-blue-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-300/70 text-sm flex items-center gap-2">
              © {new Date().getFullYear()} CobbleBode. Todos os direitos reservados.
            </p>
            <p className="text-blue-300/70 text-sm flex items-center gap-2">
              Feito com <Heart size={16} className="text-red-400 fill-current" /> para a comunidade
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
