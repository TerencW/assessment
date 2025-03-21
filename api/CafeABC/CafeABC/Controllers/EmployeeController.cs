using CafeABC.Models;
using CafeABC.Services;
using Microsoft.AspNetCore.Mvc;

namespace CafeABC.Controllers
{
    [Route("api/")]
    public class EmployeeController : Controller
    {
        private readonly IDataRepository _repository;
        public EmployeeController(IDataRepository repository)
        {
            _repository = repository;
        }


        [HttpGet("employees")]
        public IActionResult GetCafes([FromQuery] string? cafe)
        {
            var result = _repository.GetEmployees(cafe);


            return Ok(result);
        }



        [HttpPost("employee")]
        public async Task<IActionResult> CreateEmployee([FromBody] EmployeeCreate? employee)
        {
            if (employee == null)
            {
                return BadRequest("employee data is null");
            }
            // Insert the new cafe into the database using Dapper
            Employee Employee = await _repository.CreateEmployeeAsync(employee);



            return Ok(Employee);

        }

        [HttpPut("employee/{employee_id}")]
        public async Task<IActionResult> UpdateCafe(string employee_id, [FromBody] EmployeeCreate employee)
        {
            if (employee == null)
            {
                return BadRequest(new { message = "employee_id data is null" });
            }

            bool updated = await _repository.UpdateEmployeeAsync(employee_id, employee);

            if (!updated)
            {
                return NotFound(new { message = "employee_id not found" });
            }

            return Ok(new { message = "employee_id updated successfully" });
        }


        [HttpDelete("employee/{employee_id}")]
        public async Task<IActionResult> DelteEmployee(string employee_id)
        {
            var affectedRows = await _repository.DeleteEmployeeAsync(employee_id);

            if (affectedRows == 0)
            {
                return NotFound(new { message = "Employee not found" });
            }

            return Ok(new { message = "Employee deleted successfully" });



        }

    }
}
