using CafeABC.Models;
using System.ComponentModel.DataAnnotations;
namespace CafeABC.Models
{

    public class EmployeeList
    {
        public string? Employee_id { get; set; }

        public string? Name { get; set; }

        public string? Email_address { get; set; }

        public string? Phone_number { get; set; }

        public string? Gender { get; set; }
        public int? Days_worked { get; set; }
        public string? Cafe { get; set; }

    }


    public class Employee
    {
        public string? Employee_id { get; set; }

        public string? Name { get; set; }

        public string? Email_address { get; set; }

        public string? Phone_number { get; set; }

        public string? Gender { get; set; }

    }

    public class EmployeeCreate
    {

        public string? Name { get; set; }

        public string? Email_address { get; set; }

        public string? Phone_number { get; set; }

        public string? Gender { get; set; }

        public string? Cafe { get; set; }

    }




}