import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [rates, setRates] = useState({});
  const [currencyList, setCurrencyList] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BYN');
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let fromAmount = 0;
  let toAmount = 0;

  (function calculateCurrency() {
    const targetRate = rates[toCurrency] || 0;

      if (targetRate > 0) {
        if (amountInFromCurrency) {
          fromAmount = amount;
          toAmount = amount * targetRate;
        } else {
          toAmount = amount;
          fromAmount = amount / targetRate;
        }
      }
  })();

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;
    const URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

    fetch(URL)
      .then(res => {
        if(!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (data.result == 'success') {
          setRates(data.conversion_rates);
          setCurrencyList([...Object.keys(data.conversion_rates)]);
        } else {
          throw new Error(data['error-type'] || 'Unknown error');
        }
      })
      .catch(e => {
        setError(e);
        console.log(e);
      })
      .finally(() => {
          setLoading(false);
      })    
    
  }, [fromCurrency]);

  const handleFromAmountChange = (e) => {
    setAmount(Number(e.target.value));
    setAmountInFromCurrency(true);
  }

  const handleToAmountChange = (e) => {
    setAmount(Number(e.target.value));
    setAmountInFromCurrency(false);
  }

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>ERROR: {error}</div>

  return (
    <div className="container">
      <h1>Currency Converter</h1>
      <div className='converter-box'>
        <div className='converter-box__calculator'>
          <input type="number" value={fromAmount ? Number(fromAmount).toFixed(2) : ''} onChange={handleFromAmountChange} placeholder='From...' min={0}/>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencyList.map((code) => 
              <option value={code} key={code}>{code}</option>
            )}
          </select>

          <strong> = </strong>

          <input type="number" value={toAmount ? Number(toAmount).toFixed(2) : ''} onChange={handleToAmountChange} placeholder='To...' min={0}/>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencyList.map((code) => 
              <option value={code} key={code}>{code}</option>
            )}
          </select>
        </div>
        <div className='converter-box__checkbox'>
          <label>
            <input type="checkbox" checked={amountInFromCurrency} onChange={() => setAmountInFromCurrency(!amountInFromCurrency)} />
            Amount in from currency
          </label>
        </div>
      </div>
    </div>
  )
}

export default App
