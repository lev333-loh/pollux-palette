# Архитектура DOM-дерева и CSS-селекторов Gemini Monet (Material You)

> **Статус:** Эталонная спецификация разметки Google Gemini Web (Десктоп Firefox & Android GeckoView APK).
> **Цель:** Исключить слепые догадки и конфликты стилей. Каждое правило привязано строго к своему уровню иерархии DOM.

---

## 1. Полное анатомическое дерево DOM (HTML)

```html
<body class="theme-dark ...">
  <app-root>
    <div class="app-root-container">
      
      <!-- ======================================================== -->
      <!-- БОКОВОЕ МЕНЮ (DRAWER)                                   -->
      <!-- ======================================================== -->
      <mat-sidenav-container class="mat-drawer-container">
        <mat-sidenav class="mat-drawer">
          <side-navigation-v2>
            <side-navigation-content>
              <!-- Кнопка "Новый чат", список истории чатов -->
            </side-navigation-content>
          </side-navigation-v2>
        </mat-sidenav>

        <mat-sidenav-content class="mat-drawer-content">
          
          <!-- ==================================================== -->
          <!-- ВЕРХНЯЯ ШАПКА                                        -->
          <!-- ==================================================== -->
          <header class="top-bar">
            <!-- [=] Гамбургер, [Gemini Auto v] Выбор модели, Кнопка нового чата, Аватар -->
          </header>

          <!-- ==================================================== -->
          <!-- ОСНОВНАЯ ОБЛАСТЬ ЧАТА (SCROLLER)                     -->
          <!-- ==================================================== -->
          <main class="chat-container">
            <infinite-scroller class="chat-history">
              <div class="conversation-container">

                <!-- -------------------------------------------------- -->
                <!-- 1. ОТВЕТ МОДЕЛИ (AI TURN)                          -->
                <!-- -------------------------------------------------- -->
                <model-response>
                  <response-container>
                    <message-content>
                      <!-- Текст ответа -->
                      <p>Текст ответа...</p>
                      <!-- Блоки кода -->
                      <code-block>
                        <div class="code-block-decoration">...</div>
                        <pre><code>...</code></pre>
                      </code-block>
                      <!-- Сгенерированные изображения / Карточки -->
                      <generated-image-card>
                        <img src="..." />
                        <div class="actions">...</div>
                      </generated-image-card>
                    </message-content>
                    <!-- Кнопки под ответом (лайк, дизлайк, поделиться, копировать) -->
                    <response-actions>...</response-actions>
                  </response-container>
                </model-response>

                <!-- -------------------------------------------------- -->
                <!-- 2. ЗАПРОС ПОЛЬЗОВАТЕЛЯ (USER QUERY - ОБЫЧНЫЙ РЕЖИМ) -->
                <!-- -------------------------------------------------- -->
                <user-query>
                  <user-query-content class="user-query-content enable-luminous-prompt-bubble">
                    <div class="query-content">

                      <!-- Превью прикрепленных картинок/файлов (если есть) -->
                      <div class="file-preview-container">
                        <button class="file-preview">
                          <img src="..." />
                        </button>
                      </div>

                      <!-- Якорь баббла (ОБЯЗАН БЫТЬ ПРОЗРАЧНЫМ) -->
                      <div class="query-bubble-anchor">
                        
                        <!-- САМ БАББЛ СООБЩЕНИЯ (ЕДИНСТВЕННЫЙ окрашиваемый элемент!) -->
                        <!-- position: relative !important; display: inline-block; max-width: 85%; -->
                        <div class="user-query-bubble-with-background">
                          
                          <!-- Контейнер с текстом -->
                          <div class="horizontal-container">
                            <div class="query-text has-luminous-collapse-spacer">
                              <p>Текст запроса пользователя</p>
                              <!-- Псевдоэлемент ::after создает inline-spacer (26px), чтобы текст не наезжал на кнопку -->
                            </div>
                          </div>

                          <!-- Кнопка раскрытия [v] / [^] (сидит в правом нижнем углу баббла) -->
                          <!-- position: absolute; right: 10px; bottom: 8px; -->
                          <div class="luminous-toggle-container">
                            <button class="luminous-toggle-button" aria-label="Развернуть/Свернуть">
                              <div class="luminous-toggle-pill">
                                <mat-icon>keyboard_arrow_down</mat-icon>
                              </div>
                            </button>
                          </div>

                        </div> <!-- /user-query-bubble-with-background -->

                      </div> <!-- /query-bubble-anchor -->

                      <!-- Кнопки действий под бабблом (Копировать, Карандаш) -->
                      <div class="query-actions luminous-actions-container">
                        <button data-test-id="prompt-copy-button" aria-label="Копировать">...</button>
                        <button data-test-id="prompt-edit-button" aria-label="Изменить">...</button>
                      </div>

                    </div> <!-- /query-content -->
                  </user-query-content>
                </user-query>

                <!-- -------------------------------------------------- -->
                <!-- 3. ЗАПРОС ПОЛЬЗОВАТЕЛЯ (РЕЖИМ РЕДАКТИРОВАНИЯ)      -->
                <!-- -------------------------------------------------- -->
                <user-query>
                  <user-query-content>
                    <div class="query-content">
                      
                      <!-- ФОРМА РЕДАКТИРОВАНИЯ (ВЫГЛЯДИТ В ТОЧНОСТИ КАК САМ БАББЛ СООБЩЕНИЯ) -->
                      <!-- display: flex; flex-direction: column; max-width: 85%; border-radius: 24px 24px 4px 24px; -->
                      <form class="edit-query-form">
                        
                        <!-- Внутренний контейнер текстового поля (БЕЗ РАМОК, БЕЗ ОВАЛОВ) -->
                        <div class="text-input-field">
                          <textarea class="edit-textarea">Текст запроса...</textarea>
                        </div>
                        
                        <!-- Панель кнопок формы снизу справа -->
                        <div class="button-container">
                          <button type="button" class="cancel-button">Отмена</button>
                          <button type="submit" class="update-button">Обновить</button>
                        </div>

                      </form>

                    </div>
                  </user-query-content>
                </user-query>

              </div> <!-- /conversation-container -->
            </infinite-scroller>

            <!-- ==================================================== -->
            <!-- ПЛАВАЮЩЕЕ ПОЛЕ ВВОДА (FIXED СНИЗУ)                   -->
            <!-- ==================================================== -->
            <div class="bottom-container">
              <input-area-v2>
                <div class="input-area-container">
                  <!-- [+] кнопка, поле ввода, микрофон, стрелка отправки -->
                </div>
              </input-area-v2>
            </div>

          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  </app-root>
</body>
```

---

## 2. Разбор багов и анатомия их устранения

### Баг 1: «Двойной баббл» и гигантская коричневая коробка на всю ширину
* **Анатомическая причина:**
  1. В Google Gemini разметка `<user-query>` всегда содержит тег `<form>` (либо скрытый, либо в шаблоне компонента).
  2. Селектор `user-query form, user-query [class*="text-input-field"]` без жесткой привязки к активному полю ввода красил родительскую форму даже при обычном просмотре сообщения!
  3. В результате форма получала `background-color: var(--monet-user-bubble-bg)`, `border-radius: 24px`, и растягивалась на 100% ширины экрана, а внутри неё находился второй маленький баббл `.user-query-bubble-with-background`.
* **Железное решение:**
  1. Все контейнеры обёртки (`user-query`, `user-query-content`, `.query-content`, `.query-bubble-anchor`, `.horizontal-container`) имеют тотальный сброс:
     ```css
     background: transparent !important;
     background-color: transparent !important;
     border: none !important;
     box-shadow: none !important;
     border-radius: 0 !important;
     ```
  2. Стилизация формы редактирования изолирована **строго** через `:has(textarea)`:
     ```css
     user-query form:has(textarea) { ... }
     ```
  3. В обычном режиме фоновый цвет и скругление получает **только один элемент**: `.user-query-bubble-with-background`.

---

### Баг 2: Шеврон `>` / `v` (устранение пустого зазора и уродливого овала при зажатии)
* **Анатомическая причина:**
  1. **Овал при зажатии:** В нативном коде Google кнопка `.luminous-toggle-pill` имела фоновый цвет `var(--gem-sys-color--surface-container-highest)` со скруглением `9999px` и вешала Angular Material Ripple (`.mat-ripple`). При тапе/зажатии пальцем на экране телефона всплывал уродливый контрастный овал.
  2. **Пустой зазор под текстом:** Предыдущая наивная попытка избежать наезда кнопки на текст перевела `.luminous-toggle-container` в `position: static; width: 100%; height: 24px; margin-top: 6px;` — это насильно выталкивало кнопку на целую новую пустую строку снизу, раздувая высоту баббла на 40px пустоты.
* **Железное решение:**
  1. Никаких искусственных пустых строк! Шеврон позиционируется абсолютно в правом нижнем углу баббла:
     ```css
     user-query .luminous-toggle-container {
       position: absolute !important;
       inset-inline-end: 10px !important;
       bottom: 8px !important;
       width: 24px !important;
       height: 24px !important;
     }
     ```
  2. Чтобы текст никогда не наползал на шеврон, сохраняется инлайн-спейсер в конце последней строки:
     ```css
     .has-luminous-collapse-spacer::after,
     .query-text.has-luminous-collapse-spacer .query-text-line:last-child::after {
       content: "" !important;
       display: inline-block !important;
       width: 26px !important;
       height: 1em !important;
     }
     ```
  3. Овал и рипл полностью уничтожены:
     ```css
     .luminous-toggle-button,
     .luminous-toggle-pill {
       background: transparent !important;
       border: none !important;
       box-shadow: none !important;
     }
     .luminous-toggle-button .mat-ripple,
     .luminous-toggle-pill .mat-ripple {
       display: none !important;
     }
     /* Мягкий тактильный отклик, органично сливающийся с бабблом */
     .luminous-toggle-button:active {
       background-color: rgba(0, 0, 0, 0.14) !important;
       transform: scale(0.92) !important;
     }
     ```

---

### Баг 3: Режим редактирования («Изменить») — овал в овале и съехавшие кнопки
* **Анатомическая причина:**
  * Ранее селектор красил одновременно: `.query-content:has(textarea)`, `form:has(textarea)`, `[class*="text-input-field"]`, и `[class*="edit"]`.
  * Получалась «матрёшка» из 4-5 вложенных коробок со своими скруглениями, рамками и отступами.
* **Железное решение:**
  1. Все промежуточные контейнеры (`.text-input-field`, `[class*="text-area"]`, `[class*="edit-box"]`) получают:
     ```css
     background: transparent !important;
     border: none !important;
     outline: none !important;
     box-shadow: none !important;
     padding: 0 !important;
     margin: 0 !important;
     ```
  2. Форма редактирования оформляется **в точности как само сообщение**:
     ```css
     user-query form:has(textarea) {
       background-color: var(--monet-user-bubble-bg) !important;
       border-radius: 24px 24px 4px 24px !important;
       padding: 12px 18px !important;
       box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
       display: flex !important;
       flex-direction: column !important;
       align-self: flex-end !important;
       max-width: 85% !important;
     }
     ```
  3. Поле `<textarea>` полностью прозрачное, без рамок, шрифт и цвет идентичны обычному тексту запроса.
  4. Кнопки «Отмена» и «Обновить» аккуратно прижаты к нижнему правому краю внутри баббла.

---

### Баг 4: Поле ввода наезжает на сгенерированные изображения или чат улетает вверх («подлетел»)
* **Анатомическая причина:**
  * Поле ввода `input-area-v2` зафиксировано внизу окна и занимает высоту ~80–90px.
  * Если задавать `padding-bottom` и `margin-bottom` всем родительским контейнерам (`main`, `mat-sidenav-content`, `infinite-scroller`, `.chat-history`), эти отступы каскадно суммируются (до 1000px+), и весь чат улетает высоко вверх («подлетает»), оставляя гигантскую пустую дыру внизу.
  * Если же отступа нет совсем, поле ввода перекрывает нижние сообщения.
* **Железное решение:**
  * Отступ задаётся **ровно один раз и строго последнему контейнеру диалога**:
    ```css
    .conversation-container:last-child,
    [class*="conversation-container"]:last-child {
      padding-bottom: 110px !important;
    }
    ```
  * 110px перекрывают 80px высоты строки ввода и оставляют идеальный, аккуратный зазор в ~25–30px. Никакого «улетания» чата в потолок!

---

### Баг 5: Текст сообщения вылезает за левый край баббла (срезается скруглением 24px)
* **Анатомическая причина:**
  * В Google Gemini элемент `.user-query-bubble-with-background` отрендерен как тег `<span class="user-query-bubble-with-background">`.
  * Если в CSS для типографики текста написать селектор вида `user-query-content span { padding: 0 !important; }` или `.query-content span { padding: 0 !important; }`, этот селектор сработает на **сам баббл** (так как он является дочерним `span` внутри `.query-content`).
  * В результате баббл теряет свой `padding: 12px 20px !important;` и получает вычисленный `padding: 0px`. Текст начинается с координаты `x=0`, и левое верхнее/нижнее скругление `border-radius: 24px` разрезает первые буквы строк прямо на темный фон.
* **Железное решение:**
  * Запрещено использовать общие селекторы `span` внутри `user-query`.
  * Типографика текста строго таргетирует параграфы и строки:
    ```css
    .user-query-bubble-with-background p,
    .user-query-bubble-with-background .query-text-line {
      display: block !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
      color: var(--monet-user-bubble-text) !important;
    }
    ```
  * Баббл гарантированно сохраняет свои 20px боковых отступов (`padding: 12px 20px !important;`), что с запасом в 16px оставляет текст внутри безопасной зоны скругления.

---

## 3. Таблица строгого маппинга селекторов

| Элемент UI | Селектор CSS | Допустимые стили | Запрещено |
| :--- | :--- | :--- | :--- |
| **Ряд запроса** | `user-query` | `display: block; margin-bottom: 12px; background: transparent;` | Любой background, border, shadow |
| **Контейнер выравнивания** | `user-query-content, .query-content` | `display: flex; flex-direction: column; align-items: flex-end;` | Любой background, border-radius |
| **Баббл сообщения** | `.user-query-bubble-with-background` | `background-color: var(--monet-user-bubble-bg); border-radius: 24px 24px 4px 24px; padding: 10px 18px; max-width: 85%;` | Ширина 100%, скругление 0 |
| **Шеврон раскрытия [v]** | `user-query .luminous-toggle-container` | `position: absolute; right: 10px; bottom: 8px; width: 24px; height: 24px;` | `position: static; width: 100%` (создаёт дыру!) |
| **Кнопка шеврона** | `.luminous-toggle-button, .luminous-toggle-pill` | `background: transparent; border: none; :active { transform: scale(0.92); }` | Ripple, фоновый овал pill |
| **Форма редактирования** | `user-query form:has(textarea)` | `background-color: var(--monet-user-bubble-bg); border-radius: 24px 24px 4px 24px; max-width: 85%;` | Овалы вокруг формы, `width: 100%` |
| **Поле ввода в форме** | `user-query form textarea` | `background: transparent; border: none; color: inherit; resize: none;` | Внутренние рамки, белый/серый фон |
| **Фото/картинки в чате** | `.file-preview, .file-preview img` | `border-radius: 14px !important;` | Скругление 50% (круглые фото) |
| **Кнопки под бабблом** | `.query-actions button` | `border-radius: 50%; width: 32px; height: 32px; background: transparent;` | Квадратные рамки |
| **Клиренс скролла** | `.conversation-container:last-child` | `padding-bottom: 110px;` | Каскадные отступы на `main` и родителях (чат улетает вверх) |

---

## 4. Синхронизация репозиториев и пайплайн сборки

1. **Единый источник стилей:** Файл [inject.css](file:///home/aizen/gemini-monet-extension/inject.css).
2. **Синхронизация в Android APK:**
   * Копирование в `gemini-monet/app/src/main/assets/extension/inject.css`
   * Копирование `content.js` в `gemini-monet/app/src/main/assets/extension/content.js`
3. **Сборка Десктопного расширения:**
   * `python3 build.py` в `~/gemini-monet-extension` -> собирает `.xpi` и `.zip`.
4. **Сборка Android APK:**
   * `./gradlew assembleRelease` в `~/gemini-monet`
   * Доставка: `adb install -r gemini-monet/app/build/outputs/apk/release/app-release.apk`
   * Копия для бэкапа: `/sdcard/Download/GeminiMonet-release.apk`.
