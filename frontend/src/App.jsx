import CustomerList from './components/CustomerList';
import MovieList from './components/MovieList';
import ScreeningList from './components/ScreeningList';
import './App.css';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Cinema Booking System</h1>
			</header>
			<main>
				<CustomerList />
				<MovieList />
				<ScreeningList />
			</main>
		</div>
	);
}

export default App;
