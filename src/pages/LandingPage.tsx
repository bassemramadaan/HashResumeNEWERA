import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useMotionValue, animate, AnimatePresence } from "motion/react";
import { Sparkles, Target, CheckCircle2, Check, Plus, ArrowUp, X } from "lucide-react";
import Footer from "../components/Footer";
import SmallWallOfLove from "../components/SmallWallOfLove";
import { useLanguageStore } from "../store/useLanguageStore";
import { translations } from "../i18n/translations";
import { cn } from "@/lib/utils";
import { trackEvent, FUNNEL_EVENTS } from "../utils/analytics";
import { HERO_LOGO_URL } from "../constants";
import Navbar from "../components/Navbar";
import VideoDemoModal from "../components/VideoDemoModal";
import Logo from "../components/Logo";

export default function LandingPage() {
  const { language } = useLanguageStore();
  const t = translations[language].landing;

  // ... (Full reconstructed file content here)
}
