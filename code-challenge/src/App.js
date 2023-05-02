import Footer from './Components/footer';
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(error => console.log(error));
  }, []);

  const handleDelete = id => {
    fetch(`http://localhost:3000/transactions/${id}`, { method: 'DELETE' })
      .then(() => {
        const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
        setTransactions(updatedTransactions);
      })
      .catch(error => console.log(error));
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addTransaction = (newTransaction) => {
    fetch('http://localhost:3000/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTransaction)
    })
      .then(response => response.json())
      .then(data => setTransactions([...transactions, data]))
      .catch(error => console.log(error));
  };

  return (
    <div>
      <div className="container my-4">
        <Footer />
        <input
          type="text"
          placeholder="Search by description..."
          className="form-control"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <Table className="table table-dark container hover">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col">Amount</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{transaction.amount}</td>
              <td>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(transaction.id)}>Delete</button>
                <button type="button" className="btn btn-warning" onClick={() => console.log('Update transaction', transaction)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="container my-4">
        <h2>Add New Transaction</h2>
        <AddTransactionForm addTransaction={addTransaction} />
      </div>
    </div>
  );
}
function AddTransactionForm(props) {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newTransaction = {
      date: date,
      description: description,
      category: category,
      amount: amount
    };

    props.addTransaction(newTransaction);

    props.addTransaction(newTransaction);

    setDate('');
    setDescription('');
    setCategory('');
    setAmount('');


    setShowSuccessMessage(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      {showSuccessMessage && <div className="alert alert-success">Transaction added successfully!</div>}
      <div className="mb-3">
        <label htmlFor="date" className="form-label">Date</label>
        <input type="date" className="form-control" id="date" value={date} onChange={(event) => setDate(event.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <input type="text" className="form-control" id="description" value={description} onChange={(event) => setDescription(event.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category</label>
        <input type="text" className="form-control" id="category" value={category} onChange={(event) => setCategory(event.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">Amount</label>
        <input type="number" className="form-control" id="amount" value={amount} onChange={(event) => setAmount(event.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Add Transaction</button>
    </form>
  );
}

export default App;