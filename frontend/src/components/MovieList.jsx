import { useEffect, useState } from 'react';
import '../styles/MovieList.css';

const MovieList = () => {
	const [movies, setMovies] = useState([]);
	const [newMovie, setNewMovie] = useState({
		title: '',
		rating: '',
		description: '',
		runtimeMins: '',
	});
	const [editMovie, setEditMovie] = useState(null);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		fetch('https://localhost:7219/movies')
			.then((response) => response.json())
			.then((data) => setMovies(data));
	}, []);

	const validate = (movie) => {
		const errors = {};
		if (!movie.title) errors.title = 'Title is required';
		if (!movie.rating) errors.rating = 'Rating is required';
		if (!movie.description) errors.description = 'Description is required';
		if (!movie.runtimeMins) errors.runtimeMins = 'Runtime is required';
		return errors;
	};

	const handleCreate = () => {
		const validationErrors = validate(newMovie);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		fetch('https://localhost:7219/movies', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newMovie),
		})
			.then((response) => response.json())
			.then((data) => setMovies([...movies, data]));
	};

	const handleUpdate = (id) => {
		const validationErrors = validate(editMovie);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		fetch(`https://localhost:7219/movies/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(editMovie),
		})
			.then((response) => response.json())
			.then((data) => {
				setMovies(movies.map((movie) => (movie.id === id ? data : movie)));
				setEditMovie(null);
			});
	};

	const handleDelete = (id) => {
		fetch(`https://localhost:7219/movies/${id}`, { method: 'DELETE' }).then(
			() => setMovies(movies.filter((movie) => movie.id !== id))
		);
	};

	return (
		<div className="movie-list">
			<h2>Movies</h2>
			<ul>
				{movies.map((movie) => (
					<li key={movie.id} className="movie-item">
						{movie.title} - {movie.rating} - {movie.description} -{' '}
						{movie.runtimeMins} mins
						<button onClick={() => setEditMovie(movie)}>Edit</button>
						<button onClick={() => handleDelete(movie.id)}>Delete</button>
					</li>
				))}
			</ul>
			<h3>Create Movie</h3>
			<div className="form-group">
				<input
					type="text"
					placeholder="Title"
					value={newMovie.title}
					onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
				/>
				{errors.title && <span className="error">{errors.title}</span>}
			</div>
			<div className="form-group">
				<input
					type="text"
					placeholder="Rating"
					value={newMovie.rating}
					onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
				/>
				{errors.rating && <span className="error">{errors.rating}</span>}
			</div>
			<div className="form-group">
				<input
					type="text"
					placeholder="Description"
					value={newMovie.description}
					onChange={(e) =>
						setNewMovie({ ...newMovie, description: e.target.value })
					}
				/>
				{errors.description && (
					<span className="error">{errors.description}</span>
				)}
			</div>
			<div className="form-group">
				<input
					type="number"
					placeholder="Runtime (mins)"
					value={newMovie.runtimeMins}
					onChange={(e) =>
						setNewMovie({ ...newMovie, runtimeMins: e.target.value })
					}
				/>
				{errors.runtimeMins && (
					<span className="error">{errors.runtimeMins}</span>
				)}
			</div>
			<button onClick={handleCreate}>Create</button>

			{editMovie && (
				<div className="edit-form">
					<h3>Edit Movie</h3>
					<div className="form-group">
						<input
							type="text"
							placeholder="Title"
							value={editMovie.title}
							onChange={(e) =>
								setEditMovie({ ...editMovie, title: e.target.value })
							}
						/>
						{errors.title && <span className="error">{errors.title}</span>}
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="Rating"
							value={editMovie.rating}
							onChange={(e) =>
								setEditMovie({ ...editMovie, rating: e.target.value })
							}
						/>
						{errors.rating && <span className="error">{errors.rating}</span>}
					</div>
					<div className="form-group">
						<input
							type="text"
							placeholder="Description"
							value={editMovie.description}
							onChange={(e) =>
								setEditMovie({ ...editMovie, description: e.target.value })
							}
						/>
						{errors.description && (
							<span className="error">{errors.description}</span>
						)}
					</div>
					<div className="form-group">
						<input
							type="number"
							placeholder="Runtime (mins)"
							value={editMovie.runtimeMins}
							onChange={(e) =>
								setEditMovie({ ...editMovie, runtimeMins: e.target.value })
							}
						/>
						{errors.runtimeMins && (
							<span className="error">{errors.runtimeMins}</span>
						)}
					</div>
					<button onClick={() => handleUpdate(editMovie.id)}>Update</button>
				</div>
			)}
		</div>
	);
};

export default MovieList;
