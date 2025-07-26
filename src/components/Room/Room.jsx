import { Container } from "../Container/Container.jsx";
import { useEffect, useRef } from "react";

export const Room = function () {
	const canvasRef = useRef();

	useEffect(() => {
		const handleMouseDown = (e) => {
			console.log("canvas clicked", e);
		};

		const canvas = canvasRef.current;
		canvas.addEventListener("mousedown", handleMouseDown);

		return () => {
			canvas.removeEventListener("mousedown", handleMouseDown);
		};
	}, []);

	return <canvas ref={canvasRef} width={600} height={600} />;
};
