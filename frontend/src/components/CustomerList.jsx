import { useEffect, useState } from 'react';
import '../styles/CustomerList.css';

const CustomerList = () => {
	const [customers, setCustomers] = useState([]);
	const [newCustomer, setNewCustomer] = useState({
		name: '',
		email: '',
		phone: '',
	});
	const [editCustomer, setEditCustomer] = useState(null);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		fetch('https://localhost:7219/customers')
			.then((response) => response.json())
			.then((data) => setCustomers(data));
	}, []);

	const validate = (customer) => {
		const errors = {};
		if (!customer.name) errors.name = 'Name is required';
		if (!customer.email) errors.email = 'Email is required';
		if (!customer.phone) errors.phone = 'Phone is required';
		return errors;
	};

	const handleCreate = () => {
		const validationErrors = validate(newCustomer);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		fetch('https://localhost:7219/customers', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newCustomer),
		})
			.then((response) => response.json())
			.then((data) => setCustomers([...customers, data]));
	};

	const handleUpdate = (id) => {
		const validationErrors = validate(editCustomer);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		fetch(`https://localhost:7219/customers/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(editCustomer),
		})
			.then((response) => response.json())
			.then((data) => {
				setCustomers(
					customers.map((customer) => (customer.id === id ? data : customer))
				);
				setEditCustomer(null);
			});
	};

	const handleDelete = (id) => {
		fetch(`https://localhost:7219/customers/${id}`, { method: 'DELETE' }).then(
			() => setCustomers(customers.filter((customer) => customer.id !== id))
		);
	};

	return (
		<div className="customer-list">
			<h2>Customers</h2>
			<ul>
				{customers.map((customer) => (
					<li key={customer.id} className="customer-item">
						{customer.name} - {customer.email} - {customer.phone}
						<button onClick={() => setEditCustomer(customer)}>Edit</button>
						<button onClick={() => handleDelete(customer.id)}>Delete</button>
					</li>
				))}
			</ul>
			<h3>Create Customer</h3>
			<div className="form-group">
				<input
					type="text"
					placeholder="Name"
					value={newCustomer.name}
					onChange={(e) =>
						setNewCustomer({ ...newCustomer, name: e.target.value })
					}
				/>
				{errors.name && <span className="error">{errors.name}</span>}
			</div>
			<div className="form-group">
				<input
					type="email"
					placeholder="Email"
					value={newCustomer.email}
					onChange={(e) =>
						setNewCustomer({ ...newCustomer, email: e.target.value })
					}
				/>
				{errors.email && <span className="error">{errors.email}</span>}
			</div>
			<div className="form-group">
				<input
					type="tel"
					placeholder="Phone"
					value={newCustomer.phone}
					onChange={(e) =>
						setNewCustomer({ ...newCustomer, phone: e.target.value })
					}
				/>
				{errors.phone && <span className="error">{errors.phone}</span>}
			</div>
			<button onClick={handleCreate}>Create</button>

			{editCustomer && (
				<div className="edit-form">
					<h3>Edit Customer</h3>
					<div className="form-group">
						<input
							type="text"
							placeholder="Name"
							value={editCustomer.name}
							onChange={(e) =>
								setEditCustomer({ ...editCustomer, name: e.target.value })
							}
						/>
						{errors.name && <span className="error">{errors.name}</span>}
					</div>
					<div className="form-group">
						<input
							type="email"
							placeholder="Email"
							value={editCustomer.email}
							onChange={(e) =>
								setEditCustomer({ ...editCustomer, email: e.target.value })
							}
						/>
						{errors.email && <span className="error">{errors.email}</span>}
					</div>
					<div className="form-group">
						<input
							type="tel"
							placeholder="Phone"
							value={editCustomer.phone}
							onChange={(e) =>
								setEditCustomer({ ...editCustomer, phone: e.target.value })
							}
						/>
						{errors.phone && <span className="error">{errors.phone}</span>}
					</div>
					<button onClick={() => handleUpdate(editCustomer.id)}>Update</button>
				</div>
			)}
		</div>
	);
};

export default CustomerList;
