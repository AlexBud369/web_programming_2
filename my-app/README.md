1. Создание страны:

text
Метод: POST
URL: http://localhost:5000/api/countries
Body (JSON):
{
  "code": "US",
  "name": "Соединенные Штаты Америки",
  "visaCost": 160,
  "description": "Североамериканская страна, состоящая из 50 штатов",
  "flagImage": "https://flagcdn.com/w320/us.png"
}
2. Получение списка с пагинацией:

text
Метод: GET
URL: http://localhost:5000/api/countries?page=1&limit=10
3. Получение с сортировкой:

text
Метод: GET
URL: http://localhost:5000/api/countries?sort=visaCost&order=DESC&page=1&limit=5
4. Получение с фильтрацией:

text
Метод: GET
URL: http://localhost:5000/api/countries?visaCost=80&name=Франция
5. Получение с поиском:

text
Метод: GET
URL: http://localhost:5000/api/countries?search=фран
6. Получение по ID:

text
Метод: GET
URL: http://localhost:5000/api/countries/{id}
7. Обновление страны:

text
Метод: PUT
URL: http://localhost:5000/api/countries/{id}
Body (JSON):
{
  "code": "FR",
  "name": "Франция",
  "visaCost": 85,
  "description": "Обновленное описание",
  "flagImage": "https://flagcdn.com/w320/fr.png"
}
8. Удаление страны:

text
Метод: DELETE
URL: http://localhost:5000/api/countries/{id}
9. Проверка существования:

text
Метод: HEAD
URL: http://localhost:5000/api/countries/{id}
10. Тест ошибки валидации:

text
Метод: POST
URL: http://localhost:5000/api/countries
Body (JSON):
{
  "code": "F", // Ошибка: меньше 2 символов
  "name": "", // Ошибка: пустое поле
  "visaCost": -10 // Ошибка: отрицательное значение
}