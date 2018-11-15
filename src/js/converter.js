const baseCurrency = document.querySelector('.base-currency');
const convertedCurrency = document.querySelector('.converted-currency');
const baseValue = document.querySelector('.base-value');
const convertedValue = document.querySelector('.converted-value');
const apiUrl = `https://api.exchangeratesapi.io/latest?base=${baseCurrency.value}`;

window.addEventListener('offline', () => {
    toggleOffileMessage(true);
    baseCurrency.value = localStorage.getItem('baseCurrency');
    baseCurrency.disabled = true;
});

window.addEventListener('online', () => {
    toggleOffileMessage(false);
});

function toggleOffileMessage(showMessage) {
    const offlineMessage = document.querySelector('.offline-message');
    const lastConversionDate = new Date(localStorage.getItem('lastConversionDate'));
    offlineMessage.innerHTML = lastConversionDate ?
        `You are offline, rates from ${lastConversionDate.getMonth()}/
        ${lastConversionDate.getDate()}/${lastConversionDate.getFullYear()} -
        ${lastConversionDate.getHours()}:${lastConversionDate.getMinutes()}` : '';
    offlineMessage.style.display = showMessage == true ? 'block' : 'none';
}

(function initialize() {
    convertCurrency();

    localStorage.setItem('baseCurrency', baseCurrency.value);
    baseCurrency.addEventListener('change', baseCurrencyChangeHandler);
    baseValue.addEventListener('change', convertCurrency);
    convertedCurrency.addEventListener('change', convertCurrency);
})();

function baseCurrencyChangeHandler() {
    localStorage.setItem('baseCurrency', baseCurrency.value);
    convertCurrency();
}

async function getConversionRate(currency) {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.rates[currency];
}

async function convertCurrency() {
    const conversionRate = await getConversionRate(convertedCurrency.value);
    localStorage.setItem('lastConversionDate', new Date());
    convertedValue.value = (baseValue.value * conversionRate).toFixed(2);
}
