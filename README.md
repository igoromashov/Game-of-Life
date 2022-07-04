<h3>Клеточный автомат - игра "жизнь"</h3>
<h3><a href="https://igoromashov.github.io/Game-of-Life/index.html">Запустить</a></h3>

<h3>Дисклеймер:</h3>
  Это мой четвёртый учебный проект.<br>
  В проекте используются стили Bootstrap и некоторые собственные.<br>
  Данный проект я мечтал реализовать ещё до обучения программированию.<br>
  Лично меня проект устраивает и я планирую его развивать (в целях обучения).<br>
  В данном проекте учтены ошибки из предыдущих проектов.
  
<h3>Возможности программы:</h3>
<ul>
  <li>Настройка вместимости поля (количество клеток на поле) от 10х10 до 1000х1000 (сетка перестраивается автоматически).</li>
  <li>Настройка скорости от 1 до 100 поколений в секунду (зависит от аппаратных возможностей).</li>
  <li>Настройка плотности при случайной генерации (спавне) клеток от 1% до 100%</li>
  <li>Настройка цыета клеток (возможно изменение в процессе игры, цвет изменится на следующей итерации).</li>
  <li>Имеется возможность добавлять и удалять клетки нажатием мыши на сетку(до/после спавна и во время игры).</li>
  <li>Имеется возможность выполнить только одну итерацию или поставить игру на паузу.</li>
  <li>Имеется возможность очистить поле.</li>
  <li>Над полем отображаются счётчики клеток и текущего поколения.</li>
  <li>Когда количество клеток становится равно 0, программа выдаст alert('GAME OVER')</li>
  <li>В программе предусмотрено множество сценариев управления, баги не обнаружены (пока)</li>
</ul>
  
<h3>Реализация в HTML:</h3>
<ul>
  <li>Фавикон сконвертирован из скриншота самой игры на https://favicon.io/</li>
  <li>Логотип в навбаре сгенерирован на https://maketext.io/ и отредактирован на Photoshop</li>
  <li>Разметка HTML классическая (ничего особенного)</li>
  <li>В HTML импортированы bootstrap стили</li>
  <li>Собственные стили прописаны в HTML, инлайн стили используются</li>
  <li>В целом в HTML (кроме навбара) только элементы управления и 2 блока для канвасов (сетка и игра)</li>
</ul>

<h3>Реализация в JavaScript:</h3>
<ul>
  <li>Объявлены все основные переменные, получен доступ к DOM элементам.</li>
  <li>Весь код организован функциями. Функции мутируют глобальные компоненты, так и задумано.</li>
  <li>Все функции имеют комментарии</li>
  <li>Все функции имеют комментарии</li>
</ul>

<h3>Демонстрация работы:</h3>
<img src="https://github.com/igoromashov/Game-of-Life/blob/master/img/Screenshot_2.png?raw=true" style="wigth: 617px, height: 335px, margin: auto" href="#" />
<img src="https://github.com/igoromashov/Game-of-Life/blob/master/img/Screenshot_1.png?raw=true" style="wigth: 630px, height: 700px, margin: auto" href="#" />
  
<h3>Баги:</h3>
<ul>
  <li>Не обнаружены, но код можно оптимизировать для увеличения быстродействия</li>
</ul>
  
<h3>Статус проекта - приостановлен, планируется добавление функционала и оптимизация</h3>
