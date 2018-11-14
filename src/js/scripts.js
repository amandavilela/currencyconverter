if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => {
            console.info('Service Worker Registered', reg);
        })
        .catch(err => {
            console.info('Error registering Service Worker', err);
        });
}

const baseCurrency = document.querySelector('.base-currency')
const convertedCurrency = document.querySelector('.converted-currency');
const baseValue = document.querySelector('.base-value');
const convertedValue = document.querySelector('.converted-value');
const apiUrl = `https://api.exchangeratesapi.io/latest?base=${baseCurrency.value}`;

window.addEventListener('offline', () => {
    baseCurrency.value = localStorage.getItem('baseCurrency');
    baseCurrency.disabled = true;
});

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
    convertedValue.value = (baseValue.value * conversionRate).toFixed(2);
}
