import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function readJson(relativePath) {
	const absolutePath = path.resolve(relativePath);
	return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

function readText(relativePath) {
	const absolutePath = path.resolve(relativePath);
	return fs.readFileSync(absolutePath, 'utf8');
}

function get(object, dottedPath) {
	return dottedPath.split('.').reduce((value, key) => value?.[key], object);
}

const cases = [
	['frontend/i18n/locales/en/auth/register.json', 'auth.register.agreePrefix', "I agree to Musticker’s "],
	['frontend/i18n/locales/en/auth/register.json', 'auth.register.passwordHint', 'Your password must be at least 6 characters and should include an uppercase letter, a number, or a special character.'],
	['frontend/i18n/locales/kr/auth/register.json', 'auth.register.enterFirstName', '이름 입력'],
	['frontend/i18n/locales/kr/auth/register.json', 'auth.register.lastNameOptionalLabel', '성 (선택)'],
	['frontend/i18n/locales/en/auth/verification.json', 'auth.verification.title', 'Verification Required'],
	['frontend/i18n/locales/en/auth/verification.json', 'auth.verification.enterCode', 'Please enter the code:'],
	['frontend/i18n/locales/en/auth/verification.json', 'auth.verification.resendPrefix', "Didn't get the code? Check your spam folder or "],
	['frontend/i18n/locales/en/auth/verification.json', 'auth.verification.resendCta', 'Resend Code'],
	['frontend/i18n/locales/en/auth/verification.json', 'auth.verification.expiredCode', 'This verification code has expired. Click the [b]Resend Code[/b] button below to get a new one.'],
	['frontend/i18n/locales/kr/auth/verification.json', 'auth.verification.title', '인증 요청'],
	['frontend/i18n/locales/kr/auth/verification.json', 'auth.verification.enterCode', '인증 번호를 입력하세요'],
	['frontend/i18n/locales/kr/auth/verification.json', 'auth.verification.verify', '확인'],
	['frontend/i18n/locales/kr/auth/verification.json', 'auth.verification.codeRequired', '이메일로 발송된 인증 번호 입력해 주세요'],
	['frontend/i18n/locales/en/auth/loginVerification.json', 'auth.loginVerification.resendPrefix', "Didn't get the code? Check your spam folder or "],
	['frontend/i18n/locales/en/auth/loginVerification.json', 'auth.loginVerification.resendCta', 'Resend Code'],
	['frontend/i18n/locales/en/auth/guestVerification.json', 'auth.guestVerification.resendPrefix', "Didn't get the code? Check your spam folder or "],
	['frontend/i18n/locales/en/auth/guestVerification.json', 'auth.guestVerification.resendCta', 'Resend Code'],
	['frontend/i18n/locales/en/auth/login.json', 'auth.login.validation.orderNotFound', 'Order does not exist'],
	['frontend/i18n/locales/kr/auth/login.json', 'auth.login.validation.orderNotFound', '존재하지 않는 주문입니다.'],
	['frontend/i18n/locales/en/auth/reset.json', 'auth.reset.description', 'Password must be at least 6 characters and include an uppercase letter, number, or special character.'],
	['frontend/i18n/locales/en/auth/reset.json', 'auth.reset.enterNewPassword', 'Enter New Password'],
	['frontend/i18n/locales/en/auth/reset.json', 'auth.reset.confirmPassword', 'Confirm Password'],
	['frontend/i18n/locales/kr/auth/reset.json', 'auth.reset.enterNewPassword', '새 비밀번호를 입력해주세요'],
	['frontend/i18n/locales/kr/auth/reset.json', 'auth.reset.confirmPassword', '비밀번호를 확인해주세요'],
	['frontend/i18n/locales/en/account/profile.json', 'account.profile.photoUploadSuccess', 'Profile picture updated successfully.'],
	['frontend/i18n/locales/en/account/profile.json', 'account.profile.passwordHint', 'Password must be atleast 6 characters and include an uppercase letter, number, or special character.'],
	['frontend/i18n/locales/en/account/profile.json', 'account.profile.newPasswordPlaceholder', 'Enter New Password'],
	['frontend/i18n/locales/en/account/profile.json', 'account.profile.confirmPassword', 'Confirm Password'],
	['frontend/i18n/locales/en/checkout/guest.json', 'checkout.guest.fields.fullName.label', 'Full Name'],
	['frontend/i18n/locales/en/checkout/guest.json', 'checkout.guest.fields.fullName.placeholder', 'Enter Full Name'],
	['frontend/i18n/locales/en/checkout/guest.json', 'checkout.guest.fields.phone.label', 'Contact Number'],
	['frontend/i18n/locales/kr/checkout/guest.json', 'checkout.guest.fields.fullName.label', '성함'],
	['frontend/i18n/locales/kr/checkout/guest.json', 'checkout.guest.fields.company.placeholder', '화사명을 입력해 주세요'],
	['frontend/i18n/locales/kr/checkout/guest.json', 'checkout.guest.fields.streetAddress.line1Placeholder', '주소1을 입력해 주세요'],
	['frontend/i18n/locales/kr/checkout/guest.json', 'checkout.guest.fields.streetAddress.line2Placeholder', '주소2를  입력해 주세요'],
	['frontend/i18n/locales/kr/checkout/guest.json', 'checkout.guest.fields.province.placeholder', '시/도를 선택해 주세요'],
	['frontend/i18n/locales/kr/checkout/guest.json', 'checkout.guest.fields.city.placeholder', '시/군/구를 입력해 주세요'],
	['frontend/i18n/locales/kr/checkout/guest.json', 'checkout.guest.fields.postalCode.placeholder', '우편번호를 입력해 주세요'],
	['frontend/i18n/locales/kr/checkout/member.json', 'checkout.member.shippingNote', '안내 : 오늘 주문 확정 시 도착 예정일입니다.'],
	['frontend/i18n/locales/kr/checkout/member.json', 'checkout.member.payment', '결제 수단'],
	['frontend/i18n/locales/kr/checkout/member.json', 'checkout.member.viewBillingAddresses', '청구지 주소 보기'],
	['frontend/i18n/locales/kr/checkout/member.json', 'checkout.member.useShippingAsBilling', '배송지 주소를 결제 청구지와 동일하게 사용'],
	['frontend/i18n/locales/kr/account/profile.json', 'account.profile.emailChangeVerification.title', '인증 요청'],
	['frontend/i18n/locales/kr/account/profile.json', 'account.profile.emailChangeVerification.enterCode', '번호를 입력해 주세요'],
	['frontend/i18n/locales/en/layout/header/search.json', 'layout.header.search.modal.recent.title', 'Recent Search'],
	['frontend/i18n/locales/kr/layout/header/search.json', 'layout.header.search.modal.recent.title', '최근 검색'],
	['frontend/i18n/locales/en/home/tour.json', 'home.tour.step2.title', 'Explore Our Products 🧐'],
	['frontend/i18n/locales/en/home/tour.json', 'home.tour.step2.body', 'Explore all our products in one place. Use the product links in the header to quickly find the perfect stickers for your needs.'],
];

for (const [filePath, dottedPath, expected] of cases) {
	const value = get(readJson(filePath), dottedPath);
	assert.equal(value, expected, `${filePath} -> ${dottedPath}`);
}

const addressBookFormFields = readText('frontend/app/components/shared/address/AddressFormFields.vue');
assert.match(
	addressBookFormFields,
	/translate\('account\.addressBook\.companyOptional'\)/,
	'AddressFormFields.vue should use the localized address-book company label.'
);

const addressBookDeleteModal = readText('frontend/app/components/account/pages/address-book/AddressBookDeleteConfirmModal.vue');
assert.match(
	addressBookDeleteModal,
	/:cancel-label="t\('account\.addressBook\.cancel'\)"/,
	'AddressBookDeleteConfirmModal.vue should pass the localized cancel label.'
);
assert.match(
	addressBookDeleteModal,
	/:confirm-label="t\('account\.addressBook\.delete'\)"/,
	'AddressBookDeleteConfirmModal.vue should pass the localized delete label.'
);

console.log(`Verified ${cases.length} i18n bug-report expectations.`);