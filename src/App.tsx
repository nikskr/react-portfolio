import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [rates, setRates] = useState<Record<string, number>>({"BYN": 3, "RUB": 100, "USD": 1});
  const [currencyList, setCurrencyList] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BYN');
  const [amount, setAmount] = useState<string>('1');
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [focusedInput, setFocusedInput] = useState<'from' | 'to' | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const targetRate = rates[toCurrency] || 0;
  const numericAmount = Number(amount);
  let fromAmount = 0;
  let toAmount = 0;

  if (targetRate > 0) {
    if (amountInFromCurrency) {
      fromAmount = Number(numericAmount.toFixed(2));
      toAmount = Number((numericAmount * targetRate).toFixed(2));
    } else {
      toAmount = Number(numericAmount.toFixed(2));
      fromAmount = Number((numericAmount / targetRate).toFixed(2));
    }
  }

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
        setCurrencyList(Object.keys({"BYN": 3, "RUB": 100, "USD": 1}));
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
          <input type="number" value={focusedInput === 'from' ? fromAmount : Number(fromAmount).toFixed(2)} onChange={handleFromAmountChange} placeholder='From...' min={0} onFocus={() => setFocusedInput('from')} onBlur={() => setFocusedInput(null)}/>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencyList.map((code) => 
              <option value={code} key={code}>{code}</option>
            )}
          </select>

          <strong> = </strong>

          <input type="number" value={focusedInput === 'to' ? toAmount : Number(toAmount).toFixed(2)} onChange={handleToAmountChange} placeholder='To...' min={0} onFocus={() => setFocusedInput('to')} onBlur={() => setFocusedInput(null)}/>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencyList.map((code) => {
              console.log(code);
              return <option value={code} key={code}>{code}</option>
            }
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
      <div className='currency-info'>
            <h2 className='currency-info__header'>1 {fromCurrency}</h2>
            <hr style={{width: "100%"}}/>
            <div className='currency-info__container'>
              {Object.entries(rates).map(([key, value]) => {
                return (
                  <div className='currency-info__item' key={key}>
                    {value + ' ' + key}
                  </div>
                )
              })}
            </div>
      </div>
    </div>
  )
}

export default App
