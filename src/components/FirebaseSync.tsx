import { useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth as firebaseAuth } from "../lib/firebase";
import { useAuthStore } from "../store/useAuthStore";
import { useResumeStore, ResumeData } from "../store/useResumeStore";

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: firebaseAuth?.currentUser?.uid,
      email: firebaseAuth?.currentUser?.email,
      emailVerified: firebaseAuth?.currentUser?.emailVerified,
      isAnonymous: firebaseAuth?.currentUser?.isAnonymous,
      tenantId: firebaseAuth?.currentUser?.tenantId,
      providerInfo:
        firebaseAuth?.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const FirebaseSync = () => {
  const { user } = useAuthStore();
  const { data, updateData, isHydrated } = useResumeStore();

  // 1. Listen for remote changes when user is logged in
  useEffect(() => {
    if (!user || !isHydrated || !db) return;

    const path = `resumes/${user.uid}`;
    const resumeRef = doc(db, "resumes", user.uid);

    const unsubscribe = onSnapshot(
      resumeRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as ResumeData & {
            updatedAt: unknown;
          };

          // Simple conflict resolution: if remote is newer or local is empty
          // In a real app, we might want a more complex merge
          // For now, we'll just update local if remote exists
          // We exclude the 'updatedAt' from the store data
          const { updatedAt: _, ...resumeData } = remoteData;

          // Only update if data is actually different to avoid loops
          if (JSON.stringify(resumeData) !== JSON.stringify(data)) {
            updateData(resumeData);
          }
        } else {
          // If no remote data exists, initialize it with current local data
          setDoc(resumeRef, {
            ...data,
            userId: user.uid,
            updatedAt: serverTimestamp(),
          }).catch((error) => {
            handleFirestoreError(error, OperationType.WRITE, path);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      },
    );

    return () => unsubscribe();
  }, [user, isHydrated, data, updateData]);

  // 2. Push local changes to remote
  useEffect(() => {
    if (!user || !isHydrated || !db) return;

    const path = `resumes/${user.uid}`;
    const resumeRef = doc(db, "resumes", user.uid);

    const timeoutId = setTimeout(async () => {
      try {
        await setDoc(
          resumeRef,
          {
            ...data,
            userId: user.uid,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }, 2000); // 2 second debounce for cloud sync

    return () => clearTimeout(timeoutId);
  }, [data, user, isHydrated]);

  // 3. Sync user profile
  useEffect(() => {
    if (!user || !db) return;

    const path = `users/${user.uid}`;
    const userRef = doc(db, "users", user.uid);

    const syncProfile = async () => {
      try {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    };

    syncProfile();
  }, [user]);

  return null;
};


export default FirebaseSync;
