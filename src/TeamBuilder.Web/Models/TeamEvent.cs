using System;
using System.ComponentModel.DataAnnotations;

namespace TeamBuilder.Web.Models
{
    public class TeamEvent
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public DateTimeOffset CreateDate { get; set; }
        public DateTimeOffset LastModifiedDate { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public string Owner { get; set; }
        public int? MinAttendees { get; set; }
        public int? MaxAttendees { get; set; }
        public string Status { get; set; }
        public string LogoImageUrl { get; set; }
        public string LocationImageUrl { get; set; }
    }
}