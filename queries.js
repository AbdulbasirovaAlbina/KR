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

//самый популярный мастер
const getMasterPopularity = `
  SELECT
      master_full_name,
      booking_count
  FROM master_popularity;
`;
//популярная услуга мастера
const getMostUsedServiceForClients = `
  SELECT
    "ФИО клиента",
    "Популярная услуга",
    "Количество использований"
  FROM get_most_used_service_for_clients($1, $2); 
`;
module.exports = {
  getMasterServices,
  getReceiptByDateTime,
  getMasterScheduleWithClients,
  getServiceStatistics,
  getMasterPopularity,
  getMastersWithEmptyDays,
  getMostUsedServiceForClients
};

