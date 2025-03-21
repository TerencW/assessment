using CafeABC.Models;


namespace CafeABC.Services
{
    public interface IDataRepository
    {
        #region Cafe
        IEnumerable<CafeList> GetCafes(string? location);

        Task<Cafe> CreateCafeAsync(CafeCreate? cafe);
        Task<bool> UpdateCafeAsync(Guid cafe_id, CafeUpdate cafe);

        Task<int> DeleteCafeAsync(Guid cafe_id); 
        #endregion

        #region Employee
        IEnumerable<EmployeeList> GetEmployees(string? cafe);

        Task<Employee> CreateEmployeeAsync(EmployeeCreate? employee);

        Task<bool> UpdateEmployeeAsync(string employee_id, EmployeeCreate cafe);

        Task<int> DeleteEmployeeAsync(string employee_id);


        #endregion

    }
}
