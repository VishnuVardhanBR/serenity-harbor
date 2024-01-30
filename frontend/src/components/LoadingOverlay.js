import "./LoadingOverlay.css"
import { grid } from "ldrs";
grid.register();

export default function LoadingOverlay() {
	return (
		<div className="overlay main-container">
			<l-grid size="150" speed="1.5" color="#205768"></l-grid>
		</div>
	);
}
