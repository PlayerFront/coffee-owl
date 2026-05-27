export const ORDER_STATUS = {
    PENDING: 'pending',
    READY: 'ready',
    CANCELLED: 'cancelled',
};

export const getStatusText = (status) => {
    const map = {
        [ORDER_STATUS.PENDING]: 'В обработке',
        [ORDER_STATUS.READY]: 'Готов',
        [ORDER_STATUS.CANCELLED]: 'Отменен',
    };

    return map[status] || 'Неизвестный статус';
};

