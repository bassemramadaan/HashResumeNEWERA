import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  return (
    <>
      <Navbar />
      <div className="container-page py-20 text-center">
        <h1 className="text-4xl font-black mb-6">{t.heroTitle1 || "Landing Page"}</h1>
      </div>
    </>
  );
}
