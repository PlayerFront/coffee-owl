import { supabase } from "../utils/supabaseClient";

const generateCode = () => '1234';

// NOTE: Регистрация пользователя
export const registerUser = async (userData) => {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { data, error } = await supabase
        .from('users')
        .upsert({
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            verification_code: code,
            code_expires_at: expiresAt.toISOString(),
            is_verified: false
        }, {
            onConflict: 'phone'
        })
        .select();

        if (error) throw error;

        console.log(`Код для ${userData.phone}: ${code}`);

        return { success: true, phone: userData.phone, code};
};

// NOTE: проверка кода пользователя
export const verifyCode = async (phone, code) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

    if (error) throw error;

    if (data.verification_code !== code) {
        throw new Error ('Неверный код');
    }

    if (new Date(data.code_expires_at) < new Date()) {
        throw new Error('Код истёк');
    }

    const { error: updateError } = await supabase 
        .from('users')
        .update({ is_verified: true, verification_code: null })
        .eq('phone', phone);

    if (updateError) throw updateError;

    return { success: true, user: data};
}

// NOTE: повторная отправка кода
export const resendCode = async (phone) => {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error } = await supabase
        .from('users')
        .update({
            verification_code: code,
            code_expires_at: expiresAt.toISOString()
        })
        .eq('phone', phone);

    if (error) throw error;

    console.log(`Новый код для ${phone}: ${code}`);
    return { success: true, code};
}