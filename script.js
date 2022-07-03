//-------
//переменные
let size,
    offsets,
    field,
    display,
    living,
    currentState,
    pixels,
    context,
    write,
    grid,
    ticky;

let playing = false;
const canvasSize = 600; //размер границ canvas в пикселях canvasSize * canvasSize
const canvas = document.getElementById("world");
const generation = document.getElementById("generation");
const amountState = document.getElementById("amount");
const start = document.getElementById("start"); //получаем доступ к кнопке Запустить
let mouse = { x: 0, y: 0 };
let coordinates = { x: 0, y: 0 };
let draw = false;

//имена правил
const die = -1,
      birth = 1,
      nothing = 0;

//правила игры
//индекс в подмассиве - число соседей 
const rules = [
  [nothing, nothing, nothing, birth, nothing], //исли мёртв
  [die, die, nothing, nothing, die],          //если жив
];

// максимальное количество живых соседей, дальше не считаем
const maxCount = rules[0].length - 1;

// относительные координаты смещения (попарно x, y)
const edgeOffsets = [
  -1, -1,
   0, -1,
   1, -1,
  -1,  0,
   1,  0,
  -1,  1,
   0,  1,
   1,  1
];
//-------

//-------
//функции

// функция рисования сетки (шахматной доски)
function setGrid() {
  grid = document.getElementById("grid");
  grid.classList.remove("gameOver");
  Gctx = grid.getContext("2d");
  grid.width = canvasSize;
  grid.height = canvasSize;
  square = canvasSize / size;
  Gctx.strokeRect(0, 0, canvasSize, canvasSize);
  Gctx.fillRect(0, 0, canvasSize, canvasSize);
  for (i = 0; i < size; i += 2)
    for (j = 0; j < size; j += 2) {
      Gctx.clearRect(i * square, j * square, square, square);
      Gctx.clearRect((i + 1) * square, (j + 1) * square, square, square);
    }
}

//функция назначения размера и отрисовки canvas
function setSize() {
  if (playing) {
    startPause();
  }
  size = Number(document.getElementById("size").value);
  setGrid();
  document.getElementById("labelSize").textContent = `Размер мира ${size}x${size} клеток`;
  display = Object.assign(canvas, {
    width: size,
    height: size,
  });
  offsets = [
    -size - 1,
    -size,
    -size + 1,
    -1,
    1,
    size - 1,
    size,
    size + 1,
  ];
  field = [new Array(size * size).fill(0), new Array(size * size).fill(0)];
  context = display.getContext("2d");
  display.pixels = context.getImageData(0, 0, size, size);
  display.buf32 = new Uint32Array(display.pixels.data.buffer);
  canvas.innerHTML = display;
  currentState = 0;
  living = 0;
  generation.textContent = 0; // обнуляем счётчик поколений
  amountState.textContent = living; // обнуляем счётчик клеток
  setWrite();
}

//функция конвертации координат указателя мыши из абсолютных значений в относительные
function mouseToCoord(mouse) {
  return Math.ceil((size * mouse) / canvasSize);
}

//функция ручного добавления/удаления клеток
function setWrite() {
  // создаём обработчик нажатий на canvas
  const b = field[currentState % 2];
  display.removeEventListener("mousedown", write, false);
  write = function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    coordinates.x = mouseToCoord(mouse.x);
    coordinates.y = mouseToCoord(mouse.y);
    b[coordToIndex(coordinates.x, coordinates.y)] = (b[coordToIndex(coordinates.x, coordinates.y)] + 1) % 2;
    living = b[coordToIndex(coordinates.x, coordinates.y)] == 1
              ? living + 1
              : living - 1;
    render();
  };
  display.addEventListener("mousedown", write, false);
}

//функция конвертации координат пикселя в его индекс в массиве
function coordToIndex(x, y) {
  i = size * (y - 1) + (x - 1);
  return i;
}

//функция расчёта скорости обновления поля
function updDelay() {
  return Number(1000 / document.getElementById("speed").value);
}

//функция рандомного спавна клеток на поле, предварительно его очищая и переопределяя размер
function randomize() {
  setSize(); // объявляем все переменные в зависимости от выбранного размера мира
  let density = document.getElementById("density").value; // узнаём выбранную плотность заполнения
  const b = field[0]; // объявляем b как первый массив из field, он пустой, т.к. рандомайз запускаем в нулевом поколении
  let i = b.length; // пробегаем по массиву (всё поле) с конца в начало
  while (i--) {
    if (Math.random() < density) {
      b[i] = 1;
      living += 1;
    } else {
      b[i] = 0;
    }
    // если случайное число (от 0 до 1 / от 0% до 100%) меньше плотности (от 0 до 1 / от 0% до 100%)
    // то закрышиваем пиксель, иначе не закрашиваем.
    // т.е. поставили плотность 1 (100%) следовательно все (кроме 1) случайные числа будут меньше 1, значит закрасится всё.
    // чем меньше плотность, тем меньше закрасится, соотвественно.
    // получается не очень точно, но пока сойдёт
    // ??? нужно подумать оставить < или писать <=
  }
  render(); // запускаем рендер - отрисовываем полученный массив b
}

//функция отрисовки посчитанного массива
function render() {
  pixels = [0, intColor()];
  const b = field[currentState % 2], // объявляем b равную первому массиву из field
    // обращаемся к элементу field с индексом равным остатку от деления текущего поколения на 2
    // т.к. каждое 2 число делится на 2 без остатка (0 тоже делится на 2 без остатка, т.к. будет 0),
    // получаем с каждым новым поколением индекс отличный от предыдущего.
    // это нужно, чтобы в любом поколении мы знали какая ситуация была в предыдущем поколении.
    // чтобы не запоминать все предыдущие поколения (зачем?)
    // чтобы не перезаписывать каждый раз настоящее поколение в предыдущее, а новое в настоящее
    // проще записывать новое не туда, где уже настоящее, которое становится предыдущим.
    d32 = display.buf32; // к d32 присваиваем буфер дисплея
  let i = b.length; // пробегаем b с конца в начало
  while (i--) {
    d32[i] = pixels[b[i]]; // заполняем буфер массивом длиной в развёрнутое поле со значениями цвета пикселя, где отрисовывается пиксель
    // и 0 - где нет
  }
  context.putImageData(display.pixels, 0, 0); // отрисовываем в canvas с позиций 0:0 то, что насчиталось в массив d32
  amountState.textContent = living;
}

//функция заупуска/остановки игры - старт/пауза
function startPause() {
  if (playing) { // если игра идёт - ставим паузу
    pause();
    setWrite();
  } else if (!playing) { // если игра не идёт - запускаем
    playing = true;
    start.classList.remove("btn-success")
    start.classList.add("btn-danger")
    start.textContent = "Остановить"
    tick()
  }
}

//функция остановки - пауза
function pause() {
  playing = false;
  start.classList.remove("btn-danger")
  start.classList.add("btn-success")
  start.textContent = "Запустить"
  clearTimeout(ticky);
}

//функция выполнения одной итерации
function nextTick() {
  if (playing) {
    pause()
  }
  living = calculate();
  currentState++;
  render();
  if (living > 0) {
    generation.textContent = currentState;
    setWrite();
  } else {
    pause();
    gameOver();
  }
}

//рекурсивная функция запуска - процесс игры, перезапускается через время updDelay, зависимое от скорости
function tick() {
  living = calculate();
  currentState++;
  render();
  if (living > 0) {
    ticky = setTimeout(tick, updDelay());
    generation.textContent = currentState;
  } else {
    pause();
    gameOver();
  }
}

//функция конвертации HEX цвета в ABGA шестнадцатиричный формат (integer) для canvas
function intColor() {
  colorInput = document.getElementById("colorInput").value.slice(1);
  return Number(
    "0xFF" +
      colorInput.substring(4, 6) +
      colorInput.substring(2, 4) +
      colorInput.substring(0, 2)
  );
}

//функция отображения анимации Game Over, пока не дописана
function gameOver() {
  alert('GAME OVER')
}

//основная функция по расчёту состояния клеток на основании заданных правил rules
function calculate() {
  let x,
    y = size,
    idx = size * size - 1,
    count,
    k,
    total = 0;

  // предыдущий и текущий результаты расчёта
  const prev = field[currentState % 2]; // предыдущий
  const curr = field[(currentState + 1) % 2]; // текущий

  while (y--) {
    x = size;
    while (x--) {
      count = 0;
      if (x === 0 || x === size - 1 || y === 0 || y === size - 1) {
        k = 0;
        while (k < edgeOffsets.length && count < maxCount) {
          const idxMod = ((x + size + edgeOffsets[k]) % size) + ((y + size + edgeOffsets[k + 1]) % size) * size;
          count += prev[idxMod];
          k += 2;
        }
      } else {
        k = 0;
        while (k < offsets.length && count < maxCount) {
          count += prev[idx + offsets[k++]];
        }
      }
      const useRule = rules[prev[idx]][count];
      if (useRule === die) {
        curr[idx] = 0;
      } else if (useRule === birth) {
        curr[idx] = 1;
      } else {
        curr[idx] = prev[idx];
      }
      total += curr[idx];
      idx--;
    }
  }
  return total;
}

setSize(); // при загрузке страницы сразу отрисовываем сетку