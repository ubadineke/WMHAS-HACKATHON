export default function randomDigits(digits: number) {
    return Math.floor(10 ** (digits - 1) + Math.random() * 9 ** (digits - 1));
}
