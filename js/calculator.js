document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('loanAmount');
    const termInput = document.getElementById('loanTerm');
    const rateInput = document.getElementById('interestRate');
    const monthlyOutput = document.getElementById('monthlyPayment');
    const totalCostOutput = document.getElementById('totalPaid');
    const interestOutput = document.getElementById('totalInterest');

    const inputFields = [amountInput, termInput, rateInput];

    const toCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const updateLoanDetails = () => {
        const principal = parseFloat(amountInput.value) || 0;
        const years = parseFloat(termInput.value) || 0;
        const annualRate = parseFloat(rateInput.value) || 0;

        if (principal <= 0 || years <= 0 || annualRate <= 0) {
            monthlyOutput.textContent = toCurrency(0);
            totalCostOutput.textContent = toCurrency(0);
            interestOutput.textContent = toCurrency(0);
            return;
        }

        const monthlyRate = (annualRate / 100) / 12;
        const totalMonths = years * 12;

        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                        (Math.pow(1 + monthlyRate, totalMonths) - 1);

        const totalPaid = payment * totalMonths;
        const totalInterest = totalPaid - principal;

        monthlyOutput.textContent = toCurrency(payment);
        totalCostOutput.textContent = toCurrency(totalPaid);
        interestOutput.textContent = toCurrency(totalInterest);

        document.querySelectorAll('.result-card').forEach(card => {
            card.classList.add('updated');
            setTimeout(() => card.classList.remove('updated'), 500);
        });
    };

    inputFields.forEach(field => {
        field.addEventListener('input', updateLoanDetails);
    });

    updateLoanDetails();
});