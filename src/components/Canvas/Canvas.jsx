import { useEffect, useRef } from "react";
import furniture from "../../data/images_with_sprite.js";
import styles from "./Canvas.module.scss";

let options = JSON.parse(localStorage.getItem("options")) || {};

export function renderCanvas(ctx, canvas, color) {
	options.widthPx = canvas.getBoundingClientRect().width;
	options.heightPx = canvas.getBoundingClientRect().height;

	options.cellSizePx = options.widthPx / options.widthCells;

	canvas.setAttribute("width", options.widthPx);
	canvas.setAttribute("height", options.heightPx);

	ctx.clearRect(0, 0, options.widthPx, options.heightPx);
	renderGrid(ctx);
	renderObjects(ctx, color);
	localStorage.setItem("objects", JSON.stringify(objects));
	localStorage.setItem("options", JSON.stringify(options));
}

export const addObject = function (id) {
	objects.push(new Furniture(options.widthCells / 2, options.heightCells / 2, furniture[id].src));
	selectedId = objects.length - 1;
};

const setCanvasSize = function (size, ctx, canvas) {
	options.widthCells = size;
	options.heightCells = size;

	objects = [];

	renderCanvas(ctx, canvas, true);
};

const clearObjects = function (ctx, canvas) {
	objects = [];
	localStorage.setItem("objects", JSON.stringify(objects));

	renderCanvas(ctx, canvas, true);
};

let selectedId = 0;

class Furniture {
	constructor(xCells, yCells, sprites) {
		this.xCells = xCells;
		this.yCells = yCells;

		this.sprites = sprites;
		this.currentSprite = this.sprites[0];

		this.widthCells = this.currentSprite.width;
		this.heightCells = this.currentSprite.height;
	}

	update() {
		this.currentSprite = this.sprites[0];

		this.widthCells = this.currentSprite.width;
		this.heightCells = this.currentSprite.height;
	}

	static fromObj(obj) {
		return new Furniture(obj.xCells, obj.yCells, obj.sprites);
	}
}

let objects = (JSON.parse(localStorage.getItem("objects")) || []).map((el) => Furniture.fromObj(el));

const findIntersections = function () {
	let cells = [];

	objects.forEach((obj, id) => {
		cells[id] = [];

		for (let i = 0; i < obj.widthCells; i++) {
			for (let j = 0; j < obj.heightCells; j++) {
				cells[id].push([obj.xCells + i, obj.yCells + j]);
			}
		}
	});

	const objSets = cells.map((obj) => {
		return new Set(obj.map((coord) => coord.join(",")));
	});

	const intersections = new Set();

	for (let i = 0; i < objSets.length; i++) {
		for (let j = i + 1; j < objSets.length; j++) {
			const setA = objSets[i];
			const setB = objSets[j];

			const isIntersecting = [...setA].some((x) => setB.has(x));

			if (isIntersecting) {
				intersections.add(i);
				intersections.add(j);
			}
		}
	}

	return [...intersections];
};

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

const renderObjects = function (ctx, color) {
	objects.forEach((obj, id) => {
		if (id === selectedId) return;

		obj.xPx = obj.xCells * options.cellSizePx;
		obj.yPx = obj.yCells * options.cellSizePx;
		obj.widthPx = obj.widthCells * options.cellSizePx;
		obj.heightPx = obj.heightCells * options.cellSizePx;

		ctx.beginPath();
		ctx.rect(obj.xPx, obj.yPx, obj.widthPx, obj.heightPx);
		ctx.fillStyle = findIntersections().find((el) => el === id) == undefined ? "rgba(0, 0, 0, 0)" : "rgba(255, 0, 0, 0.3)";
		if (!color) ctx.fillStyle = "transparent";
		ctx.fill();

		let objImage = new Image();
		objImage.src = obj.currentSprite.name;

		objImage.onload = () => {
			ctx.drawImage(
				objImage,
				obj.currentSprite.sprite.offsetX * options.cellSizePx + obj.xPx,
				obj.currentSprite.sprite.offsetY * options.cellSizePx + obj.yPx,
				obj.currentSprite.sprite.width * options.cellSizePx,
				obj.currentSprite.sprite.height * options.cellSizePx
			);
		};
	});

	if (selectedId == undefined) return;

	let selectedObj = objects[selectedId];
	if (selectedObj == undefined) return;

	selectedObj.xPx = selectedObj.xCells * options.cellSizePx;
	selectedObj.yPx = selectedObj.yCells * options.cellSizePx;
	selectedObj.widthPx = selectedObj.widthCells * options.cellSizePx;
	selectedObj.heightPx = selectedObj.heightCells * options.cellSizePx;

	ctx.beginPath();
	ctx.rect(selectedObj.xPx, selectedObj.yPx, selectedObj.widthPx, selectedObj.heightPx);
	ctx.fillStyle = findIntersections().find((el) => el === selectedId) == undefined ? "rgba(0, 255, 0, 0.3)" : "rgba(255, 0, 0, 0.3)";
	if (!color) ctx.fillStyle = "transparent";
	ctx.fill();

	let selectedObjImage = new Image();
	selectedObjImage.src = selectedObj.currentSprite.name;

	selectedObjImage.onload = () => {
		ctx.drawImage(
			selectedObjImage,
			selectedObj.currentSprite.sprite.offsetX * options.cellSizePx + selectedObj.xPx,
			selectedObj.currentSprite.sprite.offsetY * options.cellSizePx + selectedObj.yPx,
			selectedObj.currentSprite.sprite.width * options.cellSizePx,
			selectedObj.currentSprite.sprite.height * options.cellSizePx
		);
	};
};

export const Canvas = function ({ color, canvasRef }) {
	const sizeInputRef = useRef(null);
	const sizeBtnRef = useRef(null);

	const clearBtnRef = useRef(null);
	const saveBtnRef = useRef(null);

	const handleClick = function (e) {
		e.preventDefault();

		objects.forEach((obj, id) => {
			if (e.offsetX >= obj.xPx && e.offsetX <= obj.xPx + obj.widthPx && e.offsetY >= obj.yPx && e.offsetY <= obj.yPx + obj.heightPx) {
				selectedId = id;

				const canvas = canvasRef.current;
				if (!canvas) return;

				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				renderCanvas(ctx, canvas, true);
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
				// Rotate sprite array
				objects[selectedId].sprites.unshift(objects[selectedId].sprites.pop());
				objects[selectedId].update();

				while (objects[selectedId].yCells + objects[selectedId].heightCells - 1 === options.heightCells) {
					objects[selectedId].yCells -= 1;
				}

				while (objects[selectedId].xCells + objects[selectedId].widthCells - 1 === options.widthCells) {
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

		renderCanvas(ctx, canvas, true);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		renderCanvas(ctx, canvas, true);

		canvas.addEventListener("click", handleClick);
		window.addEventListener("keydown", handleKeyDown);

		const sizeBtn = sizeBtnRef.current;
		const sizeInput = sizeInputRef.current;

		sizeBtn.addEventListener("click", () => {
			setCanvasSize(Number.parseInt(sizeInput.value), ctx, canvas);
			setTimeout(() => {
				sizeInput.value = "";
			}, 1);
		});

		const clearBtn = clearBtnRef.current;
		const saveBtn = saveBtnRef.current;

		clearBtn.addEventListener("click", () => {
			clearObjects(ctx, canvas);
		});

		saveBtn.addEventListener("click", () => {
			renderCanvas(ctx, canvas, false);
			setTimeout(() => {
				const image = canvas.toDataURL("image/png");
				const link = document.createElement("a");
				link.href = image;
				link.download = "room.png";
				link.click();
				setTimeout(() => {
					renderCanvas(ctx, canvas, true);
				}, 200);
			}, 200);
		});
	}, []);

	return (
		<>
			<div className={styles["canvas-wrap"]}>
				<div className={styles["size__wrap"]}>
					<input type="number" className={styles["size__input"]} ref={sizeInputRef} min="6" max="10" placeholder="8" />
					<button className={styles["size__button"]} ref={sizeBtnRef}>
						Застосувати
					</button>
				</div>

				<canvas style={{ backgroundColor: color }} ref={canvasRef} className={styles.canvas} />

				<ul className={styles["button-list"]}>
					<li className={styles["button-list__item"]}>
						<button className={`${styles["button-list__button"]} ${styles["button-list__button-clear"]}`} ref={clearBtnRef}>
							Очистити
						</button>
					</li>
					<li className={styles["button-list__item"]}>
						<button className={`${styles["button-list__button"]} ${styles["button-list__button-save"]}`} ref={saveBtnRef}>
							Зберегти
						</button>
					</li>
				</ul>
			</div>
		</>
	);
};
