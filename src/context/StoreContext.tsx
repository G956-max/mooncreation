import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  variant: string;
  imageUrl: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface StoreContextType {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  updateCartQuantity: (id: string, delta: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  isInWishlist: (id: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setWishlistItems([]);
      return;
    }

    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setCartItems(data.cart || []);
        setWishlistItems(data.wishlist || []);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const updateStoreInFirebase = async (cart: CartItem[], wishlist: WishlistItem[]) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(docRef, { cart, wishlist });
    } catch {
      await setDoc(docRef, { cart, wishlist }, { merge: true });
    }
  };

  const addToCart = async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const newCart = [...cartItems];
    const existingIndex = newCart.findIndex(i => i.id === item.id && i.variant === item.variant);
    
    if (existingIndex >= 0) {
      newCart[existingIndex].quantity += (item.quantity || 1);
    } else {
      newCart.push({ ...item, quantity: item.quantity || 1 } as CartItem);
    }
    
    setCartItems(newCart);
    await updateStoreInFirebase(newCart, wishlistItems);
  };

  const updateCartQuantity = async (id: string, delta: number) => {
    const newCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCartItems(newCart);
    await updateStoreInFirebase(newCart, wishlistItems);
  };

  const removeFromCart = async (id: string) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    await updateStoreInFirebase(newCart, wishlistItems);
  };

  const toggleWishlist = async (item: WishlistItem) => {
    let newWishlist = [...wishlistItems];
    const exists = newWishlist.some(i => i.id === item.id);
    
    if (exists) {
      newWishlist = newWishlist.filter(i => i.id !== item.id);
    } else {
      newWishlist.push(item);
    }
    
    setWishlistItems(newWishlist);
    await updateStoreInFirebase(cartItems, newWishlist);
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some(i => i.id === id);
  };

  return (
    <StoreContext.Provider value={{ cartItems, wishlistItems, addToCart, updateCartQuantity, removeFromCart, toggleWishlist, isInWishlist }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
