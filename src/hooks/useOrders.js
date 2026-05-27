import { useState, useEffect } from "react";
import { getUserFromStorage } from "../utils/authStorage";
import { getUserOrders } from "../api/orderApi";

export const useUserOrders = () => {
    const [state, setState] = useState({
        orders: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = getUserFromStorage();
                if (!user?.id) {
                    setState({
                        orders: [],
                        loading: false,
                        error: 'Пользователь не авторизован',
                    })
                    return;
                } 

                const data = await getUserOrders(user.id);
                setState({
                    orders: data,
                    loading: false,
                    error: null,
                });
            } catch (err) {
                setState({
                    orders: [],
                    loading: false,
                    error: err.message || 'Ошибка загрузки заказов',
                });
            }
        };
        fetchOrders();
    }, []);

    return state;
}