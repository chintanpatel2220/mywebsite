let numPeople;
    let names = [];

    function getNames() {
        numPeople = parseInt(document.getElementById('numPeople').value);
        document.getElementById('numPeople').disabled = true;

        let namesInput = document.getElementById('namesInput');
        namesInput.style.display = 'block';

        let namesDiv = document.getElementById('names');
        namesDiv.innerHTML = '';

        for (let i = 0; i < numPeople; i++) {
            namesDiv.innerHTML += `<input class="input" type="text" placeholder="Name ${i + 1}" id="name${i}">`;
        }
    }

    function getPayments() {
        for (let i = 0; i < numPeople; i++) {
            names.push(document.getElementById(`name${i}`).value);
        }
        let namesInput = document.getElementById('namesInput');
        namesInput.style.display = 'none';

        let paymentsInput = document.getElementById('paymentsInput');
        paymentsInput.style.display = 'block';
        addPaymentRow();
    }

    function addPaymentRow() {
        let table = document.getElementById('paymentsTable');
        let newRow = table.insertRow(-1);
        newRow.innerHTML = `
            <td style="text-align: center"><select>${names.map(name => `<option>${name}</option>`).join('')}</select></td>
            <td style="text-align: center"><input type="text"></td>
            <td style="text-align: center"><input type="number"></td>
            <td style="text-align: center"><select>${names.map(name => `<option>${name}</option>`).join('')}</select></td>
            <td style="text-align: center"><button onclick="deletePaymentRow(this)">Delete</button></td>
        `;
    }

    function deletePaymentRow(button) {
        let row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);

        calculate();
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
        console.log("Payments:", payments);
    
        let totalExpense = 0;
        let balance = {};
    
        payments.forEach(payment => {
            totalExpense += payment.amount; // Calculate total expense
            if (balance[payment.name] === undefined) balance[payment.name] = 0;
            if (balance[payment.paidBy] === undefined) balance[payment.paidBy] = 0;
    
            balance[payment.paidBy] -= payment.amount; // Deduct payment from payer
        });
    
        // Calculate total number of people who made payments
        let numPeopleWithPayments = new Set(payments.map(payment => payment.name)).size;
        let numPeopleWithoutPayments = numPeople - numPeopleWithPayments;
    
        // If there are people who didn't make any payments, distribute the total expense equally among them
        if (numPeopleWithoutPayments > 0) {
            let amountPerPersonWithoutPayments = totalExpense / numPeopleWithoutPayments;
            for (let i = 0; i < numPeople; i++) {
                let name = document.getElementById(`name${i}`).value;
                if (!(name in balance)) {
                    balance[name] = amountPerPersonWithoutPayments;
                }
            }
        }
    
        let amountPerPerson = totalExpense / numPeople; // Calculate equal share for each person
    
        // Distribute equal share among all recipients
        for (let person in balance) {
            balance[person] += amountPerPerson;
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
    }
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    