import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../../../../supabase-client';
import './MenuRandomList.css';

const MenuRandomList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from('menu_items').select('*');

      if (error) {
        console.error('Error fetching menu:', error);
      } else {
        setMenuItems(data);

        const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));
        setCategories(['All', ...uniqueCategories]);

        if (searchQuery) {
          const filtered = data.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredItems(filtered);
        } else {
          // Default to 8 random items for "All"
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setFilteredItems(shuffled.slice(0, 8));
        }
      }
    };

    fetchMenu();
  }, [searchQuery]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    if (category === 'All') {
      const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
      setFilteredItems(shuffled.slice(0, 8));
    } else {
      const categoryItems = menuItems.filter(item => item.category === category);
      setFilteredItems(categoryItems.slice(0, 4));
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return supabase.storage.from('menu-images').getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="menuRandom-wrapper">
      {/* Category Section */}
      <div className="menuRandom-category-filter">
        <h1 className="menuRandom-heading">Explore Menu</h1>
        <div className="menuRandom-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? 'menuRandom-btn-active' : 'menuRandom-btn'}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="menuRandom-container">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div className="menuRandom-item" key={item.id}>
              {item.image && (
                <Link to={`/MenuItem/${item.id}`}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="menuRandom-img"
                  />
                </Link>
              )}
              <h4 className="menuRandom-title">{item.name}</h4>
              <p className="menuRandom-desc">{item.description}</p>
              <p className="menuRandom-price"><strong>₹{item.price}</strong></p>
            </div>
          ))
        ) : (
          <p className="menuRandom-empty">No items found.</p>
        )}
      </div>
    </div>
  );
};

export default MenuRandomList;
