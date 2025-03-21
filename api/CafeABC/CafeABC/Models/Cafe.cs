using System;
using System.ComponentModel.DataAnnotations;

namespace CafeABC.Models
{

    public class Cafe
    {
        public Guid? Cafe_ID { get; set; }


        public string? Name { get; set; }

   
        public string? Description { get; set; }

        public string? Logo { get; set; }


        public string? Location { get; set; }


    }

    public class CafeCreate
    {

        [Required(ErrorMessage = "Name is required.")]
        public  string? Name { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        public  string? Description { get; set; }

        public string? Logo { get; set; }

        [Required(ErrorMessage = "Location is required.")]

        public  string? Location { get; set; }


    }

    public class CafeUpdate
    {

        public Guid? Cafe_id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Logo { get; set; }
        public string? Location { get; set; }



    }


    public class CafeList
    {
        public Guid? Cafe_id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? Employees { get; set; }
        public string? Logo { get; set; }
        public string? Location { get; set; }

    }


}
