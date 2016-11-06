Редактор модульный. Есть базовые части, которые можно переиспользовать для создания новых.
Editro используется как точка входа и собирает всё вместе.
Frame - представляет iframe для работы с визуальным контентом, так же содержит методы для работы с дополнительными фичами, такими как добавление служебных штуковин
Panel - используется для создания панелей. (как сделай лейаут нормально?)
Toolbox - представляет обертку для работы компонентов, редактирующих элемент. Создается с помощью Panel
Controller - компонент для редактирования элемента
Element - обертка над DOM элементов, предоставляет методы для изменения ноды
History - работает с историей, хранит грязное состояние Frame. Можно сквошить изменения. Например контроллер перед изменением может получать токен текущей ревизии, а после вызывать сквош истории

# Events
selected - when element selected
beforeSelected - fire before selected, can be used to change selected element or change selection
change - new html apeears

# Commands
deleteElement
selectParent
nextSibling
prevSibling
selectFirstChild
selectLastChild

# Api
## Editro
getSelected() : Element - return current selected Element
clearSelected()
select(element: Element)

getOption(option: string)
setOption(option: string, value: any)

#ideas
расширение идёт плагинами
настройки редактора включаются опциями

Цикл работы
middleware


before selecgted element (prevent select, select instead, create and select)


