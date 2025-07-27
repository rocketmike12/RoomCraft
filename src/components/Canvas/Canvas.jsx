import { useEffect, useRef } from "react";
import styles from "./Canvas.module.scss";

const options = {
	widthPx: 600,
	heightPx: 600,
	widthCells: 6,
	heightCells: 6,
	cellSizePx: 100
};

const objects = [
	{ id: 0, xCells: 0, yCells: 0, widthCells: 1, heightCells: 1 },
	{ id: 1, xCells: 3, yCells: 4, widthCells: 2, heightCells: 1 }
];

export const Canvas = function () {
	const canvasRef = useRef(null);

	let selectedId = 0;

	const renderGrid = function (ctx) {
		ctx.strokeStyle = "#1F2937";
		ctx.setLineDash([options.cellSizePx / 4, options.cellSizePx / 4]);
		ctx.lineDashOffset = options.cellSizePx / 8;

		for (let i = 0; i < options.widthPx / options.widthCells; i++) {
			ctx.beginPath();
			ctx.moveTo(i * options.cellSizePx, 0);
			ctx.lineTo(i * options.cellSizePx, options.widthPx);
			ctx.stroke();
		}

		for (let i = 0; i < options.heightPx / options.heightCells; i++) {
			ctx.beginPath();
			ctx.moveTo(0, i * options.cellSizePx);
			ctx.lineTo(options.heightPx, i * options.cellSizePx);
			ctx.stroke();
		}
	};

	const renderObjects = function (ctx) {
		objects.forEach((obj, id) => {
			obj.xPx = obj.xCells * options.cellSizePx;
			obj.yPx = obj.yCells * options.cellSizePx;
			obj.widthPx = obj.widthCells * options.cellSizePx;
			obj.heightPx = obj.heightCells * options.cellSizePx;

			ctx.beginPath();
			ctx.rect(obj.xPx, obj.yPx, obj.widthPx, obj.heightPx);
			ctx.fillStyle = id === selectedId ? "#8800aa" : "#000000";
			ctx.fill();
		});
	};

	const handleClick = function (e) {
		e.preventDefault();

		objects.forEach((obj, id) => {
			if (e.offsetX >= obj.xPx && e.offsetX <= obj.xPx + obj.widthPx && e.offsetY >= obj.yPx && e.offsetY <= obj.yPx + obj.heightPx) {
				selectedId = id;

				const canvas = canvasRef.current;
				if (!canvas) return;

				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				render(ctx);
			}
		});
	};

	const handleKeyDown = function (e) {
		if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "z", "x"].includes(e.key)) return;

		e.preventDefault();

		switch (e.key) {
			case "ArrowLeft":
				objects[selectedId].xCells -= 1;
				break;
			case "ArrowRight":
				objects[selectedId].xCells += 1;
				break;
			case "ArrowUp":
				objects[selectedId].yCells -= 1;
				break;
			case "ArrowDown":
				objects[selectedId].yCells += 1;
				break;
			case "z":
				[objects[selectedId].widthCells, objects[selectedId].heightCells] = [objects[selectedId].heightCells, objects[selectedId].widthCells];
				break;
			case "x":
				objects.splice(selectedId, 1);
				break;
		}
		
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		render(ctx);
	};

	const render = (ctx) => {
		ctx.clearRect(0, 0, options.widthPx, options.heightPx);
		renderGrid(ctx);
		renderObjects(ctx);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		render(ctx);

		canvas.addEventListener("click", handleClick);
		window.addEventListener("keydown", handleKeyDown);
	}, []);

	return <canvas ref={canvasRef} width={600} height={600} className={styles.canvas} />;
};
