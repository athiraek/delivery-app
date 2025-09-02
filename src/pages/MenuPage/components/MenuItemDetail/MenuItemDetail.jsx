import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../../supabase-client";
import "./MenuItemDetail.css";
import { useStore } from "../../../../Context/StoreContext";

const MenuItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const { addToCart } = useStore();
  const navigate = useNavigate();

  // Fetch menu item
  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching item:", error);
      else setItem(data);
    };

    fetchItem();
  }, [id]);

  // Check if current user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!error && profile?.is_admin) setIsAdmin(true);
    };

    checkAdmin();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return supabase.storage.from("menu-images").getPublicUrl(path).data.publicUrl;
  };

  const handleAddToCart = () => {
    if (!item) return;

    const originalPrice = item.price;
    const discount = item.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;

    const itemForCart = {
      ...item,
      originalPrice,
      discountedPrice,
      discount,
      quantity,
      image: getImageUrl(item.image),
    };

    addToCart(itemForCart, quantity);
    navigate("/cart");
  };

  const handleBuyNow = async () => {
    if (!item) return;

    const { data: { user } } = await supabase.auth.getUser();

    const originalPrice = item.price;
    const discount = item.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;

    const itemForCheckout = {
      ...item,
      originalPrice,
      discountedPrice,
      discount,
      quantity,
      image: getImageUrl(item.image),
    };

    if (!user) {
      // Pass the selected item via state for post-login redirect
      navigate("/signin", { state: { redirectTo: "/checkout", buyNowItem: itemForCheckout } });
    } else {
      navigate("/checkout", { state: { buyNowItem: itemForCheckout } });
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="menu-detail-container">
      <div className="menu-detail-header">
        <img
          src={getImageUrl(item.image)}
          alt={item.name}
          className="menu-detail-image"
        />
        <div className="menu-detail-info">
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <p>
            <strong>
              ₹{item.price}{" "}
              {item.discount ? (
                <span className="text-danger">({item.discount}% OFF)</span>
              ) : null}
            </strong>
          </p>
          <p><strong>Category:</strong> {item.category}</p>

          {!item.is_available ? (
            <p className="text-danger"><strong>Currently Unavailable</strong></p>
          ) : (
            <>
              {!isAdmin && (
                <>
                  <div className="d-flex align-items-center my-3">
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="menu-detail-buttons">
                    <button className="btn btn-primary" onClick={handleAddToCart}>
                      Add to Cart
                    </button>
                    <button className="btn btn-primary" onClick={handleBuyNow}>
                      Buy Now
                    </button>
                  </div>
                </>
              )}

              {isAdmin && (
                <p className="text-info">
                  Admins cannot buy items. You can only view or manage items.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;
