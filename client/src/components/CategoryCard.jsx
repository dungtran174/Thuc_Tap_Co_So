import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/shop?category=${category.id}`}
      className="group block"
    >
      <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        {/* Category Icon/Image */}
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
          <span className="text-3xl">
            {category.name.includes('Áo') ? '👕' : 
             category.name.includes('Quần') ? '👖' : 
             category.name.includes('Váy') ? '👗' : '🛍️'}
          </span>
        </div>
        
        {/* Category Name */}
        <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg mb-2">
          {category.name}
        </h3>
        
        {/* Category Description */}
        {category.description && (
          <p className="text-gray-500 text-sm">{category.description}</p>
        )}
        
        {/* Hover Effect */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-blue-600 text-sm font-medium">
            Xem sản phẩm →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;