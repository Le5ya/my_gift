const { async } = require("jshint/src/prod-params");

const API_URL = "https://steady-hollow-lifter.glitch.me";
const swiperThumb = new Swiper('.gift__swiper_thumb', {
	slidesPerView: "auto",
	spaceBetween: 12,
	freeMode: true,
	breakpoints: {
		320: {
			spaceBetween: 12,
		},
		1141: {
			spaceBetween: 16,
		}
	},
	watchSlidesProgress: true,
});
const swiperMain = new Swiper('.gift__swiper_card', {
	spaceBetween: 16,
	thumbs: {
		swiper: swiperThumb,
	},
});




const form = document.querySelector('.form');
const submitButton = form.querySelector('.form__button');
const phoneInputs = form.querySelectorAll('.form__field_phone');
const cardInput = form.querySelector('.form__card');

const updateCardInput = () => {
	const activeSlide = document.querySelector(
		".gift__swiper_card . swiper-slide-active",
	);
	const cardData = activeSlide.querySelector(".gift__card-image").dataset.card;
	cardInput.value = cardData;
};
updateCardInput();

swiperMain.on("slideChangeTransitionEnd", updateCardInput);

for (let i = 0; i < phoneInputs.length; i++) {
	const element = phoneInputs[i];
	IMask(element, {
		mask: "+{7}(000)000-00-00",
	});
}

const updateSubmitButton = () => {
	let isFormFilled = true;

	for (const field of form.elements) {
		if (field.classList.contains('form__field')) {
			if (!field.value.trim()) {
				isFormFilled = false;
				break;	
			}
		}
	}
	submitButton.ariaDisabled = !isFormFilled;
}

const phoneValidateOption = {
	presence: {
		message: 'Поле телефон обязательно для заполнения'
	},
	format: {
		pattern: "\\+7\\(\\d{3}\\)\\d{3}-\\d{2}-\\d{2}",
		message: 'Номер телефона не соответствует формату'

	}
}

form.addEventListener('input', updateSubmitButton);

form.addEventListener('submit', async (e) => {
	e.preventDefault();

	const errors = validate(form, {
		sender_phone: phoneValidateOption,
		receiver_phone: phoneValidateOption,
	})

if (errors) {
	for (const key in errors) {
		const errorString = errors[key];
		alert(errorString);
	}
	return;
}
const formData = new FormData(form);
const data = Object.fromEntries(formData);

	try {
		const response = await fetch(`${API_URL}/api/gift`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		});
		const result = await response.json()
		if (response.ok) {
			prompt(
				"Открытка сохранена, доступна по адресу: ",
				`${location.origin}/card.html?id=${result.id}`,
			)
		} else {
			alert(`Error: ${result.message}`)
		}
		form.reset();

} catch (error) {
	alert(`Error`)
}

	
});