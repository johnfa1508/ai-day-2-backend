import { useEffect, useState } from 'react';
import '../styles/ScreeningList.css';

const ScreeningList = () => {
	const [screenings, setScreenings] = useState([]);
	const [movies, setMovies] = useState([]);
	const [newScreening, setNewScreening] = useState({
		screenNumber: '',
		capacity: '',
		startsAt: '',
		movieId: '',
	});
	const [editScreening, setEditScreening] = useState(null);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		fetch('https://localhost:7219/screenings')
			.then((response) => response.json())
			.then((data) => setScreenings(data));

		fetch('https://localhost:7219/movies')
			.then((response) => response.json())
			.then((data) => setMovies(data));
	}, []);

	const validate = (screening) => {
		const errors = {};
		if (!screening.screenNumber)
			errors.screenNumber = 'Screen number is required';
		if (!screening.capacity) errors.capacity = 'Capacity is required';
		if (!screening.startsAt) errors.startsAt = 'Start time is required';
		if (!screening.movieId) errors.movieId = 'Movie is required';
		return errors;
	};

	const handleCreate = () => {
		const validationErrors = validate(newScreening);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		fetch('https://localhost:7219/screenings', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newScreening),
		})
			.then((response) => response.json())
			.then((data) => setScreenings([...screenings, data]));
	};

	const handleUpdate = (id) => {
		const validationErrors = validate(editScreening);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		fetch(`https://localhost:7219/screenings/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(editScreening),
		})
			.then((response) => response.json())
			.then((data) => {
				setScreenings(
					screenings.map((screening) =>
						screening.id === id ? data : screening
					)
				);
				setEditScreening(null);
			});
	};

	const handleDelete = (id) => {
		fetch(`https://localhost:7219/screenings/${id}`, { method: 'DELETE' }).then(
			() => setScreenings(screenings.filter((screening) => screening.id !== id))
		);
	};

	const handleSeatSelect = (screeningId, seatId) => {
		fetch(
			`https://localhost:7219/screenings/${screeningId}/seats/${seatId}/select`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			}
		)
			.then((response) => response.json())
			.then((data) => {
				setScreenings(
					screenings.map((screening) => {
						if (screening.id === screeningId) {
							return {
								...screening,
								seats: screening.seats.map((seat) =>
									seat.id === seatId ? data : seat
								),
							};
						}
						return screening;
					})
				);
			});
	};

	const renderSeats = (screening) => {
		const rows = Math.ceil(screening.capacity / 10); // Assuming 10 seats per row
		const seats = [];
		for (let row = 0; row < rows; row++) {
			const rowSeats = [];
			for (let col = 0; col < 10; col++) {
				const seatIndex = row * 10 + col;
				if (seatIndex < screening.capacity) {
					const seat = screening.seats[seatIndex];
					rowSeats.push(
						<div
							key={seat.id}
							className={`seat ${seat.isOccupied ? 'occupied' : 'available'}`}
							onClick={() =>
								!seat.isOccupied && handleSeatSelect(screening.id, seat.id)
							}></div>
					);
				}
			}
			seats.push(
				<div key={row} className="seat-row">
					{rowSeats}
				</div>
			);
		}
		return seats;
	};

	return (
		<div className="container">
			<h2>Screenings</h2>
			<ul>
				{screenings.map((screening) => (
					<li key={screening.id}>
						<div>
							Screen {screening.screenNumber} - Capacity: {screening.capacity} -
							Starts at: {new Date(screening.startsAt).toLocaleString()} -
							Movie: {screening.movie.title}
							<button onClick={() => setEditScreening(screening)}>Edit</button>
							<button onClick={() => handleDelete(screening.id)}>Delete</button>
						</div>
						<div className="seat-grid">{renderSeats(screening)}</div>
					</li>
				))}
			</ul>
			<h3>Create Screening</h3>
			<input
				type="number"
				placeholder="Screen Number"
				value={newScreening.screenNumber}
				onChange={(e) =>
					setNewScreening({ ...newScreening, screenNumber: e.target.value })
				}
			/>
			{errors.screenNumber && <span>{errors.screenNumber}</span>}
			<input
				type="number"
				placeholder="Capacity"
				value={newScreening.capacity}
				onChange={(e) =>
					setNewScreening({ ...newScreening, capacity: e.target.value })
				}
			/>
			{errors.capacity && <span>{errors.capacity}</span>}
			<input
				type="datetime-local"
				placeholder="Starts At"
				value={newScreening.startsAt}
				onChange={(e) =>
					setNewScreening({ ...newScreening, startsAt: e.target.value })
				}
			/>
			{errors.startsAt && <span>{errors.startsAt}</span>}
			<select
				value={newScreening.movieId}
				onChange={(e) =>
					setNewScreening({ ...newScreening, movieId: e.target.value })
				}>
				<option value="">Select Movie</option>
				{movies.map((movie) => (
					<option key={movie.id} value={movie.id}>
						{movie.title}
					</option>
				))}
			</select>
			{errors.movieId && <span>{errors.movieId}</span>}
			<button onClick={handleCreate}>Create</button>

			{editScreening && (
				<div>
					<h3>Edit Screening</h3>
					<input
						type="number"
						placeholder="Screen Number"
						value={editScreening.screenNumber}
						onChange={(e) =>
							setEditScreening({
								...editScreening,
								screenNumber: e.target.value,
							})
						}
					/>
					{errors.screenNumber && <span>{errors.screenNumber}</span>}
					<input
						type="number"
						placeholder="Capacity"
						value={editScreening.capacity}
						onChange={(e) =>
							setEditScreening({ ...editScreening, capacity: e.target.value })
						}
					/>
					{errors.capacity && <span>{errors.capacity}</span>}
					<input
						type="datetime-local"
						placeholder="Starts At"
						value={editScreening.startsAt}
						onChange={(e) =>
							setEditScreening({ ...editScreening, startsAt: e.target.value })
						}
					/>
					{errors.startsAt && <span>{errors.startsAt}</span>}
					<select
						value={editScreening.movieId}
						onChange={(e) =>
							setEditScreening({ ...editScreening, movieId: e.target.value })
						}>
						<option value="">Select Movie</option>
						{movies.map((movie) => (
							<option key={movie.id} value={movie.id}>
								{movie.title}
							</option>
						))}
					</select>
					{errors.movieId && <span>{errors.movieId}</span>}
					<button onClick={() => handleUpdate(editScreening.id)}>Update</button>
				</div>
			)}
		</div>
	);
};

export default ScreeningList;
