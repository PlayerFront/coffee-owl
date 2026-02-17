import { supabase } from "../utils/supabaseClient";
import { saveUserToStorage } from "../utils/authStorage";

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

    return { success: true, phone: userData.phone, code };
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
        throw new Error('Неверный код');
    }

    if (new Date(data.code_expires_at) < new Date()) {
        throw new Error('Код истёк');
    }

    const { error: updateError } = await supabase
        .from('users')
        .update({ is_verified: true, verification_code: null }) //  last_login: new Date().toISOString()
        .eq('phone', phone);

    if (updateError) throw updateError;

    const updatedUser = { ...data, is_verified: true, last_login: new Date().toISOString() }; // last_login: new Date().toISOString()
    saveUserToStorage(updatedUser);

    return { success: true, user: updatedUser }; // data
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
    return { success: true, code };
} //FIXME: у нас некоторые пользователи не верифицированы

// NOTE: вход пользователя
export const loginUser = async (phone) => {
    try {
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, name, email, is_verified')
            .eq('phone', phone)
            .maybeSingle()
            // .single()
            // .catch(() => ({ data: null, error: null }));

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Ошибка проверки пользователя', fetchError);
            throw new Error('Ошибка проверки пользователя');
        }

        if (!existingUser) {
            throw new Error('Пользователь не найден. Зарегистрируйтесь');
        }

        // if (!existingUser.is_verified) {
        //     throw new Error('Пользователь не верифицирован. Завершите регистрацию.');
        // } // сомнительно, но окей

        const code = generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const { data, error } = await supabase
        .from('users')
        .update({
            verification_code: code,
            code_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('phone', phone)
        .select();
        
        if (error) {
            console.error('ошибка обновления кода', error);
            throw new Error('Не удалось отправить код. Попробуйте позже');
        }

        console.log(`Код для входа ${phone}: ${code}`);
        return{
            success: true,
            phone,
            code,
            user: existingUser
        }
    } catch (error) {
        throw error;
    }
}
