// Представление для отображения всех клиентов и их заказов
const getClientOrders = `
    SELECT
        Client_Last_Name AS client_last_name,
        Client_First_Name AS client_first_name,
        TO_CHAR(Order_Time, 'YYYY-MM-DD HH24:MI:SS') AS order_time
    FROM
        ClientOrdersView;
`;

// Представление для отображения всех мастеров и их услуг
const getMasterServices = ` SELECT  
    Master_Last_Name, 
    Master_First_Name, 
    Master_Middle_Name, 
    Service_Name 
  FROM 
    MasterServicesView
`;

// Запрос для получения расписания мастеров с изменением формата даты
const getMasterSchedule = `
    SELECT
        Master_Last_Name,
        Master_First_Name,
        Master_Middle_Name,
        TO_CHAR(Date, 'YYYY-MM-DD') AS date,  -- Форматируем дату в нужный формат
        Start_Time_Work AS start_time_work,
        End_Time_Work AS end_time_work
    FROM MasterScheduleView;
`;


module.exports = {
  getClientOrders,
  getMasterServices,
  getMasterSchedule,
};

