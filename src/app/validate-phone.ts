import * as glibphone from 'google-libphonenumber';

export async function validatePhone(phone: string) {
    const phoneUtil = glibphone.PhoneNumberUtil.getInstance();
    const phoneNumber = phoneUtil.parse(phone);
    const isValidNumber = phoneUtil.isValidNumber(phoneNumber);
    return isValidNumber;
}