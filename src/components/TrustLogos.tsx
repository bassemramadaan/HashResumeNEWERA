import { motion } from 'framer-motion';
import { useLanguageStore } from '../store/useLanguageStore';
import { translations } from '../i18n/translations';

const logos = [
  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
  { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
];

export default function TrustLogos() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  return (
    <section className="py-12 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10">
          {t.trustedBy || 'Trusted by professionals from'}
        </p>
        
        <div className="relative">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 dark:opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {logos.map((logo, i) => (
              <motion.img
                key={logo.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                src={logo.url}
                alt={logo.name}
                className="h-6 md:h-8 w-auto object-contain dark:invert"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
