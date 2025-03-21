using CafeABC.Models;
using CafeABC.Services;
using Microsoft.AspNetCore.Mvc;

namespace CafeABC.Controllers
{
    [Route("api/")]
    public class CafeController : Controller
    {
        private readonly IDataRepository _repository;
        public CafeController(IDataRepository repository)
        {
            _repository = repository;
        }


        [HttpGet("cafes")]
        public IActionResult GetCafes([FromQuery] string? location)
        {
            var result = _repository.GetCafes(location);

            return Ok(result);
        }


        [HttpPost("cafe")]
        public async Task<IActionResult> CreateCafe([FromBody] CafeCreate? cafe)
        {
            if (cafe == null)
            {
                return BadRequest("Cafe data is null");
            }
            // Insert the new cafe into the database using Dapper
            Cafe cafeId = await _repository.CreateCafeAsync(cafe);

            return Ok(cafeId);
        }

        [HttpPut("cafe/{cafe_id}")]
        public async Task<IActionResult> UpdateCafe(Guid cafe_id, [FromBody] CafeUpdate cafe)
        {
            if (cafe == null)
            {
                return BadRequest(new { message = "Cafe data is null" });
            }

            bool updated = await _repository.UpdateCafeAsync(cafe_id , cafe);

            if (!updated)
            {
                return NotFound(new { message = "Café not found" });
            }

            return Ok(new { message = "Café updated successfully" });
        }

        [HttpDelete("cafe/{cafe_id}")]
        public async Task<IActionResult> CreateCafe(Guid cafe_id)
        {
            var affectedRows = await _repository.DeleteCafeAsync(cafe_id);

            if (affectedRows == 0)
            {
                return NotFound(new { message = "Café not found" });
            }

            return Ok(new { message = "Café deleted successfully" });



        }

    }

}
