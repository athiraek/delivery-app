import React, { useEffect, useState } from "react";
import { supabase } from "../../../../supabase-client";
import AdminNavigation from "./../AdminNavigation/AdminNavigation";
import "./AdminMenuList.css";

const AdminMenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase.from("menu_items").select("*");
      if (error) {
        console.error("Error fetching menu items:", error.message);
      } else {
        setMenuItems(data);
        const uniqueCategories = [
          "All",
          ...new Set(data.map((item) => item.category || "Uncategorized")),
        ];
        setCategories(uniqueCategories);
      }
      setLoading(false);
    };

    fetchMenuItems();
  }, []);

  const handleToggleAvailable = async (id, currentStatus) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error.message);
    } else {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_available: !currentStatus } : item
        )
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error.message);
    } else {
      const updatedItems = menuItems.filter((item) => item.id !== id);
      setMenuItems(updatedItems);
      const updatedCategories = [
        "All",
        ...new Set(
          updatedItems.map((item) => item.category || "Uncategorized")
        ),
      ];
      setCategories(updatedCategories);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return supabase.storage.from("menu-images").getPublicUrl(path).data
      .publicUrl;
  };

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter(
          (item) => (item.category || "Uncategorized") === selectedCategory
        );

  if (loading) return <p>Loading menu items...</p>;

  return (
    <div className="admin-menu-container">
      <AdminNavigation />

      <h2>All Menu Items</h2>

      {/* Category Filter */}
      <div className="category-filter">
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p className="no-items">No menu items found.</p>
      ) : (
        <table className="admin-menu-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Description</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.image && (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="menu-item-image"
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.category || "Uncategorized"}</td>
                <td>₹{item.price}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    onClick={() =>
                      handleToggleAvailable(item.id, item.is_available)
                    }
                    className={`btn-toggle-available ${
                      item.is_available ? "available" : "unavailable"
                    }`}
                  >
                    {item.is_available ? "Available" : "Unavailable"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMenuList;
