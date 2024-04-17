let numPeople;
let names = [];
let totalExpense = 0;

function getNames() {
    numPeople = parseInt(document.getElementById('numPeople').value);
    if (numPeople > 1) {
        document.getElementById('numPeople').disabled = true;
        document.getElementById('getNames').disabled = true;

        let namesInput = document.getElementById('namesInput');
        namesInput.style.display = 'block';

        let namesDiv = document.getElementById('names');
        namesDiv.innerHTML = '';

        for (let i = 0; i < numPeople; i++) {
            namesDiv.innerHTML += `<input class="input" type="text" required placeholder="Name ${i + 1}" id="name${i}">`;
        }
    } else {
        alert("Please enter a valid number of people. (atleast 2)");
    }
}

function getPayments() {
    for (let i = 0; i < numPeople; i++) {
        let nameInput = document.getElementById(`name${i}`);
        if (nameInput.value.trim() === '') {
            alert("Please enter a valid name for all persons.");
            return;
        }
     }

    for (let i = 0; i < numPeople; i++) {
        names.push(document.getElementById(`name${i}`).value);
    }
    let namesInput = document.getElementById('namesInput');
    namesInput.style.display = 'none';

    let paymentsInput = document.getElementById('paymentsInput');
    paymentsInput.style.display = 'block';
    addPaymentRow();
}

function validateAmount(input) {
    let amount = parseFloat(input.value);
    if (amount < 0.01) {
        alert("Please enter a valid positive amount.");
        input.value = ""; // Clear the input field
    }
}

function addPaymentRow() {
    let table = document.getElementById('paymentsTable');
    let newRow = table.insertRow(-1);
    newRow.innerHTML = `
        <td style="text-align: center"><select>${names.map(name => `<option>${name}</option>`).join('')}</select></td>
        <td style="text-align: center"><input type="text"></td>
        <td style="text-align: center"><input type="number" class="paymentAmount" min="0.01" step="0.01" oninput="validateAmount(this)"></td>
        <td style="text-align: center"><select>${names.map(name => `<option>${name}</option>`).join('')}</select></td>
        <td style="text-align: center"><button onclick="deletePaymentRow(this)">Delete</button></td>
    `;

    // Update total expense
    updateTotalExpense();
}

function deletePaymentRow(button) {
    let row = button.parentNode.parentNode;
    let amountDeleted = parseFloat(row.cells[2].querySelector('input').value);

    // Deduct amount from total expense
    totalExpense -= amountDeleted;

    // Deduct amount from payer's balance
    let payer = row.cells[3].querySelector('select').value;
    balance[payer] += amountDeleted;

    row.parentNode.removeChild(row);

    // Update total expense
    updateTotalExpense();
}

// Function to update the total expense
function updateTotalExpense() {
    totalExpense = 0; // Reset total expense
    let paymentAmountInputs = document.querySelectorAll('.paymentAmount');

    paymentAmountInputs.forEach(input => {
        let inputValue = parseFloat(input.value);
        if (!isNaN(inputValue)) {
            totalExpense += inputValue;
        }
    });

    document.getElementById('totalExpenseDiv').textContent = `Total Expense: £${totalExpense.toFixed(2)}`;
}

function getPaymentRows() {
    let table = document.getElementById('paymentsTable');
    let rows = [];
    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        let amountInput = row.cells[2].querySelector('input').value;
        // Check if amount is a valid number
        if (!isNaN(amountInput)) {
            let payment = {
                name: row.cells[0].querySelector('select').value,
                description: row.cells[1].querySelector('input').value,
                amount: parseFloat(amountInput),
                paidBy: row.cells[3].querySelector('select').value
            };
            rows.push(payment);
        }
    }
    return rows;
}

function calculate() {
    let payments = getPaymentRows();
    numPeople = parseInt(document.getElementById('numPeople').value);
    let totalExpense = 0;
    let balance = {};

    payments.forEach(payment => {
        totalExpense += payment.amount; // Calculate total expense
        if (balance[payment.name] === undefined) balance[payment.name] = 0;
        if (balance[payment.paidBy] === undefined) balance[payment.paidBy] = 0;

        balance[payment.paidBy] -= payment.amount; // Deduct payment from payer
    });

    let amountPerPerson = totalExpense / numPeople; // Calculate equal share for each person

    // Redistribute equal share among all recipients
    for (let i = 0; i < numPeople; i++) {
        let name = document.getElementById(`name${i}`).value;
        if (name in balance) {
            balance[name] += amountPerPerson;
        } else {
            balance[name] = amountPerPerson;
        }
    }

    let result = '';
    let recordedDebts = {}; // To keep track of recorded debts

    for (let person1 in balance) {
        for (let person2 in balance) {
            if (balance[person1] < 0 && balance[person2] > 0 && person1 !== person2) {
                let amount = Math.min(Math.abs(balance[person1]), balance[person2]);
                let debtKey = person1 < person2 ? `${person1}-${person2}` : `${person2}-${person1}`;
                if (!recordedDebts[debtKey]) {
                    result += `${person1} owes ${person2} £${amount.toFixed(2)}<br>`;
                    recordedDebts[debtKey] = true; // Mark debt as recorded
                }
            }
        }
    }

    document.getElementById('balance').innerHTML = result || 'No balances';
    document.getElementById('result').style.display = 'block';
    document.querySelector('.exportbtn').style.display = 'block';
    updateTotalExpense();
}