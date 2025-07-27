import { useEffect, useRef } from "react";
import styles from "./Canvas.module.scss";

const options = {
	widthCells: 6,
	heightCells: 6,
	cellSizePx: 100,
	widthPx: 600,
	heightPx: 600
};

const objects = [
	{ xCells: 0, yCells: 0, widthCells: 1, heightCells: 1 },
	{ xCells: 3, yCells: 4, widthCells: 2, heightCells: 1 }
];

export const Canvas = function () {
	const canvasRef = useRef(null);

	let selectedId = 0;

	const renderGrid = function (ctx) {
		ctx.strokeStyle = "#1F2937";
		ctx.setLineDash([options.cellSizePx / 4, options.cellSizePx / 4]);
		ctx.lineDashOffset = options.cellSizePx / 8;

		for (let i = 0; i <= options.widthCells; i++) {
			ctx.beginPath();
			ctx.moveTo(i * options.cellSizePx, 0);
			ctx.lineTo(i * options.cellSizePx, options.heightPx);
			ctx.stroke();
		}

		for (let i = 0; i <= options.heightCells; i++) {
			ctx.beginPath();
			ctx.moveTo(0, i * options.cellSizePx);
			ctx.lineTo(options.widthPx, i * options.cellSizePx);
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
			ctx.fillStyle = id === selectedId ? "#9B5ED1" : "#000000";
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
				if (objects[selectedId].xCells - 1 < 0) return;

				objects[selectedId].xCells -= 1;
				break;
			case "ArrowRight":
				if (objects[selectedId].xCells + objects[selectedId].widthCells + 1 > options.widthCells) return;

				objects[selectedId].xCells += 1;
				break;
			case "ArrowUp":
				if (objects[selectedId].yCells - 1 < 0) return;

				objects[selectedId].yCells -= 1;
				break;
			case "ArrowDown":
				if (objects[selectedId].yCells + objects[selectedId].heightCells + 1 > options.heightCells) return;

				objects[selectedId].yCells += 1;
				break;
			case "z":
				[objects[selectedId].widthCells, objects[selectedId].heightCells] = [objects[selectedId].heightCells, objects[selectedId].widthCells];

				if (objects[selectedId].yCells + objects[selectedId].heightCells - 1 === options.heightCells) {
					objects[selectedId].yCells -= 1;
				}

				if (objects[selectedId].xCells + objects[selectedId].widthCells - 1 === options.widthCells) {
					objects[selectedId].xCells -= 1;
				}

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

	return <canvas ref={canvasRef} width={options.widthPx} height={options.heightPx} className={styles.canvas} />;
};
