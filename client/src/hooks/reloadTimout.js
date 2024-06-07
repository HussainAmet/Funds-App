let timeoutId;

export const resetTimer = () => {
    if (timeoutId) {
        clearTimeout(timeoutId)
    }

    setTimeout(() => {
        window.location.reload();
    }, 15 * 60 * 1000);
}