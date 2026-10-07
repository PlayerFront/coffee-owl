import React, { useState, useEffect, useRef } from "react";
import SearchIcon from "../../../../components/SearchIcon/SearchIcon";
import SearchResultItem from "./SearchResultItem";
import { Products } from '../../../Catalog/mockData';
import './_search-bar.scss';

const SearchBar = ({ onSelectProduct, onAddToCart, getQuantity }) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery.trim().length > 0) {
            setIsOpen(true)
        }
    }, [debouncedQuery]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const results = debouncedQuery.trim().length > 0
        ? Products.filter(p =>
            p.name.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
        )
        : [];

    return (
        <div className="search-bar" ref={searchRef}>
            <div className="search-bar__field">
                <div className="search-bar__icon">
                    <SearchIcon />
                </div>

                <input
                    type="text"
                    className="search-bar__input"
                    placeholder="Найти кофе, десерт..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => debouncedQuery.trim() && setIsOpen(true)}
                />
            </div>

            {isOpen && debouncedQuery.trim().length > 0 && (
                <div className="search-bar__results">
                    {results.length > 0 ? (
                        results.map(product => (
                            <SearchResultItem
                                key={product.id}
                                product={product}
                                quantity={getQuantity(product.id)}
                                onClick={() => onSelectProduct(product)}
                                onAddToCart={() => onAddToCart(product.id)}
                            />
                        ))
                    ) : (
                        <p className="search-bar__empty">Ничего не найдено</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;