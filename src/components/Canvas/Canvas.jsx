import { useEffect, useRef } from "react";

import { throttle } from "lodash";

import { Palette } from "../Palette/Palette.jsx";
import { Question } from "../Question/Question.jsx";

import furniture from "../../data/images_with_sprite.js";

import DeleteIcon from "../../img/icons/recycle-bin.svg?react";
import RotateIcon from "../../img/icons/rotate.svg?react";

import styles from "./Canvas.module.scss";

let options = JSON.parse(localStorage.getItem("options")) || {
	widthCells: 8,
	heightCells: 8
};

let selectedColor = JSON.parse(localStorage.getItem("selectedColor")) || "#FFFFFF";

export function renderCanvas(ctx, canvas, drawColor) {
	options.widthPx = canvas.getBoundingClientRect().width;
	options.heightPx = canvas.getBoundingClientRect().height;

	options.cellSizePx = options.widthPx / options.widthCells;

	canvas.setAttribute("width", options.widthPx);
	canvas.setAttribute("height", options.heightPx);

	selectedColor = JSON.parse(localStorage.getItem("selectedColor")) || "#FFFFFF";

	ctx.clearRect(0, 0, options.widthPx, options.heightPx);

	ctx.rect(0, 0, options.widthPx, options.heightPx);
	ctx.fillStyle = selectedColor;
	ctx.fill();

	renderGrid(ctx);
	renderObjects(ctx, drawColor);

	localStorage.setItem("objects", JSON.stringify(objects));
	localStorage.setItem("options", JSON.stringify(options));
}

export const addObject = function (id) {
	objects.push(new Furniture(Math.floor(options.widthCells / 2), Math.floor(options.heightCells / 2), furniture[id].src));
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

let imageCache = new Map();
function getCachedImage(src) {
	if (imageCache.has(src)) return imageCache.get(src);

	const img = new Image();
	img.src = src;
	imageCache.set(src, img);
	return img;
}

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

const renderObjects = function (ctx, drawColor) {
	objects.forEach((obj, id) => {
		if (id === selectedId) return;

		obj.xPx = obj.xCells * options.cellSizePx;
		obj.yPx = obj.yCells * options.cellSizePx;
		obj.widthPx = obj.widthCells * options.cellSizePx;
		obj.heightPx = obj.heightCells * options.cellSizePx;

		ctx.beginPath();
		ctx.rect(obj.xPx, obj.yPx, obj.widthPx, obj.heightPx);
		ctx.fillStyle = findIntersections().find((el) => el === id) == undefined ? "rgba(0, 0, 0, 0)" : "rgba(255, 0, 0, 0.3)";
		if (!drawColor) ctx.fillStyle = "transparent";
		ctx.fill();

		let objImage = getCachedImage(obj.currentSprite.name);

		if (objImage.complete) {
			ctx.drawImage(
				objImage,
				obj.currentSprite.sprite.offsetX * options.cellSizePx + obj.xPx,
				obj.currentSprite.sprite.offsetY * options.cellSizePx + obj.yPx,
				obj.currentSprite.sprite.width * options.cellSizePx,
				obj.currentSprite.sprite.height * options.cellSizePx
			);
		} else {
			objImage.onload = () => {
				ctx.drawImage(
					objImage,
					obj.currentSprite.sprite.offsetX * options.cellSizePx + obj.xPx,
					obj.currentSprite.sprite.offsetY * options.cellSizePx + obj.yPx,
					obj.currentSprite.sprite.width * options.cellSizePx,
					obj.currentSprite.sprite.height * options.cellSizePx
				);
			};
		}
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
	if (!drawColor) ctx.fillStyle = "transparent";
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

export const Canvas = function ({ canvasRef }) {
	const sizeInputRef = useRef(null);
	const sizeBtnRef = useRef(null);

	const clearBtnRef = useRef(null);
	const saveBtnRef = useRef(null);

	const rotateBtnRef = useRef(null);
	const deleteBtnRef = useRef(null);

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

		let isDragging = false;

		function getCanvasOffsetPos(e) {
			const rect = canvas.getBoundingClientRect();
			let clientX, clientY;

			if (e.touches && e.touches.length > 0) {
				clientX = e.touches[0].clientX;
				clientY = e.touches[0].clientY;
			} else {
				clientX = e.clientX;
				clientY = e.clientY;
			}

			return {
				x: clientX - rect.left,
				y: clientY - rect.top
			};
		}

		function handleStart(e) {
			if (e.cancelable) e.preventDefault();

			const pos = getCanvasOffsetPos(e);

			for (let id = 0; id < objects.length; id++) {
				const obj = objects[id];
				if (pos.x >= obj.xPx && pos.x <= obj.xPx + obj.widthPx && pos.y >= obj.yPx && pos.y <= obj.yPx + obj.heightPx) {
					selectedId = id;
					isDragging = true;

					const canvas = canvasRef.current;
					if (!canvas) return;

					const ctx = canvas.getContext("2d");
					if (!ctx) return;

					renderCanvas(ctx, canvas, true);
					break;
				}
			}
		}

		function handleEnd() {
			isDragging = false;
		}

		function handleMove(e) {
			if (!isDragging || selectedId === null) return;

			if (e.cancelable) e.preventDefault();

			const pos = getCanvasOffsetPos(e);

			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			const selectedObj = objects[selectedId];

			let newPosX = Math.floor(pos.x / options.cellSizePx);
			let newPosY = Math.floor(pos.y / options.cellSizePx);

			if (newPosX === selectedObj.xCells && newPosY === selectedObj.yCells) return;

			selectedObj.xCells = newPosX;
			selectedObj.yCells = newPosY;

			renderCanvas(ctx, canvas, true);
		}

		canvas.addEventListener("mousedown", handleStart);
		canvas.addEventListener("touchstart", handleStart, { passive: false });

		window.addEventListener("mouseup", handleEnd);
		window.addEventListener("touchend", handleEnd);

		canvas.addEventListener("mousemove", throttle(handleMove, 100));
		canvas.addEventListener("touchmove", throttle(handleMove, 100), { passive: false });

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

		let rotateBtn = rotateBtnRef.current;
		let deleteBtn = deleteBtnRef.current;

		rotateBtn.addEventListener(
			"click",
			throttle(() => {
				objects[selectedId].sprites.unshift(objects[selectedId].sprites.pop());
				objects[selectedId].update();

				while (objects[selectedId].yCells + objects[selectedId].heightCells - 1 === options.heightCells) {
					objects[selectedId].yCells -= 1;
				}

				while (objects[selectedId].xCells + objects[selectedId].widthCells - 1 === options.widthCells) {
					objects[selectedId].xCells -= 1;
				}

				renderCanvas(ctx, canvas, true);
				console.log("rotate");
			}, 100)
		);

		deleteBtn.addEventListener("click", () => {
			objects.splice(selectedId, 1);

			renderCanvas(ctx, canvas, true);
		});
	}, []);

	const setSelectedColor = function (color) {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		localStorage.setItem("selectedColor", JSON.stringify(color));

		renderCanvas(ctx, canvas, true);
	};

	return (
		<>
			<div className={styles["canvas-wrap"]}>
				<div className={styles["size__wrap"]}>
					<div>
						<input type="number" className={styles["size__input"]} ref={sizeInputRef} min="6" max="10" placeholder="8" />
						<button className={styles["size__button"]} ref={sizeBtnRef}>
							Застосувати
						</button>
					</div>
					<div className={styles["size__subwrap"]}>
						<button className={styles["sub__button"]} ref={rotateBtnRef}>
							<RotateIcon />
						</button>
						<button className={styles["sub__button"]} ref={deleteBtnRef}>
							<DeleteIcon />
						</button>
						<Palette selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
						<Question />
					</div>
				</div>

				<canvas style={{ backgroundColor: selectedColor }} ref={canvasRef} className={styles["canvas"]} />

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
