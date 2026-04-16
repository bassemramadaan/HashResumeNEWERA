import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useAuthStore } from "../store/useAuthStore";
import { LogIn, User as UserIcon, Loader2 } from "lucide-react";

const AuthButton = () => {
  const { user, loading } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = async () => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized.");
      return;
    }
    setIsProcessing(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const firebaseError = error as { code?: string };
      if (firebaseError?.code === "auth/popup-closed-by-user") {
        console.log("User closed the login popup.");
      } else {
        console.error("Login Error:", error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    setIsProcessing(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="w-10 h-10 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
            {user.displayName}
          </span>
          <button
            onClick={handleLogout}
            disabled={isProcessing}
            className="text-[10px] font-bold text-white0 hover:text-[#ff4d2d] transition-colors"
          >
            {isProcessing ? "..." : "Sign Out"}
          </button>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ""} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <UserIcon size={20} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isProcessing}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all text-xs font-bold shadow-md active:scale-95 disabled:opacity-50"
    >
      {isProcessing ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <LogIn size={14} />
      )}
      <span>Sign In</span>
    </button>
  );
};

export default AuthButton;
