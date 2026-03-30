import React from "react";
import './_catalog-filter.scss';

const filters = [
    {id: 'all', label: 'Все'},
    {id: 'coffee', label: 'Кофе'},
    {id: 'tea', label: 'Чай'},
    {id: 'pastry', label: 'Выпечка'},
    {id: 'dessert', label: 'Десерты'}
];

const CatalogFilters =  ({ activeFilter, onFilterChange }) => {
    return (
        <div className='catalog-filter'>
            {filters.map(filter => (
                <button
                    key={filter.id}
                    className={`catalog-filter__button ${activeFilter === filter.id ? 'catalog-filter__button--active' : ''}`}
                    onClick={() => onFilterChange(filter.id)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};

export default CatalogFilters;