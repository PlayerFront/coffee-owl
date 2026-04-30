import { supabase } from '../utils/supabaseClient';

export const createOrder = async (userId, items, totalPrice, pickupTime, paymentMethod) => {

    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 900 + 100);
    const displayId = `CWL-${day}${random}`;

    if (!userId) {
        throw new Error('User ID is required');
    }

    if (!items || Object.keys(items).length === 0) {
        throw new Error('Cart is empty');
    }

    if (!pickupTime) {
        throw new Error('Pickup time is required');
    }

    const { data, error } = await supabase
        .from('orders')
        .insert([{
            user_id: userId,
            items: items,
            total_price: totalPrice,
            pickup_time: pickupTime,
            payment_method: paymentMethod,
            status: 'pending',
            display_id: displayId
        }])
        .select();

    if (error) {
        console.error('Supabase error', error);
        throw new Error('Failed to create order');
    }

    return data[0];
}

export const getUserOrders = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase error', error);
        throw new Error('Failed to fetch orders');
    }

    return data;
}