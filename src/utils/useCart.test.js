import { renderHook, act } from "@testing-library/react";
import useCart from "./useCart";

beforeEach(() => {
    localStorage.clear();
});

describe('useCart', () => {
    test('Инициализируется с пустой корзиной', () => {
        const { result } = renderHook(() => useCart());

        expect(result.current.getTotalItems()).toBe(0);
        expect(result.current.cart).toEqual({});
    });

    test('addToCart добавляет товар в корзину', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addToCart(1);
        });

        expect(result.current.getQuantity(1)).toBe(1);
        expect(result.current.getTotalItems()).toBe(1);
    });

    test('addToCart увеличивает количество существующего товара', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addToCart(1);
        });
        act(() => {
            result.current.addToCart(1);
        });

        expect(result.current.getQuantity(1)).toBe(2);
        expect(result.current.getTotalItems()).toBe(2);
    });

    test('removeFromCart уменьшает количество товара', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addToCart(1);
        });
        act(() => {
            result.current.addToCart(1);
        });
        act(() => {
            result.current.removeFromCart(1);
        });

        expect(result.current.getQuantity(1)).toBe(1);
    });

    test('removeFromCart удаляет товар из корзины', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addToCart(1);
        });
        act(() => {
            result.current.removeFromCart(1);
        });

        expect(result.current.getQuantity(1)).toBe(0);
        expect(result.current.cart).toEqual({});
    });

    test('Корзина сохраняется в localStorage, сохраняется после перезагрузки', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addToCart(1);
            result.current.addToCart(2);
        });

        const saved = localStorage.getItem('coffee-owl-cart');
        expect(saved).toBe(JSON.stringify({ 1: 1, 2: 1 }));

        const { result: newResult } = renderHook(() => useCart());
        expect(newResult.current.getTotalItems()).toBe(2);
        expect(newResult.current.getQuantity(1)).toBe(1);
        expect(newResult.current.getQuantity(2)).toBe(1);
    });

    test('ClearCart очищает корзину', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addToCart(1);
            result.current.addToCart(2);
            result.current.clearCart();
        });

        expect(result.current.cart).toEqual({});
        expect(result.current.getTotalItems()).toBe(0);
    });
});