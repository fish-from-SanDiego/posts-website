{
    // const MIN_MONTHS_COUNT = 1;
    // const MAX_MONTHS_COUNT = 120;
    // const MIN_RATE = 0;
    // const MAX_RATE = 100;
    // const MIN_LOAN_AMOUNT = 100;
    // const MAX_LOAN_AMOUNT = 100000000;
    // it would be perfect to validate parameters before save but i'm lazy
    const LOAN_STORAGE_OBJECT_KEY = 'loanCalcLoanData';

    class LoanData {
        constructor(loanAmount, monthsCount, loanRate) {
            this.amount = parseFloat(loanAmount);
            this.monthsCount = parseInt(monthsCount, 10);
            this.rate = parseFloat(loanRate);
        }
    }

    window.addEventListener('storage', onStorageChange);

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('loan_calc_form');
        form.addEventListener('submit', onLoanFormSubmit);
        form.addEventListener('click', onFormButtonClick);
        if (window.localStorage.getItem(LOAN_STORAGE_OBJECT_KEY) !== null) {
            showFormButtonsByClasses(form, 'form__button--load', 'form__button--clear');
        }
    });

    function onLoanFormSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const loanData = getDataFromLoanForm(form);
        const loanPrincipalPerMonth = loanData.amount / loanData.monthsCount;
        const monthlyRate = loanData.rate / 12 / 100;
        const payments = [];
        let remainingLoanAmount = loanData.amount;
        for (let i = 0; i < loanData.monthsCount; i++) {
            remainingLoanAmount -= loanPrincipalPerMonth;
            const interest = remainingLoanAmount * monthlyRate;
            const payment = loanPrincipalPerMonth + interest;
            payments.push({
                month: i + 1,
                payment: payment.toFixed(2),
                remainingLoanAmount: remainingLoanAmount.toFixed(2)
            });
        }
        const tableItemNodes = getPaymentNodes(payments);
        const calcContainer = document.getElementById("loan_calc_container");
        const oldTableNode = calcContainer.querySelector('.vertical-container__item > .table--calc-results');
        const newTableNode = document.createElement('div');
        newTableNode.classList.add('table', 'table--calc-results');
        newTableNode.innerHTML = `<p class="table__item table__item--header">№</p>
                    <p class="table__item table__item--header">Выплата</p>
                    <p class="table__item table__item--header">Оставшийся долг</p>`;
        tableItemNodes.forEach(node => newTableNode.appendChild(node));
        oldTableNode.replaceWith(newTableNode);
        calcContainer.querySelectorAll('.vertical-container__item > .vertical-container__hr')
            .forEach(node => node.parentElement?.classList.remove('vertical-container__item--hidden'));
        newTableNode.parentElement?.classList.remove('vertical-container__item--hidden');
    }

    function onStorageChange(event) {
        const form = document.getElementById('loan_calc_form');
        if (event.key == null || event.key === LOAN_STORAGE_OBJECT_KEY && event.newValue === null) {
            hideFormButtonsByClasses(form, 'form__button--load', 'form__button--clear');

        } else if (event.key === LOAN_STORAGE_OBJECT_KEY && event.oldValue === null && event.newValue !== null) {
            showFormButtonsByClasses(form, 'form__button--load', 'form__button--clear');
        }
    }

    function hideFormButtonsByClasses(formElement, ...classNames) {
        const classNamesSet = new Set(classNames);
        formElement.querySelectorAll('.form__button').forEach(button => {
            if (Array.from(button.classList).filter(className => classNamesSet.has(className)).length !== 0) {
                button.classList.add('form__button--hidden');
            }
        });
    }

    function showFormButtonsByClasses(formElement, ...classNames) {
        const classNamesSet = new Set(classNames);
        formElement.querySelectorAll('.form__button').forEach(button => {
            if (Array.from(button.classList).filter(className => classNamesSet.has(className)).length !== 0) {
                button.classList.remove('form__button--hidden');
            }
        });
    }

    function onFormButtonClick(event) {
        if (event.target.closest('.form__button--save')) {
            onParametersSave(event);
        } else if (event.target.closest('.form__button--load')) {
            onParametersLoad(event);
        } else if (event.target.closest('.form__button--clear')) {
            onParametersClear(event);
        }
    }

    function onParametersSave(event) {
        event.preventDefault();
        const form = event.currentTarget;
        window.localStorage.setItem(LOAN_STORAGE_OBJECT_KEY, JSON.stringify(getDataFromLoanForm(form)));
        showFormButtonsByClasses(form, 'form__button--load', 'form__button--clear');
    }

    function onParametersLoad(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const loanData = JSON.parse(window.localStorage.getItem(LOAN_STORAGE_OBJECT_KEY));
        if (loanData == null)
            return;
        const elemsByName = {};
        form.querySelectorAll('.form__input').forEach(node => elemsByName[node.getAttribute('name')] = node);
        for (const [key, value] of Object.entries(loanData)) {
            if (value == null || value === Number.NaN || elemsByName[key] == null) {
                elemsByName[key].value = "";
                continue;
            }
            elemsByName[key].value = value.toString();
        }

    }

    function onParametersClear(event) {
        event.preventDefault();
        window.localStorage.removeItem(LOAN_STORAGE_OBJECT_KEY);
        const form = event.currentTarget;
        hideFormButtonsByClasses(form, 'form__button--load', 'form__button--clear');
    }

    function getPaymentNodes(payments) {
        const nodes = [];
        for (const payment of payments) {
            nodes.push(TableItem(payment.month), TableItem(payment.payment),
                TableItem(payment.remainingLoanAmount));
        }
        return nodes;
    }

    function TableItem(innerText) {
        const node = document.createElement('p');
        node.classList.add('table__item');
        node.innerText = innerText;
        return node;
    }

    function getDataFromLoanForm(form) {
        const formData = new FormData(form);
        return new LoanData(formData.get('amount'), formData.get('monthsCount'), formData.get('rate'));
    }


}

