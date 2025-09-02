import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase-client";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);

  // ✅ Listen for auth changes
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Load cart (from localStorage or Supabase)
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // 🔹 Fetch from Supabase (make sure to use "carts")
        const { data, error } = await supabase
          .from("carts")
          .select("item_id, quantity, menu_items(*)")
          .eq("user_id", user.id);

        if (!error && data) {
          const formatted = {};
          data.forEach((row) => {
            const item = row.menu_items;
            const originalPrice = item.price;
            const discount = item.discount || 0;
            const discountedPrice =
              originalPrice - (originalPrice * discount) / 100;

            formatted[item.id] = {
              ...item,
              originalPrice,
              discountedPrice,
              discount,
              quantity: row.quantity,
            };
          });
          setCartItems(formatted);

          // 🔹 Merge localStorage cart into Supabase on login
          const localCart = JSON.parse(localStorage.getItem("cart") || "{}");
          if (Object.keys(localCart).length > 0) {
            for (let key in localCart) {
              await addToCart(localCart[key], localCart[key].quantity);
            }
            localStorage.removeItem("cart");
          }
        }
      } else {
        // 🔹 Load from localStorage if not logged in
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    loadCart();
  }, [user]);

  // ✅ Persist cart in localStorage (only if logged out)
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // --------------------
  // ✅ Cart Actions
  // --------------------

  const addToCart = async (item, quantity = 1) => {
    const newCart = {
      ...cartItems,
      [item.id]: {
        ...item,
        quantity: (cartItems[item.id]?.quantity || 0) + quantity,
      },
    };

    setCartItems(newCart);

    if (user) {
      await supabase.from("carts").upsert([
        {
          user_id: user.id,
          item_id: item.id,
          quantity: newCart[item.id].quantity,
        },
      ]);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    const updatedCart = {
      ...cartItems,
      [id]: { ...cartItems[id], quantity },
    };
    setCartItems(updatedCart);

    if (user) {
      await supabase
        .from("carts")
        .update({ quantity })
        .match({ user_id: user.id, item_id: id });
    }
  };

  const removeFromCart = async (id) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[id];
    setCartItems(updatedCart);

    if (user) {
      await supabase
        .from("carts")
        .delete()
        .match({ user_id: user.id, item_id: id });
    }
  };

  const clearCart = async () => {
    setCartItems({});
    if (user) {
      await supabase.from("carts").delete().match({ user_id: user.id });
    } else {
      localStorage.removeItem("cart");
    }
  };

  return (
    <StoreContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
