import { useState, useEffect } from "react";

const CART_STORAGE_KEY = 'coffee-owl-cart';

const useCart = () => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const getQuantity = (productId) => cart[productId] || 0;

    const updateQuantity = (productId, newQuantity) => {
        setCart(prev => {
            if (newQuantity <= 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: newQuantity };
        });
    };

    const addToCart = (productId) => {
        updateQuantity(productId, getQuantity(productId) + 1);
    }

    const removeFromCart = (productId) => {
        const current = getQuantity(productId);
        if (current <= 1) {
            updateQuantity(productId, 0);
        } else {
            updateQuantity(productId, current - 1);
        }
    };

    const clearCart = () => {
        setCart({});
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({}));
    };

    const getTotalItems = () => {
        return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    }

    const getTotalPrice = (products) => {
        return Object.entries(cart).reduce((sum, [id, qty]) => {
            const product = products.find(p => p.id === Number(id));
            return sum + (product?.price || 0) * qty;
        }, 0);
    };

    return {
        cart,
        getQuantity,
        updateQuantity,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice
    };
};

export default useCart;