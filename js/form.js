document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consultationForm');
    const inputGroups = form.querySelectorAll('.form-group');

    const validationRules = {
        fullName: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\+?[\d\s-]{10,}$/,
        preferredDate: /^\d{4}-\d{2}-\d{2}$/
    };

    const validateInput = (input) => {
        const value = input.value.trim();
        const rule = validationRules[input.id];
        const errorElem = input.nextElementSibling;

        if (!value) {
            displayError(input, 'This field is required.');
            return false;
        }

        if (rule && !rule.test(value)) {
            const fieldName = input.id.replace(/([A-Z])/g, ' $1').toLowerCase();
            displayError(input, `Please enter a valid ${fieldName}.`);
            return false;
        }

        removeError(input);
        return true;
    };

    const displayError = (input, message) => {
        let errorMsg = input.nextElementSibling;

        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('div');
            errorMsg.classList.add('error-message');
            input.parentNode.insertBefore(errorMsg, input.nextSibling);
        }

        errorMsg.textContent = message;
        input.classList.add('error');
    };

    const removeError = (input) => {
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
        }
        input.classList.remove('error');
    };

    inputGroups.forEach(group => {
        const field = group.querySelector('input, textarea');
        if (field) {
            field.addEventListener('blur', () => validateInput(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateInput(field);
                }
            });
        }
    });

    const showConfirmation = () => {
        const successNotice = document.createElement('div');
        successNotice.classList.add('success-message');
        successNotice.textContent = 'Thanks! We’ve received your request and will be in touch shortly.';
        form.insertBefore(successNotice, form.firstChild);

        setTimeout(() => successNotice.remove(), 5000);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let allValid = true;

        inputGroups.forEach(group => {
            const field = group.querySelector('input, textarea');
            if (field && !validateInput(field)) {
                allValid = false;
            }
        });

        if (!allValid) return;

        const submitBtn = form.querySelector('.submit-button');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const payload = {
                fullName: form.fullName.value,
                email: form.email.value,
                phone: form.phone.value,
                preferredDate: form.preferredDate.value,
                notes: form.notes.value
            };

            const res = await fetch(CONFIG.FORMPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                form.reset();
                showConfirmation();
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            const errorNotice = document.createElement('div');
            errorNotice.classList.add('error-message');
            errorNotice.textContent = 'Oops! Something went wrong. Please try again later.';
            form.insertBefore(errorNotice, form.firstChild);

            setTimeout(() => errorNotice.remove(), 5000);
            console.error('Submission error:', err);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});