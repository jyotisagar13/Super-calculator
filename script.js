// Global variables
let currentTab = 'basic';
let basicExpression = '';
let chartInstance = null;

// Matrix operations global variables
let matrixA = [];
let matrixB = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeUnitConverter();
    initializeFormulas();
    setupEventListeners();
    // Initialize matrix inputs
    createMatrixA();
    createMatrixB();
    // Initialize periodic table
    if (document.getElementById('periodicTable')) {
        initializePeriodicTable();
    }
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    currentTab = tabName;
}

// Basic Calculator Functions
function appendBasic(value) {
    const display = document.getElementById('basicDisplay');
    if (display.value === '0' || display.value === 'Error') {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearBasic() {
    document.getElementById('basicDisplay').value = '0';
    basicExpression = '';
}

function clearEntryBasic() {
    const display = document.getElementById('basicDisplay');
    display.value = display.value.slice(0, -1) || '0';
}

function calculateBasic() {
    const display = document.getElementById('basicDisplay');
    try {
        // Replace × with * for evaluation
        const expression = display.value.replace(/×/g, '*');
        const result = evaluateExpression(expression);
        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}

// Advanced Mathematical Functions
function calculateAdvanced() {
    const input = document.getElementById('advancedInput').value;
    const resultDiv = document.getElementById('advancedResult');
    
    try {
        const result = evaluateAdvancedExpression(input);
        resultDiv.innerHTML = `<span class="success">Result: ${result}</span>`;
    } catch (error) {
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}

function insertFunction(funcStart, funcEnd = ')') {
    const input = document.getElementById('advancedInput');
    const cursorPos = input.selectionStart;
    const value = input.value;
    const newValue = value.substring(0, cursorPos) + funcStart + value.substring(cursorPos) + funcEnd;
    input.value = newValue;
    input.focus();
    input.setSelectionRange(cursorPos + funcStart.length, cursorPos + funcStart.length);
}

// Mathematical Expression Evaluator
function evaluateExpression(expr) {
    // Basic arithmetic evaluation with safety checks
    const sanitized = expr.replace(/[^0-9+\-*/.() ]/g, '');
    return Function('"use strict"; return (' + sanitized + ')')();
}

function evaluateAdvancedExpression(expr) {
    // Advanced mathematical expression evaluator
    let expression = expr.toLowerCase();
    
    // Replace mathematical functions
    expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
    expression = expression.replace(/sin\(/g, 'Math.sin(');
    expression = expression.replace(/cos\(/g, 'Math.cos(');
    expression = expression.replace(/tan\(/g, 'Math.tan(');
    expression = expression.replace(/log\(/g, 'Math.log10(');
    expression = expression.replace(/ln\(/g, 'Math.log(');
    expression = expression.replace(/exp\(/g, 'Math.exp(');
    expression = expression.replace(/abs\(/g, 'Math.abs(');
    expression = expression.replace(/pow\(/g, 'Math.pow(');
    expression = expression.replace(/factorial\(/g, 'factorial(');
    expression = expression.replace(/\^/g, '**');
    expression = expression.replace(/π/g, 'Math.PI');
    expression = expression.replace(/e/g, 'Math.E');
    
    // Define factorial function
    window.factorial = function(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };
    
    return Function('"use strict"; return (' + expression + ')')();
}

// Equation Solvers
function solveLinear() {
    const a = parseFloat(document.getElementById('linearA').value);
    const b = parseFloat(document.getElementById('linearB').value);
    const resultDiv = document.getElementById('solutionResult');
    
    if (isNaN(a) || isNaN(b)) {
        resultDiv.innerHTML = '<span class="error">Please enter valid coefficients</span>';
        return;
    }
    
    if (a === 0) {
        if (b === 0) {
            resultDiv.innerHTML = '<span class="info">Infinite solutions</span>';
        } else {
            resultDiv.innerHTML = '<span class="error">No solution</span>';
        }
    } else {
        const x = -b / a;
        resultDiv.innerHTML = `<span class="success">x = ${x.toFixed(6)}</span>`;
    }
}

function solveQuadratic() {
    const a = parseFloat(document.getElementById('quadA').value);
    const b = parseFloat(document.getElementById('quadB').value);
    const c = parseFloat(document.getElementById('quadC').value);
    const resultDiv = document.getElementById('solutionResult');
    
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        resultDiv.innerHTML = '<span class="error">Please enter valid coefficients</span>';
        return;
    }
    
    if (a === 0) {
        resultDiv.innerHTML = '<span class="error">Coefficient a cannot be zero for quadratic equation</span>';
        return;
    }
    
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant > 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        resultDiv.innerHTML = `<span class="success">x₁ = ${x1.toFixed(6)}<br>x₂ = ${x2.toFixed(6)}</span>`;
    } else if (discriminant === 0) {
        const x = -b / (2 * a);
        resultDiv.innerHTML = `<span class="success">x = ${x.toFixed(6)} (double root)</span>`;
    } else {
        const realPart = -b / (2 * a);
        const imagPart = Math.sqrt(-discriminant) / (2 * a);
        resultDiv.innerHTML = `<span class="info">x₁ = ${realPart.toFixed(6)} + ${imagPart.toFixed(6)}i<br>x₂ = ${realPart.toFixed(6)} - ${imagPart.toFixed(6)}i</span>`;
    }
}

// Statistics Functions
function calculateStats() {
    const input = document.getElementById('statsData').value;
    const resultDiv = document.getElementById('statsResults');
    
    try {
        const data = input.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
        
        if (data.length === 0) {
            throw new Error('No valid data points');
        }
        
        const stats = {
            count: data.length,
            sum: data.reduce((a, b) => a + b, 0),
            mean: 0,
            median: 0,
            mode: [],
            range: 0,
            variance: 0,
            stdDev: 0,
            min: Math.min(...data),
            max: Math.max(...data)
        };
        
        stats.mean = stats.sum / stats.count;
        
        // Median
        const sorted = [...data].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        stats.median = sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
        
        // Mode
        const frequency = {};
        data.forEach(x => frequency[x] = (frequency[x] || 0) + 1);
        const maxFreq = Math.max(...Object.values(frequency));
        stats.mode = Object.keys(frequency).filter(x => frequency[x] === maxFreq).map(Number);
        
        // Range
        stats.range = stats.max - stats.min;
        
        // Variance and Standard Deviation
        const sumSquaredDiffs = data.reduce((sum, x) => sum + Math.pow(x - stats.mean, 2), 0);
        stats.variance = sumSquaredDiffs / stats.count;
        stats.stdDev = Math.sqrt(stats.variance);
        
        resultDiv.innerHTML = `
            <div class="stats-grid">
                <div><strong>Count:</strong> ${stats.count}</div>
                <div><strong>Sum:</strong> ${stats.sum.toFixed(4)}</div>
                <div><strong>Mean:</strong> ${stats.mean.toFixed(4)}</div>
                <div><strong>Median:</strong> ${stats.median.toFixed(4)}</div>
                <div><strong>Mode:</strong> ${stats.mode.join(', ')}</div>
                <div><strong>Range:</strong> ${stats.range.toFixed(4)}</div>
                <div><strong>Min:</strong> ${stats.min.toFixed(4)}</div>
                <div><strong>Max:</strong> ${stats.max.toFixed(4)}</div>
                <div><strong>Variance:</strong> ${stats.variance.toFixed(4)}</div>
                <div><strong>Std Dev:</strong> ${stats.stdDev.toFixed(4)}</div>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
}

// Finance Calculators
function calculateSIP() {
    const amount = parseFloat(document.getElementById('sipAmount').value);
    const rate = parseFloat(document.getElementById('sipRate').value);
    const years = parseFloat(document.getElementById('sipYears').value);
    const resultDiv = document.getElementById('sipResults');
    
    if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
        resultDiv.innerHTML = '<span class="error">Please enter valid values</span>';
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const totalInvestment = amount * months;
    
    // SIP Future Value Formula
    const futureValue = amount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const returns = futureValue - totalInvestment;
    
    resultDiv.innerHTML = `
        <div class="finance-result">
            <h3>SIP Investment Summary</h3>
            <div><strong>Monthly Investment:</strong> ₹${amount.toLocaleString()}</div>
            <div><strong>Investment Period:</strong> ${years} years (${months} months)</div>
            <div><strong>Expected Annual Return:</strong> ${rate}%</div>
            <div><strong>Total Investment:</strong> ₹${totalInvestment.toLocaleString()}</div>
            <div><strong>Estimated Returns:</strong> ₹${returns.toLocaleString()}</div>
            <div class="highlight"><strong>Maturity Value:</strong> ₹${futureValue.toLocaleString()}</div>
        </div>
    `;
}

function calculateEMI() {
    const principal = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('loanRate').value);
    const tenure = parseFloat(document.getElementById('loanTenure').value);
    const resultDiv = document.getElementById('emiResults');
    
    if (isNaN(principal) || isNaN(rate) || isNaN(tenure)) {
        resultDiv.innerHTML = '<span class="error">Please enter valid values</span>';
        return;
    }
    
    const monthlyRate = rate / 100 / 12;
    const months = tenure * 12;
    
    // EMI Formula
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;
    
    resultDiv.innerHTML = `
        <div class="finance-result">
            <h3>EMI Calculation</h3>
            <div><strong>Loan Amount:</strong> ₹${principal.toLocaleString()}</div>
            <div><strong>Interest Rate:</strong> ${rate}% per annum</div>
            <div><strong>Loan Tenure:</strong> ${tenure} years</div>
            <div class="highlight"><strong>Monthly EMI:</strong> ₹${emi.toLocaleString()}</div>
            <div><strong>Total Interest:</strong> ₹${totalInterest.toLocaleString()}</div>
            <div><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</div>
        </div>
    `;
}

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('interestRate').value);
    const time = parseFloat(document.getElementById('timePeriod').value);
    const frequency = parseInt(document.getElementById('compoundFreq').value);
    const resultDiv = document.getElementById('compoundResults');
    
    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        resultDiv.innerHTML = '<span class="error">Please enter valid values</span>';
        return;
    }
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const amount = principal * Math.pow((1 + rate / 100 / frequency), frequency * time);
    const compoundInterest = amount - principal;
    
    // Simple Interest for comparison
    const simpleInterest = principal * rate * time / 100;
    const simpleAmount = principal + simpleInterest;
    
    resultDiv.innerHTML = `
        <div class="finance-result">
            <h3>Compound Interest Calculation</h3>
            <div><strong>Principal:</strong> ₹${principal.toLocaleString()}</div>
            <div><strong>Interest Rate:</strong> ${rate}% per annum</div>
            <div><strong>Time Period:</strong> ${time} years</div>
            <div><strong>Compounding:</strong> ${getCompoundingText(frequency)}</div>
            <br>
            <div class="highlight"><strong>Final Amount:</strong> ₹${amount.toLocaleString()}</div>
            <div><strong>Compound Interest:</strong> ₹${compoundInterest.toLocaleString()}</div>
            <br>
            <div><strong>Simple Interest (comparison):</strong> ₹${simpleInterest.toLocaleString()}</div>
            <div><strong>Additional earnings:</strong> ₹${(compoundInterest - simpleInterest).toLocaleString()}</div>
        </div>
    `;
}

function getCompoundingText(frequency) {
    const frequencies = {
        1: 'Annually',
        2: 'Semi-annually',
        4: 'Quarterly',
        12: 'Monthly',
        365: 'Daily'
    };
    return frequencies[frequency] || 'Custom';
}

// Event Listeners Setup
function setupEventListeners() {
    // Equation type change
    const equationType = document.getElementById('equationType');
    if (equationType) {
        equationType.addEventListener('change', function() {
            const linearInputs = document.getElementById('linearInputs');
            const quadraticInputs = document.getElementById('quadraticInputs');
            
            if (this.value === 'linear') {
                linearInputs.style.display = 'flex';
                quadraticInputs.style.display = 'none';
            } else {
                linearInputs.style.display = 'none';
                quadraticInputs.style.display = 'flex';
            }
        });
    }
    
    // Unit category change
    const unitCategory = document.getElementById('unitCategory');
    if (unitCategory) {
        unitCategory.addEventListener('change', initializeUnitConverter);
    }
    
    // Formula category change
    const formulaCategory = document.getElementById('formulaCategory');
    if (formulaCategory) {
        formulaCategory.addEventListener('change', displayFormulas);
    }
}

// Placeholder functions for additional features
function plotFunction() {
    // Will implement function plotting
    console.log('Plotting function...');
}

function createChart() {
    // Will implement chart creation
    console.log('Creating chart...');
}

function convertBases() {
    // Will implement base conversion
    console.log('Converting number bases...');
}

function bitwiseOp(operation) {
    // Will implement bitwise operations
    console.log('Performing bitwise operation:', operation);
}

function generateTruthTable(gate) {
    // Will implement truth table generation
    console.log('Generating truth table for:', gate);
}

function convertUnits() {
    // Will implement unit conversion
    console.log('Converting units...');
}

function calculateDateDiff() {
    // Will implement date calculations
    console.log('Calculating date difference...');
}

function calculateBMI() {
    // Will implement BMI calculation
    console.log('Calculating BMI...');
}

function calculateTip() {
    // Will implement tip calculation
    console.log('Calculating tip...');
}

function initializeUnitConverter() {
    // Will implement unit converter initialization
    console.log('Initializing unit converter...');
}

function initializeFormulas() {
    // Will implement formula initialization
    console.log('Initializing formulas...');
}

function displayFormulas() {
    // Will implement formula display
    console.log('Displaying formulas...');
}

function solveStepByStep() {
    // Will implement step-by-step solver
    console.log('Solving step by step...');
}

// Unit Conversion Data
const unitConversions = {
    length: {
        units: ['meter', 'kilometer', 'centimeter', 'millimeter', 'inch', 'foot', 'yard', 'mile'],
        toBase: {
            meter: 1,
            kilometer: 1000,
            centimeter: 0.01,
            millimeter: 0.001,
            inch: 0.0254,
            foot: 0.3048,
            yard: 0.9144,
            mile: 1609.344
        }
    },
    weight: {
        units: ['kilogram', 'gram', 'pound', 'ounce', 'ton'],
        toBase: {
            kilogram: 1,
            gram: 0.001,
            pound: 0.453592,
            ounce: 0.0283495,
            ton: 1000
        }
    },
    temperature: {
        units: ['celsius', 'fahrenheit', 'kelvin'],
        convert: (value, from, to) => {
            // Convert to Celsius first
            let celsius;
            switch(from) {
                case 'celsius': celsius = value; break;
                case 'fahrenheit': celsius = (value - 32) * 5/9; break;
                case 'kelvin': celsius = value - 273.15; break;
            }
            
            // Convert from Celsius to target
            switch(to) {
                case 'celsius': return celsius;
                case 'fahrenheit': return celsius * 9/5 + 32;
                case 'kelvin': return celsius + 273.15;
            }
        }
    },
    volume: {
        units: ['liter', 'milliliter', 'gallon', 'quart', 'pint', 'cup', 'fluid_ounce'],
        toBase: {
            liter: 1,
            milliliter: 0.001,
            gallon: 3.78541,
            quart: 0.946353,
            pint: 0.473176,
            cup: 0.236588,
            fluid_ounce: 0.0295735
        }
    },
    pressure: {
        units: ['pascal', 'kilopascal', 'bar', 'atmosphere', 'psi', 'torr'],
        toBase: {
            pascal: 1,
            kilopascal: 1000,
            bar: 100000,
            atmosphere: 101325,
            psi: 6894.76,
            torr: 133.322
        }
    }
};

// Enhanced Unit Converter
function initializeUnitConverter() {
    const category = document.getElementById('unitCategory').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    // Clear existing options
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    // Populate with units for selected category
    if (unitConversions[category]) {
        unitConversions[category].units.forEach(unit => {
            fromUnit.innerHTML += `<option value="${unit}">${unit.charAt(0).toUpperCase() + unit.slice(1).replace('_', ' ')}</option>`;
            toUnit.innerHTML += `<option value="${unit}">${unit.charAt(0).toUpperCase() + unit.slice(1).replace('_', ' ')}</option>`;
        });
    }
}

function convertUnits() {
    const category = document.getElementById('unitCategory').value;
    const value = parseFloat(document.getElementById('convertFrom').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const resultDiv = document.getElementById('conversionResult');
    
    if (isNaN(value)) {
        resultDiv.innerHTML = '<span class="error">Please enter a valid number</span>';
        return;
    }
    
    let result;
    
    if (category === 'temperature') {
        result = unitConversions.temperature.convert(value, fromUnit, toUnit);
    } else {
        const conversionData = unitConversions[category];
        if (conversionData) {
            // Convert to base unit, then to target unit
            const baseValue = value * conversionData.toBase[fromUnit];
            result = baseValue / conversionData.toBase[toUnit];
        }
    }
    
    if (result !== undefined) {
        resultDiv.innerHTML = `<span class="success">${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}</span>`;
    } else {
        resultDiv.innerHTML = '<span class="error">Conversion not available</span>';
    }
}

// Number Base Converter
function convertBases() {
    const input = document.getElementById('baseInput').value.trim();
    const fromBase = parseInt(document.getElementById('fromBase').value);
    const resultDiv = document.getElementById('baseResults');
    
    if (!input) {
        resultDiv.innerHTML = '<span class="error">Please enter a number</span>';
        return;
    }
    
    try {
        // Convert input to decimal first
        const decimal = parseInt(input, fromBase);
        
        if (isNaN(decimal)) {
            throw new Error('Invalid number for selected base');
        }
        
        const binary = decimal.toString(2);
        const octal = decimal.toString(8);
        const hexadecimal = decimal.toString(16).toUpperCase();
        
        resultDiv.innerHTML = `
            <div class="base-conversion-results">
                <div><strong>Decimal:</strong> ${decimal}</div>
                <div><strong>Binary:</strong> ${binary}</div>
                <div><strong>Octal:</strong> ${octal}</div>
                <div><strong>Hexadecimal:</strong> ${hexadecimal}</div>
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<span class="error">${error.message}</span>`;
    }
}

// Bitwise Operations
function bitwiseOp(operation) {
    const a = parseInt(document.getElementById('bitA').value);
    const b = parseInt(document.getElementById('bitB').value);
    const resultDiv = document.getElementById('bitwiseResult');
    
    if (isNaN(a) || (operation !== 'NOT' && isNaN(b))) {
        resultDiv.innerHTML = '<span class="error">Please enter valid numbers</span>';
        return;
    }
    
    let result;
    let operationText;
    
    switch(operation) {
        case 'AND':
            result = a & b;
            operationText = `${a} AND ${b}`;
            break;
        case 'OR':
            result = a | b;
            operationText = `${a} OR ${b}`;
            break;
        case 'XOR':
            result = a ^ b;
            operationText = `${a} XOR ${b}`;
            break;
        case 'NOT':
            result = ~a;
            operationText = `NOT ${a}`;
            break;
        case 'LSHIFT':
            result = a << b;
            operationText = `${a} << ${b}`;
            break;
        case 'RSHIFT':
            result = a >> b;
            operationText = `${a} >> ${b}`;
            break;
    }
    
    resultDiv.innerHTML = `
        <div class="bitwise-result">
            <div><strong>Operation:</strong> ${operationText}</div>
            <div><strong>Result (Decimal):</strong> ${result}</div>
            <div><strong>Result (Binary):</strong> ${result.toString(2)}</div>
            <div><strong>Result (Hex):</strong> ${result.toString(16).toUpperCase()}</div>
        </div>
    `;
}

// Truth Table Generator
function generateTruthTable(gate) {
    const tableDiv = document.getElementById('truthTable');
    
    const gates = {
        AND: (a, b) => a && b,
        OR: (a, b) => a || b,
        XOR: (a, b) => a !== b,
        NAND: (a, b) => !(a && b),
        NOR: (a, b) => !(a || b)
    };
    
    const gateFunction = gates[gate];
    
    let tableHTML = `
        <h4>${gate} Gate Truth Table</h4>
        <table>
            <thead>
                <tr><th>A</th><th>B</th><th>Output</th></tr>
            </thead>
            <tbody>
    `;
    
    for (let a = 0; a <= 1; a++) {
        for (let b = 0; b <= 1; b++) {
            const output = gateFunction(Boolean(a), Boolean(b)) ? 1 : 0;
            tableHTML += `<tr><td>${a}</td><td>${b}</td><td>${output}</td></tr>`;
        }
    }
    
    tableHTML += '</tbody></table>';
    tableDiv.innerHTML = tableHTML;
}

// Date Calculator
function calculateDateDiff() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const resultDiv = document.getElementById('dateResult');
    
    if (!document.getElementById('startDate').value || !document.getElementById('endDate').value) {
        resultDiv.innerHTML = '<span class="error">Please select both dates</span>';
        return;
    }
    
    const timeDiff = Math.abs(endDate - startDate);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff = Math.floor(daysDiff / 30.44); // Average days per month
    const yearsDiff = Math.floor(daysDiff / 365.25); // Account for leap years
    
    resultDiv.innerHTML = `
        <div class="date-calculation">
            <div><strong>Days:</strong> ${daysDiff}</div>
            <div><strong>Weeks:</strong> ${weeksDiff}</div>
            <div><strong>Months (approx):</strong> ${monthsDiff}</div>
            <div><strong>Years (approx):</strong> ${yearsDiff}</div>
        </div>
    `;
}

// BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const resultDiv = document.getElementById('bmiResult');
    
    if (isNaN(weight) || isNaN(height) || height <= 0) {
        resultDiv.innerHTML = '<span class="error">Please enter valid weight and height</span>';
        return;
    }
    
    // Convert height from cm to meters
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    
    let category, color;
    if (bmi < 18.5) {
        category = 'Underweight';
        color = 'info';
    } else if (bmi < 25) {
        category = 'Normal weight';
        color = 'success';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = 'warning';
    } else {
        category = 'Obese';
        color = 'error';
    }
    
    resultDiv.innerHTML = `
        <div class="bmi-result">
            <div><strong>BMI:</strong> ${bmi.toFixed(2)}</div>
            <div><strong>Category:</strong> <span class="${color}">${category}</span></div>
            <div class="bmi-scale">
                <div>Underweight: &lt; 18.5</div>
                <div>Normal: 18.5 - 24.9</div>
                <div>Overweight: 25 - 29.9</div>
                <div>Obese: ≥ 30</div>
            </div>
        </div>
    `;
}

// Tip Calculator
function calculateTip() {
    const billAmount = parseFloat(document.getElementById('billAmount').value);
    const tipPercent = parseFloat(document.getElementById('tipPercent').value);
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const resultDiv = document.getElementById('tipResult');
    
    if (isNaN(billAmount) || isNaN(tipPercent) || isNaN(numPeople) || numPeople <= 0) {
        resultDiv.innerHTML = '<span class="error">Please enter valid values</span>';
        return;
    }
    
    const tipAmount = billAmount * (tipPercent / 100);
    const totalAmount = billAmount + tipAmount;
    const perPerson = totalAmount / numPeople;
    const tipPerPerson = tipAmount / numPeople;
    
    resultDiv.innerHTML = `
        <div class="tip-calculation">
            <div><strong>Bill Amount:</strong> $${billAmount.toFixed(2)}</div>
            <div><strong>Tip (${tipPercent}%):</strong> $${tipAmount.toFixed(2)}</div>
            <div><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</div>
            ${numPeople > 1 ? `
                <div><strong>Per Person:</strong> $${perPerson.toFixed(2)}</div>
                <div><strong>Tip Per Person:</strong> $${tipPerPerson.toFixed(2)}</div>
            ` : ''}
        </div>
    `;
}

// Function Plotter
function plotFunction() {
    const functionInput = document.getElementById('functionInput').value;
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const canvas = document.getElementById('functionChart');
    const ctx = canvas.getContext('2d');
    
    if (!functionInput || isNaN(xMin) || isNaN(xMax)) {
        alert('Please enter a valid function and range');
        return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    try {
        // Generate data points
        const points = [];
        const step = (xMax - xMin) / 200;
        
        for (let x = xMin; x <= xMax; x += step) {
            try {
                // Replace x in the function string and evaluate
                let expr = functionInput.replace(/x/g, `(${x})`);
                expr = expr.replace(/\^/g, '**');
                expr = expr.replace(/sin/g, 'Math.sin');
                expr = expr.replace(/cos/g, 'Math.cos');
                expr = expr.replace(/tan/g, 'Math.tan');
                expr = expr.replace(/log/g, 'Math.log');
                expr = expr.replace(/sqrt/g, 'Math.sqrt');
                expr = expr.replace(/abs/g, 'Math.abs');
                
                const y = Function('"use strict"; return (' + expr + ')')();
                
                if (isFinite(y)) {
                    points.push({ x, y });
                }
            } catch (e) {
                // Skip invalid points
                continue;
            }
        }
        
        if (points.length === 0) {
            throw new Error('No valid points generated');
        }
        
        // Find y range
        const yValues = points.map(p => p.y);
        const yMin = Math.min(...yValues);
        const yMax = Math.max(...yValues);
        
        // Draw axes
        drawAxes(ctx, canvas, xMin, xMax, yMin, yMax);
        
        // Plot function
        ctx.strokeStyle = '#f093fb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        points.forEach((point, index) => {
            const canvasX = ((point.x - xMin) / (xMax - xMin)) * canvas.width;
            const canvasY = canvas.height - ((point.y - yMin) / (yMax - yMin)) * canvas.height;
            
            if (index === 0) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        });
        
        ctx.stroke();
        
    } catch (error) {
        alert(`Error plotting function: ${error.message}`);
    }
}

function drawAxes(ctx, canvas, xMin, xMax, yMin, yMax) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // X-axis
    if (yMin <= 0 && yMax >= 0) {
        const y0 = canvas.height - ((-yMin) / (yMax - yMin)) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y0);
        ctx.lineTo(canvas.width, y0);
        ctx.stroke();
    }
    
    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
        const x0 = ((-xMin) / (xMax - xMin)) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, canvas.height);
        ctx.stroke();
    }
}

// Chart Creator
function createChart() {
    const chartType = document.getElementById('chartType').value;
    const labels = document.getElementById('chartLabels').value.split(',').map(s => s.trim());
    const data = document.getElementById('chartData').value.split(',').map(s => parseFloat(s.trim()));
    const canvas = document.getElementById('dataChart');
    
    if (labels.length !== data.length || data.some(isNaN)) {
        alert('Please ensure labels and data have the same count and data contains only numbers');
        return;
    }
    
    // Destroy existing chart if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    const chartConfig = {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: data,
                backgroundColor: [
                    '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
                    '#667eea', '#764ba2', '#ffecd2', '#fcb69f'
                ],
                borderColor: '#333',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: chartType === 'pie'
                }
            },
            scales: chartType !== 'pie' ? {
                y: {
                    beginAtZero: true
                }
            } : {}
        }
    };
    
    chartInstance = new Chart(ctx, chartConfig);
}

// Formula Reference System
const formulas = {
    algebra: [
        { name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / 2a' },
        { name: 'Distance Formula', formula: 'd = √((x₂-x₁)² + (y₂-y₁)²)' },
        { name: 'Slope Formula', formula: 'm = (y₂-y₁) / (x₂-x₁)' }
    ],
    geometry: [
        { name: 'Area of Circle', formula: 'A = πr²' },
        { name: 'Area of Triangle', formula: 'A = ½bh' },
        { name: 'Volume of Sphere', formula: 'V = (4/3)πr³' }
    ],
    trigonometry: [
        { name: 'Pythagorean Theorem', formula: 'a² + b² = c²' },
        { name: 'Law of Cosines', formula: 'c² = a² + b² - 2ab cos(C)' },
        { name: 'Law of Sines', formula: 'a/sin(A) = b/sin(B) = c/sin(C)' }
    ],
    calculus: [
        { name: 'Derivative of xⁿ', formula: 'd/dx(xⁿ) = nxⁿ⁻¹' },
        { name: 'Product Rule', formula: 'd/dx(uv) = u\'v + uv\'' },
        { name: 'Chain Rule', formula: 'd/dx(f(g(x))) = f\'(g(x)) · g\'(x)' }
    ],
    physics: [
        { name: 'Newton\'s Second Law', formula: 'F = ma' },
        { name: 'Kinetic Energy', formula: 'KE = ½mv²' },
        { name: 'Ohm\'s Law', formula: 'V = IR' }
    ],
    chemistry: [
        { name: 'Ideal Gas Law', formula: 'PV = nRT' },
        { name: 'pH Formula', formula: 'pH = -log[H⁺]' },
        { name: 'Molarity', formula: 'M = n/V' }
    ]
};

function initializeFormulas() {
    displayFormulas();
}

function displayFormulas() {
    const category = document.getElementById('formulaCategory').value;
    const displayDiv = document.getElementById('formulaDisplay');
    
    const categoryFormulas = formulas[category] || [];
    
    let html = '<div class="formula-list">';
    categoryFormulas.forEach(formula => {
        html += `
            <div class="formula-item">
                <h4>${formula.name}</h4>
                <div class="formula">${formula.formula}</div>
            </div>
        `;
    });
    html += '</div>';
    
    displayDiv.innerHTML = html;
}

// Step-by-Step Solver (Basic Implementation)
function solveStepByStep() {
    const problemType = document.getElementById('problemType').value;
    const problemInput = document.getElementById('problemInput').value;
    const solutionDiv = document.getElementById('stepSolution');
    
    if (!problemInput.trim()) {
        solutionDiv.innerHTML = '<span class="error">Please enter a problem</span>';
        return;
    }
    
    let solution = '';
    
    switch(problemType) {
        case 'derivative':
            solution = solveDerivative(problemInput);
            break;
        case 'integral':
            solution = solveIntegral(problemInput);
            break;
        case 'limit':
            solution = solveLimit(problemInput);
            break;
        case 'equation':
            solution = solveEquation(problemInput);
            break;
        default:
            solution = '<span class="error">Problem type not supported</span>';
    }
    
    solutionDiv.innerHTML = solution;
}

function solveDerivative(input) {
    // Basic derivative solver
    if (input.includes('x^')) {
        const match = input.match(/x\^(\d+)/);
        if (match) {
            const power = parseInt(match[1]);
            if (power === 1) {
                return '<div class="step-solution"><h4>Derivative of x</h4><div>d/dx(x) = 1</div></div>';
            } else {
                return `<div class="step-solution"><h4>Derivative of x^${power}</h4><div>Using power rule: d/dx(x^n) = nx^(n-1)</div><div>d/dx(x^${power}) = ${power}x^${power-1}</div></div>`;
            }
        }
    }
    return '<div class="step-solution">Basic derivative solver - enter functions like x^2, x^3, etc.</div>';
}

function solveIntegral(input) {
    return '<div class="step-solution">Integration solver coming soon</div>';
}

function solveLimit(input) {
    return '<div class="step-solution">Limit solver coming soon</div>';
}

function solveEquation(input) {
    return '<div class="step-solution">Equation solver coming soon</div>';
}

// Matrix Operations
function createMatrixA() {
    const rows = parseInt(document.getElementById('matrixARows').value);
    const cols = parseInt(document.getElementById('matrixACols').value);
    const container = document.getElementById('matrixAGrid');
    
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
    
    matrixA = Array(rows).fill().map(() => Array(cols).fill(0));
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = '0';
            input.addEventListener('change', (e) => {
                matrixA[i][j] = parseFloat(e.target.value) || 0;
            });
            container.appendChild(input);
        }
    }
}

function createMatrixB() {
    const rows = parseInt(document.getElementById('matrixBRows').value);
    const cols = parseInt(document.getElementById('matrixBCols').value);
    const container = document.getElementById('matrixBGrid');
    
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
    
    matrixB = Array(rows).fill().map(() => Array(cols).fill(0));
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = '0';
            input.addEventListener('change', (e) => {
                matrixB[i][j] = parseFloat(e.target.value) || 0;
            });
            container.appendChild(input);
        }
    }
}

function addMatrices() {
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        displayMatrixResult('Error: Matrices must have the same dimensions for addition');
        return;
    }
    
    const result = matrixA.map((row, i) => 
        row.map((val, j) => val + matrixB[i][j])
    );
    displayMatrixResult('A + B =', result);
}

function subtractMatrices() {
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        displayMatrixResult('Error: Matrices must have the same dimensions for subtraction');
        return;
    }
    
    const result = matrixA.map((row, i) => 
        row.map((val, j) => val - matrixB[i][j])
    );
    displayMatrixResult('A - B =', result);
}

function multiplyMatrices() {
    if (matrixA[0].length !== matrixB.length) {
        displayMatrixResult('Error: Number of columns in A must equal number of rows in B');
        return;
    }
    
    const result = Array(matrixA.length).fill().map(() => Array(matrixB[0].length).fill(0));
    
    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixB[0].length; j++) {
            for (let k = 0; k < matrixB.length; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    
    displayMatrixResult('A × B =', result);
}

function transposeMatrix(matrix) {
    const mat = matrix === 'A' ? matrixA : matrixB;
    const result = mat[0].map((col, i) => mat.map(row => row[i]));
    displayMatrixResult(`Transpose of ${matrix} =`, result);
}

function determinantMatrix(matrix) {
    const mat = matrix === 'A' ? matrixA : matrixB;
    
    if (mat.length !== mat[0].length) {
        displayMatrixResult('Error: Matrix must be square to calculate determinant');
        return;
    }
    
    const det = calculateDeterminant(mat);
    displayMatrixResult(`Determinant of ${matrix} = ${det.toFixed(4)}`);
}

function calculateDeterminant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
        const subMatrix = matrix.slice(1).map(row => 
            row.filter((_, colIndex) => colIndex !== j)
        );
        det += Math.pow(-1, j) * matrix[0][j] * calculateDeterminant(subMatrix);
    }
    return det;
}

function displayMatrixResult(title, matrix = null) {
    const resultDiv = document.getElementById('matrixResult');
    let html = `<h4>${title}</h4>`;
    
    if (matrix) {
        html += '<div class="matrix-display">';
        matrix.forEach(row => {
            html += '<div class="matrix-row">';
            row.forEach(val => {
                html += `<span class="matrix-cell">${val.toFixed(2)}</span>`;
            });
            html += '</div>';
        });
        html += '</div>';
    }
    
    resultDiv.innerHTML = html;
}

// Complex Number Operations
function addComplex() {
    const a_real = parseFloat(document.getElementById('complexA_real').value) || 0;
    const a_imag = parseFloat(document.getElementById('complexA_imag').value) || 0;
    const b_real = parseFloat(document.getElementById('complexB_real').value) || 0;
    const b_imag = parseFloat(document.getElementById('complexB_imag').value) || 0;
    
    const result_real = a_real + b_real;
    const result_imag = a_imag + b_imag;
    
    displayComplexResult('Addition', result_real, result_imag);
}

function subtractComplex() {
    const a_real = parseFloat(document.getElementById('complexA_real').value) || 0;
    const a_imag = parseFloat(document.getElementById('complexA_imag').value) || 0;
    const b_real = parseFloat(document.getElementById('complexB_real').value) || 0;
    const b_imag = parseFloat(document.getElementById('complexB_imag').value) || 0;
    
    const result_real = a_real - b_real;
    const result_imag = a_imag - b_imag;
    
    displayComplexResult('Subtraction', result_real, result_imag);
}

function multiplyComplex() {
    const a_real = parseFloat(document.getElementById('complexA_real').value) || 0;
    const a_imag = parseFloat(document.getElementById('complexA_imag').value) || 0;
    const b_real = parseFloat(document.getElementById('complexB_real').value) || 0;
    const b_imag = parseFloat(document.getElementById('complexB_imag').value) || 0;
    
    const result_real = a_real * b_real - a_imag * b_imag;
    const result_imag = a_real * b_imag + a_imag * b_real;
    
    displayComplexResult('Multiplication', result_real, result_imag);
}

function divideComplex() {
    const a_real = parseFloat(document.getElementById('complexA_real').value) || 0;
    const a_imag = parseFloat(document.getElementById('complexA_imag').value) || 0;
    const b_real = parseFloat(document.getElementById('complexB_real').value) || 0;
    const b_imag = parseFloat(document.getElementById('complexB_imag').value) || 0;
    
    const denominator = b_real * b_real + b_imag * b_imag;
    
    if (denominator === 0) {
        displayComplexResult('Error: Division by zero');
        return;
    }
    
    const result_real = (a_real * b_real + a_imag * b_imag) / denominator;
    const result_imag = (a_imag * b_real - a_real * b_imag) / denominator;
    
    displayComplexResult('Division', result_real, result_imag);
}

function modulusComplex(which) {
    const real = parseFloat(document.getElementById(`complex${which}_real`).value) || 0;
    const imag = parseFloat(document.getElementById(`complex${which}_imag`).value) || 0;
    
    const modulus = Math.sqrt(real * real + imag * imag);
    displayComplexResult(`Modulus of ${which}`, modulus);
}

function displayComplexResult(operation, real = null, imag = null) {
    const resultDiv = document.getElementById('complexResult');
    let html = `<h4>${operation}</h4>`;
    
    if (real !== null && imag !== null) {
        const sign = imag >= 0 ? '+' : '';
        html += `<div class="complex-result-value">${real.toFixed(4)} ${sign} ${imag.toFixed(4)}i</div>`;
    } else if (real !== null) {
        html += `<div class="complex-result-value">${real.toFixed(4)}</div>`;
    }
    
    resultDiv.innerHTML = html;
}

// Additional placeholder functions for missing implementations
function conjugateComplex(which) {
    const real = parseFloat(document.getElementById(`complex${which}_real`).value) || 0;
    const imag = parseFloat(document.getElementById(`complex${which}_imag`).value) || 0;
    displayComplexResult(`Conjugate of ${which}`, real, -imag);
}

function argComplex(which) {
    const real = parseFloat(document.getElementById(`complex${which}_real`).value) || 0;
    const imag = parseFloat(document.getElementById(`complex${which}_imag`).value) || 0;
    const arg = Math.atan2(imag, real);
    displayComplexResult(`Argument of ${which}`, arg);
}

function polarForm(which) {
    const real = parseFloat(document.getElementById(`complex${which}_real`).value) || 0;
    const imag = parseFloat(document.getElementById(`complex${which}_imag`).value) || 0;
    const r = Math.sqrt(real * real + imag * imag);
    const theta = Math.atan2(imag, real);
    document.getElementById('complexResult').innerHTML = `<h4>Polar Form of ${which}</h4><div class="complex-result-value">${r.toFixed(4)} × e^(${theta.toFixed(4)}i)</div>`;
}

function calculateCovariance() {
    displayAdvancedStatsResult('Covariance calculation coming soon');
}

function calculateZScore() {
    displayAdvancedStatsResult('Z-Score calculation coming soon');
}

function confidenceInterval() {
    displayAdvancedStatsResult('Confidence Interval calculation coming soon');
}

function tTest() {
    displayAdvancedStatsResult('T-Test calculation coming soon');
}

function chiSquareTest() {
    displayAdvancedStatsResult('Chi-Square Test calculation coming soon');
}

function anovaTest() {
    displayAdvancedStatsResult('ANOVA Test calculation coming soon');
}

function trapezoidalRule() {
    const func = document.getElementById('sciFunction').value;
    const lower = parseFloat(document.getElementById('integralLower').value);
    const upper = parseFloat(document.getElementById('integralUpper').value);
    
    if (isNaN(lower) || isNaN(upper)) {
        displayScientificResult('Error: Please enter valid bounds');
        return;
    }
    
    const n = 1000;
    const h = (upper - lower) / n;
    let sum = 0;
    
    try {
        for (let i = 0; i <= n; i++) {
            const x = lower + i * h;
            const coefficient = (i === 0 || i === n) ? 0.5 : 1;
            sum += coefficient * evaluateFunction(func, x);
        }
        
        const result = h * sum;
        displayScientificResult(`Trapezoidal Rule Integration: ${result.toFixed(6)}`);
    } catch (error) {
        displayScientificResult('Error: Invalid function');
    }
}

function symbolicDerivative() {
    displayScientificResult('Symbolic differentiation coming soon');
}

function newtonRaphson() {
    displayScientificResult('Newton-Raphson method coming soon');
}

function bisectionMethod() {
    displayScientificResult('Bisection method coming soon');
}

function showExchangeRates() {
    const exchangeRates = {
        'USD': 1.0, 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110.0,
        'AUD': 1.35, 'CAD': 1.25, 'CHF': 0.92, 'CNY': 6.5, 'INR': 74.0
    };
    
    let html = '<h4>Current Exchange Rates (relative to USD)</h4>';
    for (const [currency, rate] of Object.entries(exchangeRates)) {
        html += `<div>1 USD = ${rate.toFixed(4)} ${currency}</div>`;
    }
    
    document.getElementById('exchangeRates').innerHTML = html;
}

function calculateMolecularWeight() {
    displayChemistryResult('molWeightResult', 'Molecular weight calculation coming soon');
}

function calculateMolarity() {
    displayChemistryResult('solutionResult', 'Molarity calculation coming soon');
}

function calculateDilution() {
    displayChemistryResult('solutionResult', 'Dilution calculation coming soon');
}

function displayChemistryResult(elementId, result) {
    document.getElementById(elementId).innerHTML = `<div class="chem-result">${result}</div>`;
}

function plot3DWireframe() {
    document.getElementById('threeDContainer').innerHTML = '<div class="placeholder-function">3D Wireframe plotting coming soon</div>';
}

function plot3DContour() {
    document.getElementById('threeDContainer').innerHTML = '<div class="placeholder-function">3D Contour plotting coming soon</div>';
}

function exportToCSV() {
    alert('CSV export functionality coming soon');
}

function exportToImage() {
    alert('Image export functionality coming soon');
}

function printCalculations() {
    window.print();
}

function clearHistory() {
    document.getElementById('calculationHistory').innerHTML = '<div class="info">History cleared</div>';
}

function saveToLocal() {
    localStorage.setItem('supercalc_history', 'Sample calculation data');
    alert('Data saved to browser storage');
}

function loadFromLocal() {
    const data = localStorage.getItem('supercalc_history');
    document.getElementById('calculationHistory').innerHTML = data ? `<div class="history-item">${data}</div>` : '<div class="info">No saved data found</div>';
}

function generateShareLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    document.getElementById('shareResult').innerHTML = '<div class="success">Share link copied to clipboard!</div>';
}

function shareToEmail() {
    const subject = 'Supercalc Results';
    const body = 'Check out these calculation results from Supercalc';
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function inverseMatrix(matrix) {
    displayMatrixResult('Matrix inversion coming soon');
}

function eigenvalues(matrix) {
    displayMatrixResult('Eigenvalue calculation coming soon');
}

// Advanced Statistics
function calculateRegression() {
    const xData = getDataArray('advStatsDataX');
    const yData = getDataArray('advStatsDataY');
    
    if (xData.length !== yData.length || xData.length < 2) {
        displayAdvancedStatsResult('Error: Need equal length datasets with at least 2 points');
        return;
    }
    
    const n = xData.length;
    const sumX = xData.reduce((a, b) => a + b, 0);
    const sumY = yData.reduce((a, b) => a + b, 0);
    const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
    const sumXX = xData.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const predictions = xData.map(x => slope * x + intercept);
    const residuals = yData.map((y, i) => y - predictions[i]);
    const rSquared = 1 - (residuals.reduce((sum, r) => sum + r * r, 0) / 
                        yData.reduce((sum, y) => sum + Math.pow(y - sumY/n, 2), 0));
    
    displayAdvancedStatsResult(`Linear Regression: y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}<br>R² = ${rSquared.toFixed(4)}`);
}

function calculateCorrelation() {
    const xData = getDataArray('advStatsDataX');
    const yData = getDataArray('advStatsDataY');
    
    if (xData.length !== yData.length || xData.length < 2) {
        displayAdvancedStatsResult('Error: Need equal length datasets with at least 2 points');
        return;
    }
    
    const n = xData.length;
    const meanX = xData.reduce((a, b) => a + b, 0) / n;
    const meanY = yData.reduce((a, b) => a + b, 0) / n;
    
    const numerator = xData.reduce((sum, x, i) => sum + (x - meanX) * (yData[i] - meanY), 0);
    const denomX = Math.sqrt(xData.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0));
    const denomY = Math.sqrt(yData.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0));
    
    const correlation = numerator / (denomX * denomY);
    
    displayAdvancedStatsResult(`Pearson Correlation Coefficient: ${correlation.toFixed(4)}`);
}

function getDataArray(elementId) {
    const input = document.getElementById(elementId).value;
    return input.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
}

function displayAdvancedStatsResult(result) {
    document.getElementById('advancedStatsResults').innerHTML = `<div class="stats-result">${result}</div>`;
}

// Scientific Computing
function numericalIntegration() {
    const func = document.getElementById('sciFunction').value;
    const lower = parseFloat(document.getElementById('integralLower').value);
    const upper = parseFloat(document.getElementById('integralUpper').value);
    
    if (isNaN(lower) || isNaN(upper)) {
        displayScientificResult('Error: Please enter valid bounds');
        return;
    }
    
    const n = 1000; // Number of intervals
    const h = (upper - lower) / n;
    let sum = 0;
    
    try {
        for (let i = 0; i <= n; i++) {
            const x = lower + i * h;
            const coefficient = (i === 0 || i === n) ? 1 : (i % 2 === 0) ? 2 : 4;
            sum += coefficient * evaluateFunction(func, x);
        }
        
        const result = (h / 3) * sum;
        displayScientificResult(`Simpson's Rule Integration: ${result.toFixed(6)}`);
    } catch (error) {
        displayScientificResult('Error: Invalid function');
    }
}

function numericalDerivative() {
    const func = document.getElementById('sciFunction').value;
    const point = parseFloat(document.getElementById('derivativePoint').value);
    const h = parseFloat(document.getElementById('stepSize').value);
    
    if (isNaN(point) || isNaN(h)) {
        displayScientificResult('Error: Please enter valid values');
        return;
    }
    
    try {
        const f_plus = evaluateFunction(func, point + h);
        const f_minus = evaluateFunction(func, point - h);
        const derivative = (f_plus - f_minus) / (2 * h);
        
        displayScientificResult(`Numerical Derivative at x=${point}: ${derivative.toFixed(6)}`);
    } catch (error) {
        displayScientificResult('Error: Invalid function');
    }
}

function evaluateFunction(funcStr, x) {
    // Replace x with the actual value and evaluate
    let expr = funcStr.replace(/x/g, `(${x})`);
    expr = expr.replace(/\^/g, '**');
    expr = expr.replace(/sin/g, 'Math.sin');
    expr = expr.replace(/cos/g, 'Math.cos');
    expr = expr.replace(/tan/g, 'Math.tan');
    expr = expr.replace(/log/g, 'Math.log');
    expr = expr.replace(/sqrt/g, 'Math.sqrt');
    
    return Function('"use strict"; return (' + expr + ')')();
}

function displayScientificResult(result) {
    document.getElementById('scientificComputingResults').innerHTML = `<div class="sci-result">${result}</div>`;
}

// Currency Converter (using mock data for demonstration)
async function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('currencyFrom').value;
    const to = document.getElementById('currencyTo').value;
    
    if (isNaN(amount)) {
        displayCurrencyResult('Error: Please enter a valid amount');
        return;
    }
    
    // Mock exchange rates (in real app, you'd fetch from an API)
    const exchangeRates = {
        'USD': 1.0,
        'EUR': 0.85,
        'GBP': 0.73,
        'JPY': 110.0,
        'AUD': 1.35,
        'CAD': 1.25,
        'CHF': 0.92,
        'CNY': 6.5,
        'INR': 74.0
    };
    
    const fromRate = exchangeRates[from];
    const toRate = exchangeRates[to];
    const result = (amount / fromRate) * toRate;
    
    displayCurrencyResult(`${amount} ${from} = ${result.toFixed(2)} ${to}`);
}

function displayCurrencyResult(result) {
    document.getElementById('currencyResult').innerHTML = `<div class="currency-result-value">${result}</div>`;
}

// Cryptocurrency Tools
async function convertCrypto() {
    const amount = parseFloat(document.getElementById('cryptoAmount').value);
    const from = document.getElementById('cryptoFrom').value;
    const to = document.getElementById('cryptoTo').value;
    
    if (isNaN(amount)) {
        displayCryptoResult('Error: Please enter a valid amount');
        return;
    }
    
    // Mock crypto prices (in real app, you'd fetch from CoinGecko API)
    const cryptoPrices = {
        'bitcoin': { 'usd': 45000, 'eur': 38000 },
        'ethereum': { 'usd': 3200, 'eur': 2700 },
        'cardano': { 'usd': 1.20, 'eur': 1.02 },
        'polkadot': { 'usd': 28, 'eur': 24 },
        'chainlink': { 'usd': 25, 'eur': 21 }
    };
    
    const price = cryptoPrices[from] ? cryptoPrices[from][to] : 0;
    const result = amount * price;
    
    displayCryptoResult(`${amount} ${from.toUpperCase()} = ${result.toFixed(2)} ${to.toUpperCase()}`);
}

function calculatePnL() {
    const buyPrice = parseFloat(document.getElementById('buyPrice').value);
    const currentPrice = parseFloat(document.getElementById('currentPrice').value);
    const quantity = parseFloat(document.getElementById('quantity').value);
    
    if (isNaN(buyPrice) || isNaN(currentPrice) || isNaN(quantity)) {
        displayPnLResult('Error: Please enter valid values');
        return;
    }
    
    const totalInvestment = buyPrice * quantity;
    const currentValue = currentPrice * quantity;
    const pnl = currentValue - totalInvestment;
    const pnlPercentage = (pnl / totalInvestment) * 100;
    
    const resultClass = pnl >= 0 ? 'success' : 'error';
    displayPnLResult(`
        <div class="pnl-breakdown">
            <div>Investment: $${totalInvestment.toFixed(2)}</div>
            <div>Current Value: $${currentValue.toFixed(2)}</div>
            <div class="${resultClass}">P&L: $${pnl.toFixed(2)} (${pnlPercentage.toFixed(2)}%)</div>
        </div>
    `);
}

function displayCryptoResult(result) {
    document.getElementById('cryptoResult').innerHTML = `<div class="crypto-result-value">${result}</div>`;
}

function displayPnLResult(result) {
    document.getElementById('pnlResult').innerHTML = result;
}

// Advanced Physics
function calculateAdvancedPhysics() {
    const category = document.getElementById('physicsCategory').value;
    const type = document.getElementById('mechanicsType').value;
    
    // This is a simplified implementation - would need extensive physics formulas
    displayAdvancedPhysicsResult('Advanced physics calculations coming soon!');
}

function displayAdvancedPhysicsResult(result) {
    document.getElementById('advancedPhysicsResult').innerHTML = `<div class="physics-result">${result}</div>`;
}

// Chemistry Database
function initializePeriodicTable() {
    const periodicTableDiv = document.getElementById('periodicTable');
    
    if (!periodicTableDiv) return;
    
    // Simplified periodic table data
    const elements = [
        {symbol: 'H', number: 1, name: 'Hydrogen'},
        {symbol: 'He', number: 2, name: 'Helium'},
        {symbol: 'Li', number: 3, name: 'Lithium'},
        {symbol: 'Be', number: 4, name: 'Beryllium'},
        {symbol: 'B', number: 5, name: 'Boron'},
        {symbol: 'C', number: 6, name: 'Carbon'},
        {symbol: 'N', number: 7, name: 'Nitrogen'},
        {symbol: 'O', number: 8, name: 'Oxygen'},
        {symbol: 'F', number: 9, name: 'Fluorine'},
        {symbol: 'Ne', number: 10, name: 'Neon'}
        // ... would include all elements
    ];
    
    elements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'element';
        elementDiv.innerHTML = `
            <div class="element-number">${element.number}</div>
            <div class="element-symbol">${element.symbol}</div>
        `;
        elementDiv.onclick = () => showElementInfo(element);
        periodicTableDiv.appendChild(elementDiv);
    });
}

function showElementInfo(element) {
    const infoDiv = document.getElementById('elementInfo');
    infoDiv.innerHTML = `
        <h4>${element.name} (${element.symbol})</h4>
        <p>Atomic Number: ${element.number}</p>
        <p>More detailed information would be displayed here...</p>
    `;
}

// 3D Graphics with Three.js
function plot3DFunction() {
    const funcStr = document.getElementById('function3D').value;
    const xMin = parseFloat(document.getElementById('xMin3D').value);
    const xMax = parseFloat(document.getElementById('xMax3D').value);
    const yMin = parseFloat(document.getElementById('yMin3D').value);
    const yMax = parseFloat(document.getElementById('yMax3D').value);
    
    const container = document.getElementById('threeDContainer');
    
    if (!container) {
        alert('3D container not found');
        return;
    }
    
    container.innerHTML = ''; // Clear previous plot
    
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        container.innerHTML = '<div class="error">Three.js library not loaded</div>';
        return;
    }
    
    // Create Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    
    // Create surface geometry
    const geometry = new THREE.PlaneGeometry(10, 10, 50, 50);
    const vertices = geometry.attributes.position.array;
    
    try {
        for (let i = 0; i < vertices.length; i += 3) {
            const x = (vertices[i] / 10) * (xMax - xMin) + (xMax + xMin) / 2;
            const y = (vertices[i + 1] / 10) * (yMax - yMin) + (yMax + yMin) / 2;
            vertices[i + 2] = evaluateFunction3D(funcStr, x, y);
        }
    } catch (error) {
        container.innerHTML = '<div class="error">Error: Invalid function</div>';
        return;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x3b82f6, 
        wireframe: false,
        side: THREE.DoubleSide 
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 0.4));
    
    camera.position.z = 15;
    
    // Render
    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.005;
        mesh.rotation.z += 0.005;
        renderer.render(scene, camera);
    }
    animate();
}

function evaluateFunction3D(funcStr, x, y) {
    let expr = funcStr.replace(/x/g, `(${x})`).replace(/y/g, `(${y})`);
    expr = expr.replace(/\^/g, '**');
    expr = expr.replace(/sin/g, 'Math.sin');
    expr = expr.replace(/cos/g, 'Math.cos');
    expr = expr.replace(/sqrt/g, 'Math.sqrt');
    
    return Function('"use strict"; return (' + expr + ')')();
}

// Export Tools
function exportToPDF() {
    if (typeof jsPDF === 'undefined') {
        alert('PDF export library not loaded');
        return;
    }
    
    const doc = new jsPDF.jsPDF();
    doc.text('Supercalc Results Export', 20, 20);
    doc.text(new Date().toLocaleDateString(), 20, 30);
    
    // Add calculation results (simplified)
    doc.text('Calculation Results would be exported here...', 20, 50);
    
    doc.save('supercalc-results.pdf');
}

function copyToClipboard() {
    const resultsText = 'Calculation results copied to clipboard';
    navigator.clipboard.writeText(resultsText).then(() => {
        document.getElementById('shareResult').innerHTML = '<div class="success">Results copied to clipboard!</div>';
    });
} 