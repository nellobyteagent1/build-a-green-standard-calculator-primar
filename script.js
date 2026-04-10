(() => {
  const display = document.getElementById('display');
  const expression = document.getElementById('expression');

  let current = '0';
  let previous = '';
  let operator = null;
  let shouldReset = false;

  function updateDisplay() {
    display.textContent = formatNumber(current);
  }

  function formatNumber(str) {
    if (str === 'Error') return str;
    if (str.includes('.') && str.endsWith('.')) return str;
    const num = parseFloat(str);
    if (isNaN(num)) return str;
    if (str.includes('.')) {
      const [intPart, decPart] = str.split('.');
      return intPart + '.' + decPart;
    }
    if (Math.abs(num) >= 1e15) return num.toExponential(6);
    return str;
  }

  function getOperatorSymbol(op) {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return symbols[op] || op;
  }

  function inputNumber(value) {
    if (current === 'Error') {
      current = value;
      shouldReset = false;
      updateDisplay();
      return;
    }
    if (shouldReset) {
      current = value;
      shouldReset = false;
    } else if (current === '0' && value !== '0') {
      current = value;
    } else if (current === '0' && value === '0') {
      return;
    } else {
      if (current.replace(/[^0-9]/g, '').length >= 15) return;
      current = current + value;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (current === 'Error') {
      current = '0.';
      shouldReset = false;
      updateDisplay();
      return;
    }
    if (shouldReset) {
      current = '0.';
      shouldReset = false;
    } else if (!current.includes('.')) {
      current = current + '.';
    }
    updateDisplay();
  }

  function inputOperator(op) {
    if (current === 'Error') return;
    if (operator && !shouldReset) {
      calculate();
    }
    previous = current;
    operator = op;
    shouldReset = true;
    expression.textContent = previous + ' ' + getOperatorSymbol(op);
  }

  function calculate() {
    if (!operator || previous === '') return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result;

    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/':
        if (b === 0) {
          current = 'Error';
          expression.textContent = '';
          operator = null;
          previous = '';
          shouldReset = true;
          updateDisplay();
          return;
        }
        result = a / b;
        break;
    }

    const resultStr = parseFloat(result.toPrecision(12)).toString();
    expression.textContent = previous + ' ' + getOperatorSymbol(operator) + ' ' + current + ' =';
    current = resultStr;
    operator = null;
    previous = '';
    shouldReset = true;
    updateDisplay();
  }

  function clear() {
    current = '0';
    previous = '';
    operator = null;
    shouldReset = false;
    expression.textContent = '';
    updateDisplay();
  }

  function backspace() {
    if (current === 'Error' || shouldReset) {
      clear();
      return;
    }
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  }

  function percent() {
    if (current === 'Error') return;
    const num = parseFloat(current);
    current = (num / 100).toString();
    updateDisplay();
  }

  // Button click handler
  document.querySelector('.buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const action = btn.dataset.action;

    switch (action) {
      case 'number':   inputNumber(btn.dataset.value); break;
      case 'decimal':  inputDecimal(); break;
      case 'operator': inputOperator(btn.dataset.value); break;
      case 'equals':   calculate(); break;
      case 'clear':    clear(); break;
      case 'backspace': backspace(); break;
      case 'percent':  percent(); break;
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') inputOperator('+');
    else if (e.key === '-') inputOperator('-');
    else if (e.key === '*') inputOperator('*');
    else if (e.key === '/') { e.preventDefault(); inputOperator('/'); }
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Escape') clear();
    else if (e.key === 'Backspace') backspace();
    else if (e.key === '%') percent();
  });

  updateDisplay();
})();
