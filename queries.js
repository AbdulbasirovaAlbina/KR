

const getServiceStatistics = `
  SELECT 
    "Период", 
    "Количество обслуженных клиентов", 
    "Общая сумма"
  FROM get_service_statistics($1, $2);
`;
const getServiceStatisticsByDate = `
SELECT "Название услуги", "Количество услуг", "Общая сумма"
FROM get_service_statistics_by_date($1, $2);
`;

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

const getMasterServices = `
SELECT
    "Мастер", 
    "Услуги"
FROM 
    MasterServicesView;
`;

module.exports = {
  getMasterServices,
  getServiceStatistics,
  getServiceStatisticsByDate,
  getReceiptByDateTime,
  getMasterScheduleWithClients
};

