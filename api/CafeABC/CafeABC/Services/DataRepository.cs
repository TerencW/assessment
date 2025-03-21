using CafeABC.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using System.Data;
using System.Data.Common;
using System.Net.Mail;
using System.Reflection;
using static System.Net.Mime.MediaTypeNames;

namespace CafeABC.Services
{
    public class DataRepository : IDataRepository
    {
        private readonly string _connectionString;

        public DataRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection")
            ?? throw new InvalidOperationException("Database connection string is missing in appsettings.json");

        }

        public IEnumerable<CafeList> GetCafes(string? location)
        {

            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = @"
                    WITH NumberOfEmployee AS (
                        SELECT Count(Cafe_Id) employees , cafe_id From EmployeeCafe Group by cafe_id 
                    ) 
                    SELECT * From Cafe A LEFT JOIN NumberOfEmployee B 
                    ON A.cafe_id = B.cafe_id WHERE 1=1 ";

                var parameters = new DynamicParameters();

                if (!string.IsNullOrEmpty(location))
                {
                    query += " AND A.location = @location";
                    parameters.Add("@location", location);
                }

                query += " order by b.employees desc";

                return conn.Query<CafeList>(query, parameters).ToList();
            }


        }

        public async Task<Cafe> CreateCafeAsync(CafeCreate? cafe)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var query = @"
                    INSERT INTO Cafe (cafe_id , Name, Description ,Logo ,Location )
                    OUTPUT INSERTED.*
                    VALUES (NEWID() , @Name, @Description, @Logo , @Location);
                "; 

                Cafe cafenew = await conn.QueryFirstAsync<Cafe>(query, cafe);
                return cafenew;
            }

        }

        public async Task<bool> UpdateCafeAsync(Guid cafe_id, CafeUpdate cafe)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                const string query = @"
                    UPDATE Cafe
                    SET Name = @Name,
                        Description = @Description,
                        Logo = @Logo,
                        Location = @Location
                    WHERE cafe_id = @cafe_id;
                 ";

                int affectedRows = await connection.ExecuteAsync(query, new
                {
                    cafe_id = cafe_id,
                    Name = cafe.Name,
                    Description = cafe.Description,
                    Logo = cafe.Logo,
                    Location = cafe.Location
                });

                return affectedRows > 0;
            }
        }

        public async Task<int> DeleteCafeAsync(Guid cafe_id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {

                conn.Open();
                SqlTransaction tran = conn.BeginTransaction();
                try
                {
                    string query = "DELETE FROM Employee WHERE employee_id in ( Select employee_id From EmployeeCafe where cafe_id = @cafe_id)";
                    int employees = await conn.ExecuteAsync(query, new { cafe_id = cafe_id }, tran);
                    //auto delete employeecafe
    
                    query = "DELETE FROM Cafe WHERE cafe_id = @cafe_id";
                    int affectedrows = await conn.ExecuteAsync(query, new { cafe_id = cafe_id }, tran);

                    if (affectedrows != 1)
                    {
                        tran.Rollback();
                        return 0;
                    }


                    tran.Commit();
                    return affectedrows;

                }

                catch (Exception)
                {
                    // Rollback the transaction if any error occurs
                    try
                    {
                        // Check if the connection is still open and transaction is valid
                        if (conn.State == System.Data.ConnectionState.Open)
                        {
                            tran.Rollback();
                            Console.WriteLine("Transaction rolled back due to error.");
                        }
                    }
                    catch (Exception rollEx)
                    {
                        Console.WriteLine("Error during rollback: " + rollEx.Message);
                    }

                    // Optionally log the exception here before rethrowing
                    throw;
                }

            }

        }





        public IEnumerable<EmployeeList> GetEmployees(string? cafe)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = " SELECT DATEDIFF(DAY , B.start_date , GetDate()) Days_Worked ," +
                               " C.Name as Cafe ," +
                               " A.* FROM Employee A " +
                               " LEFT JOIN EmployeeCafe B on A.[employee_id] = B.[employee_id]" +
                               " LEFT JOIN Cafe C on B.[cafe_id] = C.[cafe_id]" +
                               " WHERE 1 = 1";

                var parameters = new DynamicParameters();

                if (!string.IsNullOrEmpty(cafe))
                {
                    query += " AND c.[Name] = @cafe";
                    parameters.Add("@cafe", cafe);
                }
                return conn.Query<EmployeeList>(query, parameters).ToList();
            }

        }

        public async Task<Employee> CreateEmployeeAsync(EmployeeCreate? employee)
        {

            using (var conn = new SqlConnection(_connectionString))
            {

                conn.Open();
                SqlTransaction tran = conn.BeginTransaction();
                try
                {
                    var query = @"
           
                    DECLARE @NewEmpID Varchar(9);
                    SET @NewEmpID ='UI' + SUBSTRING(CONVERT(VARCHAR(50), NEWID()), 1, 7)
		                
          
                    INSERT INTO Employee (employee_id , name, email_address ,phone_number ,gender )
                    OUTPUT INSERTED.*   
                    VALUES (@NewEmpID,  @name, @email_address , @phone_number , @gender); ";

                    Employee Emploeenew = await conn.QueryFirstAsync<Employee>(query, employee, tran);

                    if (!employee.Cafe.IsNullOrEmpty())
                    {
                        query = @"
           
               
                    INSERT INTO EmployeeCafe (employee_id , cafe_id, start_date)
                    VALUES (@employee_id , @cafe_id, getdate() ) ";


                    }


                    var result = await conn.ExecuteAsync(query,
                        new { employee_id = Emploeenew.Employee_id, cafe_id = employee.Cafe }, tran);




                    tran.Commit();
                    return Emploeenew;
                }

                catch (Exception)
                {
                    // Rollback the transaction if any error occurs
                    try
                    {
                        // Check if the connection is still open and transaction is valid
                        if (conn.State == System.Data.ConnectionState.Open)
                        {
                            tran.Rollback();
                            Console.WriteLine("Transaction rolled back due to error.");
                        }
                    }
                    catch (Exception rollEx)
                    {
                        Console.WriteLine("Error during rollback: " + rollEx.Message);
                    }

                    // Optionally log the exception here before rethrowing
                    throw;
                }
            }
        }

        public async Task<bool> UpdateEmployeeAsync(string employee_id, EmployeeCreate employee)
        {
            using (var conn = new SqlConnection(_connectionString))
            {

                conn.Open();
                SqlTransaction tran = conn.BeginTransaction();
                try
                {
                    var query = @"
           
                    UPDATE EmployeeCafe
                    SET cafe_id = @cafe_id
                    WHERE employee_id = @employee_id; ";

                    int affectedRows = await conn.ExecuteAsync(query, new
                    {
                        cafe_id = employee.Cafe,
                        employee_id = employee_id    
                    }, tran);


                    query = @"
                        UPDATE Employee
                        SET name = @name,
                            email_address = @email_address,
                            phone_number = @phone_number,
                            gender = @gender
                        WHERE employee_id = @employee_id; ";

                     affectedRows = await conn.ExecuteAsync(query, new
                    {
                         name = employee.Name,
                         email_address = employee.Email_address,
                         phone_number = employee.Phone_number,
                         gender = employee.Gender,
                         employee_id = employee_id
                     }, tran);


                    tran.Commit();
                    return affectedRows > 0; 
                }

                catch (Exception)
                {
                    // Rollback the transaction if any error occurs
                    try
                    {
                        // Check if the connection is still open and transaction is valid
                        if (conn.State == System.Data.ConnectionState.Open)
                        {
                            tran.Rollback();
                            Console.WriteLine("Transaction rolled back due to error.");
                        }
                    }
                    catch (Exception rollEx)
                    {
                        Console.WriteLine("Error during rollback: " + rollEx.Message);
                    }

                    // Optionally log the exception here before rethrowing
                    throw;
                }
            }

        }

        public async Task<int> DeleteEmployeeAsync(string employee_id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {

                conn.Open();
                SqlTransaction tran = conn.BeginTransaction();
                try
                {
                    string query = "DELETE FROM EmployeeCafe WHERE employee_id = @employee_id";
                    int employees = await conn.ExecuteAsync(query, new { employee_id = employee_id }, tran);


                    query = "DELETE FROM Employee WHERE employee_id = @employee_id";
                    int affectedrows = await conn.ExecuteAsync(query, new { employee_id = employee_id }, tran);

                    if (affectedrows != 1)
                    {
                        tran.Rollback();
                        return 0;
                    }


                    tran.Commit();
                    return affectedrows;

                }

                catch (Exception)
                {
                    // Rollback the transaction if any error occurs
                    try
                    {
                        // Check if the connection is still open and transaction is valid
                        if (conn.State == System.Data.ConnectionState.Open)
                        {
                            tran.Rollback();
                            Console.WriteLine("Transaction rolled back due to error.");
                        }
                    }
                    catch (Exception rollEx)
                    {
                        Console.WriteLine("Error during rollback: " + rollEx.Message);
                    }

                    // Optionally log the exception here before rethrowing
                    throw;
                }
            }
        }


    }
}
