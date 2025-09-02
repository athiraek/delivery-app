import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../../supabase-client';
import './MenuItemList.css';

const MenuItemList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = new URLSearchParams(location.search).get('search') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from('menu_items').select('*');

      if (error) {
        console.error('Error fetching menu:', error);
      } else {
        setMenuItems(data);

        const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));
        setCategories(['All', ...uniqueCategories]);

        // Initial filter
        if (searchQuery) {
          const filtered = data.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredItems(filtered);
        } else {
          setFilteredItems(data);
        }
      }
    };

    fetchMenu();
  }, [searchQuery]);

  // 🔥 Live filtering while typing
  useEffect(() => {
    let filtered = menuItems;

    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (searchInput.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchInput, activeCategory, menuItems]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return supabase.storage.from('menu-images').getPublicUrl(path).data.publicUrl;
  };

  const handleSearch = () => {
    // Keep URL in sync
    const params = new URLSearchParams();
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    }
    navigate({ search: params.toString() });
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="menuList-category-filter">
        <h5>Explore Menu</h5>

        {/* Search bar (live search enabled) */}
        <div className="menuList-search-bar">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Categories */}
        <div className="menuList-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? 'menuList-btn-active' : 'menuList-btn'}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="menuList-container">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div className="menuList-item" key={item.id}>
              {item.image && (
                <Link to={`/MenuItem/${item.id}`}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="menuList-img"
                  />
                </Link>
              )}
              <h4 className="menuList-title">{item.name}</h4>
              <p className="menuList-desc">{item.description}</p>
              <p className="menuList-price"><strong>₹{item.price}</strong></p>
            </div>
          ))
        ) : (
          <p className="menuList-empty">No items found.</p>
        )}
      </div>
    </div>
  );
};

export default MenuItemList;
