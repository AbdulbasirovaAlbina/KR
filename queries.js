//статистика
const getServiceStatistics = `
  SELECT
      "Название услуги",
      "Количество обслуженных клиентов",
      "Количество оказанных услуг",
      "Общая сумма"
  FROM
      get_service_statistics($1, $2);  -- Вызов функции с параметрами диапазона дат
`;
//проверка занятости мастеров
const getMastersWithEmptyDays = `
  SELECT
    "ФИО мастера",
    "Общее количество рабочих дней",
    "Количество свободных дней"
  FROM get_masters_with_empty_days($1, $2);  -- $1 и $2 — параметры для диапазона дат
`;
//чек
const getReceiptByDateTime = `
  SELECT 
      "Чек", 
      "Клиент", 
      "Дата выполнения услуги", 
      "Услуга", 
      "Мастер", 
      "Цена", 
      "Дата печати чека"
  FROM generate_receipt_view
  WHERE "Дата печати чека" = $1;  -- $1 для подстановки параметра даты и времени
`;
//расписание мастеров
const getMasterScheduleWithClients = `
  SELECT 
      "Мастер", 
      "Клиент", 
      "Услуга", 
      "Время начала", 
      "Время окончания"
  FROM 
      MasterScheduleWithClients
  WHERE
      "Дата" = $1;  -- Параметр для фильтрации по дате
`;
//мастера и их услуги
const getMasterServices = `
SELECT
    "Мастер", 
    "Услуги"
FROM 
    MasterServicesView;
`;
//популярность мастера
const getMasterPopularity = `
  SELECT
      "Имя мастера",
      "Количество записей"
  FROM master_popularity;
`;

//все чеки
const getAllReceipts = `
  SELECT 
      "Чек", 
      "Клиент", 
      "Дата выполнения услуги", 
      "Услуга", 
      "Мастер", 
      "Цена", 
      "Дата печати чека"
  FROM generate_receipt_view
  ORDER BY "Дата печати чека" DESC;  -- Сортировка от самых новых
`;

//свободные окна
const getFreeSlotsForService = `
  SELECT free_start AS "Начало свободного времени", 
         free_end AS "Конец свободного времени"  
  FROM get_free_slots_for_service($1, $2, $3, $4, $5);
`;
const getMostUsedServiceForClient = `
  SELECT
    "ФИО клиента",
    "Популярная услуга",
    "Количество использований"
  FROM get_most_used_service_for_client($1, $2, $3, $4);
`;
const addSchedule = `
  CALL AddSchedule($1, $2, $3, $4, $5, $6);
`;

module.exports = {
  getMasterServices,
  getReceiptByDateTime,
  getAllReceipts,
  getMasterScheduleWithClients,
  getServiceStatistics,
  getMasterPopularity,
  getMastersWithEmptyDays,
  getFreeSlotsForService,
  getMostUsedServiceForClient,
  addSchedule
};

