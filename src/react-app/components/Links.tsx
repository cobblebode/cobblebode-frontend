import { motion } from 'framer-motion';
import { FaDiscord, FaShoppingCart, FaBook, FaTwitter, FaYoutube, FaTwitch, FaFacebook, FaInstagram, FaStore } from 'react-icons/fa';

export default function Links() {
  const links = [
    {
      title: 'Discord',
      description: 'Junte-se à nossa comunidade',
      icon: <FaDiscord size={40} />,
      href: 'https://discord.gg/ZaqvDWB8jZ',
      gradient: 'from-indigo-500 to-purple-600',
      shadow: 'shadow-indigo-500/50',
    },
    {
      title: 'Loja VIP',
      description: 'Benefícios exclusivos',
      icon: <FaShoppingCart size={40} />,
      href: '/store',
      gradient: 'from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/50',
    },
    {
      title: 'Loja',
      description: 'Itens e chaves lendárias',
      icon: <FaStore size={40} />,
      href: '/shop',
      gradient: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/50',
    },
    {
      title: 'Regras',
      description: 'Leia nosso código de conduta',
      icon: <FaBook size={40} />,
      href: '/rules',
      gradient: 'from-orange-500 to-red-600',
      shadow: 'shadow-orange-500/50',
    },
    {
      title: 'Instagram',
      description: 'Fotos e novidades',
      icon: <FaInstagram size={40} />,
      href: 'https://instagram.com/cobblebode',
      gradient: 'from-pink-500 to-rose-600',
      shadow: 'shadow-pink-500/50',
    },
    {
      title: 'Facebook',
      description: 'Curtir nossa página',
      icon: <FaFacebook size={40} />,
      href: 'https://facebook.com/profile.php?id=61585122626076',
      gradient: 'from-blue-600 to-indigo-700',
      shadow: 'shadow-blue-600/50',
    },
    {
      title: 'Twitter',
      description: 'Novidades e atualizações',
      icon: <FaTwitter size={40} />,
      href: 'https://twitter.com/cobblebode',
      gradient: 'from-sky-500 to-blue-600',
      shadow: 'shadow-sky-500/50',
    },
    {
      title: 'YouTube',
      description: 'Vídeos e tutoriais',
      icon: <FaYoutube size={40} />,
      href: 'https://www.youtube.com/@Cobblebode',
      gradient: 'from-red-500 to-rose-600',
      shadow: 'shadow-red-500/50',
    },
    {
      title: 'Twitch',
      description: 'Lives e eventos',
      icon: <FaTwitch size={40} />,
      href: 'https://www.twitch.tv/cobblebode',
      gradient: 'from-purple-500 to-violet-600',
      shadow: 'shadow-purple-500/50',
    },
  ];

  return (
    <section id="discord" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Nossas Redes
          </h2>
          <p className="text-xl text-blue-300/70 max-w-2xl mx-auto">
            Conecte-se com a comunidade CobbleBode
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {links.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.href}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-8 hover:border-blue-400/50 transition-all overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10">
                <div className={`mb-4 text-white bg-gradient-to-br ${link.gradient} w-20 h-20 rounded-xl flex items-center justify-center shadow-lg ${link.shadow}`}>
                  {link.icon}
                </div>
                <h3 className="text-2xl font-bold text-blue-100 mb-2">
                  {link.title}
                </h3>
                <p className="text-blue-300/70">
                  {link.description}
                </p>
              </div>

              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-full transform translate-x-16 translate-y-16 group-hover:translate-x-12 group-hover:translate-y-12 transition-transform" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
